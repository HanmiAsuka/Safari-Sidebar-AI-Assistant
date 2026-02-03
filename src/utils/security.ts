/**
 * 安全工具模块
 * 提供 XSS 防护、输入验证、API Key 加密等安全相关功能
 */

import { IS_ZH } from '@/i18n';
import { CONFIG } from '@/config';
import type { ProviderType } from '@/types';

/** 缓存的加密密钥 */
let cachedEncryptionKey: CryptoKey | null = null;

/**
 * 生成或获取加密密钥
 * 使用 Web Crypto API 生成 AES-GCM 密钥
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  if (cachedEncryptionKey) {
    return cachedEncryptionKey;
  }

  // 尝试从 localStorage 获取已存储的密钥
  const storedKey = localStorage.getItem(CONFIG.SECURITY.ENCRYPTION_KEY_STORAGE);
  if (storedKey) {
    const keyData = JSON.parse(storedKey);
    cachedEncryptionKey = await crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    return cachedEncryptionKey;
  }

  // 生成新密钥
  cachedEncryptionKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // 导出并存储密钥
  const exportedKey = await crypto.subtle.exportKey('jwk', cachedEncryptionKey);
  localStorage.setItem(CONFIG.SECURITY.ENCRYPTION_KEY_STORAGE, JSON.stringify(exportedKey));

  return cachedEncryptionKey;
}

/**
 * HTML 转义，防止 XSS 攻击
 * @param text - 需要转义的文本
 * @returns 转义后的安全文本
 */
export function escapeHtml(text: unknown): string {
  if (text === null || text === undefined) return '';
  const str = String(text);
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * API Key 加密存储（异步）
 * 使用 AES-GCM 加密
 * @param plainKey - 明文 API Key
 * @returns 加密后的 Key (格式: ENC:base64(iv):base64(ciphertext))
 */
export async function obfuscateApiKey(plainKey: string): Promise<string> {
  if (!plainKey || typeof plainKey !== 'string') return '';

  const key = await getEncryptionKey();
  const encoder = new TextEncoder();
  const data = encoder.encode(plainKey);

  // 生成随机 IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 加密
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  // 编码为 base64
  const ivBase64 = btoa(String.fromCharCode(...iv));
  const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));

  return `ENC:${ivBase64}:${ciphertextBase64}`;
}

/**
 * API Key 解密（异步）
 * @param encryptedKey - 加密后的 Key
 * @returns 明文 API Key，解密失败返回空字符串
 */
export async function deobfuscateApiKey(encryptedKey: string): Promise<string> {
  if (!encryptedKey || typeof encryptedKey !== 'string') return '';

  // 必须是 ENC 格式
  if (!encryptedKey.startsWith('ENC:')) {
    // 可能是旧版未加密的 key，直接返回（向后兼容）
    return encryptedKey;
  }

  const key = await getEncryptionKey();

  // 解析格式
  const parts = encryptedKey.split(':');
  if (parts.length !== 3) {
    console.error('Invalid encrypted key format');
    return '';
  }

  try {
    // 解码 base64
    const iv = new Uint8Array(atob(parts[1]).split('').map(c => c.charCodeAt(0)));
    const ciphertext = new Uint8Array(atob(parts[2]).split('').map(c => c.charCodeAt(0)));

    // 解密
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    // 解密失败通常意味着密钥已更换（用户清除了浏览器数据）
    // 静默返回空字符串，让用户重新输入 API Key
    console.warn('API Key decryption failed - encryption key may have changed. Please re-enter your API Key.');
    return '';
  }
}

/**
 * 验证 URL 是否为允许的 API 地址
 * - 标准提供方：只允许 HTTPS 协议和白名单域名
 * - 自定义提供方：允许 HTTPS 协议，但禁止内网地址
 * @param url - 待验证的 URL
 * @param providerType - 提供方类型（可选，默认为标准提供方）
 * @returns 是否有效
 */
export function isValidApiUrl(url: string, providerType?: ProviderType): boolean {
  try {
    const parsed = new URL(url);
    // 只允许 HTTPS 协议
    if (parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();

    // 自定义提供方：使用黑名单模式
    if (providerType === 'custom') {
      // 检查是否为内网地址
      for (const blocked of CONFIG.SECURITY.BLOCKED_HOSTS) {
        if (hostname === blocked || hostname.startsWith(blocked)) {
          return false;
        }
      }
      // 检查是否为 IPv6 本地地址
      if (hostname === '::1' || hostname.startsWith('fe80:')) {
        return false;
      }
      return true;
    }

    // 标准提供方：严格的域名白名单
    return CONFIG.SECURITY.ALLOWED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * 验证数值范围并安全转换
 * @param value - 输入值
 * @param min - 最小值
 * @param max - 最大值
 * @param defaultValue - 默认值
 * @returns 验证后的数值
 */
export function clampNumber(value: unknown, min: number, max: number, defaultValue: number): number {
  const num = parseFloat(String(value));
  if (isNaN(num)) return defaultValue;
  return Math.max(min, Math.min(max, num));
}

/**
 * 验证 API Key 格式
 * @param key - API Key
 * @returns 是否有效
 */
export function validateApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  // 基本格式验证：至少10个字符，只允许字母、数字、下划线、点和横线
  return key.length >= 10 && /^[a-zA-Z0-9_.-]+$/.test(key) && key.length <= 200;
}

/**
 * 安全的 innerHTML 设置，增强 XSS 防护
 * 移除所有潜在的危险元素和属性
 * @param element - 目标元素
 * @param htmlContent - HTML 内容
 */
export function safeSetInnerHTML(element: HTMLElement, htmlContent: string): void {
  try {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;

    // 危险标签列表
    const dangerousTags = [
      'script', 'iframe', 'object', 'embed', 'form',
      'input', 'textarea', 'button',
      'base', 'link', 'meta', 'style', 'template', 'slot'
    ];

    // 移除所有危险元素
    dangerousTags.forEach(tag => {
      const elements = temp.getElementsByTagName(tag);
      for (let i = elements.length - 1; i >= 0; i--) {
        elements[i].remove();
      }
    });

    // 移除所有事件处理属性和危险协议
    const allElements = temp.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      const attrs = el.attributes;
      for (let j = attrs.length - 1; j >= 0; j--) {
        const attrName = attrs[j].name.toLowerCase();
        const attrValue = attrs[j].value.toLowerCase().trim();
        if (
          attrName.startsWith('on') ||
          (attrName === 'href' && attrValue.startsWith('javascript:')) ||
          (attrName === 'href' && attrValue.startsWith('data:'))
        ) {
          el.removeAttribute(attrs[j].name);
        }
      }
    }

    // 清理 SVG 元素中的危险属性（允许 KaTeX 使用的 SVG）
    const svgElements = temp.querySelectorAll('svg, svg *');
    svgElements.forEach(el => {
      const attrs = el.attributes;
      for (let j = attrs.length - 1; j >= 0; j--) {
        const attrName = attrs[j].name.toLowerCase();
        // 移除 SVG 中的事件处理器
        if (attrName.startsWith('on')) {
          el.removeAttribute(attrs[j].name);
        }
      }
    });

    element.innerHTML = temp.innerHTML;
  } catch (error) {
    console.error('Safe innerHTML setting failed:', error);
    // 降级处理：使用纯文本
    element.textContent = htmlContent.replace(/<[^>]*>/g, '');
  }
}

/**
 * 输入清理函数
 * @param input - 输入字符串
 * @param maxLength - 最大长度
 * @returns 清理后的字符串
 */
export function sanitizeInput(input: string, maxLength = 10000): string {
  if (!input || typeof input !== 'string') return '';
  return input.substring(0, maxLength).trim();
}

/**
 * 智能截断页面内容，保留开头和结尾的重要信息
 * @param content - 页面内容
 * @param maxLength - 最大长度
 * @returns 截断后的内容
 */
export function smartTruncateContent(content: string, maxLength = 15000): string {
  if (!content || typeof content !== 'string') return '';
  content = content.replace(/\s+/g, ' ').trim();

  if (content.length <= maxLength) return content;

  // 保留 60% 开头 + 40% 结尾，中间用省略号连接
  const headLength = Math.floor(maxLength * 0.6);
  const tailLength = Math.floor(maxLength * 0.35);
  const head = content.substring(0, headLength);
  const tail = content.substring(content.length - tailLength);

  const truncatedText = IS_ZH ? '内容已截断' : 'content truncated';
  return `${head}\n\n... [${truncatedText}] ...\n\n${tail}`;
}

/**
 * 检查是否为敏感页面（银行、邮箱、登录等）
 * 使用安全的正则模式，避免 ReDoS 攻击
 * @returns 是否为敏感页面
 */
export function isSensitivePage(): boolean {
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();

  // 使用更安全的正则模式，避免 .* 导致的回溯
  const sensitivePatterns = [
    // 银行和金融
    /bank/, /paypal/, /stripe/, /alipay/, /wechat\w{0,20}pay/,
    // 邮箱
    /mail\./, /outlook/, /gmail/,
    // 密码和认证
    /login/, /signin/, /\bauth\b/, /password/, /credential/,
    // 医疗健康
    /health/, /medical/, /patient/,
    // 政府
    /\.gov(?:$|\.)/, /gov\.cn/
  ];

  // 限制检测字符串长度防止 ReDoS
  const fullUrl = (hostname + pathname).substring(0, 500);
  return sensitivePatterns.some(pattern => pattern.test(fullUrl));
}

/**
 * 清理 URL 中的敏感参数
 * @param url - 原始 URL
 * @returns 清理后的 URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // 清理查询参数
    CONFIG.SECURITY.SENSITIVE_PARAMS.forEach(param => {
      if (parsed.searchParams.has(param)) {
        parsed.searchParams.set(param, '[REDACTED]');
      }
    });

    // 清理 hash 中的敏感信息
    if (parsed.hash) {
      CONFIG.SECURITY.SENSITIVE_PARAMS.forEach(param => {
        const regex = new RegExp(`(${param}=)[^&]*`, 'gi');
        parsed.hash = parsed.hash.replace(regex, '$1[REDACTED]');
      });
    }

    return parsed.toString();
  } catch {
    // URL 解析失败，返回去除查询参数的基本 URL
    return url.split('?')[0].split('#')[0];
  }
}

/**
 * 获取当前页面的安全 URL
 * 清理敏感参数后的 URL
 * @returns 安全的 URL 字符串
 */
export function getSafeUrl(): string {
  return sanitizeUrl(window.location.href);
}

/**
 * 获取安全的 Referer 头
 * 对于敏感页面，只返回 origin 而不是完整 URL
 * @returns 安全的 Referer 字符串
 */
export function getSafeReferer(): string {
  return isSensitivePage()
    ? window.location.origin
    : sanitizeUrl(window.location.href);
}

// ============================================
// 提供方验证相关
// ============================================

/** 提供方验证结果 */
export interface ProviderValidationResult {
  /** 是否验证通过 */
  valid: boolean;
  /** 错误类型 */
  errorType?: 'no_provider' | 'no_api_key' | 'invalid_api_key' | 'invalid_url';
  /** 解密后的 API Key（验证通过时返回） */
  decryptedApiKey?: string;
}

/**
 * 验证提供方配置
 * 统一验证 API Key 和 URL 的有效性
 * @param provider - 提供方配置对象（需包含 apiKey、apiUrl、type）
 * @returns 验证结果
 */
export async function validateProviderConfig(
  provider: { apiKey?: string; apiUrl: string; type: ProviderType } | undefined
): Promise<ProviderValidationResult> {
  // 检查提供方是否存在
  if (!provider) {
    return { valid: false, errorType: 'no_provider' };
  }

  // 检查 API Key 是否存在
  if (!provider.apiKey) {
    return { valid: false, errorType: 'no_api_key' };
  }

  // 解密并验证 API Key
  const decryptedApiKey = await deobfuscateApiKey(provider.apiKey);
  if (!validateApiKey(decryptedApiKey)) {
    return { valid: false, errorType: 'invalid_api_key' };
  }

  // 验证 API URL
  if (!isValidApiUrl(provider.apiUrl, provider.type)) {
    return { valid: false, errorType: 'invalid_url' };
  }

  return { valid: true, decryptedApiKey };
}

/**
 * 获取验证错误的本地化消息
 * @param errorType - 错误类型
 * @param isZh - 是否为中文
 * @returns 错误消息
 */
export function getProviderValidationErrorMessage(
  errorType: ProviderValidationResult['errorType'],
  isZh: boolean
): string {
  switch (errorType) {
    case 'no_provider':
      return isZh ? '提供方未配置' : 'Provider not configured';
    case 'no_api_key':
      return isZh ? 'API Key 未设置' : 'API Key not set';
    case 'invalid_api_key':
      return isZh ? 'API Key 格式无效，请检查设置' : 'Invalid API Key format';
    case 'invalid_url':
      return isZh ? 'API 地址无效，请检查设置' : 'Invalid API URL';
    default:
      return isZh ? '验证失败' : 'Validation failed';
  }
}
