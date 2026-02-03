/**
 * CSS 变量定义 - 主题颜色
 */

import { CONFIG } from '@/config';

/** 深色主题 CSS 变量 */
export const darkThemeVars = `
  --bg-color: #1a1a1a;
  --card-bg: #242424;
  --chat-bg: #242424;
  --input-bg: #2d2d2d;
  --border-color: #3a3a3a;
  --text-primary: #f0f0f0;
  --text-secondary: #999;
  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --accent-light: rgba(99,102,241,0.15);
  --danger-color: #ef4444;
  --danger-hover: #dc2626;
  --success-color: #22c55e;
  --think-bg: #1e1e2e;
  --think-border: #3a3a4a;
  --user-bubble: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --chip-bg: #2a2a2a;
  --chip-border: #404040;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
`;

/** 浅色主题 CSS 变量 */
export const lightThemeVars = `
  --bg-color: #fafafa;
  --card-bg: #ffffff;
  --chat-bg: #ffffff;
  --input-bg: #ffffff;
  --border-color: #e5e5e5;
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --accent-light: rgba(99,102,241,0.1);
  --think-bg: #f5f5ff;
  --think-border: #e0e0f0;
  --chip-bg: #f0f0f0;
  --chip-border: #ddd;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
`;

/** 通用设计系统变量 */
export const designSystemVars = `
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
`;

/** 获取侧边栏宽度 */
export const sidebarWidth = CONFIG.SIDEBAR_WIDTH;
