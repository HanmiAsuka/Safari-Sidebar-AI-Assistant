/**
 * 对话视图
 * 管理聊天界面的 UI 和交互逻辑
 */

import type {
  ChatMessage,
  ThinkingLevel,
  UserMessageContext,
  ProviderConfig,
  SummaryCallbacks
} from '@/types';
import { T, IS_ZH } from '@/i18n';
import { CONFIG } from '@/config';
import { sendIcon, stopIcon } from '@/ui';
import * as Security from '../../utils/security';
import { getShortModelName } from '@/utils';
import { toggleSelectorOpen, closeSelectorDropdown, updateSelectorArrow } from '@/utils';
import { ChatClient, parseErrorMessage } from '../chat-client';
import { BaseView, ViewHost } from '@/core';
import { SelectionManager, renderChips } from '@/core';
import { addMessageFooter } from '@/core';
import {
  renderUserMessage,
  createAIBubbleEmpty,
  addLoadingIndicator,
  removeLoadingIndicator,
  createThinkingBlock,
  updateThinkingContent,
  finishThinking,
  createSummaryBlock,
  updateSummaryContent,
  finishSummary,
  createContextDivider,
  createAbortedIndicator,
  createErrorElement,
  createMarkdownContainer,
  updateMarkdownContent,
  showNoResponseMessage
} from '@/core';

/**
 * 对话视图扩展宿主接口
 */
export interface ChatViewHost extends ViewHost {
  /** 打开设置面板 */
  openSettings(): void;
  /** 获取当前对话提供方配置 */
  getChatProvider(): ProviderConfig | undefined;
  /** 获取摘要提供方配置 */
  getSummaryProvider(): ProviderConfig | undefined;
  /** 检查是否需要生成摘要 */
  needsSummary(): boolean;
  /** 获取缓存的摘要 */
  getCachedSummary(): string | null;
  /** 生成摘要 */
  generateSummary(callbacks: SummaryCallbacks): Promise<string | null>;
  /** 中止摘要生成 */
  abortSummary(): void;
}

/**
 * 对话视图类
 * 负责聊天消息的渲染、发送和流式响应处理
 */
export class ChatView extends BaseView {
  protected override host: ChatViewHost;

  // DOM 元素
  private chatList!: HTMLElement;
  private input!: HTMLTextAreaElement;
  private actionBtn!: HTMLButtonElement;
  private chipList!: HTMLElement;
  private thinkSelector!: HTMLElement;
  private thinkBtn!: HTMLElement;
  private thinkPopup!: HTMLElement;
  private thinkLevelDisplay!: HTMLElement;
  private modelSwitchSelector!: HTMLElement;
  private modelSwitchBtn!: HTMLElement;
  private modelSwitchPopup!: HTMLElement;
  private modelSwitchName!: HTMLElement;

  // 状态
  private selectionManager = new SelectionManager();
  private chatHistory: ChatMessage[] = [];
  private contextCutoffIndex = -1;
  private lastUserMessage: UserMessageContext | null = null;
  private currentSessionModel: string | null = null;
  private isSummaryGenerating = false;
  private isActionLocked = false; // 防止连续点击
  private isAborted = false; // 标记当前生成流程是否被中止

  // 聊天客户端
  private chatClient: ChatClient;

  // 请求锁
  private requestLock: Promise<void> = Promise.resolve();

  // 滚动节流
  private scrollThrottle: ReturnType<typeof setTimeout> | null = null;

  constructor(host: ChatViewHost, container: HTMLElement) {
    super(host, container);
    this.host = host;
    this.chatClient = new ChatClient();
  }

  /**
   * 初始化对话视图
   */
  init(): void {
    this.cacheElements();
    this.bindEvents();
    this.updateThinkingLevelUI();
    this.updateModelSwitchUI();
  }

  /**
   * 缓存 DOM 元素引用
   */
  private cacheElements(): void {
    this.chatList = this.host.shadow.getElementById('sa-chat-list')!;
    this.input = this.host.shadow.getElementById('sa-input') as HTMLTextAreaElement;
    this.actionBtn = this.host.shadow.getElementById('sa-action-btn') as HTMLButtonElement;
    this.chipList = this.host.shadow.getElementById('sa-chip-list')!;
    this.thinkSelector = this.host.shadow.getElementById('sa-think-selector')!;
    this.thinkBtn = this.host.shadow.getElementById('sa-think-btn')!;
    this.thinkPopup = this.host.shadow.getElementById('sa-think-popup')!;
    this.thinkLevelDisplay = this.host.shadow.getElementById('sa-think-level')!;
    this.modelSwitchSelector = this.host.shadow.getElementById('sa-model-switch-selector')!;
    this.modelSwitchBtn = this.host.shadow.getElementById('sa-model-switch-btn')!;
    this.modelSwitchPopup = this.host.shadow.getElementById('sa-model-switch-popup')!;
    this.modelSwitchName = this.host.shadow.getElementById('sa-model-switch-name')!;
  }

  /**
   * 绑定事件处理器
   */
  private bindEvents(): void {
    // 清空聊天按钮
    this.host.shadow.getElementById('sa-clear-btn')!.onclick = () => {
      if (confirm(T.clearConfirm)) {
        this.chatList.innerHTML = '';
        this.chatHistory = [];
        this.contextCutoffIndex = -1;
      }
    };

    // 清除上下文按钮
    this.host.shadow.getElementById('sa-clear-context-btn')!.onclick = () =>
      this.toggleContextClear();

    // 发送/停止按钮
    this.actionBtn.onclick = () => void this.handleAction();

    // 模型切换按钮
    this.modelSwitchBtn.onclick = (e) => {
      e.stopPropagation();
      toggleSelectorOpen(this.modelSwitchSelector, '.model-arrow');
      this.renderModelSwitchPopup();
    };

    // 思考强度选择器
    this.thinkBtn.onclick = (e) => {
      e.stopPropagation();
      toggleSelectorOpen(this.thinkSelector, '.think-arrow');
    };

    this.thinkPopup.querySelectorAll('.sa-think-option').forEach((opt) => {
      (opt as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        const level = (opt as HTMLElement).dataset.level as ThinkingLevel;
        this.host.saveSettings({ thinkingLevel: level });
        this.updateThinkingLevelUI();
        closeSelectorDropdown(this.thinkSelector, '.think-arrow');
      };
    });
  }

  /**
   * 获取输入框元素
   */
  getInput(): HTMLTextAreaElement {
    return this.input;
  }

  /**
   * 聚焦输入框
   */
  focusInput(): void {
    this.input.focus();
  }

  /**
   * 处理输入框回车事件
   */
  handleInputEnter(e: KeyboardEvent): boolean {
    if (e.target === this.input && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // 使用 void 忽略 Promise，因为 handleAction 内部已有锁保护
      void this.handleAction();
      return true;
    }
    return false;
  }

  // ============================================
  // 选择文本管理
  // ============================================

  /**
   * 添加选中的文本
   */
  addSelection(text: string, append: boolean): void {
    this.selectionManager.add(text, append);
    this.renderChipsUI();
  }

  /**
   * 渲染选中文本标签 UI
   */
  private renderChipsUI(): void {
    renderChips({
      container: this.chipList,
      queue: this.selectionManager.getQueue(),
      onRemove: (index) => {
        this.selectionManager.remove(index);
        this.renderChipsUI();
      }
    });
  }

  /**
   * 清空所有选中文本
   */
  private clearSelections(): void {
    this.selectionManager.clear();
    this.renderChipsUI();
  }

  // ============================================
  // 消息渲染
  // ============================================

  /**
   * 添加用户消息到聊天列表
   */
  private appendUserMessage(text: string, contexts?: string[]): void {
    renderUserMessage(this.chatList, text, contexts);
    this.scrollToBottom(true);
  }

  /**
   * 切换上下文清除分隔线
   */
  private toggleContextClear(): void {
    const existingDivider = this.chatList.querySelector('.sa-context-divider.can-restore');
    if (existingDivider) {
      existingDivider.remove();
      this.contextCutoffIndex = -1;
      return;
    }

    this.contextCutoffIndex = this.chatHistory.length;
    createContextDivider(this.chatList, () => this.toggleContextClear());
    this.scrollToBottom();
  }

  /**
   * 滚动到底部
   */
  private scrollToBottom(force = false): void {
    if (this.scrollThrottle) {
      clearTimeout(this.scrollThrottle);
    }

    this.scrollThrottle = setTimeout(() => {
      try {
        if (!this.chatList) return;

        if (force) {
          this.chatList.scrollTo({
            top: this.chatList.scrollHeight,
            behavior: 'instant'
          });
        } else {
          const isNearBottom =
            this.chatList.scrollHeight -
              this.chatList.scrollTop -
              this.chatList.clientHeight <=
            CONFIG.SCROLL_BOTTOM_THRESHOLD;
          if (isNearBottom) {
            this.chatList.scrollTo({
              top: this.chatList.scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      } catch (error) {
        console.warn('Scroll error:', error);
      }
    }, CONFIG.SCROLL_THROTTLE_DELAY);
  }

  // ============================================
  // 模型切换 UI
  // ============================================

  /**
   * 更新思考强度 UI
   */
  updateThinkingLevelUI(): void {
    const level = this.host.settings.thinkingLevel || 'none';
    this.thinkLevelDisplay.textContent = T.thinkingLevels[level];

    if (level !== 'none') {
      this.thinkBtn.classList.add('active');
    } else {
      this.thinkBtn.classList.remove('active');
    }

    // 确保箭头方向正确
    updateSelectorArrow(this.thinkSelector, '.think-arrow');

    this.thinkPopup.querySelectorAll('.sa-think-option').forEach((opt) => {
      const optEl = opt as HTMLElement;
      optEl.classList.toggle('selected', optEl.dataset.level === level);
    });
  }

  /**
   * 更新模型切换按钮 UI
   */
  updateModelSwitchUI(): void {
    const currentModel = this.currentSessionModel || this.host.settings.chatModel;
    this.modelSwitchName.textContent = getShortModelName(currentModel);
    this.modelSwitchName.title = currentModel;

    // 确保箭头方向正确
    updateSelectorArrow(this.modelSwitchSelector, '.model-arrow');
  }

  /**
   * 渲染模型切换弹出菜单
   */
  private renderModelSwitchPopup(): void {
    const addedModels = this.host.addedModels;

    if (addedModels.length === 0) {
      this.modelSwitchPopup.innerHTML = `<div class="sa-model-dropdown-empty">${T.noModelsAdded}</div>`;
      return;
    }

    const currentModel = this.currentSessionModel || this.host.settings.chatModel;
    this.modelSwitchPopup.innerHTML = addedModels
      .map(
        (id) =>
          `<div class="sa-model-switch-option ${id === currentModel ? 'selected' : ''}" data-model="${id}">${id}</div>`
      )
      .join('');

    this.modelSwitchPopup.querySelectorAll('.sa-model-switch-option').forEach((item) => {
      (item as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        this.currentSessionModel = (item as HTMLElement).dataset.model!;
        this.updateModelSwitchUI();
        closeSelectorDropdown(this.modelSwitchSelector, '.model-arrow');
      };
    });
  }

  /**
   * 关闭所有下拉菜单
   */
  closeDropdowns(): void {
    closeSelectorDropdown(this.thinkSelector, '.think-arrow');
    closeSelectorDropdown(this.modelSwitchSelector, '.model-arrow');
    this.host.shadow.querySelectorAll('.sa-msg-btn.open').forEach((btn) => {
      btn.classList.remove('open');
      const arrow = btn.querySelector('.sa-msg-btn-arrow');
      if (arrow) arrow.textContent = '◀';
    });
  }

  // ============================================
  // 生成响应
  // ============================================

  /**
   * 处理发送/停止动作
   * 使用短暂的防抖锁防止连续点击，但不阻塞整个生成过程
   */
  private async handleAction(): Promise<void> {
    // 防止连续点击/双击（短暂防抖）
    if (this.isActionLocked) return;
    this.isActionLocked = true;

    // 短暂延迟后解锁，允许后续的中止操作
    setTimeout(() => {
      this.isActionLocked = false;
    }, 300);

    try {
      if (this.chatClient.isGenerating || this.isSummaryGenerating) {
        await this.abortGeneration();
      } else {
        // 不 await，让生成在后台进行，这样用户可以点击中止
        this.startGeneration().catch((error) => {
          console.error('Generation error:', error);
        });
      }
    } catch (error) {
      console.error('handleAction error:', error);
    }
  }

  /**
   * 中止生成
   */
  private async abortGeneration(): Promise<void> {
    try {
      // 标记整个生成流程被中止
      this.isAborted = true;

      if (this.isSummaryGenerating) {
        this.host.abortSummary();
        this.isSummaryGenerating = false;
      }

      await this.chatClient.abort();
      this.updateActionButton('send');

      const lastMsg = this.chatList.lastElementChild;
      if (lastMsg?.classList.contains('ai')) {
        const bubble = lastMsg.querySelector('.sa-bubble');
        if (bubble) {
          removeLoadingIndicator(bubble as HTMLElement);
          const summaryBlock = bubble.querySelector('.sa-summary-block.loading');
          if (summaryBlock) summaryBlock.remove();

          if (!bubble.querySelector('.sa-aborted-indicator')) {
            bubble.appendChild(createAbortedIndicator());
          }
        }
      }
    } catch (error) {
      console.error('Error aborting generation:', error);
    }
  }

  /**
   * 更新发送/停止按钮状态
   */
  private updateActionButton(state: 'send' | 'stop'): void {
    if (state === 'stop') {
      this.actionBtn.innerHTML = stopIcon;
      this.actionBtn.className = 'stop';
      this.actionBtn.title = 'Stop';
    } else {
      this.actionBtn.innerHTML = sendIcon;
      this.actionBtn.className = 'send';
      this.actionBtn.title = 'Send';
    }
  }

  /**
   * 开始生成
   */
  private async startGeneration(): Promise<void> {
    try {
      const rawInput = Security.sanitizeInput(this.input.value.trim(), CONFIG.MAX_INPUT_LENGTH);
      const currentQueue = this.selectionManager.getQueue();

      if (!rawInput && currentQueue.length === 0) return;

      const provider = this.host.getChatProvider();
      if (!provider || !provider.apiKey) {
        this.host.openSettings();
        return;
      }

      const plainApiKey = await Security.deobfuscateApiKey(provider.apiKey);
      if (!Security.validateApiKey(plainApiKey)) {
        alert(IS_ZH ? 'API Key 格式无效，请检查设置' : 'Invalid API Key format');
        this.host.openSettings();
        return;
      }

      if (!Security.isValidApiUrl(provider.apiUrl, provider.type)) {
        alert(IS_ZH ? 'API 地址无效，请检查设置' : 'Invalid API URL');
        this.host.openSettings();
        return;
      }

      let userQuery = rawInput;
      if (!userQuery && currentQueue.length > 0) {
        userQuery = currentQueue.length > 1 ? T.prompts.explainMulti : T.prompts.explain;
      }

      this.clearSelections();
      this.input.value = '';

      const restorableDivider = this.chatList.querySelector('.sa-context-divider.can-restore');
      if (restorableDivider) {
        restorableDivider.classList.remove('can-restore');
        (restorableDivider as HTMLElement).onclick = null;
        (restorableDivider as HTMLElement).style.cursor = 'default';
      }

      this.lastUserMessage = { query: userQuery, contexts: currentQueue };
      this.appendUserMessage(userQuery, currentQueue);
      await this.generateResponse(userQuery, currentQueue);
    } catch (error) {
      console.error('Start generation error:', error);
      this.updateActionButton('send');
      alert(IS_ZH ? '发送消息时出现错误' : 'Error sending message');
    }
  }

  /**
   * 重新生成消息
   */
  private regenerateMessage(messageDiv: HTMLElement, useModel: string): void {
    if (this.chatClient.isGenerating || !this.lastUserMessage) return;

    messageDiv.remove();

    if (
      this.chatHistory.length > 0 &&
      this.chatHistory[this.chatHistory.length - 1].role === 'assistant'
    ) {
      this.chatHistory.pop();
    }

    const { query, contexts } = this.lastUserMessage;
    this.generateResponse(query, contexts, useModel);
  }

  /**
   * 生成 AI 响应
   */
  private async generateResponse(
    userQuery: string,
    currentQueue: string[],
    useModel?: string
  ): Promise<void> {
    // 等待前一个请求完成，但不吞掉错误
    await this.requestLock;

    // 创建新的请求锁
    let resolveLock: () => void;
    this.requestLock = new Promise((resolve) => {
      resolveLock = resolve;
    });

    // 重置中止标志
    this.isAborted = false;

    let aiBubble: HTMLElement | null = null;
    let messageDiv: HTMLElement | null = null;
    const actualModel = useModel || this.currentSessionModel || this.host.settings.chatModel;

    const provider = this.host.getChatProvider();

    try {
      this.updateActionButton('stop');

      aiBubble = createAIBubbleEmpty(this.chatList);
      messageDiv = aiBubble.parentElement!;
      this.scrollToBottom();

      if (!provider || !provider.apiKey) {
        throw new Error(IS_ZH ? 'API Key 未设置' : 'API Key not set');
      }

      const plainApiKey = await Security.deobfuscateApiKey(provider.apiKey);
      if (!Security.validateApiKey(plainApiKey)) {
        throw new Error(IS_ZH ? 'API Key 格式无效' : 'Invalid API Key format');
      }

      if (!Security.isValidApiUrl(provider.apiUrl, provider.type)) {
        throw new Error(IS_ZH ? 'API 地址无效' : 'Invalid API URL');
      }

      // ========== 摘要处理 ==========
      let pageContextContent = '';
      const summaryEnabled = this.host.settings.summaryEnabled;

      if (summaryEnabled) {
        const cachedSummary = this.host.getCachedSummary();
        const needsNewSummary = this.host.needsSummary();

        if (cachedSummary && !needsNewSummary) {
          createSummaryBlock(aiBubble, false);
          updateSummaryContent(aiBubble, cachedSummary, true);
          addLoadingIndicator(aiBubble);
          this.scrollToBottom();
          pageContextContent = `[Page Summary]:\n${cachedSummary}`;
        } else {
          createSummaryBlock(aiBubble, true);
          this.scrollToBottom();
          this.isSummaryGenerating = true;

          try {
            const summaryContent = await this.host.generateSummary({
              onStart: () => {},
              onProgress: (content) => {
                updateSummaryContent(aiBubble!, content, false);
                this.scrollToBottom();
              },
              onComplete: (content) => {
                updateSummaryContent(aiBubble!, content, true);
                this.isSummaryGenerating = false;
              },
              onError: (error) => {
                console.error('Summary generation error:', error);
                finishSummary(aiBubble!);
                this.isSummaryGenerating = false;
              }
            });

            if (summaryContent) {
              pageContextContent = `[Page Summary]:\n${summaryContent}`;
            } else {
              pageContextContent = `[Page Content]:\n${Security.smartTruncateContent(document.body.innerText, CONFIG.MAX_PAGE_CONTENT_LENGTH)}`;
            }
          } catch (error) {
            console.error('Summary error:', error);
            finishSummary(aiBubble);
            pageContextContent = `[Page Content]:\n${Security.smartTruncateContent(document.body.innerText, CONFIG.MAX_PAGE_CONTENT_LENGTH)}`;
          }

          this.isSummaryGenerating = false;
          addLoadingIndicator(aiBubble);
          this.scrollToBottom();
        }
      } else {
        addLoadingIndicator(aiBubble);
        this.scrollToBottom();
        pageContextContent = `[Page Content]:\n${Security.smartTruncateContent(document.body.innerText, CONFIG.MAX_PAGE_CONTENT_LENGTH)}`;
      }

      // 检查是否在摘要阶段被中止
      if (this.isAborted) {
        return;
      }

      // ========== 构建消息 ==========
      const sys =
        Security.sanitizeInput(this.host.settings.chatSystemPrompt, CONFIG.MAX_SYSTEM_PROMPT_LENGTH) +
        `\n\nContext:\nURL: ${Security.getSafeUrl()}\n${pageContextContent}`;

      let promptContent = '';
      if (currentQueue && currentQueue.length > 0) {
        promptContent += '=== Selected Contents ===\n';
        currentQueue.forEach((txt, i) => {
          const sanitizedTxt = Security.sanitizeInput(txt, CONFIG.MAX_SELECTION_LENGTH);
          promptContent += `[Block ${i + 1}]:\n"""${sanitizedTxt}"""\n\n`;
        });
        promptContent += '=========================\n';
      }
      promptContent += `User Question: ${Security.sanitizeInput(userQuery, CONFIG.MAX_INPUT_LENGTH)}`;

      const messages: ChatMessage[] = [{ role: 'system', content: sys }];

      const startIndex = Math.min(
        Math.max(0, this.contextCutoffIndex >= 0 ? this.contextCutoffIndex : 0),
        this.chatHistory.length
      );
      for (let i = startIndex; i < this.chatHistory.length; i++) {
        if (this.chatHistory[i]?.role && this.chatHistory[i]?.content) {
          messages.push(this.chatHistory[i]);
        }
      }

      messages.push({ role: 'user', content: promptContent });

      this.chatHistory.push({ role: 'user', content: promptContent });
      this.trimChatHistory();

      await this.performStreamingRequest(messages, actualModel, aiBubble, messageDiv, provider);
    } catch (error) {
      console.error('Generation error:', error);
      if (aiBubble && messageDiv) {
        this.handleGenerationError(error as Error, aiBubble, messageDiv, actualModel);
      }
    } finally {
      this.isSummaryGenerating = false;
      this.updateActionButton('send');
      // 释放锁，允许下一个请求执行
      resolveLock!();
    }
  }

  /**
   * 执行流式请求
   */
  private async performStreamingRequest(
    messages: ChatMessage[],
    actualModel: string,
    aiBubble: HTMLElement,
    messageDiv: HTMLElement,
    provider: ProviderConfig
  ): Promise<void> {
    const mdDiv = createMarkdownContainer();
    let thinkDiv: HTMLElement | null = null;
    const summaryBlock = aiBubble.querySelector('.sa-summary-block');

    const decryptedApiKey = await Security.deobfuscateApiKey(provider.apiKey);

    await this.chatClient.streamRequest(
      {
        apiUrl: provider.apiUrl,
        apiKey: decryptedApiKey,
        messages,
        model: actualModel,
        temperature: this.host.settings.chatTemperature,
        thinkingLevel: this.host.settings.thinkingLevel
      },
      {
        onFirstContent: () => {
          removeLoadingIndicator(aiBubble);
          aiBubble.appendChild(mdDiv);
        },
        onThinkingContent: (content: string, isComplete: boolean) => {
          removeLoadingIndicator(aiBubble);

          if (!thinkDiv) {
            thinkDiv = createThinkingBlock(aiBubble, !isComplete);
          }
          updateThinkingContent(aiBubble, content, isComplete);
          this.scrollToBottom();
        },
        onContent: (_delta: string, fullContent: string) => {
          updateMarkdownContent(mdDiv, fullContent);
          this.scrollToBottom();
        },
        onComplete: (fullContent: string) => {
          finishThinking(aiBubble);
          if (fullContent) {
            this.chatHistory.push({ role: 'assistant', content: fullContent });
            this.trimChatHistory();
          }
          addMessageFooter(messageDiv, {
            usedModel: actualModel,
            addedModels: this.host.addedModels,
            onRegenerate: (msgDiv, model) => this.regenerateMessage(msgDiv, model)
          });

          if (!fullContent && !aiBubble.querySelector('.sa-think-block')) {
            showNoResponseMessage(aiBubble);
          }
        },
        onError: (error: Error) => {
          console.error('Stream error:', error);
        }
      }
    );
  }

  /**
   * 处理生成错误
   */
  private handleGenerationError(
    error: Error,
    aiBubble: HTMLElement,
    messageDiv: HTMLElement,
    actualModel: string
  ): void {
    console.error('Generation error details:', error);

    const errorMessage = parseErrorMessage(error);
    const errorDiv = createErrorElement(errorMessage);

    aiBubble.innerHTML = '';
    aiBubble.appendChild(errorDiv);
    addMessageFooter(messageDiv, {
      usedModel: actualModel,
      addedModels: this.host.addedModels,
      onRegenerate: (msgDiv, model) => this.regenerateMessage(msgDiv, model)
    });
  }

  /**
   * 裁剪聊天历史
   */
  private trimChatHistory(): void {
    const maxHistory = CONFIG.MAX_CHAT_HISTORY;
    if (this.chatHistory.length > maxHistory) {
      const trimCount = this.chatHistory.length - maxHistory;
      this.chatHistory = this.chatHistory.slice(trimCount);
      if (this.contextCutoffIndex >= 0) {
        this.contextCutoffIndex = Math.max(0, this.contextCutoffIndex - trimCount);
      }
    }
  }

  /**
   * 销毁视图
   */
  override destroy(): void {
    this.chatClient.destroy();

    if (this.scrollThrottle) {
      clearTimeout(this.scrollThrottle);
      this.scrollThrottle = null;
    }

    this.chatHistory = [];
    this.selectionManager.clear();
  }
}
