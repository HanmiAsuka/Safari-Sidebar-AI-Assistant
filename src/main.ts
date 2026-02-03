/**
 * Safari AI Assistant - 入口文件
 *
 * 这是一个用于 Safari 浏览器的侧边栏 AI 助手脚本
 * 使用 Userscripts 扩展加载
 *
 * @author HanmiAsuka
 * @version 1.0.0
 * @license MIT
 */

import { AISidebar } from './core';

// 启动侧边栏
new AISidebar();

console.log('🤖 Safari AI Assistant loaded');
