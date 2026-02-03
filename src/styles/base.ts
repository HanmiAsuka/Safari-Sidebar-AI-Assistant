/**
 * 基础样式 - 容器和布局
 */

import { sidebarWidth } from './variables';

/** 基础重置和容器样式 */
export const baseStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* 继承属性重置，防止宿主页面样式泄漏 */
  #sa-sidebar, #sa-sidebar * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #sa-sidebar button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  #sa-sidebar {
    position: fixed;
    top: 0;
    right: -${sidebarWidth};
    width: ${sidebarWidth};
    height: 100vh;
    background: var(--bg-color);
    color: var(--text-primary);
    z-index: 2147483647;
    box-shadow: none;
    transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    border-left: 1px solid var(--border-color);
    border-top-left-radius: var(--radius-lg);
    border-bottom-left-radius: var(--radius-lg);
    overflow: hidden;
  }

  #sa-sidebar.open {
    right: 0;
    box-shadow: -8px 0 32px rgba(0,0,0,0.3);
  }
`;

/** 图标样式 */
export const iconStyles = `
  .sa-icon {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .sa-icon-sm {
    width: 16px;
    height: 16px;
  }

  .sa-icon-lg {
    width: 20px;
    height: 20px;
  }
`;

/** 头部样式 */
export const headerStyles = `
  .sa-header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    background: var(--bg-color);
    backdrop-filter: blur(10px);
  }

  .sa-header-title {
    font-weight: 600;
    font-size: 15px;
    background: linear-gradient(135deg, var(--accent-color), #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sa-header-actions {
    display: flex;
    gap: 4px;
  }

  #sa-mode-indicator {
    font-size: 11px;
    font-weight: 600;
    color: var(--success-color);
    background: rgba(34, 197, 94, 0.1);
    padding: 3px 10px;
    border-radius: var(--radius-full);
    opacity: 0;
    transition: all 0.2s;
    pointer-events: none;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  #sa-mode-indicator.active {
    opacity: 1;
  }

  .sa-icon-btn {
    cursor: pointer;
    opacity: 0.7;
    background: none;
    border: none;
    color: inherit;
    padding: 8px;
    border-radius: var(--radius-md);
    font-size: 15px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sa-icon-btn:hover {
    opacity: 1;
    background: var(--accent-light);
    transform: scale(1.05);
  }

  .sa-icon-btn:active {
    transform: scale(0.95);
  }
`;
