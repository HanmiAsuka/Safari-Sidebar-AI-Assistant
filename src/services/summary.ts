/**
 * 摘要服务
 * 负责调用 AI 生成网页摘要
 */

import type { ProviderConfig, Settings, SummaryResult, SummaryCallbacks } from '@/types';
import { CONFIG } from '@/config';
import { ChatClient } from '../core/chat-client';
import { pageContentManager } from './page-content';
import * as Security from '../utils/security';

/**
 * 摘要服务类
 */
export class SummaryService {
  private chatClient: ChatClient;
  private currentSummary: SummaryResult = { status: 'idle', content: null };

  constructor() {
    this.chatClient = new ChatClient();
  }

  /**
   * 获取当前摘要状态
   */
  getStatus(): SummaryResult {
    return { ...this.currentSummary };
  }

  /**
   * 检查是否需要生成摘要
   */
  needsSummary(): boolean {
    return pageContentManager.needsResummarize();
  }

  /**
   * 获取缓存的摘要
   */
  getCachedSummary(): string | null {
    return pageContentManager.getCachedSummary();
  }

  /**
   * 生成网页摘要
   * @param settings - 用户设置
   * @param provider - 摘要提供方配置
   * @param callbacks - 状态回调
   */
  async generateSummary(
    settings: Settings,
    provider: ProviderConfig,
    callbacks: Partial<SummaryCallbacks>
  ): Promise<string | null> {
    // 检查缓存
    const cachedSummary = this.getCachedSummary();
    if (cachedSummary) {
      this.currentSummary = { status: 'complete', content: cachedSummary };
      callbacks.onComplete?.(cachedSummary);
      return cachedSummary;
    }

    // 检查配置
    if (!settings.summaryEnabled) {
      return null;
    }

    if (!provider.apiKey || !settings.summaryModel) {
      callbacks.onError?.('Summary not configured');
      return null;
    }

    // 开始生成
    this.currentSummary = { status: 'loading', content: null };
    callbacks.onStatusChange?.('loading');

    const pageContent = pageContentManager.getPageContent(CONFIG.MAX_SUMMARY_CONTENT_LENGTH);
    const systemPrompt = settings.summarySystemPrompt;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: pageContent }
    ];

    let fullContent = '';

    try {
      const decryptedApiKey = await Security.deobfuscateApiKey(provider.apiKey);

      await this.chatClient.streamRequest(
        {
          apiUrl: provider.apiUrl,
          apiKey: decryptedApiKey,
          messages,
          model: settings.summaryModel,
          temperature: settings.summaryTemperature,
          thinkingLevel: 'none'
        },
        {
          onFirstContent: () => {},
          onThinkingContent: () => {},
          onContent: (_delta: string, content: string) => {
            fullContent = content;
            callbacks.onProgress?.(content);
          },
          onComplete: (content: string) => {
            fullContent = content;
            pageContentManager.updateCache(content);
            this.currentSummary = { status: 'complete', content };
            callbacks.onStatusChange?.('complete');
            callbacks.onComplete?.(content);
          },
          onError: (error: Error) => {
            this.currentSummary = { status: 'error', content: null, error: error.message };
            callbacks.onStatusChange?.('error');
            callbacks.onError?.(error.message);
          }
        }
      );

      return fullContent;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.currentSummary = { status: 'error', content: null, error: errorMsg };
      callbacks.onError?.(errorMsg);
      return null;
    }
  }

  /**
   * 中止摘要生成
   */
  abort(): void {
    this.chatClient.abort();
    if (this.currentSummary.status === 'loading') {
      this.currentSummary = { status: 'idle', content: null };
    }
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    this.chatClient.destroy();
  }
}
