/**
 * 其他样式 - 加载动画、Markdown 内容、消息工具栏等
 */

/** 加载动画样式 */
export const loadingStyles = `
  .sa-loading-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .sa-loading-dots {
    display: flex;
    gap: 5px;
  }

  .sa-loading-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-color);
    animation: dotBounce 1.4s ease-in-out infinite;
  }

  .sa-loading-dots span:nth-child(1) { animation-delay: 0s; }
  .sa-loading-dots span:nth-child(2) { animation-delay: 0.16s; }
  .sa-loading-dots span:nth-child(3) { animation-delay: 0.32s; }

  @keyframes dotBounce {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .sa-loading-text {
    animation: textPulse 2s ease-in-out infinite;
  }

  @keyframes textPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .sa-aborted-indicator {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 12px;
    text-align: center;
    opacity: 0.6;
    font-style: italic;
  }
`;

/** 上下文分割线样式 */
export const contextDividerStyles = `
  .sa-context-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
    padding: 8px 0;
    color: var(--text-secondary);
    font-size: 11px;
    opacity: 0.7;
  }

  .sa-context-divider::before,
  .sa-context-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-color), transparent);
  }

  .sa-context-divider.can-restore {
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .sa-context-divider.can-restore:hover {
    opacity: 1;
  }
`;

/** Markdown 内容样式 */
export const markdownStyles = `
  .sa-md-content {
    line-height: 1.6;
  }

  .sa-md-content p {
    margin: 0 0 12px 0;
  }

  .sa-md-content p:last-child {
    margin-bottom: 0;
  }

  .sa-md-content code {
    background: rgba(127,127,127,0.15);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'SF Mono', Monaco, monospace;
  }

  .sa-md-content pre {
    background: rgba(0,0,0,0.3);
    padding: 12px;
    border-radius: var(--radius-sm);
    overflow-x: auto;
    margin: 12px 0;
  }

  .sa-md-content pre code {
    background: none;
    padding: 0;
  }

  .sa-md-content ul,
  .sa-md-content ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  .sa-md-content li {
    margin: 4px 0;
  }

  .sa-md-content blockquote {
    border-left: 3px solid var(--accent-color);
    margin: 12px 0;
    padding: 8px 12px;
    background: var(--accent-light);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  .sa-md-content a {
    color: var(--accent-color);
    text-decoration: none;
  }

  .sa-md-content a:hover {
    text-decoration: underline;
  }

  .sa-md-content h1,
  .sa-md-content h2,
  .sa-md-content h3 {
    margin: 16px 0 8px 0;
    font-weight: 600;
  }

  .sa-md-content h1 { font-size: 1.4em; }
  .sa-md-content h2 { font-size: 1.2em; }
  .sa-md-content h3 { font-size: 1.1em; }

  /* LaTeX 公式样式 */
  .sa-latex-block {
    margin: 16px 0;
    padding: 12px;
    background: rgba(127,127,127,0.08);
    border-radius: var(--radius-sm);
    overflow-x: auto;
    text-align: center;
  }

  .sa-latex-inline {
    display: inline;
    vertical-align: middle;
  }

  .sa-latex-fallback {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
    background: rgba(127,127,127,0.15);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--text-secondary);
  }

  .sa-latex-error {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
    background: rgba(204,0,0,0.1);
    padding: 2px 6px;
    border-radius: 4px;
    color: #cc0000;
    border: 1px solid rgba(204,0,0,0.3);
  }

  /* LaTeX 公式样式 - 使用浏览器原生 MathML 渲染 */
  /* KaTeX JS 负责将 LaTeX 转换为 MathML，浏览器负责渲染 MathML */
  .katex {
    font-size: 1.1em;
    line-height: 1.2;
  }

  .katex-display {
    display: block;
    margin: 1em 0;
    text-align: center;
  }

  .katex-display > .katex {
    display: block;
    font-size: 1.2em;
    text-align: center;
  }

  /* 隐藏 KaTeX HTML 渲染层（依赖字体，在 Shadow DOM 中不可靠） */
  .katex .katex-html {
    display: none !important;
  }

  /* 显示 MathML 层（浏览器原生渲染） */
  .katex .katex-mathml {
    position: static;
    clip: auto;
    padding: 0;
    border: 0;
    height: auto;
    width: auto;
    overflow: visible;
  }

  /* 用户消息中的 Markdown 样式调整 */
  .sa-user-content {
    color: inherit;
  }

  .sa-user-content code {
    background: rgba(255,255,255,0.2);
    color: inherit;
  }

  .sa-user-content pre {
    background: rgba(0,0,0,0.2);
  }

  .sa-user-content a {
    color: rgba(255,255,255,0.9);
    text-decoration: underline;
  }

  .sa-user-content blockquote {
    border-left-color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.1);
  }

  .sa-user-content .sa-latex-block {
    background: rgba(255,255,255,0.1);
  }

  .sa-user-content .sa-latex-fallback {
    background: rgba(255,255,255,0.2);
    color: inherit;
  }
`;

/** 消息底部工具栏样式 */
export const messageFooterStyles = `
  .sa-message-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .sa-msg-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: var(--radius-full);
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    cursor: pointer;
    user-select: none;
    font-size: 11px;
    color: var(--text-secondary);
    transition: all 0.15s;
    position: relative;
  }

  .sa-msg-btn:hover {
    border-color: var(--accent-color);
    background: var(--accent-light);
  }

  .sa-msg-btn .sa-icon-xs {
    width: 12px;
    height: 12px;
  }

  .sa-msg-btn-text {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sa-msg-btn .sa-msg-btn-arrow {
    font-size: 8px;
    opacity: 0.6;
  }

  .sa-msg-btn.open .sa-msg-btn-arrow {
  }

  .sa-msg-btn-popup {
    display: none;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    min-width: 180px;
    max-width: 240px;
    max-height: 220px;
    overflow-y: auto;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    z-index: 100;
    box-shadow: var(--shadow-lg);
  }

  .sa-msg-btn.open .sa-msg-btn-popup {
    display: block;
  }

  .sa-msg-btn-option {
    padding: 10px 12px;
    cursor: pointer;
    font-size: 12px;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.1s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sa-msg-btn-option:last-child {
    border-bottom: none;
  }

  .sa-msg-btn-option:hover {
    background: var(--accent-light);
  }

  .sa-msg-btn-option.selected {
    background: var(--accent-light);
    color: var(--accent-color);
  }
`;
