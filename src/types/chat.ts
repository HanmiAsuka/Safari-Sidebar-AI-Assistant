/**
 * 类型定义文件 - 聊天相关类型
 */

/** 聊天消息角色 */
export type MessageRole = 'system' | 'user' | 'assistant';

/** 聊天历史消息 */
export interface ChatMessage {
  /** 消息角色 */
  role: MessageRole;
  /** 消息内容 */
  content: string;
}

/** 用户消息上下文 */
export interface UserMessageContext {
  /** 用户查询内容 */
  query: string;
  /** 选中的文本片段 */
  contexts: string[];
}

/** 流式响应状态 */
export interface StreamState {
  /** 思考内容缓冲 */
  thinkBuffer: string;
  /** Markdown 内容缓冲 */
  mdBuffer: string;
  /** 是否正在思考 */
  isThinking: boolean;
  /** 思考内容 DOM 元素 */
  thinkDiv: HTMLElement | null;
  /** 是否已收到内容 */
  hasReceivedContent: boolean;
}

/** API 请求体 */
export interface ChatRequestBody {
  /** 模型 ID */
  model: string;
  /** 消息列表 */
  messages: ChatMessage[];
  /** 是否流式响应 */
  stream: boolean;
  /** 温度参数 */
  temperature: number;
  /** 思考配置（可选） */
  reasoning?: {
    effort: string;
  };
}

/** API 响应增量 */
export interface StreamDelta {
  /** 内容增量 */
  content?: string;
  /** 推理内容（OpenRouter 格式） */
  reasoning_content?: string;
  /** 推理内容（备选格式） */
  reasoning?: string;
  /** 推理详情（数组格式） */
  reasoning_details?: ReasoningDetail[];
}

/** 推理详情 */
export interface ReasoningDetail {
  type: string;
  text?: string;
  summary?: string;
}

// ============================================
// 摘要相关类型（统一定义）
// ============================================

/** 摘要状态 */
export type SummaryStatus = 'idle' | 'loading' | 'complete' | 'error';

/** 摘要结果 */
export interface SummaryResult {
  /** 摘要状态 */
  status: SummaryStatus;
  /** 摘要内容 */
  content: string | null;
  /** 是否为新生成的摘要 */
  isNew?: boolean;
  /** 错误信息 */
  error?: string;
}

/** 摘要生成回调 */
export interface SummaryCallbacks {
  /** 状态变化时调用 */
  onStatusChange?: (status: SummaryStatus) => void;
  /** 开始生成时调用 */
  onStart?: () => void;
  /** 收到进度时调用 */
  onProgress: (content: string) => void;
  /** 生成完成时调用 */
  onComplete: (content: string) => void;
  /** 发生错误时调用 */
  onError: (error: string) => void;
}
