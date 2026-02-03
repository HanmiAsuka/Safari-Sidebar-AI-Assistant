/**
 * 国际化模块入口
 * 根据浏览器语言自动选择中文或英文
 */

import { zh } from './zh';
import { en } from './en';
import type { I18NText } from '@/types';

/** 检测是否为中文环境 */
export const IS_ZH = navigator.language.startsWith('zh');

/** 当前语言文本 */
export const T: I18NText = IS_ZH ? zh : en;

/** 导出定义 */
export { zh, en, type I18NText };
