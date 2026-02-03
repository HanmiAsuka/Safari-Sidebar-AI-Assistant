/**
 * HTML 模板模块
 * 生成侧边栏的主要 HTML 结构
 */

import { T } from '@/i18n';
import { CONFIG } from '@/config';
import * as Icons from './icons';

/**
 * 生成侧边栏主 HTML 模板
 * @returns HTML 字符串
 */
export function getSidebarTemplate(): string {
  return `
    <div class="sa-header">
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="sa-header-title">${T.title}</span>
        <span id="sa-mode-indicator">${T.appendMode}</span>
      </div>
      <div class="sa-header-actions">
        <button class="sa-icon-btn" id="sa-settings-btn" title="${T.settings}">
          ${Icons.settingsIcon}
        </button>
        <button class="sa-icon-btn" id="sa-close-btn" title="${T.close}">
          ${Icons.closeIcon}
        </button>
      </div>
    </div>
    <div id="sa-chat-list">
      <div class="sa-message ai">
        <div class="sa-bubble sa-markdown">${T.welcome}</div>
      </div>
    </div>
    <div class="sa-input-container">
      <div id="sa-chip-list"></div>
      <textarea id="sa-input" placeholder="${T.placeholder}"></textarea>
      <div class="sa-toolbar">
        ${getThinkSelectorTemplate()}
        ${getModelSwitchTemplate()}
        <button class="sa-toolbar-btn danger" id="sa-clear-btn" title="${T.clear}">
          ${Icons.clearChatIcon}
        </button>
        <button class="sa-toolbar-btn" id="sa-clear-context-btn" title="${T.clearContextTip}">
          ${Icons.clearContextIcon}
        </button>
        <div class="sa-toolbar-spacer"></div>
        <button id="sa-action-btn" class="send" title="Send">
          ${Icons.sendIcon}
        </button>
      </div>
    </div>
    ${getSettingsPanelTemplate()}
    ${getModelsPanelTemplate()}
    ${getProvidersPanelTemplate()}
  `;
}

/**
 * 生成思考强度选择器模板
 */
function getThinkSelectorTemplate(): string {
  return `
    <div class="sa-think-selector" id="sa-think-selector">
      <div class="sa-think-btn" id="sa-think-btn" title="${T.deepThinkTip}">
        <span class="think-icon">${Icons.thinkIcon}</span>
        <span class="think-label">${T.deepThink}</span>
        <span class="think-level" id="sa-think-level">${T.thinkingLevels.none}</span>
        <span class="think-arrow">◀</span>
      </div>
      <div class="sa-think-popup" id="sa-think-popup">
        <div class="sa-think-option" data-level="none">
          <div class="sa-think-option-icon">${Icons.thinkLevelNoneIcon}</div>
          <div class="sa-think-option-info">
            <div class="sa-think-option-name">${T.thinkingLevels.none}</div>
            <div class="sa-think-option-desc">${T.thinkingLevelDesc.none}</div>
          </div>
          <span class="sa-think-option-check">✓</span>
        </div>
        <div class="sa-think-option" data-level="low">
          <div class="sa-think-option-icon">${Icons.thinkLevelLowIcon}</div>
          <div class="sa-think-option-info">
            <div class="sa-think-option-name">${T.thinkingLevels.low}</div>
            <div class="sa-think-option-desc">${T.thinkingLevelDesc.low}</div>
          </div>
          <span class="sa-think-option-check">✓</span>
        </div>
        <div class="sa-think-option" data-level="medium">
          <div class="sa-think-option-icon">${Icons.thinkLevelMediumIcon}</div>
          <div class="sa-think-option-info">
            <div class="sa-think-option-name">${T.thinkingLevels.medium}</div>
            <div class="sa-think-option-desc">${T.thinkingLevelDesc.medium}</div>
          </div>
          <span class="sa-think-option-check">✓</span>
        </div>
        <div class="sa-think-option" data-level="high">
          <div class="sa-think-option-icon">${Icons.thinkLevelHighIcon}</div>
          <div class="sa-think-option-info">
            <div class="sa-think-option-name">${T.thinkingLevels.high}</div>
            <div class="sa-think-option-desc">${T.thinkingLevelDesc.high}</div>
          </div>
          <span class="sa-think-option-check">✓</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成模型切换按钮模板
 */
function getModelSwitchTemplate(): string {
  return `
    <div class="sa-model-switch-selector" id="sa-model-switch-selector">
      <div class="sa-model-switch-btn" id="sa-model-switch-btn" title="${T.switchModel}">
        <span class="model-icon">${Icons.modelIcon}</span>
        <span class="model-name" id="sa-model-switch-name">${CONFIG.DEFAULT_MODEL}</span>
        <span class="model-arrow">◀</span>
      </div>
      <div class="sa-model-switch-popup" id="sa-model-switch-popup"></div>
    </div>
  `;
}

/**
 * 生成设置面板模板
 */
function getSettingsPanelTemplate(): string {
  return `
    <div id="sa-settings-panel">
      <div class="sa-settings-header">
        <button class="sa-icon-btn" id="sa-back-btn" title="${T.back}">
          ${Icons.backIcon}
        </button>
        <h3>${T.settings}</h3>
        <span id="sa-settings-status" class="sa-settings-status"></span>
      </div>
      <div id="sa-storage-warning" class="sa-warning">${T.storageWarn}</div>

      <!-- 系统设置 -->
      <div class="sa-settings-section">
        <div class="sa-settings-section-title">${T.systemSettings}</div>
        <div class="sa-form-group">
          <label class="sa-form-label">${T.labels.theme}</label>
          <div class="sa-selector-wrapper" id="sa-theme-selector">
            <button type="button" class="sa-selector-display" id="set-theme-display" data-theme="auto">${T.themeOpts.auto}</button>
            <span class="sa-selector-arrow">◀</span>
            <div class="sa-selector-dropdown" id="sa-theme-dropdown">
              <div class="sa-selector-item" data-theme="auto">${T.themeOpts.auto}</div>
              <div class="sa-selector-item" data-theme="dark">${T.themeOpts.dark}</div>
              <div class="sa-selector-item" data-theme="light">${T.themeOpts.light}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 对话模型设置 -->
      <div class="sa-settings-section">
        <div class="sa-settings-section-title">${T.chatModelSettings}</div>
        <div class="sa-form-group">
          <label class="sa-form-label">${T.labels.provider}</label>
          <div class="sa-input-with-btn">
            <div class="sa-selector-wrapper" id="sa-chat-provider-selector">
              <button type="button" class="sa-selector-display" id="set-chat-provider-display"></button>
              <span class="sa-selector-arrow">◀</span>
              <div class="sa-selector-dropdown" id="sa-chat-provider-dropdown"></div>
            </div>
            <button type="button" class="sa-manage-btn" id="sa-provider-manage-btn">${Icons.settingsSmallIcon} ${T.manage}</button>
          </div>
        </div>
        <div class="sa-form-group">
          <label class="sa-form-label">${T.labels.model}</label>
          <div class="sa-input-with-btn">
            <div class="sa-selector-wrapper" id="sa-chat-model-selector">
              <button type="button" class="sa-selector-display" id="set-chat-model-display">${CONFIG.DEFAULT_MODEL}</button>
              <span class="sa-selector-arrow">◀</span>
              <div class="sa-selector-dropdown" id="sa-chat-model-dropdown"></div>
            </div>
            <button type="button" class="sa-manage-btn" id="sa-chat-model-manage-btn">${Icons.settingsSmallIcon} ${T.manage}</button>
          </div>
        </div>
        <div class="sa-form-group">
          <label class="sa-form-label">${T.labels.temp}</label>
          <input type="number" step="0.1" min="0" max="2" id="set-chat-temp" class="sa-form-input">
        </div>
        <div class="sa-form-group">
          <label class="sa-form-label-with-btn">
            <span>${T.labels.prompt}</span>
            <button type="button" class="sa-reset-btn" id="sa-reset-chat-prompt" title="${T.reset || 'Reset'}">
              ${Icons.resetIcon}
            </button>
          </label>
          <textarea id="set-chat-prompt" class="sa-form-input" rows="3"></textarea>
        </div>
      </div>

      <!-- 摘要模型设置 -->
      <div class="sa-settings-section" id="sa-summary-section">
        <div class="sa-settings-section-title">${T.summaryModelSettings}</div>
        <div class="sa-toggle-row">
          <span class="sa-toggle-label">${T.enableSummary}</span>
          <div class="sa-toggle" id="sa-summary-toggle"></div>
        </div>
        <div class="sa-form-group">
          <label class="sa-form-label">${T.labels.provider}</label>
          <div class="sa-selector-wrapper" id="sa-summary-provider-selector">
            <button type="button" class="sa-selector-display" id="set-summary-provider-display"></button>
            <span class="sa-selector-arrow">◀</span>
            <div class="sa-selector-dropdown" id="sa-summary-provider-dropdown"></div>
          </div>
        </div>
        <div class="sa-form-group">
          <label class="sa-form-label">${T.labels.model}</label>
          <div class="sa-selector-wrapper" id="sa-summary-model-selector">
            <button type="button" class="sa-selector-display" id="set-summary-model-display"></button>
            <span class="sa-selector-arrow">◀</span>
            <div class="sa-selector-dropdown" id="sa-summary-model-dropdown"></div>
          </div>
        </div>
        <div class="sa-form-group">
          <label class="sa-form-label">${T.labels.temp}</label>
          <input type="number" step="0.1" min="0" max="2" id="set-summary-temp" class="sa-form-input">
        </div>
        <div class="sa-form-group">
          <label class="sa-form-label-with-btn">
            <span>${T.summaryPrompt}</span>
            <button type="button" class="sa-reset-btn" id="sa-reset-summary-prompt" title="${T.reset || 'Reset'}">
              ${Icons.resetIcon}
            </button>
          </label>
          <textarea id="set-summary-prompt" class="sa-form-input" rows="3"></textarea>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成模型管理面板模板
 */
function getModelsPanelTemplate(): string {
  return `
    <div id="sa-models-panel">
      <div class="sa-models-header">
        <button class="sa-icon-btn" id="sa-models-back-btn" title="${T.back}">
          ${Icons.backIcon}
        </button>
        <h3>${T.modelList}</h3>
        <div class="sa-models-actions">
          <button class="sa-models-remove-all" id="sa-models-remove-all">${T.removeAll}</button>
        </div>
      </div>
      <div class="sa-models-search">
        <input type="text" class="sa-models-search-input" id="sa-models-search" placeholder="${T.searchModels}">
      </div>
      <div class="sa-models-list" id="sa-models-list"></div>
    </div>
  `;
}

/**
 * 生成提供方管理面板模板
 */
function getProvidersPanelTemplate(): string {
  return `
    <div id="sa-providers-panel">
      <div class="sa-providers-header">
        <button class="sa-icon-btn" id="sa-providers-back-btn" title="${T.back}">
          ${Icons.backIcon}
        </button>
        <h3>${T.providerManage}</h3>
      </div>
      <div class="sa-providers-list" id="sa-providers-list"></div>
      <button type="button" class="sa-add-provider-btn" id="sa-add-provider-btn">
        + ${T.addProvider}
      </button>
    </div>
  `;
}
