/**
 * 模型管理样式
 */

export const modelsPanelStyles = `
  #sa-models-panel {
    display: none;
    padding: 0;
    background: var(--bg-color);
    position: absolute;
    inset: 0;
    z-index: 11;
    overflow: hidden;
    animation: slideIn 0.2s ease-out;
    flex-direction: column;
  }

  #sa-models-panel.visible {
    display: flex;
  }

  .sa-models-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .sa-models-header h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    flex: 1;
  }

  .sa-models-actions {
    display: flex;
    gap: 8px;
  }

  .sa-models-remove-all {
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
    cursor: pointer;
    font-size: 12px;
    transition: all 0.15s;
  }

  .sa-models-remove-all:hover {
    background: var(--danger-color);
    color: white;
  }

  .sa-models-search {
    padding: 12px 20px 16px 20px;
    flex-shrink: 0;
  }

  .sa-models-search-input {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--radius-md);
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .sa-models-search-input:focus {
    border-color: var(--accent-color);
  }

  .sa-models-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px 16px 20px;
  }

  .sa-model-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--chat-bg);
    margin-bottom: 8px;
    border: 1px solid var(--border-color);
    transition: all 0.15s;
  }

  .sa-model-item:hover {
    border-color: var(--accent-color);
  }

  .sa-model-info {
    flex: 1;
    min-width: 0;
  }

  .sa-model-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sa-model-desc {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sa-model-add-btn,
  .sa-model-remove-btn {
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .sa-model-add-btn {
    background: var(--success-color);
    color: white;
  }

  .sa-model-add-btn:hover {
    filter: brightness(1.1);
  }

  .sa-model-remove-btn {
    background: var(--danger-color);
    color: white;
  }

  .sa-model-remove-btn:hover {
    filter: brightness(1.1);
  }

  .sa-models-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0 12px 0;
    color: var(--text-secondary);
    font-size: 11px;
  }

  .sa-models-divider::before,
  .sa-models-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  .sa-models-loading,
  .sa-models-error {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .sa-models-error {
    color: var(--danger-color);
  }
`;

/** 模型选择器样式 */
export const modelSelectorStyles = `
  .sa-model-selector {
    position: relative;
  }

  .sa-model-selector-display {
    width: 100%;
    padding: 10px 70px 10px 12px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.15s;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sa-model-selector-display:hover {
    border-color: var(--accent-color);
  }

  .sa-model-selector-input {
    width: 100%;
    padding: 10px 36px 10px 12px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .sa-model-selector-input:focus {
    outline: none;
    border-color: var(--accent-color);
  }

  .sa-model-selector-arrow {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-secondary);
    font-size: 10px;
    transition: transform 0.15s;
  }

  .sa-model-selector.open .sa-model-selector-arrow {
    transform: translateY(-50%) rotate(180deg);
  }

  .sa-model-dropdown {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 4px);
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    max-height: 200px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: var(--shadow-md);
  }

  .sa-model-selector.open .sa-model-dropdown {
    display: block;
  }

  .sa-model-dropdown-item {
    padding: 10px 12px;
    cursor: pointer;
    font-size: 13px;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.1s;
  }

  .sa-model-dropdown-item:last-child {
    border-bottom: none;
  }

  .sa-model-dropdown-item:hover {
    background: var(--accent-light);
  }

  .sa-model-dropdown-item.selected {
    background: var(--accent-light);
    color: var(--accent-color);
  }

  .sa-model-dropdown-empty {
    padding: 20px;
    text-align: center;
    color: var(--text-secondary);
    font-size: 12px;
  }

  .sa-model-manage-btn {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #22c55e;
    border: none;
    border-left: 1px solid var(--border-color);
    cursor: pointer;
    color: white;
    transition: all 0.15s;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-size: 12px;
    font-weight: 500;
  }

  .sa-model-manage-btn:hover {
    background: #16a34a;
  }
`;

/** 模型切换按钮样式 */
export const modelSwitchStyles = `
  .sa-model-switch-selector {
    position: relative;
    display: inline-flex;
    max-width: 120px;
  }

  .sa-model-switch-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: var(--radius-full);
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    cursor: pointer;
    user-select: none;
    font-size: 12px;
    color: var(--text-secondary);
    transition: all 0.15s;
    max-width: 120px;
    min-width: 0;
  }

  .sa-model-switch-btn:hover {
    border-color: var(--accent-color);
    background: var(--accent-light);
  }

  .sa-model-switch-btn .model-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .sa-model-switch-btn .model-name {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }

  .sa-model-switch-btn .model-arrow {
    font-size: 10px;
    opacity: 0.6;
  }

  .sa-model-switch-selector.open .sa-model-switch-btn .model-arrow {
  }

  .sa-model-switch-popup {
    display: none;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    min-width: 220px;
    max-width: 280px;
    max-height: 300px;
    overflow-y: auto;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    z-index: 100;
    box-shadow: var(--shadow-lg);
  }

  .sa-model-switch-selector.open .sa-model-switch-popup {
    display: block;
  }

  .sa-model-switch-option {
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.1s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sa-model-switch-option:last-child {
    border-bottom: none;
  }

  .sa-model-switch-option:hover {
    background: var(--accent-light);
  }

  .sa-model-switch-option.selected {
    background: var(--accent-light);
    color: var(--accent-color);
  }
`;
