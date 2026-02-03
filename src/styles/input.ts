/**
 * 输入区域样式
 */

/** 输入容器样式 */
export const inputContainerStyles = `
  .sa-input-container {
    padding: 16px;
    border-top: 1px solid var(--border-color);
    background: var(--bg-color);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  #sa-input {
    width: 100%;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    resize: none;
    min-height: 80px;
    max-height: 150px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.5;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  #sa-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  #sa-input::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
`;

/** 选择片段 Chip 样式 */
export const chipStyles = `
  #sa-chip-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    max-height: 80px;
    overflow-y: auto;
    padding-bottom: 4px;
    min-height: 0;
  }

  .sa-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    border-radius: var(--radius-full);
    padding: 5px 12px;
    font-size: 12px;
    color: var(--text-secondary);
    position: relative;
    cursor: default;
    animation: chipIn 0.2s ease-out;
    max-width: 100%;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .sa-chip:hover {
    border-color: var(--accent-color);
  }

  @keyframes chipIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .sa-chip-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .sa-chip-close {
    cursor: pointer;
    padding: 2px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    font-size: 10px;
    transition: all 0.15s;
  }

  .sa-chip-close:hover {
    background: rgba(239,68,68,0.2);
    color: #ef4444;
  }

  .sa-chip:hover::after {
    content: attr(data-full-text);
    position: absolute;
    bottom: calc(100% + 10px);
    left: 0;
    min-width: 200px;
    max-width: min(350px, calc(100vw - 60px));
    background: var(--bg-color);
    color: var(--text-primary);
    padding: 10px 12px;
    border-radius: var(--radius-md);
    font-size: 12px;
    line-height: 1.5;
    z-index: 100;
    pointer-events: none;
    white-space: pre-wrap;
    word-break: break-word;
    border: 1px solid var(--border-color);
  }
`;

/** 工具栏样式 */
export const toolbarStyles = `
  .sa-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sa-toolbar-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    height: 32px;
    border-radius: var(--radius-full);
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    cursor: pointer;
    user-select: none;
    font-size: 12px;
    color: var(--text-secondary);
    transition: all 0.15s;
    gap: 5px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .sa-toolbar-btn:hover {
    border-color: var(--accent-color);
    background: var(--accent-light);
  }

  .sa-toolbar-btn.danger:hover {
    border-color: var(--danger-color);
    color: var(--danger-color);
    background: rgba(239,68,68,0.1);
  }

  .sa-toolbar-spacer {
    flex: 1;
  }

  #sa-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  #sa-action-btn.send {
    background: var(--accent-color);
    color: white;
    box-shadow: 0 2px 8px rgba(99,102,241,0.4);
  }

  #sa-action-btn.send:hover {
    background: var(--accent-hover);
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(99,102,241,0.5);
  }

  #sa-action-btn.send:active {
    transform: scale(0.95);
  }

  #sa-action-btn.stop {
    background: var(--danger-color);
    color: white;
    box-shadow: 0 2px 8px rgba(239,68,68,0.4);
  }

  #sa-action-btn.stop:hover {
    background: var(--danger-hover);
    transform: scale(1.08);
  }

  #sa-action-btn .sa-icon {
    stroke-width: 2.2;
  }
`;
