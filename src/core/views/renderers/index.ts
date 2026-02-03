/**
 * 聊天消息渲染器统一导出
 * 从各个子模块重新导出所有渲染函数
 */

// 用户消息
export { renderUserMessage } from './user-message';

// AI 消息气泡
export {
  createAIBubble,
  createAIBubbleEmpty,
  addLoadingIndicator,
  removeLoadingIndicator,
  createMarkdownContainer,
  updateMarkdownContent,
  showNoResponseMessage,
  createErrorElement,
  createAbortedIndicator,
  createContextDivider
} from './ai-bubble';

// 思考块
export {
  createThinkingBlock,
  finishThinking,
  updateThinkingContent
} from './thinking-block';

// 摘要块
export {
  createSummaryBlock,
  updateSummaryContent,
  finishSummary,
  showSummaryError
} from './summary-block';
