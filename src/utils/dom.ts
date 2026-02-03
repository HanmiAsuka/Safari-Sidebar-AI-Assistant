/**
 * DOM 工具函数
 * 提供通用的 DOM 操作辅助函数
 */

/**
 * 关闭指定根元素下所有打开的下拉选择器
 * @param root - 根元素（如 shadow root）
 * @param except - 可选，排除的元素（不关闭该元素）
 */
export function closeAllDropdowns(root: Document | ShadowRoot | HTMLElement, except?: HTMLElement | null): void {
  root.querySelectorAll('.sa-selector-wrapper.open').forEach((wrapper) => {
    if (wrapper !== except) {
      wrapper.classList.remove('open');
      const arrow = wrapper.querySelector('.sa-selector-arrow');
      if (arrow) arrow.textContent = '◀';
    }
  });
}

/**
 * 切换下拉选择器的展开状态
 * @param selector - 选择器容器元素
 * @param arrowSelector - 箭头元素的 CSS 选择器
 * @param root - 可选，用于关闭其他下拉框的根元素
 * @returns 切换后是否为展开状态
 */
export function toggleSelectorOpen(
  selector: HTMLElement,
  arrowSelector: string = '.sa-selector-arrow',
  root?: Document | ShadowRoot | HTMLElement
): boolean {
  // 如果提供了 root，先关闭其他所有下拉框
  if (root) {
    closeAllDropdowns(root, selector);
  }

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
