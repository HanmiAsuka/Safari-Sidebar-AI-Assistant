/**
 * GM API 兼容层模块
 * 提供对 GM.* 和 GM_* API 的统一封装，支持降级到 localStorage
 */

import type { GMRequestDetails, GMRequestController } from '@/types';

// 声明全局变量类型
declare const GM: {
  getValue<T>(key: string, defaultValue: T): Promise<T>;
  setValue<T>(key: string, value: T): Promise<void>;
  registerMenuCommand(caption: string, callback: () => void): void;
  xmlHttpRequest(details: GMRequestDetails): GMRequestController;
} | undefined;

declare const GM_getValue: (<T>(key: string, defaultValue: T) => T) | undefined;
declare const GM_setValue: (<T>(key: string, value: T) => void) | undefined;

declare const GM_registerMenuCommand:
  | ((caption: string, callback: () => void) => void)
  | undefined;

declare const GM_xmlhttpRequest:
  | ((details: GMRequestDetails) => GMRequestController)
  | undefined;

/** 本地存储键前缀 */
const STORAGE_PREFIX = 'sa_';

/**
 * 检查是否支持异步 GM API
 * @returns 是否支持
 */
export function isAsyncAPI(): boolean {
  return typeof GM !== 'undefined';
}

/**
 * 获取存储值
 * 优先使用 GM.getValue，降级到 localStorage
 * @param key - 存储键
 * @param defaultValue - 默认值
 * @returns 存储的值
 */
export async function getValue<T>(key: string, defaultValue: T): Promise<T> {
  // 1. 尝试现代异步 API (GM.getValue)
  if (typeof GM !== 'undefined' && GM.getValue) {
    return await GM.getValue(key, defaultValue);
  }

  // 2. 尝试传统同步 API (GM_getValue)
  if (typeof GM_getValue !== 'undefined') {
    return GM_getValue(key, defaultValue);
  }

  // 3. 降级到 localStorage
  const stored = localStorage.getItem(STORAGE_PREFIX + key);
  if (stored === null) return defaultValue;

  // localStorage 总是返回字符串，尝试解析 JSON 以保持类型一致性
  try {
    return JSON.parse(stored) as T;
  } catch {
    return stored as unknown as T;
  }
}

/**
 * 设置存储值
 * 优先使用 GM.setValue，降级到 localStorage
 * @param key - 存储键
 * @param value - 要存储的值
 */
export async function setValue<T>(key: string, value: T): Promise<void> {
  // 1. 尝试现代异步 API (GM.setValue)
  if (typeof GM !== 'undefined' && GM.setValue) {
    return await GM.setValue(key, value);
  }

  // 2. 尝试传统同步 API (GM_setValue)
  if (typeof GM_setValue !== 'undefined') {
    GM_setValue(key, value);
    return;
  }

  // 3. 降级到 localStorage
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

/**
 * 注册菜单命令
 * 优先使用 GM.registerMenuCommand，降级到 GM_registerMenuCommand
 * @param caption - 菜单项文本
 * @param callback - 点击回调
 */
export function registerMenu(caption: string, callback: () => void): void {
  // 1. 尝试传统 API (更稳定)
  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand(caption, callback);
  }
  // 2. 尝试现代 API
  else if (typeof GM !== 'undefined' && GM.registerMenuCommand) {
    GM.registerMenuCommand(caption, callback);
  }
}

/**
 * 发起 HTTP 请求
 * 优先使用 GM.xmlHttpRequest，降级到 GM_xmlhttpRequest，最后降级到 fetch
 * @param details - 请求配置
 * @returns 请求控制器
 */
export function request(details: GMRequestDetails): GMRequestController {
  // 1. 优先使用传统 API (在 Tampermonkey 等管理器中对 Streaming 支持更好)
  if (typeof GM_xmlhttpRequest !== 'undefined') {
    return GM_xmlhttpRequest(details);
  }

  // 2. 尝试现代 API
  if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
    return GM.xmlHttpRequest(details);
  }

  // 3. 降级到 fetch
  const controller = new AbortController();

  fetch(details.url, {
    method: details.method,
    headers: details.headers,
    body: details.data,
    signal: controller.signal
  })
    .then(async (response) => {
      const text = await response.text();
      if (details.onload) {
        details.onload({
          readyState: 4,
          status: response.status,
          statusText: response.statusText,
          responseText: text
        });
      }
    })
    .catch((error) => {
      if (details.onerror) {
        details.onerror(error);
      }
    });

  return {
    abort: () => controller.abort()
  };
}

/** GM API 统一接口对象 */
export const GMSafe = {
  isAsyncAPI,
  getValue,
  setValue,
  registerMenu,
  request
};

export default GMSafe;
