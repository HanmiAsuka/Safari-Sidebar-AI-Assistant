/**
 * 提供方管理视图
 * 管理多个 AI 提供方的配置
 */

import type { ProviderConfig, ProviderType } from '@/types';
import { T } from '@/i18n';
import { CONFIG, getDefaultProvider } from '@/config';
import * as Security from '../../utils/security';
import { BaseView, ViewHost } from '@/core';

/**
 * 提供方管理视图扩展宿主接口
 */
export interface ProvidersViewHost extends ViewHost {
  /** 获取所有提供方 */
  readonly providers: ProviderConfig[];
  /** 添加提供方 */
  addProvider(provider: ProviderConfig): void;
  /** 更新提供方 */
  updateProvider(provider: ProviderConfig): void;
  /** 删除提供方 */
  deleteProvider(providerId: string): void;
  /** 保存提供方列表 */
  saveProviders(): Promise<void>;
}

/**
 * 提供方管理视图类
 * 负责提供方的增删改查
 */
export class ProvidersView extends BaseView {
  protected override host: ProvidersViewHost;

  // DOM 元素
  private providersList!: HTMLElement;

  constructor(host: ProvidersViewHost, container: HTMLElement) {
    super(host, container);
    this.host = host;
  }

  /**
   * 初始化视图
   */
  init(): void {
    this.cacheElements();
    this.bindEvents();
  }

  /**
   * 缓存 DOM 元素引用
   */
  private cacheElements(): void {
    this.providersList = this.host.shadow.getElementById('sa-providers-list')!;
  }

  /**
   * 绑定事件处理器
   */
  private bindEvents(): void {
    // 返回按钮
    this.host.shadow.getElementById('sa-providers-back-btn')!.onclick = () => this.hide();

    // 添加提供方按钮
    this.host.shadow.getElementById('sa-add-provider-btn')!.onclick = () => this.addNewProvider();
  }

  /**
   * 显示视图并渲染列表
   */
  override show(): void {
    super.show();
    this.renderList();
  }

  /**
   * 添加新提供方
   */
  private addNewProvider(): void {
    const newProvider: ProviderConfig = {
      id: `provider_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: '',
      type: 'openrouter',
      apiKey: '',
      apiUrl: CONFIG.DEFAULT_API_URL,
      modelsApiUrl: CONFIG.DEFAULT_MODELS_API_URL
    };
    this.host.addProvider(newProvider);
    this.renderList();

    // 滚动到新添加的卡片并聚焦名称输入框
    setTimeout(() => {
      const cards = this.providersList.querySelectorAll('.sa-provider-card');
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth' });
        const nameInput = lastCard.querySelector('input[data-field="name"]') as HTMLInputElement;
        if (nameInput) nameInput.focus();
      }
    }, 100);
  }

  /**
   * 渲染提供方列表
   */
  renderList(): void {
    const providers = this.host.providers;

    if (providers.length === 0) {
      this.providersList.innerHTML = `<div class="sa-providers-empty">${T.noProviders}</div>`;
      return;
    }

    this.providersList.innerHTML = providers
      .map((provider) => this.renderProviderCard(provider))
      .join('');

    this.bindCardEvents();
  }

  /**
   * 渲染单个提供方卡片
   */
  private renderProviderCard(provider: ProviderConfig): string {
    const isDefault = provider.id === getDefaultProvider().id;

    return `
      <div class="sa-provider-card" data-provider-id="${provider.id}">
        <div class="sa-provider-card-header">
          <span class="sa-provider-card-title">${Security.escapeHtml(provider.name || T.defaultProviderName)}</span>
          ${!isDefault ? `<button class="sa-provider-card-delete" data-action="delete">${T.deleteProvider}</button>` : ''}
        </div>

        <div class="sa-provider-field">
          <label class="sa-provider-field-label">${T.providerName}</label>
          <input type="text" class="sa-provider-field-input" data-field="name" value="${Security.escapeHtml(provider.name)}" placeholder="${T.defaultProviderName}">
        </div>

        <div class="sa-provider-field">
          <label class="sa-provider-field-label">${T.providerType}</label>
          <div class="sa-selector-wrapper" data-field-wrapper="type">
            <button type="button" class="sa-selector-display" data-field="type-display">${T.providerTypes[provider.type]}</button>
            <span class="sa-selector-arrow">◀</span>
            <div class="sa-selector-dropdown" data-field="type-dropdown">
              <div class="sa-selector-item ${provider.type === 'openrouter' ? 'selected' : ''}" data-value="openrouter">${T.providerTypes.openrouter}</div>
              <div class="sa-selector-item ${provider.type === 'openai' ? 'selected' : ''}" data-value="openai">${T.providerTypes.openai}</div>
              <div class="sa-selector-item ${provider.type === 'aihubmix' ? 'selected' : ''}" data-value="aihubmix">${T.providerTypes.aihubmix}</div>
              <div class="sa-selector-item ${provider.type === 'custom' ? 'selected' : ''}" data-value="custom">${T.providerTypes.custom}</div>
            </div>
          </div>
        </div>

        <div class="sa-provider-field">
          <label class="sa-provider-field-label">${T.labels.apiKey}</label>
          <input type="password" class="sa-provider-field-input" data-field="apiKey" value="${this.getMaskedApiKey(provider.apiKey)}" placeholder="sk-...">
        </div>

        <div class="sa-provider-field">
          <label class="sa-provider-field-label">${T.labels.url}</label>
          <input type="text" class="sa-provider-field-input" data-field="apiUrl" value="${Security.escapeHtml(provider.apiUrl)}" placeholder="${CONFIG.DEFAULT_API_URL}">
        </div>

        <div class="sa-provider-field">
          <label class="sa-provider-field-label">${T.modelListUrl}</label>
          <input type="text" class="sa-provider-field-input" data-field="modelsApiUrl" value="${Security.escapeHtml(provider.modelsApiUrl)}" placeholder="${CONFIG.DEFAULT_MODELS_API_URL}">
        </div>
      </div>
    `;
  }

  /**
   * 绑定卡片内事件
   */
  private bindCardEvents(): void {
    const cards = this.providersList.querySelectorAll('.sa-provider-card');

    cards.forEach((card) => {
      const providerId = card.getAttribute('data-provider-id');
      if (!providerId) return;

      // 删除按钮
      const deleteBtn = card.querySelector('button[data-action="delete"]');
      if (deleteBtn) {
        (deleteBtn as HTMLElement).onclick = (e) => {
          e.stopPropagation();
          if (confirm(T.deleteProvider + '?')) {
            this.host.deleteProvider(providerId);
            this.renderList();
          }
        };
      }

      // 类型选择器
      const typeWrapper = card.querySelector('[data-field-wrapper="type"]') as HTMLElement;
      if (typeWrapper) {
        const typeDisplay = typeWrapper.querySelector('[data-field="type-display"]') as HTMLElement;
        const typeDropdown = typeWrapper.querySelector('[data-field="type-dropdown"]') as HTMLElement;

        typeDisplay.onclick = (e) => {
          e.stopPropagation();
          const isOpen = typeWrapper.classList.toggle('open');
          typeWrapper.querySelector('.sa-selector-arrow')!.textContent = isOpen ? '▼' : '◀';
        };

        typeDropdown.querySelectorAll('.sa-selector-item').forEach((item) => {
          (item as HTMLElement).onclick = (e) => {
            e.stopPropagation();
            const value = (item as HTMLElement).dataset.value as ProviderType;
            typeDisplay.textContent = T.providerTypes[value];
            typeWrapper.classList.remove('open');
            typeWrapper.querySelector('.sa-selector-arrow')!.textContent = '◀';

            // 更新选中状态
            typeDropdown.querySelectorAll('.sa-selector-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');

            // 更新提供方类型
            this.updateProviderField(providerId, 'type', value);
            this.autoFillUrls(providerId, value);
          };
        });
      }

      // 输入框变化
      const inputs = card.querySelectorAll('input[data-field]');
      inputs.forEach((input) => {
        const field = (input as HTMLElement).dataset.field;
        if (!field) return;

        // 对于 apiKey，需要特殊处理占位符
        if (field === 'apiKey') {
          (input as HTMLInputElement).onfocus = () => {
            const provider = this.host.providers.find(p => p.id === providerId);
            if (provider && provider.apiKey) {
              const masked = this.getMaskedApiKey(provider.apiKey);
              // 聚焦时如果是占位符，清空以便输入
              if ((input as HTMLInputElement).value === masked) {
                (input as HTMLInputElement).value = '';
                (input as HTMLInputElement).type = 'text';
              }
            }
          };

          (input as HTMLInputElement).onblur = async () => {
            const value = (input as HTMLInputElement).value.trim();
            const provider = this.host.providers.find(p => p.id === providerId);
            const masked = provider ? this.getMaskedApiKey(provider.apiKey) : '';

            if (value && value !== masked) {
              // 使用异步加密保存 API Key
              const encryptedKey = await Security.obfuscateApiKey(value);
              this.updateProviderField(providerId, field, encryptedKey);
            }
            // 恢复密码显示
            (input as HTMLInputElement).type = 'password';
            if (provider && provider.apiKey) {
              (input as HTMLInputElement).value = this.getMaskedApiKey(provider.apiKey);
            }
          };
        } else {
          // 对于文本输入，在失焦时保存
          (input as HTMLInputElement).onblur = () => {
            const value = (input as HTMLInputElement).value;
            this.updateProviderField(providerId, field, value);
          };
        }
      });
    });

    // 点击外部关闭下拉框
    document.addEventListener('click', () => {
      this.providersList.querySelectorAll('.sa-selector-wrapper.open').forEach(wrapper => {
        wrapper.classList.remove('open');
        wrapper.querySelector('.sa-selector-arrow')!.textContent = '◀';
      });
    });
  }

  /**
   * 更新提供方字段
   */
  private updateProviderField(providerId: string, field: string, value: string): void {
    const provider = this.host.providers.find(p => p.id === providerId);
    if (!provider) return;

    const updatedProvider = { ...provider, [field]: value };
    this.host.updateProvider(updatedProvider);

    // 更新卡片标题（如果改变了名称）
    if (field === 'name') {
      const card = this.providersList.querySelector(`[data-provider-id="${providerId}"]`);
      const title = card?.querySelector('.sa-provider-card-title');
      if (title) {
        title.textContent = value || T.defaultProviderName;
      }
    }
  }

  /**
   * 根据提供方类型自动填充 URL
   */
  private autoFillUrls(providerId: string, type: ProviderType): void {
    let apiUrl = '';
    let modelsApiUrl = '';

    switch (type) {
      case 'openrouter':
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        modelsApiUrl = 'https://openrouter.ai/api/v1/models';
        break;
      case 'openai':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        modelsApiUrl = 'https://api.openai.com/v1/models';
        break;
      case 'aihubmix':
        apiUrl = 'https://aihubmix.com/v1/chat/completions';
        modelsApiUrl = 'https://aihubmix.com/v1/models';
        break;
      case 'custom':
        // 自定义不自动填充
        return;
    }

    const provider = this.host.providers.find(p => p.id === providerId);
    if (!provider) return;

    const updatedProvider = { ...provider, apiUrl, modelsApiUrl };
    this.host.updateProvider(updatedProvider);

    // 更新 UI 显示
    const card = this.providersList.querySelector(`[data-provider-id="${providerId}"]`);
    if (card) {
      const apiUrlInput = card.querySelector('input[data-field="apiUrl"]') as HTMLInputElement;
      const modelsApiUrlInput = card.querySelector('input[data-field="modelsApiUrl"]') as HTMLInputElement;
      if (apiUrlInput) apiUrlInput.value = apiUrl;
      if (modelsApiUrlInput) modelsApiUrlInput.value = modelsApiUrl;
    }
  }

  /**
   * 获取遮盖后的 API Key 显示
   */
  private getMaskedApiKey(encryptedKey: string): string {
    if (!encryptedKey) return '';
    // 使用固定长度的掩码显示，不需要解密
    return '•'.repeat(32);
  }

  /**
   * 获取指定 ID 的提供方
   */
  getProvider(providerId: string): ProviderConfig | undefined {
    return this.host.providers.find(p => p.id === providerId);
  }
}
