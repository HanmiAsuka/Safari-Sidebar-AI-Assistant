/**
 * 选中文本管理器
 * 管理用户选中文本的队列
 */

import { CONFIG } from '@/config';
import * as Security from '../../utils/security';

/**
 * 选中文本管理类
 */
export class SelectionManager {
  private queue: string[] = [];

  /**
   * 添加选中的文本
   * @param text - 选中的文本
   * @param append - 是否追加到队列（按住 X 键时为 true）
   */
  add(text: string, append: boolean): void {
    if (!text || typeof text !== 'string') return;

    const sanitizedText = Security.sanitizeInput(text, CONFIG.MAX_SELECTION_LENGTH);
    if (!sanitizedText.trim()) return;

    if (append) {
      if (!Array.isArray(this.queue)) {
        this.queue = [];
      }
      this.queue.push(sanitizedText);
      if (this.queue.length > CONFIG.MAX_SELECTION_QUEUE) {
        this.queue.shift();
      }
    } else {
      this.queue = [sanitizedText];
    }
  }

  /**
   * 移除指定索引的选中文本
   * @param index - 索引
   */
  remove(index: number): void {
    if (!Array.isArray(this.queue) || index < 0 || index >= this.queue.length) {
      return;
    }
    this.queue.splice(index, 1);
  }

  /**
   * 清空所有选中文本
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * 获取当前队列
   */
  getQueue(): string[] {
    return Array.isArray(this.queue) ? [...this.queue] : [];
  }

  /**
   * 获取队列长度
   */
  get length(): number {
    return this.queue.length;
  }

  /**
   * 检查队列是否为空
   */
  get isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

/**
 * 渲染选中文本标签的配置
 */
export interface ChipRenderConfig {
  /** 标签容器 */
  container: HTMLElement;
  /** 队列数据 */
  queue: string[];
  /** 移除回调 */
  onRemove: (index: number) => void;
}

/**
 * 渲染选中文本标签
 * @param config - 配置
 */
export function renderChips(config: ChipRenderConfig): void {
  const { container, queue, onRemove } = config;
  container.innerHTML = '';

  queue.forEach((text, index) => {
    const chip = document.createElement('div');
    chip.className = 'sa-chip';

    const fullText =
      text.length > CONFIG.CHIP_PREVIEW_LENGTH
        ? text.substring(0, CONFIG.CHIP_PREVIEW_LENGTH) + '...'
        : text;
    const safeFullText = fullText
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ');
    chip.setAttribute('data-full-text', safeFullText);

    const indexSpan = document.createElement('span');
    indexSpan.style.cssText = 'font-size:10px;opacity:0.7';
    indexSpan.textContent = `#${index + 1}`;

    const textSpan = document.createElement('span');
    textSpan.className = 'sa-chip-text';
    textSpan.textContent = text;

    const closeBtn = document.createElement('div');
    closeBtn.className = 'sa-chip-close';
    closeBtn.textContent = '✕';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      onRemove(index);
    };

    chip.appendChild(indexSpan);
    chip.appendChild(textSpan);
    chip.appendChild(closeBtn);
    container.appendChild(chip);
  });

  if (container.lastElementChild) {
    container.lastElementChild.scrollIntoView({ behavior: 'smooth' });
  }
}
