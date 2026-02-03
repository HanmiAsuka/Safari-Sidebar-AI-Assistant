/**
 * 思考块渲染模块
 * 负责 AI 深度思考过程的展示
 */

import { T } from '@/i18n';
import { thinkIcon } from '@/ui';
import { updateMarkdownContent } from './ai-bubble';

/**
 * 创建思考过程展示块
 * @param parent - 父容器（气泡元素）
 * @param isThinking - 是否正在思考
 * @returns 思考内容容器元素
 */
export function createThinkingBlock(parent: HTMLElement, isThinking = true): HTMLElement {
  const existing = parent.querySelector('.sa-think-block');
  if (existing) {
    if (isThinking) existing.classList.add('thinking');
    return parent.querySelector('.sa-think-content') as HTMLElement;
  }

  const block = document.createElement('div');
  block.className = 'sa-think-block' + (isThinking ? ' thinking' : '');

  const header = document.createElement('div');
  header.className = 'sa-think-header';

  // 思考图标
  const iconSpan = document.createElement('span');
  iconSpan.className = 'sa-think-icon';
  iconSpan.innerHTML = thinkIcon;
  header.appendChild(iconSpan);

  const titleSpan = document.createElement('span');
  titleSpan.className = 'sa-think-title';
  titleSpan.textContent = T.thinking;
  header.appendChild(titleSpan);

  if (isThinking) {
    const statusSpan = document.createElement('span');
    statusSpan.className = 'sa-think-status';
    const dotSpan = document.createElement('span');
    dotSpan.className = 'dot';
    statusSpan.appendChild(dotSpan);
    statusSpan.appendChild(document.createTextNode(T.thinkingInProgress + '...'));
    header.appendChild(statusSpan);
  }

  const arrowSpan = document.createElement('span');
  arrowSpan.className = 'sa-think-arrow';
  arrowSpan.textContent = '◀';
  header.appendChild(arrowSpan);

  const content = document.createElement('div');
  content.className = 'sa-think-content sa-md-content';

  header.onclick = () => {
    const isExpanded = block.classList.toggle('expanded');
    content.classList.toggle('visible', isExpanded);
    arrowSpan.textContent = isExpanded ? '▼' : '◀';
  };

  block.appendChild(header);
  block.appendChild(content);

  // 如果有摘要块，插入到摘要块后面；否则插入到最前面
  const summaryBlock = parent.querySelector('.sa-summary-block');
  if (summaryBlock) {
    summaryBlock.after(block);
  } else {
    parent.insertBefore(block, parent.firstChild);
  }

  return content;
}

/**
 * 完成思考状态
 * @param parent - 父容器
 */
export function finishThinking(parent: HTMLElement): void {
  const block = parent.querySelector('.sa-think-block');
  if (block) {
    block.classList.remove('thinking');
    const status = block.querySelector('.sa-think-status');
    if (status) status.remove();
  }
}

/**
 * 更新思考内容（支持 markdown 和 latex）
 * @param parent - 气泡元素
 * @param content - 思考内容
 * @param isComplete - 是否完成
 */
export function updateThinkingContent(
  parent: HTMLElement,
  content: string,
  isComplete = false
): void {
  const block = parent.querySelector('.sa-think-block');
  if (!block) return;

  const contentDiv = block.querySelector('.sa-think-content');
  if (contentDiv) {
    updateMarkdownContent(contentDiv as HTMLElement, content);
  }

  if (isComplete) {
    finishThinking(parent);
  }
}
