/**
 * 思考选择器样式
 */

export const thinkSelectorStyles = `
  .sa-think-selector {
    position: relative;
    display: inline-flex;
  }

  .sa-think-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    cursor: pointer;
    user-select: none;
    font-size: 12px;
    color: var(--text-secondary);
    transition: all 0.15s;
    font-weight: 500;
  }

  .sa-think-btn:hover {
    border-color: var(--accent-color);
    background: var(--accent-light);
  }

  .sa-think-btn.active {
    background: var(--accent-light);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  .sa-think-btn .think-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sa-think-btn .think-level {
    font-size: 11px;
    opacity: 0.8;
    padding: 2px 6px;
    background: rgba(127,127,127,0.15);
    border-radius: var(--radius-sm);
  }

  .sa-think-btn.active .think-level {
    background: rgba(99,102,241,0.2);
  }

  .sa-think-btn .think-arrow {
    font-size: 10px;
    opacity: 0.6;
  }

  .sa-think-selector.open .sa-think-btn .think-arrow {
  }

  .sa-think-popup {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 6px;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    visibility: hidden;
    transform: translateY(8px);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 100;
    min-width: 160px;
  }

  .sa-think-selector.open .sa-think-popup {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .sa-think-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.1s;
  }

  .sa-think-option:hover {
    background: var(--accent-light);
  }

  .sa-think-option.selected {
    background: var(--accent-light);
    color: var(--accent-color);
  }

  .sa-think-option-icon {
    width: 24px;
    height: 24px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    color: var(--text-secondary);
  }

  .sa-think-option-icon svg {
    width: 14px;
    height: 14px;
  }

  .sa-think-option.selected .sa-think-option-icon {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }

  .sa-think-option-info {
    flex: 1;
  }

  .sa-think-option-name {
    font-size: 13px;
    font-weight: 500;
  }

  .sa-think-option-desc {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  .sa-think-option-check {
    opacity: 0;
    color: var(--accent-color);
    font-size: 14px;
  }

  .sa-think-option.selected .sa-think-option-check {
    opacity: 1;
  }
`;
