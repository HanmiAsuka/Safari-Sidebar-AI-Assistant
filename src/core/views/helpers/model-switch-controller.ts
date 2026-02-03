/**
 * 模型切换控制模块
 * 负责模型和思考强度选择器的 UI 逻辑
 */

import type { ThinkingLevel, Settings } from '@/types';
import { T } from '@/i18n';
import { getShortModelName } from '@/utils';
import { toggleSelectorOpen, closeSelectorDropdown, updateSelectorArrow } from '@/utils';

/**
 * 模型切换选项
 */
export interface ModelSwitchOptions {
  /** Shadow DOM 根 */
  shadow: ShadowRoot;
  /** 获取当前设置 */
  getSettings: () => Settings;
  /** 保存设置 */
  saveSettings: (settings: Partial<Settings>) => void;
  /** 获取已添加的模型列表 */
  getAddedModels: () => string[];
}

/**
 * 模型切换控制器类
 */
export class ModelSwitchController {
  private options: ModelSwitchOptions;

  // DOM 元素
  private thinkSelector!: HTMLElement;
  private thinkBtn!: HTMLElement;
  private thinkPopup!: HTMLElement;
  private thinkLevelDisplay!: HTMLElement;
  private modelSwitchSelector!: HTMLElement;
  private modelSwitchBtn!: HTMLElement;
  private modelSwitchPopup!: HTMLElement;
  private modelSwitchName!: HTMLElement;

  // 当前会话模型（可能与设置不同）
  private currentSessionModel: string | null = null;

  constructor(options: ModelSwitchOptions) {
    this.options = options;
  }

  /**
   * 初始化控制器
   */
  init(): void {
    this.cacheElements();
    this.bindEvents();
    this.updateThinkingLevelUI();
    this.updateModelSwitchUI();
  }

  /**
   * 缓存 DOM 元素
   */
  private cacheElements(): void {
    const shadow = this.options.shadow;
    this.thinkSelector = shadow.getElementById('sa-think-selector')!;
    this.thinkBtn = shadow.getElementById('sa-think-btn')!;
    this.thinkPopup = shadow.getElementById('sa-think-popup')!;
    this.thinkLevelDisplay = shadow.getElementById('sa-think-level')!;
    this.modelSwitchSelector = shadow.getElementById('sa-model-switch-selector')!;
    this.modelSwitchBtn = shadow.getElementById('sa-model-switch-btn')!;
    this.modelSwitchPopup = shadow.getElementById('sa-model-switch-popup')!;
    this.modelSwitchName = shadow.getElementById('sa-model-switch-name')!;
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
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
        this.options.saveSettings({ thinkingLevel: level });
        this.updateThinkingLevelUI();
        closeSelectorDropdown(this.thinkSelector, '.think-arrow');
      };
    });
  }

  /**
   * 获取当前使用的模型
   */
  getCurrentModel(): string {
    return this.currentSessionModel || this.options.getSettings().chatModel;
  }

  /**
   * 设置当前会话模型
   */
  setSessionModel(model: string): void {
    this.currentSessionModel = model;
    this.updateModelSwitchUI();
  }

  /**
   * 更新思考强度 UI
   */
  updateThinkingLevelUI(): void {
    const level = this.options.getSettings().thinkingLevel || 'none';
    this.thinkLevelDisplay.textContent = T.thinkingLevels[level];

    if (level !== 'none') {
      this.thinkBtn.classList.add('active');
    } else {
      this.thinkBtn.classList.remove('active');
    }

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
    const currentModel = this.getCurrentModel();
    this.modelSwitchName.textContent = getShortModelName(currentModel);
    this.modelSwitchName.title = currentModel;

    updateSelectorArrow(this.modelSwitchSelector, '.model-arrow');
  }

  /**
   * 渲染模型切换弹出菜单
   */
  private renderModelSwitchPopup(): void {
    const addedModels = this.options.getAddedModels();

    if (addedModels.length === 0) {
      this.modelSwitchPopup.innerHTML = `<div class="sa-model-dropdown-empty">${T.noModelsAdded}</div>`;
      return;
    }

    const currentModel = this.getCurrentModel();
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
  }
}
