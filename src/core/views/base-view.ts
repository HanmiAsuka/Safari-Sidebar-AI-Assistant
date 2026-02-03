/**
 * 视图基类
 * 提供所有视图的公共接口和基础功能
 */

import type { Settings, ProviderConfig } from '@/types';

/**
 * 视图宿主接口
 * 定义视图与宿主（AISidebar）之间的通信契约
 */
export interface ViewHost {
  /** Shadow DOM 根节点 */
  readonly shadow: ShadowRoot;
  /** 当前设置 */
  readonly settings: Settings;
  /** 所有提供方配置 */
  readonly providers: ProviderConfig[];
  /** 已添加的模型列表（当前对话提供方） */
  readonly addedModels: string[];

  /** 保存设置 */
  saveSettings(newSettings: Partial<Settings>): Promise<void>;
  /** 更新模型切换 UI */
  updateModelSwitchUI(): void;
  /** 应用主题 */
  applyTheme(theme: Settings['theme']): void;
  /** 获取缓存的 DOM 元素 */
  getCachedElement(id: string): HTMLElement | null;
}

/**
 * 视图基类
 * 所有视图组件的抽象基类
 */
export abstract class BaseView {
  /** 视图宿主引用 */
  protected host: ViewHost;
  /** 视图容器元素 */
  protected container: HTMLElement;

  /**
   * @param host - 视图宿主
   * @param container - 视图容器元素
   */
  constructor(host: ViewHost, container: HTMLElement) {
    this.host = host;
    this.container = container;
  }

  /**
   * 初始化视图
   * 子类必须实现此方法来绑定事件和初始化状态
   */
  abstract init(): void;

  /**
   * 显示视图
   */
  show(): void {
    this.container.classList.add('visible');
  }

  /**
   * 隐藏视图
   */
  hide(): void {
    this.container.classList.remove('visible');
  }

  /**
   * 切换视图显示状态
   * @param show - 可选，强制设置显示状态
   */
  toggle(show?: boolean): void {
    if (show === undefined) {
      this.container.classList.toggle('visible');
    } else {
      this.container.classList.toggle('visible', show);
    }
  }

  /**
   * 视图是否可见
   */
  get isVisible(): boolean {
    return this.container.classList.contains('visible');
  }

  /**
   * 销毁视图，清理资源
   * 子类可以重写此方法来清理额外的资源
   */
  destroy(): void {
    // 基类默认不做任何清理
  }
}
