/**
 * 聊天客户端模块
 * 处理 API 请求和流式响应
 */

import type { ChatMessage, StreamState, StreamDelta, GMRequestController } from '@/types';
import { T } from '@/i18n';
import { CONFIG } from '@/config';
import * as Security from '../utils/security';
import GMSafe from './gm-api';

/**
 * 流式请求选项
 */
export interface StreamRequestOptions {
  /** API URL */
  apiUrl: string;
  /** API Key (已解密) */
  apiKey: string;
  /** 聊天消息数组 */
  messages: ChatMessage[];
  /** 使用的模型 */
  model: string;
  /** 温度参数 */
  temperature: number;
  /** 思考强度 */
  thinkingLevel?: 'none' | 'low' | 'medium' | 'high';
}

/**
 * 流式响应回调函数类型
 */
export interface StreamCallbacks {
  /** 首次收到内容时调用 */
  onFirstContent: () => void;
  /** 收到思考内容时调用 */
  onThinkingContent: (content: string, isComplete: boolean) => void;
  /** 收到正文内容时调用 */
  onContent: (content: string, fullContent: string) => void;
  /** 请求完成时调用 */
  onComplete: (fullContent: string) => void;
  /** 发生错误时调用 */
  onError: (error: Error) => void;
}

/**
 * 聊天 API 客户端
 * 负责与 OpenRouter/OpenAI 兼容的 API 通信
 */
export class ChatClient {
  /** 当前请求控制器 */
  private currentRequest: GMRequestController | null = null;
  /** 中止控制器 */
  private abortController: AbortController | null = null;
  /** 是否正在生成 */
  private _isGenerating = false;

  /**
   * 获取当前是否正在生成
   */
  get isGenerating(): boolean {
    return this._isGenerating;
  }

  /**
   * 中止当前请求
   */
  async abort(): Promise<void> {
    try {
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }

      if (this.currentRequest?.abort) {
        this.currentRequest.abort();
      }

      this.currentRequest = null;
      this._isGenerating = false;

      // 等待请求完全停止
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error aborting generation:', error);
    }
  }

  /**
   * 执行流式请求
   * @param options - 请求选项
   * @param callbacks - 回调函数集合
   * @returns Promise，请求完成时 resolve
   */
  async streamRequest(options: StreamRequestOptions, callbacks: StreamCallbacks): Promise<void> {
    const { apiUrl, apiKey, messages, model, temperature, thinkingLevel = 'none' } = options;

    // 如果正在生成，先中止并等待完成
    if (this._isGenerating) {
      await this.abort();
    }

    this._isGenerating = true;
    this.abortController = new AbortController();

    // 流状态管理
    const streamState: StreamState = {
      thinkBuffer: '',
      mdBuffer: '',
      isThinking: false,
      thinkDiv: null,
      hasReceivedContent: false
    };

    let lastLen = 0;

    // 构建请求体
    const safeTemperature = Security.clampNumber(temperature, 0, 2, CONFIG.DEFAULT_CHAT_TEMP);
    const requestBody: Record<string, unknown> = {
      model,
      messages,
      stream: true,
      temperature: safeTemperature
    };

    // 添加思考参数
    if (thinkingLevel !== 'none') {
      requestBody.reasoning = { effort: thinkingLevel };
    }

    return new Promise((resolve, reject) => {
      const timeoutDuration = CONFIG.REQUEST_TIMEOUT || 60000;
      let timeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        this.currentRequest?.abort?.();
        const error = new Error('timeout');
        callbacks.onError(error);
        reject(error);
      }, timeoutDuration);

      const clearRequestTimeout = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      this.currentRequest = GMSafe.request({
        method: 'POST',
        url: apiUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': Security.getSafeReferer(),
          'X-Title': 'Safari AI'
        },
        data: JSON.stringify(requestBody),
        onreadystatechange: (res) => {
          try {
            // 收到内容后重置超时
            if (res.readyState === 3 && streamState.hasReceivedContent) {
              clearRequestTimeout();
              timeoutId = setTimeout(() => {
                this.currentRequest?.abort?.();
                const error = new Error('timeout');
                callbacks.onError(error);
                reject(error);
              }, timeoutDuration);
            }

            if (res.readyState === 3 || res.readyState === 4) {
              const chunk = res.responseText.substring(lastLen);
              lastLen = res.responseText.length;
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (!line.startsWith('data: ') || line.includes('[DONE]')) continue;

                try {
                  const json = JSON.parse(line.substring(6));
                  const delta = json.choices?.[0]?.delta as StreamDelta | undefined;
                  if (!delta) continue;

                  // 首次收到内容
                  if (!streamState.hasReceivedContent) {
                    streamState.hasReceivedContent = true;
                    callbacks.onFirstContent();
                  }

                  // 处理流式增量
                  this._processStreamingDelta(delta, streamState, callbacks);
                } catch (parseError) {
                  console.warn('JSON parse error:', line);
                }
              }
            }

            // 请求完成
            if (res.readyState === 4) {
              clearRequestTimeout();
              this._isGenerating = false;

              // 通知思考完成
              if (streamState.thinkBuffer) {
                callbacks.onThinkingContent(streamState.thinkBuffer, true);
              }

              // 通知请求完成
              callbacks.onComplete(streamState.mdBuffer);

              if (!streamState.hasReceivedContent) {
                callbacks.onError(new Error(T.noResponse));
              }

              resolve();
            }
          } catch (error) {
            clearRequestTimeout();
            this._isGenerating = false;
            console.error('Stream processing error:', error);
            callbacks.onError(error as Error);
            reject(error);
          }
        },
        onerror: (err) => {
          clearRequestTimeout();
          this._isGenerating = false;
          console.error('Request error:', err);
          callbacks.onError(new Error('network'));
          reject(err);
        }
      });
    });
  }

  /**
   * 处理流式响应增量数据
   * @param delta - 增量数据
   * @param streamState - 流状态
   * @param callbacks - 回调函数
   */
  private _processStreamingDelta(
    delta: StreamDelta,
    streamState: StreamState,
    callbacks: StreamCallbacks
  ): void {
    let content = delta.content || '';
    let reasoning = '';

    // 提取 reasoning 内容（支持多种格式）
    if (delta.reasoning_content) {
      reasoning = delta.reasoning_content;
    } else if (delta.reasoning) {
      reasoning = delta.reasoning;
    } else if (delta.reasoning_details && Array.isArray(delta.reasoning_details)) {
      for (const detail of delta.reasoning_details) {
        if (detail.type === 'reasoning.text' && detail.text) {
          reasoning += detail.text;
        } else if (detail.type === 'reasoning.summary' && detail.summary) {
          reasoning += detail.summary;
        }
      }
    }

    // 处理思考内容
    if (reasoning) {
      streamState.thinkBuffer += reasoning;
      callbacks.onThinkingContent(streamState.thinkBuffer, false);
    }

    // 处理正文内容
    if (content) {
      // 处理 <think> 标签开始
      if (content.includes('<think>')) {
        streamState.isThinking = true;
        content = content.replace('<think>', '');
      }

      // 处理 </think> 标签结束
      if (content.includes('</think>')) {
        streamState.isThinking = false;
        const parts = content.split('</think>');
        streamState.thinkBuffer += parts[0];
        callbacks.onThinkingContent(streamState.thinkBuffer, true);
        content = parts[1] || '';
      }

      // 根据状态处理内容
      if (streamState.isThinking) {
        streamState.thinkBuffer += content;
        callbacks.onThinkingContent(streamState.thinkBuffer, false);
      } else if (content) {
        streamState.mdBuffer += content;
        callbacks.onContent(content, streamState.mdBuffer);
      }
    }
  }

  /**
   * 销毁客户端，释放资源
   */
  destroy(): void {
    this.abort();
    this.currentRequest = null;
    this.abortController = null;
  }
}

/**
 * 解析错误信息为用户友好的消息
 * @param error - 错误对象
 * @returns 用户友好的错误消息
 */
export function parseErrorMessage(error: Error): string {
  let errorMessage = T.errors.requestFailed;

  if (error?.message) {
    const safeErrorPatterns = [
      { pattern: /network|fetch|connection/i, msg: T.errors.networkError },
      { pattern: /timeout/i, msg: T.errors.timeout },
      { pattern: /abort/i, msg: T.errors.requestCancelled },
      { pattern: /401|unauthorized/i, msg: T.errors.invalidApiKey },
      { pattern: /403|forbidden/i, msg: T.errors.accessDenied },
      { pattern: /404/i, msg: T.errors.apiNotFound },
      {
        pattern: /429|rate.?limit/i,
        msg: T.errors.rateLimit
      },
      { pattern: /5\d{2}|server/i, msg: T.errors.serverError },
      { pattern: /API Key/i, msg: error.message },
      { pattern: /未收到响应|No response/i, msg: error.message }
    ];

    const matchedError = safeErrorPatterns.find((p) => p.pattern.test(error.message));
    if (matchedError) {
      errorMessage = matchedError.msg;
    }
  }

  return errorMessage;
}

// 导出默认实例
export default ChatClient;
