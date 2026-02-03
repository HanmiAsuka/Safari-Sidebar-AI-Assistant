/**
 * 应用配置常量模块
 */

import type { AppConfig, Settings, ThinkingLevel, ProviderConfig } from '@/types';
import { T } from '@/i18n';

/** 应用配置常量 */
export const CONFIG: AppConfig = {
  /** 默认 API 地址 */
  DEFAULT_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  /** 默认模型列表 API 地址 */
  DEFAULT_MODELS_API_URL: 'https://openrouter.ai/api/v1/models',
  /** 默认模型 */
  DEFAULT_MODEL: 'deepseek/deepseek-r1',
  /** 默认摘要模型 */
  DEFAULT_SUMMARY_MODEL: 'google/gemini-2.0-flash-exp:free',
  /** 默认对话温度 */
  DEFAULT_CHAT_TEMP: 0.7,
  /** 默认摘要温度 */
  DEFAULT_SUMMARY_TEMP: 0.7,
  /** 侧边栏宽度 */
  SIDEBAR_WIDTH: '450px',
  /** 设置存储键名 */
  STORAGE_KEY: 'settings_v1',
  /** 提供方存储键名 */
  PROVIDERS_STORAGE_KEY: 'providers_v1',
  /** 模型存储键名前缀 */
  MODELS_STORAGE_PREFIX: 'models_',
  /** 最大聊天历史条数 */
  MAX_CHAT_HISTORY: 50,
  /** 请求超时时间（毫秒） */
  REQUEST_TIMEOUT: 60000,
  /** 最大选中文本队列长度 */
  MAX_SELECTION_QUEUE: 5,
  /** 选中文本最大长度 */
  MAX_SELECTION_LENGTH: 2000,
  /** 用户输入最大长度 */
  MAX_INPUT_LENGTH: 1000,
  /** 系统提示词最大长度 */
  MAX_SYSTEM_PROMPT_LENGTH: 5000,
  /** 页面内容最大长度 */
  MAX_PAGE_CONTENT_LENGTH: 15000,
  /** 摘要内容最大长度 */
  MAX_SUMMARY_CONTENT_LENGTH: 20000,
  /** 滚动节流延迟（毫秒） */
  SCROLL_THROTTLE_DELAY: 16,
  /** 滚动到底部阈值（像素） */
  SCROLL_BOTTOM_THRESHOLD: 150,
  /** Chip 预览文本最大长度 */
  CHIP_PREVIEW_LENGTH: 600,
  /** 安全相关配置 */
  SECURITY: {
    /** 允许的 API 域名白名单 */
    ALLOWED_HOSTS: ['openrouter.ai', 'api.openai.com', 'aihubmix.com'],
    /** 禁止的 API 域名黑名单 */
    BLOCKED_HOSTS: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '192.168.',
      '10.',
      '172.16.',
      '172.17.',
      '172.18.',
      '172.19.',
      '172.20.',
      '172.21.',
      '172.22.',
      '172.23.',
      '172.24.',
      '172.25.',
      '172.26.',
      '172.27.',
      '172.28.',
      '172.29.',
      '172.30.',
      '172.31.'
    ],
    /** 敏感 URL 参数列表 */
    SENSITIVE_PARAMS: [
      'token', 'key', 'api_key', 'apikey', 'secret',
      'password', 'pass', 'pwd', 'session', 'sessionid',
      'auth', 'access_token', 'refresh_token', 'code', 'state', 'nonce'
    ],
    /** 加密密钥存储键名 */
    ENCRYPTION_KEY_STORAGE: 'sa_encryption_key'
  },
  /** 内容管理相关配置 */
  CONTENT: {
    /** 内容变化阈值 */
    CHANGE_THRESHOLD: 0.2,
    /** 采样数量 */
    SAMPLE_COUNT: 10
  }
};

/** 默认提供方 ID */
export const DEFAULT_PROVIDER_ID = 'default_openrouter';

/**
 * 获取默认提供方配置
 * @returns 默认的 OpenRouter 提供方配置
 */
export function getDefaultProvider(): ProviderConfig {
  return {
    id: DEFAULT_PROVIDER_ID,
    name: 'OpenRouter',
    type: 'openrouter',
    apiKey: '',
    apiUrl: CONFIG.DEFAULT_API_URL,
    modelsApiUrl: CONFIG.DEFAULT_MODELS_API_URL,
    defaultModel: 'openrouter/auto'
  };
}

/**
 * 获取默认设置
 * 系统提示词根据当前语言自动调整
 * @returns 默认设置对象
 */
export function getDefaultSettings(): Settings {
  return {
    // 系统设置
    theme: 'auto',

    // 对话模型设置
    chatProviderId: DEFAULT_PROVIDER_ID,
    chatModel: CONFIG.DEFAULT_MODEL,
    chatTemperature: CONFIG.DEFAULT_CHAT_TEMP,
    chatSystemPrompt: T.prompts.defaultSys,
    thinkingLevel: 'none' as ThinkingLevel,

    // 摘要模型设置
    summaryEnabled: false,
    summaryProviderId: DEFAULT_PROVIDER_ID,
    summaryModel: CONFIG.DEFAULT_SUMMARY_MODEL,
    summaryTemperature: CONFIG.DEFAULT_SUMMARY_TEMP,
    summarySystemPrompt: T.prompts.defaultSummary
  };
}
