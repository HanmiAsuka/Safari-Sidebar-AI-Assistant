/**
 * 聊天消息渲染器
 * 负责消息的 DOM 创建和更新
 */

import { T } from '@/i18n';
import { parseMarkdown } from '@/core';
import * as Security from '../../utils/security';
import { summaryIcon, thinkIcon } from '@/ui';

/**
 * 添加用户消息到聊天列表
 * @param chatList - 聊天列表容器
 * @param text - 用户输入文本
 * @param contexts - 选中的上下文文本
 */
export function renderUserMessage(
  chatList: HTMLElement,
  text: string,
  contexts?: string[]
): void {
  const div = document.createElement('div');
  div.className = 'sa-message user';
  const bubble = document.createElement('div');
  bubble.className = 'sa-bubble';

  if (contexts && contexts.length > 0) {
    const collapseDiv = document.createElement('div');
    collapseDiv.className = 'sa-ref-collapse';
    const count = contexts.length;
    const title = count > 1 ? `${T.prompts.ref} (${count})` : T.prompts.ref;
    const fullContent = contexts
      .map((t, i) => (count > 1 ? `[${T.prompts.block} ${i + 1}]:\n${t}` : t))
      .join('\n\n');
    const preview = contexts[0].substring(0, 30).replace(/\n/g, ' ') + '...';

    const refHeader = document.createElement('div');
    refHeader.className = 'sa-ref-header';

    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'sa-arrow';
    arrowSpan.textContent = '◀';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = `${title}: "${preview}"`;

    refHeader.appendChild(arrowSpan);
    refHeader.appendChild(titleSpan);

    const refContent = document.createElement('div');
    refContent.className = 'sa-ref-content';
    refContent.textContent = fullContent;

    refHeader.onclick = () => {
      const isVisible = refContent.classList.toggle('visible');
      arrowSpan.textContent = isVisible ? '▼' : '◀';
    };

    collapseDiv.appendChild(refHeader);
    collapseDiv.appendChild(refContent);
    bubble.appendChild(collapseDiv);
  }

  // 使用 Markdown 渲染用户消息，支持 LaTeX 和换行
  const textSpan = document.createElement('div');
  textSpan.className = 'sa-md-content sa-user-content';
  try {
    const parsedMarkdown = parseMarkdown(text);
    Security.safeSetInnerHTML(textSpan, parsedMarkdown);
  } catch (error) {
    console.warn('User message markdown parsing error:', error);
    // 降级：保留换行
    textSpan.innerHTML = Security.escapeHtml(text).replace(/\n/g, '<br>');
  }
  bubble.appendChild(textSpan);
  div.appendChild(bubble);
  chatList.appendChild(div);
}

/**
 * 创建空的 AI 消息气泡（不带加载提示）
 * @param chatList - 聊天列表容器
 * @returns AI 消息气泡元素
 */
export function createAIBubbleEmpty(chatList: HTMLElement): HTMLElement {
  const div = document.createElement('div');
  div.className = 'sa-message ai';
  const bubble = document.createElement('div');
  bubble.className = 'sa-bubble sa-markdown';

  div.appendChild(bubble);
  chatList.appendChild(div);
  return bubble;
}

/**
 * 创建带加载提示的 AI 消息气泡
 * @param chatList - 聊天列表容器
 * @returns AI 消息气泡元素
 */
export function createAIBubble(chatList: HTMLElement): HTMLElement {
  const bubble = createAIBubbleEmpty(chatList);
  addLoadingIndicator(bubble);
  return bubble;
}

/**
 * 在气泡中添加加载指示器
 * @param bubble - 气泡元素
 */
export function addLoadingIndicator(bubble: HTMLElement): void {
  // 移除已有的加载指示器
  const existing = bubble.querySelector('.sa-loading-indicator');
  if (existing) return;

  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'sa-loading-indicator';

  const loadingDots = document.createElement('div');
  loadingDots.className = 'sa-loading-dots';
  for (let i = 0; i < 3; i++) {
    loadingDots.appendChild(document.createElement('span'));
  }

  const loadingText = document.createElement('span');
  loadingText.className = 'sa-loading-text';
  loadingText.textContent = T.waitingAI + '...';

  loadingIndicator.appendChild(loadingDots);
  loadingIndicator.appendChild(loadingText);
  bubble.appendChild(loadingIndicator);
}

/**
 * 移除气泡中的加载指示器
 * @param bubble - 气泡元素
 */
export function removeLoadingIndicator(bubble: HTMLElement): void {
  const indicator = bubble.querySelector('.sa-loading-indicator');
  if (indicator) indicator.remove();
}

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
 * 创建上下文分割线
 * @param chatList - 聊天列表容器
 * @param onClick - 点击回调
 * @returns 分割线元素
 */
export function createContextDivider(
  chatList: HTMLElement,
  onClick: () => void
): HTMLElement {
  const divider = document.createElement('div');
  divider.className = 'sa-context-divider can-restore';
  divider.textContent = T.contextCleared;
  divider.title = T.clearContextTip;
  divider.onclick = onClick;
  chatList.appendChild(divider);
  return divider;
}

/**
 * 创建中止指示器
 * @returns 中止指示器元素
 */
export function createAbortedIndicator(): HTMLElement {
  const abortedDiv = document.createElement('div');
  abortedDiv.className = 'sa-aborted-indicator';
  abortedDiv.textContent = T.aborted;
  return abortedDiv;
}

/**
 * 创建错误显示元素
 * @param errorMessage - 错误消息
 * @returns 错误 DOM 元素
 */
export function createErrorElement(errorMessage: string): HTMLDivElement {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText =
    'color: var(--danger-color); padding: 12px; border-radius: 6px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); margin: 8px 0;';
  errorDiv.textContent = errorMessage;
  return errorDiv;
}

/**
 * 创建 Markdown 内容容器
 * @returns Markdown 内容容器元素
 */
export function createMarkdownContainer(): HTMLElement {
  const mdDiv = document.createElement('div');
  mdDiv.className = 'sa-md-content';
  return mdDiv;
}

/**
 * 更新 Markdown 内容
 * @param container - Markdown 容器
 * @param content - Markdown 内容
 */
export function updateMarkdownContent(container: HTMLElement, content: string): void {
  try {
    const parsedMarkdown = parseMarkdown(content);
    Security.safeSetInnerHTML(container, parsedMarkdown);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    container.textContent = content;
  }
}

/**
 * 显示无响应提示
 * @param bubble - 气泡元素
 */
export function showNoResponseMessage(bubble: HTMLElement): void {
  const span = document.createElement('span');
  span.style.cssText = 'color:var(--text-secondary);font-style:italic;';
  span.textContent = T.noResponse + '.';
  bubble.innerHTML = '';
  bubble.appendChild(span);
}
