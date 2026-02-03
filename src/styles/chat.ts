/**
 * 聊天区域样式
 */

/** 聊天列表样式 */
export const chatListStyles = `
  #sa-chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-behavior: smooth;
  }

  #sa-chat-list::-webkit-scrollbar {
    width: 6px;
  }

  #sa-chat-list::-webkit-scrollbar-track {
    background: transparent;
  }

  #sa-chat-list::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }

  #sa-chat-list::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }
`;

/** 消息气泡样式 */
export const messageStyles = `
  .sa-message {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    animation: messageIn 0.3s ease-out;
  }

  @keyframes messageIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .sa-message.user {
    align-items: flex-end;
  }

  .sa-message.ai {
    align-items: flex-start;
  }

  .sa-bubble {
    padding: 12px 16px;
    border-radius: var(--radius-lg);
    max-width: 90%;
    word-wrap: break-word;
    position: relative;
    line-height: 1.5;
  }

  .sa-message.user .sa-bubble {
    background: var(--user-bubble);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: var(--shadow-md);
  }

  .sa-message.ai .sa-bubble {
    background: var(--chat-bg);
    border: 1px solid var(--border-color);
    border-bottom-left-radius: 4px;
    box-shadow: var(--shadow-sm);
  }
`;

/** 引用折叠样式 */
export const refCollapseStyles = `
  .sa-ref-collapse {
    background: rgba(255,255,255,0.1);
    border-radius: var(--radius-md);
    margin-bottom: 10px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(4px);
  }

  .sa-ref-header {
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
    background: rgba(255,255,255,0.05);
    font-weight: 500;
    transition: background 0.15s;
  }

  .sa-ref-header:hover {
    background: rgba(255,255,255,0.1);
  }

  .sa-ref-content {
    padding: 10px 12px;
    font-size: 12px;
    opacity: 0.9;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: none;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
    background: rgba(0,0,0,0.1);
  }

  .sa-ref-content.visible {
    display: block;
    animation: slideDown 0.2s ease-out;
  }

  .sa-arrow {
    font-size: 10px;
    opacity: 0.7;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 200px;
    }
  }
`;

/** 思考块样式 */
export const thinkBlockStyles = `
  .sa-think-block {
    margin-bottom: 12px;
    border: 1px solid var(--think-border);
    border-radius: var(--radius-md);
    background: var(--think-bg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .sa-think-header {
    padding: 10px 14px;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    user-select: none;
    transition: background 0.15s;
  }

  .sa-think-header:hover {
    background: rgba(127,127,127,0.08);
  }

  .sa-think-icon {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sa-think-title {
    flex: 1;
    font-weight: 500;
  }

  .sa-think-content {
    padding: 12px 14px;
    font-size: 13px;
    color: var(--text-secondary);
    border-top: 1px solid var(--think-border);
    white-space: pre-wrap;
    display: none;
    line-height: 1.6;
    max-height: 300px;
    overflow-y: auto;
  }

  .sa-think-content.visible {
    display: block;
    animation: slideDown 0.25s ease-out;
  }

  .sa-think-block.thinking .sa-think-header {
    background: linear-gradient(90deg,
      transparent,
      var(--accent-light),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .sa-think-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--accent-color);
    padding-right: 8px;
  }

  .sa-think-status .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-color);
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .sa-think-header .sa-think-arrow {
    font-size: 10px;
    opacity: 0.5;
  }

  .sa-think-block.expanded .sa-think-arrow {
  }
`;

/** 摘要块样式 */
export const summaryBlockStyles = `
  .sa-summary-block {
    margin-bottom: 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--card-bg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .sa-summary-block.loading .sa-summary-header {
    background: linear-gradient(90deg,
      transparent,
      var(--accent-light),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }

  .sa-summary-header {
    padding: 10px 14px;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    user-select: none;
    transition: background 0.15s;
  }

  .sa-summary-header:hover {
    background: rgba(127,127,127,0.08);
  }

  .sa-summary-icon {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
  }

  .sa-summary-title {
    flex: 1;
    font-weight: 500;
  }

  .sa-summary-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--accent-color);
    padding-right: 8px;
  }

  .sa-summary-status .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-color);
    animation: pulse 1.2s ease-in-out infinite;
  }

  .sa-summary-arrow {
    font-size: 10px;
    opacity: 0.5;
  }

  .sa-summary-block.expanded .sa-summary-arrow {
  }

  .sa-summary-content {
    padding: 12px 14px;
    font-size: 13px;
    color: var(--text-primary);
    border-top: 1px solid var(--border-color);
    white-space: pre-wrap;
    display: none;
    line-height: 1.6;
    max-height: 400px;
    overflow-y: auto;
  }

  .sa-summary-content.visible {
    display: block;
    animation: slideDown 0.25s ease-out;
  }
`;
