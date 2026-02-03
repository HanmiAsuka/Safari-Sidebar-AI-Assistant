/**
 * 用户消息渲染模块
 * 负责用户消息的 DOM 创建
 */

import { T } from '@/i18n';
import { parseMarkdown } from '@/core';
import * as Security from '../../../utils/security';

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
