/**
 * AISidebar 主类
 * 作为主协调器，管理各个视图组件和全局状态
 */

import type { Settings, ThemeType, ProviderConfig } from '@/types';
import { T, zh, en } from '@/i18n';
import { CONFIG, getDefaultSettings, getDefaultProvider, DEFAULT_PROVIDER_ID } from '../config';
import { styles } from '@/styles';
import { getSidebarTemplate } from '@/ui';
import { configureMarked } from './markdown';
import GMSafe from './gm-api';
import * as Security from '../utils/security';
import {
  SettingsView,
  ModelsView,
  ChatView,
  ProvidersView,
  type SettingsViewHost,
  type ModelsViewHost,
  type ChatViewHost,
  type ProvidersViewHost
} from './views';
import { SummaryService, pageContentManager } from '@/services';

/** 事件处理器映射 */
interface BoundEventHandlers {
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
  onWindowBlur?: () => void;
  onMouseUp?: (e: MouseEvent) => void;
  onDocumentClick?: () => void;
}

/**
 * AI 侧边栏主类
 * 实现 ViewHost 接口，作为所有视图的宿主
 */
export class AISidebar implements SettingsViewHost, ModelsViewHost, ChatViewHost, ProvidersViewHost {
  // DOM 元素
  private root: HTMLDivElement;
  private _shadow: ShadowRoot;
  private container!: HTMLElement;
  private modeIndicator!: HTMLElement;

  // 视图组件
  private settingsView!: SettingsView;
  private modelsView!: ModelsView;
  private chatView!: ChatView;
  private providersView!: ProvidersView;

  // 服务
  private summaryService: SummaryService;

  // 状态
  private isOpen = false;
  private _settings: Settings;
  private _providers: ProviderConfig[] = [];
  private _modelsCache: Record<string, string[]> = {};
  private _unsavedProviders: Set<string> = new Set(); // 跟踪未保存的提供方
  private isXPressed = false;

  // DOM 缓存
  private domCache: Record<string, HTMLElement | null> = {};

  // 事件处理器
  private _boundEventHandlers: BoundEventHandlers = {};

  constructor() {
    this.root = document.createElement('div');
    this._shadow = this.root.attachShadow({ mode: 'open' });
    this._settings = getDefaultSettings();
    this._providers = [getDefaultProvider()];
    this.summaryService = new SummaryService();

    this.initUI();
    this.initViews();
    this.attachGlobalEvents();
    this.registerMenu();
    this.applyTheme(this._settings.theme);

    this.loadSettingsAsync()
      .then(() => console.log('✅ Settings Loaded'))
      .catch((error) => console.error('❌ Failed to load settings:', error));
  }

  // ============================================
  // ViewHost 接口实现
  // ============================================

  /** Shadow DOM 根节点 */
  get shadow(): ShadowRoot {
    return this._shadow;
  }

  /** 当前设置 */
  get settings(): Settings {
    return this._settings;
  }

  /** 所有提供方 */
  get providers(): ProviderConfig[] {
    return this._providers;
  }

  /** 已添加的模型列表 */
  get addedModels(): string[] {
    // 返回当前对话提供方的模型
    return this.getModelsForProvider(this._settings.chatProviderId);
  }

  /**
   * 获取缓存的 DOM 元素
   */
  getCachedElement(id: string): HTMLElement | null {
    if (!this.domCache[id]) {
      this.domCache[id] = this._shadow.getElementById(id);
    }
    return this.domCache[id];
  }

  /**
   * 应用主题
   */
  applyTheme(theme: ThemeType): void {
    const isDark =
      theme === 'auto'
        ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
        : theme === 'dark';

    if (isDark) {
      this.container.classList.remove('light-theme');
    } else {
      this.container.classList.add('light-theme');
    }
  }

  /**
   * 保存设置
   * @param newSettings - 新设置
   */
  async saveSettings(newSettings: Partial<Settings>): Promise<void> {
    // 验证系统提示词
    if (newSettings.chatSystemPrompt) {
      newSettings.chatSystemPrompt = Security.sanitizeInput(newSettings.chatSystemPrompt, 5000);
    }
    if (newSettings.summarySystemPrompt) {
      newSettings.summarySystemPrompt = Security.sanitizeInput(newSettings.summarySystemPrompt, 5000);
    }

    this._settings = { ...this._settings, ...newSettings };
    await GMSafe.setValue(CONFIG.STORAGE_KEY, JSON.stringify(this._settings));
    this.applyTheme(this._settings.theme);

    // 更新各视图的 UI
    this.chatView.updateThinkingLevelUI();
  }

  /**
   * 保存提供方列表
   */
  async saveProviders(): Promise<void> {
    await GMSafe.setValue(CONFIG.PROVIDERS_STORAGE_KEY, JSON.stringify(this._providers));
  }

  /**
   * 保存已添加的模型列表（按提供方）
   */
  async saveModelsForProvider(providerId: string): Promise<void> {
    const key = CONFIG.MODELS_STORAGE_PREFIX + providerId;
    await GMSafe.setValue(key, JSON.stringify(this._modelsCache[providerId] || []));
  }

  /**
   * 更新模型切换 UI
   */
  updateModelSwitchUI(): void {
    this.chatView.updateModelSwitchUI();
  }

  /**
   * 打开设置面板
   */
  openSettings(): void {
    this.settingsView.show();
  }

  /**
   * 获取当前对话提供方配置
   */
  getChatProvider(): ProviderConfig | undefined {
    return this._providers.find(p => p.id === this._settings.chatProviderId);
  }

  /**
   * 获取摘要提供方配置
   */
  getSummaryProvider(): ProviderConfig | undefined {
    return this._providers.find(p => p.id === this._settings.summaryProviderId);
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
   * 生成摘要
   */
  async generateSummary(callbacks: {
    onStart: () => void;
    onProgress: (content: string) => void;
    onComplete: (content: string) => void;
    onError: (error: string) => void;
  }): Promise<string | null> {
    const provider = this.getSummaryProvider();
    if (!provider || !provider.apiKey || !this._settings.summaryModel) {
      callbacks.onError('Summary provider not configured');
      return null;
    }

    callbacks.onStart();

    return this.summaryService.generateSummary(this._settings, provider, {
      onProgress: callbacks.onProgress,
      onComplete: callbacks.onComplete,
      onError: callbacks.onError
    });
  }

  /**
   * 中止摘要生成
   */
  abortSummary(): void {
    this.summaryService.abort();
  }

  /**
   * 打开模型管理面板（指定提供方）
   */
  openModelsPanel(providerId: string): void {
    this.modelsView.showForProvider(providerId);
  }

  /**
   * 打开提供方管理面板
   */
  openProvidersPanel(): void {
    this.providersView.show();
  }

  // ============================================
  // 提供方管理（ProvidersViewHost 实现）
  // ============================================

  /**
   * 添加提供方（草稿状态，不自动保存）
   */
  addProvider(provider: ProviderConfig): void {
    this._providers.push(provider);
    this._modelsCache[provider.id] = [];
    // 标记为未保存
    this._unsavedProviders.add(provider.id);
  }

  /**
   * 更新提供方
   */
  updateProvider(provider: ProviderConfig): void {
    const index = this._providers.findIndex(p => p.id === provider.id);
    if (index >= 0) {
      this._providers[index] = provider;
      // 只有已保存的提供方才持久化更新
      if (!this._unsavedProviders.has(provider.id)) {
        this.saveProviders();
      }
    }
  }

  /**
   * 删除提供方
   */
  deleteProvider(providerId: string): void {
    // 不允许删除默认提供方
    if (providerId === DEFAULT_PROVIDER_ID) return;

    this._providers = this._providers.filter(p => p.id !== providerId);
    delete this._modelsCache[providerId];
    this._unsavedProviders.delete(providerId);

    // 如果删除的是当前选中的提供方，切换到默认
    if (this._settings.chatProviderId === providerId) {
      this._settings.chatProviderId = DEFAULT_PROVIDER_ID;
    }
    if (this._settings.summaryProviderId === providerId) {
      this._settings.summaryProviderId = DEFAULT_PROVIDER_ID;
    }

    this.saveProviders();
    this.saveSettings({});
  }

  /**
   * 检查提供方是否已保存（非草稿）
   */
  isProviderSaved(providerId: string): boolean {
    return !this._unsavedProviders.has(providerId);
  }

  /**
   * 标记提供方为已保存
   */
  markProviderAsSaved(providerId: string): void {
    this._unsavedProviders.delete(providerId);
    this.saveProviders();
  }

  // ============================================
  // 模型管理（ModelsViewHost 实现）
  // ============================================

  /**
   * 获取指定提供方的模型列表
   */
  getModelsForProvider(providerId: string): string[] {
    return this._modelsCache[providerId] || [];
  }

  /**
   * 添加模型到指定提供方
   */
  addModelToProvider(providerId: string, modelId: string): void {
    if (!this._modelsCache[providerId]) {
      this._modelsCache[providerId] = [];
    }
    if (!this._modelsCache[providerId].includes(modelId)) {
      this._modelsCache[providerId].push(modelId);
      this.saveModelsForProvider(providerId);
    }
  }

  /**
   * 从指定提供方移除模型
   */
  removeModelFromProvider(providerId: string, modelId: string): void {
    if (this._modelsCache[providerId]) {
      this._modelsCache[providerId] = this._modelsCache[providerId].filter(id => id !== modelId);
      this.saveModelsForProvider(providerId);
    }
  }

  /**
   * 清空指定提供方的所有模型
   */
  clearModelsForProvider(providerId: string): void {
    this._modelsCache[providerId] = [];
    this.saveModelsForProvider(providerId);
  }

  /**
   * 刷新提供方视图（模型列表变化后调用）
   * 如果提供方还没有设置默认模型，自动设置第一个模型为默认
   */
  refreshProvidersView(providerId: string): void {
    const provider = this._providers.find(p => p.id === providerId);
    const models = this._modelsCache[providerId] || [];

    // 如果提供方没有设置默认模型且有可用模型，自动设置第一个为默认
    if (provider && !provider.defaultModel && models.length > 0) {
      provider.defaultModel = models[0];
      this.saveProviders();
    }

    // 刷新提供方视图
    if (this.providersView.isVisible) {
      this.providersView.renderList();
    }
  }

  // ============================================
  // 初始化
  // ============================================

  private registerMenu(): void {
    GMSafe.registerMenu(T.menu, () => this.toggle());
  }

  private initUI(): void {
    configureMarked();

    // 检查 KaTeX 加载状态（KaTeX JS 用于将 LaTeX 转换为 MathML）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).katex !== 'undefined' || typeof (globalThis as any).katex !== 'undefined') {
      console.log('✅ KaTeX loaded successfully');
    } else {
      console.warn('⚠️ KaTeX not loaded, LaTeX rendering will use fallback');
    }

    // 注意：不再需要加载 KaTeX CSS，因为我们使用浏览器原生 MathML 渲染

    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    this._shadow.appendChild(styleTag);

    const container = document.createElement('div');
    container.id = 'sa-sidebar';
    container.innerHTML = getSidebarTemplate();
    this._shadow.appendChild(container);
    document.body.appendChild(this.root);

    this.container = this._shadow.getElementById('sa-sidebar')!;
    this.modeIndicator = this._shadow.getElementById('sa-mode-indicator')!;

    if (!GMSafe.isAsyncAPI()) {
      const warning = this._shadow.getElementById('sa-storage-warning');
      if (warning) warning.style.display = 'block';
    }
  }

  private initViews(): void {
    // 初始化设置视图
    const settingsPanel = this._shadow.getElementById('sa-settings-panel')!;
    this.settingsView = new SettingsView(this, settingsPanel);
    this.settingsView.init();

    // 初始化模型管理视图
    const modelsPanel = this._shadow.getElementById('sa-models-panel')!;
    this.modelsView = new ModelsView(this, modelsPanel);
    this.modelsView.init();

    // 初始化提供方管理视图
    const providersPanel = this._shadow.getElementById('sa-providers-panel')!;
    this.providersView = new ProvidersView(this, providersPanel);
    this.providersView.init();

    // 初始化对话视图（使用 container 作为容器，因为 ChatView 管理多个元素）
    this.chatView = new ChatView(this, this.container);
    this.chatView.init();

    // 绑定头部按钮事件
    this._shadow.getElementById('sa-close-btn')!.onclick = () => this.toggle(false);
    this._shadow.getElementById('sa-settings-btn')!.onclick = () => this.settingsView.toggle();

    // 刷新设置 UI
    this.settingsView.refreshUI();
  }

  private async loadSettingsAsync(): Promise<void> {
    try {
      // 加载提供方列表
      const providersStr = await GMSafe.getValue<string | null>(CONFIG.PROVIDERS_STORAGE_KEY, null);
      if (providersStr) {
        const savedProviders = JSON.parse(providersStr) as ProviderConfig[];
        if (savedProviders.length > 0) {
          this._providers = savedProviders;
        }
      }

      // 确保默认提供方存在
      if (!this._providers.find(p => p.id === DEFAULT_PROVIDER_ID)) {
        this._providers.unshift(getDefaultProvider());
      }

      // 加载每个提供方的模型列表
      for (const provider of this._providers) {
        const modelsStr = await GMSafe.getValue<string | null>(
          CONFIG.MODELS_STORAGE_PREFIX + provider.id,
          null
        );
        if (modelsStr) {
          this._modelsCache[provider.id] = JSON.parse(modelsStr);
        } else {
          this._modelsCache[provider.id] = [];
        }
      }

      // 加载设置
      const savedStr = await GMSafe.getValue<string | null>(CONFIG.STORAGE_KEY, null);
      if (savedStr) {
        const savedSettings = JSON.parse(savedStr) as Partial<Settings>;

        // 检查默认提示词（根据语言自动更新）
        const isDefaultPrompt =
          savedSettings.chatSystemPrompt === zh.prompts.defaultSys ||
          savedSettings.chatSystemPrompt === en.prompts.defaultSys;

        this._settings = { ...getDefaultSettings(), ...savedSettings };
        if (isDefaultPrompt) {
          this._settings.chatSystemPrompt = T.prompts.defaultSys;
        }

        this.settingsView.refreshUI();
        this.applyTheme(this._settings.theme);
        this.chatView.updateThinkingLevelUI();
        this.chatView.updateModelSwitchUI();
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }

  // ============================================
  // 全局事件处理
  // ============================================

  private attachGlobalEvents(): void {
    // 键盘快捷键
    this._boundEventHandlers.onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !(e.target as HTMLElement).isContentEditable) {
          this.isXPressed = true;
          this.modeIndicator.classList.add('active');
        }
      }
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        this.toggle();
      }
    };

    this._boundEventHandlers.onKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        this.isXPressed = false;
        this.modeIndicator.classList.remove('active');
      }
    };

    this._boundEventHandlers.onWindowBlur = () => {
      this.isXPressed = false;
      this.modeIndicator.classList.remove('active');
    };

    // 文本选择
    this._boundEventHandlers.onMouseUp = (e: MouseEvent) => {
      if (this.root.contains(e.target as Node)) return;
      setTimeout(() => {
        const sel = window.getSelection()?.toString().trim();
        if (sel && this.isOpen) {
          this.chatView.addSelection(sel, this.isXPressed);
        }
      }, 100);
    };

    // 关闭下拉菜单
    this._boundEventHandlers.onDocumentClick = () => {
      this.settingsView.closeDropdowns();
      this.chatView.closeDropdowns();
    };

    document.addEventListener('keydown', this._boundEventHandlers.onKeyDown);
    document.addEventListener('keyup', this._boundEventHandlers.onKeyUp);
    window.addEventListener('blur', this._boundEventHandlers.onWindowBlur);
    document.addEventListener('mouseup', this._boundEventHandlers.onMouseUp);
    document.addEventListener('click', this._boundEventHandlers.onDocumentClick);

    // 容器内事件
    this.container.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        e.stopPropagation();
        this.toggle(false);
        return;
      }
      if (this.chatView.handleInputEnter(e)) {
        return;
      }
      e.stopPropagation();
    });

    // 阻止滚轮穿透
    this.container.addEventListener(
      'wheel',
      (e) => {
        let target = e.target as HTMLElement | null;
        let scrollableElement: HTMLElement | null = null;

        while (target && target !== this.container) {
          const style = window.getComputedStyle(target);
          const overflowY = style.overflowY;
          const isScrollable =
            (overflowY === 'auto' || overflowY === 'scroll') &&
            target.scrollHeight > target.clientHeight;

          if (isScrollable) {
            scrollableElement = target;
            break;
          }
          target = target.parentElement;
        }

        if (scrollableElement) {
          const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
          const atTop = scrollTop <= 0;
          const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

          if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
        e.stopPropagation();
      },
      { passive: false }
    );

    // Shadow DOM 内部点击处理
    this._shadow.addEventListener('click', (e) => {
      // 关闭未被点击的下拉菜单
      const thinkSelector = this._shadow.getElementById('sa-think-selector');
      const modelSwitchSelector = this._shadow.getElementById('sa-model-switch-selector');
      const themeSelector = this._shadow.getElementById('sa-theme-selector');

      if (thinkSelector && !thinkSelector.contains(e.target as Node)) {
        thinkSelector.classList.remove('open');
      }
      if (modelSwitchSelector && !modelSwitchSelector.contains(e.target as Node)) {
        modelSwitchSelector.classList.remove('open');
      }
      if (themeSelector && !themeSelector.contains(e.target as Node)) {
        themeSelector.classList.remove('open');
      }

      // 关闭所有打开的选择器（包括更新箭头）
      this._shadow.querySelectorAll('.sa-selector-wrapper.open').forEach((wrapper) => {
        if (!wrapper.contains(e.target as Node)) {
          wrapper.classList.remove('open');
          const arrow = wrapper.querySelector('.sa-selector-arrow');
          if (arrow) arrow.textContent = '◀';
        }
      });

      this._shadow.querySelectorAll('.sa-msg-btn.open').forEach((btn) => {
        if (!btn.contains(e.target as Node)) btn.classList.remove('open');
      });
    });
  }

  // ============================================
  // 公共方法
  // ============================================

  /**
   * 切换侧边栏显示状态
   */
  public toggle(forceState?: boolean): void {
    const nextState = forceState !== undefined ? forceState : !this.isOpen;
    this.isOpen = nextState;

    if (this.isOpen) {
      this.container.classList.add('open');
      this.chatView.focusInput();
      const sel = window.getSelection()?.toString().trim();
      if (sel) this.chatView.addSelection(sel, false);
    } else {
      this.container.classList.remove('open');
      this.chatView.getInput().blur();
      window.focus();
    }
  }

  /**
   * 销毁侧边栏
   */
  public destroy(): void {
    try {
      // 销毁视图组件
      this.chatView.destroy();
      this.settingsView.destroy();
      this.modelsView.destroy();
      this.providersView.destroy();

      // 销毁服务
      this.summaryService.destroy();

      // 移除全局事件监听
      if (this._boundEventHandlers) {
        if (this._boundEventHandlers.onKeyDown) {
          document.removeEventListener('keydown', this._boundEventHandlers.onKeyDown);
        }
        if (this._boundEventHandlers.onKeyUp) {
          document.removeEventListener('keyup', this._boundEventHandlers.onKeyUp);
        }
        if (this._boundEventHandlers.onWindowBlur) {
          window.removeEventListener('blur', this._boundEventHandlers.onWindowBlur);
        }
        if (this._boundEventHandlers.onMouseUp) {
          document.removeEventListener('mouseup', this._boundEventHandlers.onMouseUp);
        }
        if (this._boundEventHandlers.onDocumentClick) {
          document.removeEventListener('click', this._boundEventHandlers.onDocumentClick);
        }
        this._boundEventHandlers = {};
      }

      // 清理 DOM 缓存
      this.domCache = {};

      // 移除 DOM 元素
      if (this.root?.parentNode) {
        this.root.parentNode.removeChild(this.root);
      }

      // 清理状态
      this._providers = [];
      this._modelsCache = {};

      console.log('🧹 AI Sidebar destroyed and cleaned up');
    } catch (error) {
      console.error('Error during destroy:', error);
    }
  }
}
