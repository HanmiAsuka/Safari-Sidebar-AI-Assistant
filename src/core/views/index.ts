/**
 * Views 模块入口
 */

export { BaseView, type ViewHost } from './base-view';
export { SettingsView, type SettingsViewHost } from './settings-view';
export { ModelsView, type ModelsViewHost } from './models-view';
export { ChatView, type ChatViewHost } from './chat-view';
export { ProvidersView, type ProvidersViewHost } from './providers-view';

// 聊天相关子模块
export { SelectionManager, renderChips } from './selection-manager';
export { addMessageFooter, type MessageFooterConfig } from './chat-footer';
export * from './chat-renderer';
