/**
 * 翻译文本接口定义
 */

export interface I18NText {
  /** 标题 */
  title: string;
  /** 追加模式 */
  appendMode: string;
  /** 清空对话 */
  clear: string;
  /** 清空确认 */
  clearConfirm: string;
  /** 设置 */
  settings: string;
  /** 关闭 */
  close: string;
  /** 返回 */
  back: string;
  /** 欢迎消息 */
  welcome: string;
  /** 输入占位符 */
  placeholder: string;
  /** 保存配置 */
  save: string;
  /** 已保存 */
  saved: string;
  /** 正在保存 */
  saving: string;
  /** 已中断 */
  aborted: string;
  /** 无响应 */
  noResponse: string;
  /** 存储警告 */
  storageWarn: string;
  /** 标签文本 */
  labels: {
    apiKey: string;
    model: string;
    temp: string;
    prompt: string;
    theme: string;
    url: string;
    provider: string;
  };
  /** 主题选项 */
  themeOpts: {
    auto: string;
    dark: string;
    light: string;
  };
  /** 提示词 */
  prompts: {
    defaultSys: string;
    defaultSummary: string;
    explain: string;
    explainMulti: string;
    ref: string;
    block: string;
  };
  /** 深度思考 */
  thinking: string;
  /** 正在思考 */
  thinkingInProgress: string;
  /** AI 正在思考中 */
  waitingAI: string;
  /** 思考按钮文本 */
  deepThink: string;
  /** 思考提示 */
  deepThinkTip: string;
  /** 思考级别 */
  thinkingLevels: {
    none: string;
    low: string;
    medium: string;
    high: string;
  };
  /** 思考级别描述 */
  thinkingLevelDesc: {
    none: string;
    low: string;
    medium: string;
    high: string;
  };
  /** 重新生成 */
  regenerate: string;
  /** 清除上下文 */
  clearContext: string;
  /** 清除上下文提示 */
  clearContextTip: string;
  /** 上下文已清除 */
  contextCleared: string;
  /** 菜单文本 */
  menu: string;
  /** 模型管理 */
  modelManage: string;
  /** 管理 */
  manage: string;
  /** 模型列表 */
  modelList: string;
  /** 模型列表 API */
  modelListUrl: string;
  /** 添加 */
  addModel: string;
  /** 移除 */
  removeModel: string;
  /** 移除全部 */
  removeAll: string;
  /** 已添加的模型 */
  addedModels: string;
  /** 弃用模型提示 */
  deprecatedModels: string;
  /** 加载模型列表 */
  loadingModels: string;
  /** 加载失败 */
  loadModelsFailed: string;
  /** 无模型 */
  noModelsAdded: string;
  /** 点击管理添加 */
  clickManageToAdd: string;
  /** 切换模型 */
  switchModel: string;
  /** 当前模型 */
  currentModel: string;
  /** 搜索模型 */
  searchModels: string;
  /** 重置 */
  reset: string;

  // ========== 设置分组 ==========
  /** 系统设置 */
  systemSettings: string;
  /** 对话模型设置 */
  chatModelSettings: string;
  /** 摘要模型设置 */
  summaryModelSettings: string;

  // ========== 提供方管理 ==========
  /** 提供方管理 */
  providerManage: string;
  /** 提供方 */
  provider: string;
  /** 提供方名称 */
  providerName: string;
  /** 提供方类型 */
  providerType: string;
  /** 添加提供方 */
  addProvider: string;
  /** 删除提供方 */
  deleteProvider: string;
  /** 保存提供方 */
  saveProvider: string;
  /** 无提供方 */
  noProviders: string;
  /** 默认提供方名称 */
  defaultProviderName: string;
  /** 提供方类型选项 */
  providerTypes: {
    openrouter: string;
    openai: string;
    aihubmix: string;
    custom: string;
  };
  /** 默认模型 */
  defaultModel: string;
  /** 提供方验证提示 */
  providerValidation: {
    nameRequired: string;
    apiKeyRequired: string;
    defaultModelRequired: string;
  };

  // ========== 摘要功能 ==========
  /** 启用摘要 */
  enableSummary: string;
  /** 摘要提示词 */
  summaryPrompt: string;
  /** AI 正在摘要 */
  summarizing: string;
  /** 摘要完成 */
  summaryComplete: string;
  /** 摘要失败 */
  summaryFailed: string;
  /** 摘要错误前缀 */
  summaryErrorPrefix: string;
  /** 页面摘要 */
  pageSummary: string;
  /** 点击查看摘要 */
  clickToViewSummary: string;
  /** 错误信息 */
  errors: {
    requestFailed: string;
    networkError: string;
    timeout: string;
    requestCancelled: string;
    invalidApiKey: string;
    accessDenied: string;
    apiNotFound: string;
    rateLimit: string;
    serverError: string;
  };
}
