/**
 * 摘要块渲染模块
 * 负责网页摘要的展示
 */

import { T } from '@/i18n';
import { summaryIcon, errorIcon } from '@/ui';
import { updateMarkdownContent } from './ai-bubble';

/**
 * 创建摘要展示块（在气泡内）
 * @param parent - 父容器（气泡元素）
 * @param isLoading - 是否正在加载
 * @returns 摘要内容容器元素
 */
export function createSummaryBlock(parent: HTMLElement, isLoading = true): HTMLElement {
  const existing = parent.querySelector('.sa-summary-block');
  if (existing) {
    existing.classList.toggle('loading', isLoading);
    return existing.querySelector('.sa-summary-content') as HTMLElement;
  }

  const block = document.createElement('div');
  block.className = 'sa-summary-block' + (isLoading ? ' loading' : '');

  const header = document.createElement('div');
  header.className = 'sa-summary-header';

  // 摘要图标
  const iconSpan = document.createElement('span');
  iconSpan.className = 'sa-summary-icon';
  iconSpan.innerHTML = summaryIcon;
  header.appendChild(iconSpan);

  // 标题
  const titleSpan = document.createElement('span');
  titleSpan.className = 'sa-summary-title';
  titleSpan.textContent = T.pageSummary;
  header.appendChild(titleSpan);

  // 加载状态
  if (isLoading) {
    const statusSpan = document.createElement('span');
    statusSpan.className = 'sa-summary-status';
    const dotSpan = document.createElement('span');
    dotSpan.className = 'dot';
    statusSpan.appendChild(dotSpan);
    statusSpan.appendChild(document.createTextNode(T.summarizing + '...'));
    header.appendChild(statusSpan);
  }

  // 展开箭头
  const arrowSpan = document.createElement('span');
  arrowSpan.className = 'sa-summary-arrow';
  arrowSpan.textContent = '◀';
  header.appendChild(arrowSpan);

  // 摘要内容区 - 使用 sa-md-content 支持 markdown 和 latex
  const content = document.createElement('div');
  content.className = 'sa-summary-content sa-md-content';

  header.onclick = () => {
    const isExpanded = block.classList.toggle('expanded');
    content.classList.toggle('visible', isExpanded);
    arrowSpan.textContent = isExpanded ? '▼' : '◀';
  };

  block.appendChild(header);
  block.appendChild(content);

  // 插入到气泡最前面
  parent.insertBefore(block, parent.firstChild);

  return content;
}

/**
 * 更新摘要内容（支持 markdown）
 * @param parent - 气泡元素
 * @param content - 摘要内容
 * @param isComplete - 是否完成
 */
export function updateSummaryContent(
  parent: HTMLElement,
  content: string,
  isComplete = false
): void {
  const block = parent.querySelector('.sa-summary-block');
  if (!block) return;

  const contentDiv = block.querySelector('.sa-summary-content');
  if (contentDiv) {
    updateMarkdownContent(contentDiv as HTMLElement, content);
  }

  if (isComplete) {
    finishSummary(parent);
  }
}

/**
 * 完成摘要状态
 * @param parent - 父容器
 */
export function finishSummary(parent: HTMLElement): void {
  const block = parent.querySelector('.sa-summary-block');
  if (block) {
    block.classList.remove('loading');
    const status = block.querySelector('.sa-summary-status');
    if (status) status.remove();
  }
}

/**
 * 显示摘要错误状态
 * @param parent - 气泡元素
 * @param errorMessage - 错误信息
 */
export function showSummaryError(parent: HTMLElement, errorMessage: string): void {
  let block = parent.querySelector('.sa-summary-block');

  // 如果不存在摘要块，先创建一个
  if (!block) {
    createSummaryBlock(parent, false);
    block = parent.querySelector('.sa-summary-block');
  }

  if (!block) return;

  // 移除加载状态，添加错误状态
  block.classList.remove('loading');
  block.classList.add('error');

  // 更新图标为错误图标
  const iconSpan = block.querySelector('.sa-summary-icon');
  if (iconSpan) {
    iconSpan.innerHTML = errorIcon;
  }

  // 更新标题
  const titleSpan = block.querySelector('.sa-summary-title');
  if (titleSpan) {
    titleSpan.textContent = T.summaryFailed;
  }

  // 移除加载状态指示器
  const statusSpan = block.querySelector('.sa-summary-status');
  if (statusSpan) statusSpan.remove();

  // 添加错误状态指示器
  const header = block.querySelector('.sa-summary-header');
  const arrow = header?.querySelector('.sa-summary-arrow');
  if (header && arrow && !header.querySelector('.sa-summary-error-status')) {
    const errorStatus = document.createElement('span');
    errorStatus.className = 'sa-summary-error-status';
    errorStatus.textContent = T.clickToViewSummary;
    header.insertBefore(errorStatus, arrow);
  }

  // 更新内容区域显示错误信息
  let contentDiv = block.querySelector('.sa-summary-content') as HTMLElement;
  if (!contentDiv) {
    contentDiv = document.createElement('div');
    contentDiv.className = 'sa-summary-content sa-summary-error-content';
    block.appendChild(contentDiv);
  } else {
    contentDiv.classList.add('sa-summary-error-content');
  }
  contentDiv.textContent = T.summaryErrorPrefix + errorMessage;
}
