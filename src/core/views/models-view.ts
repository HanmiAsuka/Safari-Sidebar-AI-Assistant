/**
 * 模型管理视图
 * 管理模型列表面板的 UI 和交互逻辑
 */

import type { ModelInfo, ProviderConfig } from '@/types';
import { T } from '@/i18n';
import { CONFIG } from '@/config';
import * as Security from '../../utils/security';
import GMSafe from '../gm-api';
import { BaseView, ViewHost } from '@/core';

/**
 * 模型管理视图扩展宿主接口
 */
export interface ModelsViewHost extends ViewHost {
  /** 获取所有提供方 */
  readonly providers: ProviderConfig[];
  /** 获取指定提供方的模型列表 */
  getModelsForProvider(providerId: string): string[];
  /** 添加模型到指定提供方 */
  addModelToProvider(providerId: string, modelId: string): void;
  /** 从指定提供方移除模型 */
  removeModelFromProvider(providerId: string, modelId: string): void;
  /** 清空指定提供方的所有模型 */
  clearModelsForProvider(providerId: string): void;
}

/**
 * 模型管理视图类
 * 负责模型列表的加载、搜索、增删操作
 */
export class ModelsView extends BaseView {
  protected override host: ModelsViewHost;

  // DOM 元素
  private modelsList!: HTMLElement;
  private searchInput!: HTMLInputElement;

  // 当前提供方 ID
  private currentProviderId: string = '';

  // 可用模型列表（从 API 加载）
  private availableModels: ModelInfo[] = [];

  constructor(host: ModelsViewHost, container: HTMLElement) {
    super(host, container);
    this.host = host;
  }

  /**
   * 初始化模型管理视图
   */
  init(): void {
    this.cacheElements();
    this.bindEvents();
  }

  /**
   * 缓存 DOM 元素引用
   */
  private cacheElements(): void {
    this.modelsList = this.host.shadow.getElementById('sa-models-list')!;
    this.searchInput = this.host.shadow.getElementById('sa-models-search') as HTMLInputElement;
  }

  /**
   * 绑定事件处理器
   */
  private bindEvents(): void {
    // 返回按钮
    this.host.shadow.getElementById('sa-models-back-btn')!.onclick = () => this.hide();

    // 清空所有模型按钮
    this.host.shadow.getElementById('sa-models-remove-all')!.onclick = () => {
      if (this.currentProviderId) {
        this.host.clearModelsForProvider(this.currentProviderId);
        this.renderList();
      }
    };

    // 搜索输入
    this.searchInput.oninput = () => {
      this.renderList(this.searchInput.value.trim().toLowerCase());
    };
  }

  /**
   * 显示视图并加载指定提供方的模型列表
   * @param providerId - 提供方 ID
   */
  showForProvider(providerId: string): void {
    this.currentProviderId = providerId;
    super.show();
    this.searchInput.value = '';
    this.loadAvailableModels();
  }

  /**
   * 获取当前提供方
   */
  private getCurrentProvider(): ProviderConfig | undefined {
    return this.host.providers.find(p => p.id === this.currentProviderId);
  }

  /**
   * 从 API 加载可用模型列表
   */
  async loadAvailableModels(): Promise<void> {
    this.modelsList.innerHTML = `<div class="sa-models-loading">${T.loadingModels}</div>`;

    const provider = this.getCurrentProvider();
    if (!provider) {
      this.modelsList.innerHTML = `<div class="sa-models-error">${T.noProviders}</div>`;
      return;
    }

    const modelsUrl = provider.modelsApiUrl || CONFIG.DEFAULT_MODELS_API_URL;
    const apiKey = provider.apiKey;

    if (!apiKey) {
      this.modelsList.innerHTML = `<div class="sa-models-error">${T.loadModelsFailed}</div>`;
      return;
    }

    // 异步解密 API Key
    const decryptedApiKey = await Security.deobfuscateApiKey(apiKey);

    GMSafe.request({
      method: 'GET',
      url: modelsUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${decryptedApiKey}`
      },
      onload: (res) => {
        try {
          if (res.status < 200 || res.status >= 300) {
            throw new Error(`HTTP ${res.status}`);
          }
          const data = JSON.parse(res.responseText);
          if (data && Array.isArray(data.data)) {
            this.availableModels = data.data
              .filter(
                (m: { id?: string }) =>
                  m && typeof m.id === 'string' && m.id.length > 0 && m.id.length < 200
              )
              .map((m: { id: string; name?: string }) => ({
                id: m.id.substring(0, 200),
                name: typeof m.name === 'string' ? m.name.substring(0, 200) : ''
              }));
          } else {
            this.availableModels = [];
          }
          this.renderList();
        } catch (e) {
          console.error('Load models error:', e);
          this.modelsList.innerHTML = `<div class="sa-models-error">${Security.escapeHtml(T.loadModelsFailed)}</div>`;
        }
      },
      onerror: () => {
        this.modelsList.innerHTML = `<div class="sa-models-error">${Security.escapeHtml(T.loadModelsFailed)}</div>`;
      }
    });
  }

  /**
   * 渲染模型列表
   * @param searchFilter - 可选的搜索过滤字符串
   */
  renderList(searchFilter = ''): void {
    const addedModels = this.host.getModelsForProvider(this.currentProviderId);
    const availableIds = new Set(this.availableModels.map((m) => m.id));

    // 找出已添加但不在可用列表中的模型（已弃用）
    const deprecatedModels = addedModels.filter((id) => !availableIds.has(id));

    // 过滤可用模型
    const filteredAvailable = searchFilter
      ? this.availableModels.filter(
          (m) =>
            m.id.toLowerCase().includes(searchFilter) ||
            (m.name && m.name.toLowerCase().includes(searchFilter))
        )
      : this.availableModels;

    // 过滤已弃用模型
    const filteredDeprecated = searchFilter
      ? deprecatedModels.filter((id) => id.toLowerCase().includes(searchFilter))
      : deprecatedModels;

    let html = '';

    // 渲染可用模型
    filteredAvailable.forEach((model) => {
      const isAdded = addedModels.includes(model.id);
      html += `
        <div class="sa-model-item" data-model-id="${model.id}">
          <div class="sa-model-info">
            <div class="sa-model-name">${model.id}</div>
            <div class="sa-model-desc">${model.name || ''}</div>
          </div>
          <button class="${isAdded ? 'sa-model-remove-btn' : 'sa-model-add-btn'}" data-action="${isAdded ? 'remove' : 'add'}">${isAdded ? T.removeModel : T.addModel}</button>
        </div>
      `;
    });

    // 渲染已弃用模型
    if (filteredDeprecated.length > 0) {
      html += `<div class="sa-models-divider">${T.deprecatedModels}</div>`;
      filteredDeprecated.forEach((modelId) => {
        html += `
          <div class="sa-model-item" data-model-id="${modelId}">
            <div class="sa-model-info">
              <div class="sa-model-name" style="opacity:0.6">${modelId}</div>
            </div>
            <button class="sa-model-remove-btn" data-action="remove">${T.removeModel}</button>
          </div>
        `;
      });
    }

    this.modelsList.innerHTML =
      html || `<div class="sa-models-loading">${T.noModelsAdded}</div>`;

    // 绑定按钮事件
    this.modelsList.querySelectorAll('button[data-action]').forEach((btn) => {
      (btn as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        const modelId = (btn as HTMLElement)
          .closest('.sa-model-item')
          ?.getAttribute('data-model-id');
        if (!modelId) return;

        const action = (btn as HTMLElement).dataset.action;
        if (action === 'add') {
          this.host.addModelToProvider(this.currentProviderId, modelId);
          (btn as HTMLElement).textContent = T.removeModel;
          (btn as HTMLElement).className = 'sa-model-remove-btn';
          (btn as HTMLElement).dataset.action = 'remove';
        } else {
          this.host.removeModelFromProvider(this.currentProviderId, modelId);
          (btn as HTMLElement).textContent = T.addModel;
          (btn as HTMLElement).className = 'sa-model-add-btn';
          (btn as HTMLElement).dataset.action = 'add';
        }
      };
    });
  }

  /**
   * 获取可用模型列表
   */
  getAvailableModels(): ModelInfo[] {
    return this.availableModels;
  }
}
