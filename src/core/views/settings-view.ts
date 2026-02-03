/**
 * 设置视图
 * 管理设置面板的 UI 和交互逻辑
 */

import type { ThemeType, ProviderConfig } from '@/types';
import { T, zh, en, IS_ZH } from '@/i18n';
import { CONFIG } from '@/config';
import { toggleSelectorOpen, closeSelectorDropdown } from '@/utils';
import { BaseView, ViewHost } from '@/core';

/**
 * 设置视图扩展宿主接口
 * 定义设置视图需要的额外宿主能力
 */
export interface SettingsViewHost extends ViewHost {
  /** 打开模型管理面板 */
  openModelsPanel(providerId: string): void;
  /** 打开提供方管理面板 */
  openProvidersPanel(): void;
  /** 获取所有提供方 */
  readonly providers: ProviderConfig[];
  /** 获取指定提供方的模型列表 */
  getModelsForProvider(providerId: string): string[];
}

/**
 * 设置视图类
 * 负责设置面板的渲染和交互
 */
export class SettingsView extends BaseView {
  protected override host: SettingsViewHost;

  // DOM 元素缓存 - 主题
  private themeSelector!: HTMLElement;
  private themeDisplay!: HTMLElement;
  private themeDropdown!: HTMLElement;

  // DOM 元素缓存 - 对话模型
  private chatProviderSelector!: HTMLElement;
  private chatProviderDisplay!: HTMLElement;
  private chatProviderDropdown!: HTMLElement;
  private chatModelSelector!: HTMLElement;
  private chatModelDisplay!: HTMLElement;
  private chatModelDropdown!: HTMLElement;

  // DOM 元素缓存 - 摘要模型
  private summarySection!: HTMLElement;
  private summaryToggle!: HTMLElement;
  private summaryProviderSelector!: HTMLElement;
  private summaryProviderDisplay!: HTMLElement;
  private summaryProviderDropdown!: HTMLElement;
  private summaryModelSelector!: HTMLElement;
  private summaryModelDisplay!: HTMLElement;
  private summaryModelDropdown!: HTMLElement;

  // DOM 元素缓存 - 状态显示
  private statusDisplay!: HTMLElement;
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private statusHideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(host: SettingsViewHost, container: HTMLElement) {
    super(host, container);
    this.host = host;
  }

  /**
   * 初始化设置视图
   */
  init(): void {
    this.cacheElements();
    this.bindEvents();
  }

  /**
   * 缓存 DOM 元素引用
   */
  private cacheElements(): void {
    // 主题
    this.themeSelector = this.host.shadow.getElementById('sa-theme-selector')!;
    this.themeDisplay = this.host.shadow.getElementById('set-theme-display')!;
    this.themeDropdown = this.host.shadow.getElementById('sa-theme-dropdown')!;

    // 对话模型
    this.chatProviderSelector = this.host.shadow.getElementById('sa-chat-provider-selector')!;
    this.chatProviderDisplay = this.host.shadow.getElementById('set-chat-provider-display')!;
    this.chatProviderDropdown = this.host.shadow.getElementById('sa-chat-provider-dropdown')!;
    this.chatModelSelector = this.host.shadow.getElementById('sa-chat-model-selector')!;
    this.chatModelDisplay = this.host.shadow.getElementById('set-chat-model-display')!;
    this.chatModelDropdown = this.host.shadow.getElementById('sa-chat-model-dropdown')!;

    // 摘要模型
    this.summarySection = this.host.shadow.getElementById('sa-summary-section')!;
    this.summaryToggle = this.host.shadow.getElementById('sa-summary-toggle')!;
    this.summaryProviderSelector = this.host.shadow.getElementById('sa-summary-provider-selector')!;
    this.summaryProviderDisplay = this.host.shadow.getElementById('set-summary-provider-display')!;
    this.summaryProviderDropdown = this.host.shadow.getElementById('sa-summary-provider-dropdown')!;
    this.summaryModelSelector = this.host.shadow.getElementById('sa-summary-model-selector')!;
    this.summaryModelDisplay = this.host.shadow.getElementById('set-summary-model-display')!;
    this.summaryModelDropdown = this.host.shadow.getElementById('sa-summary-model-dropdown')!;

    // 状态显示
    this.statusDisplay = this.host.shadow.getElementById('sa-settings-status')!;
  }

  /**
   * 绑定事件处理器
   */
  private bindEvents(): void {
    // 返回按钮
    this.host.shadow.getElementById('sa-back-btn')!.onclick = () => this.hide();

    // 提供方管理按钮
    this.host.shadow.getElementById('sa-provider-manage-btn')!.onclick = (e) => {
      e.stopPropagation();
      this.host.openProvidersPanel();
    };

    // 对话模型管理按钮
    this.host.shadow.getElementById('sa-chat-model-manage-btn')!.onclick = (e) => {
      e.stopPropagation();
      const providerId = this.chatProviderDisplay.dataset.providerId || '';
      this.host.openModelsPanel(providerId);
    };

    // 重置对话提示词按钮
    this.host.shadow.getElementById('sa-reset-chat-prompt')!.onclick = (e) => {
      e.stopPropagation();
      const textarea = this.host.shadow.getElementById('set-chat-prompt') as HTMLTextAreaElement;
      const defaultPrompt = IS_ZH ? zh.prompts.defaultSys : en.prompts.defaultSys;
      if (textarea) {
        textarea.value = defaultPrompt;
        this.triggerSave();
      }
    };

    // 重置摘要提示词按钮
    this.host.shadow.getElementById('sa-reset-summary-prompt')!.onclick = (e) => {
      e.stopPropagation();
      const textarea = this.host.shadow.getElementById('set-summary-prompt') as HTMLTextAreaElement;
      const defaultPrompt = IS_ZH ? zh.prompts.defaultSummary : en.prompts.defaultSummary;
      if (textarea) {
        textarea.value = defaultPrompt;
        this.triggerSave();
      }
    };

    // 监听所有输入框和文本域的变化
    this.container.querySelectorAll('input, textarea').forEach((input) => {
      (input as HTMLElement).oninput = () => this.triggerSave();
    });

    // 主题选择器
    this.themeDisplay.onclick = (e) => {
      e.stopPropagation();
      toggleSelectorOpen(this.themeSelector);
      this.renderThemeDropdown();
    };

    this.themeDropdown.querySelectorAll('.sa-selector-item').forEach((item) => {
      (item as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        this.themeDisplay.textContent = (item as HTMLElement).textContent;
        this.themeDisplay.dataset.theme = (item as HTMLElement).dataset.theme;
        closeSelectorDropdown(this.themeSelector);
        this.triggerSave();
      };
    });

    // 对话提供方选择器
    this.chatProviderDisplay.onclick = (e) => {
      e.stopPropagation();
      toggleSelectorOpen(this.chatProviderSelector);
      this.renderProviderDropdown(this.chatProviderDropdown, this.chatProviderDisplay, 'chat');
    };

    // 对话模型选择器
    this.chatModelDisplay.onclick = (e) => {
      e.stopPropagation();
      toggleSelectorOpen(this.chatModelSelector);
      this.renderModelDropdown(this.chatModelDropdown, this.chatModelDisplay, 'chat');
    };

    // 摘要开关
    this.summaryToggle.onclick = () => {
      const isActive = this.summaryToggle.classList.toggle('active');
      this.updateSummarySectionState(isActive);
      this.triggerSave();
    };

    // 摘要提供方选择器
    this.summaryProviderDisplay.onclick = (e) => {
      e.stopPropagation();
      toggleSelectorOpen(this.summaryProviderSelector);
      this.renderProviderDropdown(this.summaryProviderDropdown, this.summaryProviderDisplay, 'summary');
    };

    // 摘要模型选择器
    this.summaryModelDisplay.onclick = (e) => {
      e.stopPropagation();
      toggleSelectorOpen(this.summaryModelSelector);
      this.renderModelDropdown(this.summaryModelDropdown, this.summaryModelDisplay, 'summary');
    };
  }

  /**
   * 渲染主题下拉选项
   */
  private renderThemeDropdown(): void {
    const currentTheme = this.themeDisplay.dataset.theme;
    this.themeDropdown.querySelectorAll('.sa-selector-item').forEach((item) => {
      (item as HTMLElement).classList.toggle(
        'selected',
        (item as HTMLElement).dataset.theme === currentTheme
      );
    });
  }

  /**
   * 渲染提供方下拉选项
   */
  private renderProviderDropdown(
    dropdown: HTMLElement,
    display: HTMLElement,
    type: 'chat' | 'summary'
  ): void {
    const providers = this.host.providers;

    if (providers.length === 0) {
      dropdown.innerHTML = `<div class="sa-model-dropdown-empty">${T.noProviders}</div>`;
      return;
    }

    const currentProviderId = display.dataset.providerId;

    dropdown.innerHTML = providers
      .map(
        (p) =>
          `<div class="sa-selector-item ${p.id === currentProviderId ? 'selected' : ''}" data-provider-id="${p.id}">${p.name || T.defaultProviderName}</div>`
      )
      .join('');

    dropdown.querySelectorAll('.sa-selector-item').forEach((item) => {
      (item as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        const providerId = (item as HTMLElement).dataset.providerId!;
        const provider = providers.find(p => p.id === providerId);
        display.textContent = provider?.name || T.defaultProviderName;
        display.dataset.providerId = providerId;

        // 关闭下拉
        if (type === 'chat') {
          closeSelectorDropdown(this.chatProviderSelector);
          // 重置对应的模型选择器
          this.chatModelDisplay.textContent = '';
          this.chatModelDisplay.dataset.model = '';
        } else {
          closeSelectorDropdown(this.summaryProviderSelector);
          this.summaryModelDisplay.textContent = '';
          this.summaryModelDisplay.dataset.model = '';
        }
        this.triggerSave();
      };
    });
  }

  /**
   * 渲染模型下拉选项
   */
  private renderModelDropdown(
    dropdown: HTMLElement,
    display: HTMLElement,
    type: 'chat' | 'summary'
  ): void {
    const providerId = type === 'chat'
      ? this.chatProviderDisplay.dataset.providerId
      : this.summaryProviderDisplay.dataset.providerId;

    if (!providerId) {
      dropdown.innerHTML = `<div class="sa-model-dropdown-empty">${T.noProviders}</div>`;
      return;
    }

    const models = this.host.getModelsForProvider(providerId);

    if (models.length === 0) {
      dropdown.innerHTML = `<div class="sa-model-dropdown-empty">${T.clickManageToAdd}</div>`;
      return;
    }

    const currentModel = display.dataset.model;

    dropdown.innerHTML = models
      .map(
        (id) =>
          `<div class="sa-selector-item ${id === currentModel ? 'selected' : ''}" data-model="${id}">${id}</div>`
      )
      .join('');

    dropdown.querySelectorAll('.sa-selector-item').forEach((item) => {
      (item as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        const model = (item as HTMLElement).dataset.model!;
        display.textContent = model;
        display.dataset.model = model;

        if (type === 'chat') {
          closeSelectorDropdown(this.chatModelSelector);
        } else {
          closeSelectorDropdown(this.summaryModelSelector);
        }
        this.triggerSave();
      };
    });
  }

  /**
   * 更新摘要部分的启用/禁用状态
   */
  private updateSummarySectionState(enabled: boolean): void {
    // 获取摘要部分除了开关行以外的所有表单元素
    const formGroups = this.summarySection.querySelectorAll('.sa-form-group');
    formGroups.forEach((group) => {
      const inputs = group.querySelectorAll('input, textarea, button, .sa-selector-display');
      inputs.forEach((input) => {
        if (enabled) {
          (input as HTMLElement).removeAttribute('disabled');
        } else {
          (input as HTMLInputElement).disabled = true;
        }
      });
    });
  }

  /**
   * 触发保存（防抖）
   */
  private triggerSave(): void {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    if (this.statusHideTimeout) clearTimeout(this.statusHideTimeout);

    this.statusDisplay.textContent = T.saving;
    this.statusDisplay.classList.add('visible');

    this.saveTimeout = setTimeout(async () => {
      await this.handleSave();
      this.statusDisplay.textContent = T.saved;
      this.statusHideTimeout = setTimeout(() => {
        this.statusDisplay.classList.remove('visible');
        this.statusHideTimeout = null;
      }, 1500);
      this.saveTimeout = null;
    }, 1000);
  }

  /**
   * 处理保存设置
   */
  private async handleSave(): Promise<void> {
    const summaryEnabled = this.summaryToggle.classList.contains('active');

    await this.host.saveSettings({
      theme: this.themeDisplay.dataset.theme as ThemeType,
      // 对话模型设置
      chatProviderId: this.chatProviderDisplay.dataset.providerId || '',
      chatModel: this.chatModelDisplay.dataset.model || '',
      chatTemperature: parseFloat(
        (this.host.shadow.getElementById('set-chat-temp') as HTMLInputElement).value
      ),
      chatSystemPrompt: (this.host.shadow.getElementById('set-chat-prompt') as HTMLTextAreaElement).value,
      // 摘要模型设置
      summaryEnabled,
      summaryProviderId: this.summaryProviderDisplay.dataset.providerId || '',
      summaryModel: this.summaryModelDisplay.dataset.model || '',
      summaryTemperature: parseFloat(
        (this.host.shadow.getElementById('set-summary-temp') as HTMLInputElement).value
      ),
      summarySystemPrompt: (this.host.shadow.getElementById('set-summary-prompt') as HTMLTextAreaElement).value
    });
    this.host.updateModelSwitchUI();
  }

  /**
   * 刷新设置 UI
   * 从当前设置更新所有表单字段
   */
  refreshUI(): void {
    const settings = this.host.settings;
    const providers = this.host.providers;

    // 重置所有箭头为 ◀
    this.container.querySelectorAll('.sa-selector-arrow').forEach(arrow => {
      arrow.textContent = '◀';
    });

    // 主题
    const themeDisplay = this.host.getCachedElement('set-theme-display');
    if (themeDisplay) {
      themeDisplay.textContent = T.themeOpts[settings.theme] || T.themeOpts.auto;
      themeDisplay.dataset.theme = settings.theme || 'auto';
    }

    // 对话模型设置
    const chatProvider = providers.find(p => p.id === settings.chatProviderId);
    if (this.chatProviderDisplay) {
      this.chatProviderDisplay.textContent = chatProvider?.name || T.defaultProviderName;
      this.chatProviderDisplay.dataset.providerId = settings.chatProviderId;
    }

    if (this.chatModelDisplay) {
      const modelName = settings.chatModel || CONFIG.DEFAULT_MODEL;
      this.chatModelDisplay.textContent = modelName;
      this.chatModelDisplay.dataset.model = modelName;
    }

    const chatTempInput = this.host.getCachedElement('set-chat-temp') as HTMLInputElement | null;
    if (chatTempInput) chatTempInput.value = String(settings.chatTemperature);

    const chatPromptInput = this.host.getCachedElement('set-chat-prompt') as HTMLTextAreaElement | null;
    if (chatPromptInput) chatPromptInput.value = settings.chatSystemPrompt;

    // 摘要模型设置
    const summaryEnabled = settings.summaryEnabled;
    if (this.summaryToggle) {
      this.summaryToggle.classList.toggle('active', summaryEnabled);
    }
    this.updateSummarySectionState(summaryEnabled);

    const summaryProvider = providers.find(p => p.id === settings.summaryProviderId);
    if (this.summaryProviderDisplay) {
      this.summaryProviderDisplay.textContent = summaryProvider?.name || T.defaultProviderName;
      this.summaryProviderDisplay.dataset.providerId = settings.summaryProviderId;
    }

    if (this.summaryModelDisplay) {
      this.summaryModelDisplay.textContent = settings.summaryModel || '';
      this.summaryModelDisplay.dataset.model = settings.summaryModel || '';
    }

    const summaryTempInput = this.host.getCachedElement('set-summary-temp') as HTMLInputElement | null;
    if (summaryTempInput) summaryTempInput.value = String(settings.summaryTemperature);

    const summaryPromptInput = this.host.getCachedElement('set-summary-prompt') as HTMLTextAreaElement | null;
    if (summaryPromptInput) summaryPromptInput.value = settings.summarySystemPrompt;
  }

  /**
   * 关闭所有下拉菜单
   */
  closeDropdowns(): void {
    closeSelectorDropdown(this.themeSelector);
    closeSelectorDropdown(this.chatProviderSelector);
    closeSelectorDropdown(this.chatModelSelector);
    closeSelectorDropdown(this.summaryProviderSelector);
    closeSelectorDropdown(this.summaryModelSelector);
  }
}
