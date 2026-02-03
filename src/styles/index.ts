/**
 * 样式模块入口
 * 整合所有样式并导出完整的 CSS 字符串
 */

import { darkThemeVars, lightThemeVars, designSystemVars } from './variables';
import { baseStyles, iconStyles, headerStyles } from './base';
import { chatListStyles, messageStyles, refCollapseStyles, thinkBlockStyles, summaryBlockStyles } from './chat';
import { inputContainerStyles, chipStyles, toolbarStyles } from './input';
import { thinkSelectorStyles } from './think-selector';
import { settingsPanelStyles, themeSelectorStyles, providersPanelStyles } from './settings';
import { modelsPanelStyles, modelSelectorStyles, modelSwitchStyles } from './models';
import { loadingStyles, contextDividerStyles, markdownStyles, messageFooterStyles } from './misc';

/**
 * 生成完整的样式字符串
 * @returns 完整的 CSS 样式
 */
export function getStyles(): string {
  return `
    :host {
      ${darkThemeVars}
      ${designSystemVars}
    }

    #sa-sidebar.light-theme {
      ${lightThemeVars}
    }

    ${baseStyles}
    ${iconStyles}
    ${headerStyles}
    ${chatListStyles}
    ${messageStyles}
    ${refCollapseStyles}
    ${thinkBlockStyles}
    ${summaryBlockStyles}
    ${inputContainerStyles}
    ${chipStyles}
    ${toolbarStyles}
    ${thinkSelectorStyles}
    ${settingsPanelStyles}
    ${themeSelectorStyles}
    ${modelsPanelStyles}
    ${modelSelectorStyles}
    ${modelSwitchStyles}
    ${providersPanelStyles}
    ${loadingStyles}
    ${contextDividerStyles}
    ${markdownStyles}
    ${messageFooterStyles}
  `;
}

/** 导出完整样式 */
export const styles = getStyles();

// 导出子模块以便单独使用
export * from './variables';
export * from './base';
export * from './chat';
export * from './input';
export * from './think-selector';
export * from './settings';
export * from './models';
export * from './misc';
