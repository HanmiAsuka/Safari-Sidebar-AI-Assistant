/**
 * AI 消息气泡渲染模块
 * 负责 AI 消息气泡的创建和加载指示器
 */

import { T } from '@/i18n';
import { parseMarkdown } from '@/core';
import * as Security from '../../../utils/security';

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
