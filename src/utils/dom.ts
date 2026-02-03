/**
 * DOM 工具函数
 * 提供通用的 DOM 操作辅助函数
 */

/**
 * 切换下拉选择器的展开状态
 * @param selector - 选择器容器元素
 * @param arrowSelector - 箭头元素的 CSS 选择器
 * @returns 切换后是否为展开状态
 */
export function toggleSelectorOpen(
  selector: HTMLElement,
  arrowSelector: string = '.sa-selector-arrow'
): boolean {
  const isOpen = selector.classList.toggle('open');
  const arrow = selector.querySelector(arrowSelector);
  if (arrow) {
    arrow.textContent = isOpen ? '▼' : '◀';
  }
  return isOpen;
}

/**
 * 关闭下拉选择器
 * @param selector - 选择器容器元素
 * @param arrowSelector - 箭头元素的 CSS 选择器
 */
export function closeSelectorDropdown(
  selector: HTMLElement | null,
  arrowSelector: string = '.sa-selector-arrow'
): void {
  if (!selector) return;
  selector.classList.remove('open');
  const arrow = selector.querySelector(arrowSelector);
  if (arrow) {
    arrow.textContent = '◀';
  }
}

/**
 * 设置选择器的箭头方向
 * @param selector - 选择器容器元素
 * @param arrowSelector - 箭头元素的 CSS 选择器
 */
export function updateSelectorArrow(
  selector: HTMLElement,
  arrowSelector: string = '.sa-selector-arrow'
): void {
  const isOpen = selector.classList.contains('open');
  const arrow = selector.querySelector(arrowSelector);
  if (arrow) {
    arrow.textContent = isOpen ? '▼' : '◀';
  }
}
