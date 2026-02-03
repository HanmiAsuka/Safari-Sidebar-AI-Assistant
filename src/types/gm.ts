/**
 * 类型定义文件 - GM API 相关类型
 */

/** GM 请求配置 */
export interface GMRequestDetails {
  /** 请求方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 请求 URL */
  url: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体数据 */
  data?: string;
  /** 加载回调 */
  onload?: (response: GMResponse) => void;
  /** 错误回调 */
  onerror?: (error: unknown) => void;
  /** 状态变化回调 */
  onreadystatechange?: (response: GMResponse) => void;
}

/** GM 响应对象 */
export interface GMResponse {
  /** 就绪状态 */
  readyState: number;
  /** HTTP 状态码 */
  status: number;
  /** 状态文本 */
  statusText?: string;
  /** 响应文本 */
  responseText: string;
}

/** GM 请求控制器 */
export interface GMRequestController {
  /** 中止请求 */
  abort: () => void;
}

/** GM API 接口 */
export interface GMAPI {
  getValue<T>(key: string, defaultValue: T): Promise<T>;
  setValue<T>(key: string, value: T): Promise<void>;
  registerMenuCommand(caption: string, callback: () => void): void;
  xmlHttpRequest(details: GMRequestDetails): GMRequestController;
}

/** 全局 marked 库类型 */
export interface MarkedRenderer {
  link: (href: string, title: string | null, text: string) => string;
  image: (href: string, title: string | null, text: string) => string;
}

export interface MarkedOptions {
  renderer?: MarkedRenderer;
  headerIds?: boolean;
  mangle?: boolean;
  breaks?: boolean;
  gfm?: boolean;
}

export interface MarkedStatic {
  Renderer: new () => MarkedRenderer;
  parse(markdown: string): string;
  setOptions(options: MarkedOptions): void;
}

/** KaTeX 库类型 */
export interface KaTeXStatic {
  renderToString(tex: string, options?: KaTeXOptions): string;
}

export interface KaTeXOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
  trust?: boolean;
  strict?: boolean | string;
}
