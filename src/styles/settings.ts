/**
 * 设置面板样式
 */

export const settingsPanelStyles = `
  #sa-settings-panel {
    display: none;
    padding: 20px;
    background: var(--bg-color);
    position: absolute;
    inset: 0;
    z-index: 10;
    overflow-y: auto;
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  #sa-settings-panel.visible {
    display: block;
  }

  .sa-settings-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .sa-settings-header h3 {
    font-size: 17px;
    font-weight: 600;
    margin: 0;
    flex: 1;
  }

  .sa-settings-status {
    font-size: 12px;
    color: var(--text-secondary);
    transition: opacity 0.3s, visibility 0.3s;
    opacity: 0;
    visibility: hidden;
    user-select: none;
    pointer-events: none;
  }

  .sa-settings-status.visible {
    opacity: 1;
    visibility: visible;
  }

  /* ========== 设置卡片分组 ========== */
  .sa-settings-section {
    background: var(--card-bg);
    border-radius: var(--radius-md);
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--border-color);
  }

  .sa-settings-section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sa-form-group {
    margin-bottom: 16px;
  }

  .sa-form-group:last-child {
    margin-bottom: 0;
  }

  .sa-form-label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .sa-form-input {
    width: 100%;
    padding: 10px 12px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    font-size: 14px;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .sa-form-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .sa-form-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  textarea.sa-form-input {
    resize: vertical;
    min-height: 80px;
  }

  .sa-btn {
    padding: 12px 16px;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    width: 100%;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.15s;
  }

  .sa-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
  }

  .sa-btn:active {
    transform: translateY(0);
  }

  .sa-warning {
    font-size: 12px;
    color: var(--danger-color);
    margin-top: 12px;
    padding: 10px 12px;
    border: 1px solid var(--danger-color);
    background: rgba(239,68,68,0.1);
    border-radius: var(--radius-sm);
    display: none;
  }

  /* ========== 带管理按钮的输入行 ========== */
  .sa-input-with-btn {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  .sa-input-with-btn .sa-selector-wrapper {
    flex: 1;
  }

  .sa-input-with-btn .sa-manage-btn {
    padding: 0 12px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .sa-input-with-btn .sa-manage-btn:hover {
    background: var(--accent-light);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  /* ========== 开关样式 ========== */
  .sa-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .sa-toggle-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .sa-toggle {
    position: relative;
    width: 44px;
    height: 24px;
    background: var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .sa-toggle.active {
    background: var(--accent-color);
  }

  .sa-toggle::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .sa-toggle.active::after {
    transform: translateX(20px);
  }

  /* ========== 禁用状态 ========== */
  .sa-settings-section.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .sa-settings-section.disabled .sa-toggle-row {
    pointer-events: auto;
    opacity: 1;
  }

  /* ========== 带重置按钮的标签行 ========== */
  .sa-form-label-with-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .sa-reset-btn {
    padding: 4px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sa-reset-btn:hover {
    color: var(--accent-color);
    background: var(--accent-light);
  }

  .sa-reset-btn svg {
    width: 14px;
    height: 14px;
  }
`;

/** 主题/选择器样式 */
export const themeSelectorStyles = `
  .sa-selector-wrapper {
    position: relative;
  }

  .sa-selector-display {
    width: 100%;
    padding: 10px 36px 10px 12px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.15s;
    box-sizing: border-box;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sa-selector-display:hover {
    border-color: var(--accent-color);
  }

  .sa-selector-display:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sa-selector-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-secondary);
    font-size: 10px;
  }

  .sa-selector-wrapper.open .sa-selector-arrow {
  }

  .sa-selector-dropdown {
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

  .sa-selector-wrapper.open .sa-selector-dropdown {
    display: block;
  }

  .sa-selector-item {
    padding: 10px 12px;
    cursor: pointer;
    font-size: 13px;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.1s;
  }

  .sa-selector-item:last-child {
    border-bottom: none;
  }

  .sa-selector-item:hover {
    background: var(--accent-light);
  }

  .sa-selector-item.selected {
    background: var(--accent-light);
    color: var(--accent-color);
  }

  .sa-theme-selector { position: relative; }
  .sa-theme-selector-display {
    width: 100%;
    padding: 10px 36px 10px 12px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .sa-theme-selector-display:hover { border-color: var(--accent-color); }
  .sa-theme-selector-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-secondary);
    font-size: 10px;
    transition: transform 0.15s;
  }
  .sa-theme-selector.open .sa-theme-selector-arrow { transform: translateY(-50%) rotate(180deg); }
  .sa-theme-dropdown {
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
  .sa-theme-selector.open .sa-theme-dropdown { display: block; }
  .sa-theme-dropdown-item {
    padding: 10px 12px;
    cursor: pointer;
    font-size: 13px;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.1s;
  }
  .sa-theme-dropdown-item:last-child { border-bottom: none; }
  .sa-theme-dropdown-item:hover { background: var(--accent-light); }
  .sa-theme-dropdown-item.selected { background: var(--accent-light); color: var(--accent-color); }
`;

/** 提供方管理面板样式 */
export const providersPanelStyles = `
  #sa-providers-panel {
    display: none;
    padding: 20px;
    background: var(--bg-color);
    position: absolute;
    inset: 0;
    z-index: 15;
    overflow-y: auto;
    animation: slideIn 0.2s ease-out;
  }

  #sa-providers-panel.visible {
    display: block;
  }

  .sa-providers-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .sa-providers-header h3 {
    font-size: 17px;
    font-weight: 600;
    margin: 0;
    flex: 1;
  }

  .sa-provider-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 16px;
    margin-bottom: 12px;
  }

  .sa-provider-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .sa-provider-card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .sa-provider-card-delete {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
    border-radius: var(--radius-sm);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .sa-provider-card-delete:hover {
    background: var(--danger-color);
    color: white;
  }

  .sa-provider-field {
    margin-bottom: 12px;
  }

  .sa-provider-field:last-child {
    margin-bottom: 0;
  }

  .sa-provider-field-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .sa-provider-field-input {
    width: 100%;
    padding: 8px 10px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    font-size: 13px;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .sa-provider-field-input:focus {
    outline: none;
    border-color: var(--accent-color);
  }

  .sa-add-provider-btn {
    width: 100%;
    padding: 14px;
    background: var(--card-bg);
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .sa-add-provider-btn:hover {
    border-color: var(--accent-color);
    color: var(--accent-color);
    background: var(--accent-light);
  }

  .sa-providers-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
    font-size: 14px;
  }
`;
