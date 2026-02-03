/**
 * 类型定义文件 - 配置相关类型
 */

/** 提供方类型 */
export type ProviderType = 'openrouter' | 'openai' | 'aihubmix' | 'custom';

/** 提供方配置 */
export interface ProviderConfig {
  /** 唯一 ID */
  id: string;
  /** 用户自定义名称 */
  name: string;
  /** 提供方类型 */
  type: ProviderType;
  /** API 密钥（混淆存储） */
  apiKey: string;
  /** API 请求地址 */
  apiUrl: string;
  /** 模型列表 API 地址 */
  modelsApiUrl: string;
  /** 默认模型 ID（切换提供方时自动选择的模型） */
  defaultModel?: string;
}

/** 用户设置配置 */
export interface Settings {
  /** 主题设置: auto | dark | light */
  theme: ThemeType;

  // ========== 对话模型设置 ==========
  /** 对话模型提供方 ID */
  chatProviderId: string;
  /** 对话模型 ID */
  chatModel: string;
  /** 对话模型温度参数 (0-2) */
  chatTemperature: number;
  /** 对话系统提示词 */
  chatSystemPrompt: string;
  /** 思考强度: none | low | medium | high */
  thinkingLevel: ThinkingLevel;

  // ========== 摘要模型设置 ==========
  /** 是否启用摘要功能 */
  summaryEnabled: boolean;
  /** 摘要模型提供方 ID */
  summaryProviderId: string;
  /** 摘要模型 ID */
  summaryModel: string;
  /** 摘要模型温度参数 (0-2) */
  summaryTemperature: number;
  /** 摘要系统提示词 */
  summarySystemPrompt: string;
}

/** 主题类型 */
export type ThemeType = 'auto' | 'dark' | 'light';

/** 思考强度级别 */
export type ThinkingLevel = 'none' | 'low' | 'medium' | 'high';

/** 应用配置常量 */
export interface AppConfig {
  /** 默认 API 地址 */
  DEFAULT_API_URL: string;
  /** 默认模型列表 API 地址 */
  DEFAULT_MODELS_API_URL: string;
  /** 默认模型 */
  DEFAULT_MODEL: string;
  /** 默认摘要模型 */
  DEFAULT_SUMMARY_MODEL: string;
  /** 默认对话温度 */
  DEFAULT_CHAT_TEMP: number;
  /** 默认摘要温度 */
  DEFAULT_SUMMARY_TEMP: number;
  /** 侧边栏宽度 */
  SIDEBAR_WIDTH: string;
  /** 设置存储键名 */
  STORAGE_KEY: string;
  /** 提供方存储键名 */
  PROVIDERS_STORAGE_KEY: string;
  /** 模型存储键名前缀（后接 providerId） */
  MODELS_STORAGE_PREFIX: string;
  /** 最大聊天历史条数 */
  MAX_CHAT_HISTORY: number;
  /** 请求超时时间（毫秒） */
  REQUEST_TIMEOUT: number;
  /** 最大选中文本队列长度 */
  MAX_SELECTION_QUEUE: number;
  /** 选中文本最大长度 */
  MAX_SELECTION_LENGTH: number;
  /** 用户输入最大长度 */
  MAX_INPUT_LENGTH: number;
  /** 系统提示词最大长度 */
  MAX_SYSTEM_PROMPT_LENGTH: number;
  /** 页面内容最大长度 */
  MAX_PAGE_CONTENT_LENGTH: number;
  /** 摘要内容最大长度 */
  MAX_SUMMARY_CONTENT_LENGTH: number;
  /** 滚动节流延迟（毫秒） */
  SCROLL_THROTTLE_DELAY: number;
  /** 滚动到底部阈值（像素） */
  SCROLL_BOTTOM_THRESHOLD: number;
  /** Chip 预览文本最大长度 */
  CHIP_PREVIEW_LENGTH: number;
  /** 安全相关配置 */
  SECURITY: {
    /** 允许的 API 域名白名单 */
    ALLOWED_HOSTS: string[];
    /** 禁止的 API 域名黑名单 */
    BLOCKED_HOSTS: string[];
    /** 敏感 URL 参数列表 */
    SENSITIVE_PARAMS: string[];
    /** 加密密钥存储键名 */
    ENCRYPTION_KEY_STORAGE: string;
  };
  /** 内容管理相关配置 */
  CONTENT: {
    /** 内容变化阈值 */
    CHANGE_THRESHOLD: number;
    /** 采样数量 */
    SAMPLE_COUNT: number;
  };
}

/** 模型信息 */
export interface ModelInfo {
  /** 模型 ID */
  id: string;
  /** 模型名称 */
  name: string;
}
