import type { I18NText } from '@/types';

/** 中文文本 */
export const zh: I18NText = {
  title: 'AI 助手',
  appendMode: '追加模式',
  clear: '清空对话',
  clearConfirm: '清空消息？',
  settings: '设置',
  close: '关闭',
  back: '返回',
  welcome: '<p>Hi! 按 <code>Ctrl + X</code> 唤出。</p><p><b>提示：</b> 按住 <code>x</code> 键选文可多选。</p>',
  placeholder: '输入问题 (空内容将直接解释选文)...',
  save: '保存配置',
  saved: '已保存',
  saving: '正在保存...',
  aborted: '— 已中断 —',
  noResponse: '未收到响应',
  storageWarn: '警告：当前环境不支持异步 GM API，功能可能受限。',
  labels: {
    apiKey: 'API Key',
    model: '模型',
    temp: '温度 (Temperature)',
    prompt: '系统提示词',
    theme: '主题',
    url: 'API 地址',
    provider: '模型提供方'
  },
  themeOpts: {
    auto: '自动 (跟随系统)',
    dark: '深色',
    light: '浅色'
  },
  prompts: {
    defaultSys: '你是一个有用的AI助手。请用中文简洁回答。',
    defaultSummary: `你是一个网页内容提取专家。请对以下网页内容进行精炼摘要，为AI助手提供有效的上下文信息。

重要规则：
1. **只提取有意义的文本内容**：忽略代码片段、文件列表、技术性重复内容、菜单项列表
2. **严格控制长度**：摘要应控制在 500-1000 字以内
3. **过滤噪音**：跳过导航菜单、页脚链接、广告内容、技术性元数据
4. **聚焦核心**：只保留文章主体、产品描述、用户评论等主要内容

输出格式：
## 页面类型
简要描述（如：技术文档、新闻文章、产品页面、代码仓库等）

## 核心内容
用 2-5 句话概括页面主要内容

## 关键要点
- 最重要的 3-5 个信息点
- 每条控制在一行内

注意：如果页面是代码仓库（如 GitHub），只需说明项目名称、简要描述和主要功能，不要列出文件名或代码内容。`,
    explain: '请解释这段内容：',
    explainMulti: '请解释这些内容：',
    ref: '引用内容',
    block: '选段'
  },
  thinking: '深度思考',
  thinkingInProgress: '正在思考',
  waitingAI: 'AI 正在思考中',
  deepThink: '思考',
  deepThinkTip: '点击选择思考强度',
  thinkingLevels: {
    none: '默认',
    low: '轻度',
    medium: '中度',
    high: '深度'
  },
  thinkingLevelDesc: {
    none: '由模型自行决定',
    low: '简单推理',
    medium: '适中推理',
    high: '深度推理分析'
  },
  regenerate: '重新生成',
  clearContext: '清除上下文',
  clearContextTip: '清除上下文，保留聊天记录',
  contextCleared: '— 上下文已清除 —',
  menu: '打开/关闭 AI 助手',
  modelManage: '管理模型',
  manage: '管理',
  modelList: '模型列表',
  modelListUrl: '模型列表 API',
  addModel: '添加',
  removeModel: '移除',
  removeAll: '移除全部',
  addedModels: '已添加的模型',
  deprecatedModels: '以下模型可能已弃用',
  loadingModels: '正在加载模型列表...',
  loadModelsFailed: '加载模型列表失败',
  noModelsAdded: '尚未添加任何模型',
  clickManageToAdd: '请点击「管理」添加模型',
  switchModel: '切换模型',
  currentModel: '当前模型',
  searchModels: '搜索模型...',
  reset: '重置',

  // 设置分组
  systemSettings: '系统设置',
  chatModelSettings: '对话模型设置',
  summaryModelSettings: '摘要模型设置',

  // 提供方管理
  providerManage: '提供方管理',
  provider: '提供方',
  providerName: '名称',
  providerType: '类型',
  addProvider: '添加提供方',
  deleteProvider: '删除',
  saveProvider: '保存',
  noProviders: '尚未添加任何提供方',
  defaultProviderName: 'OpenRouter',
  providerTypes: {
    openrouter: 'OpenRouter',
    openai: 'OpenAI',
    aihubmix: 'AIHubMix',
    custom: '自定义'
  },
  defaultModel: '默认模型',
  providerValidation: {
    nameRequired: '请输入提供方名称',
    apiKeyRequired: '请输入 API Key',
    defaultModelRequired: '请选择默认模型'
  },

  // 摘要功能
  enableSummary: '启用摘要',
  summaryPrompt: '摘要提示词',
  summarizing: 'AI 正在生成网页摘要',
  summaryComplete: '摘要完成',
  summaryFailed: '摘要生成失败',
  summaryErrorPrefix: '错误原因：',
  pageSummary: '页面摘要',
  clickToViewSummary: '点击查看摘要内容',
  errors: {
    requestFailed: '请求失败',
    networkError: '网络连接错误',
    timeout: '请求超时',
    requestCancelled: '请求已取消',
    invalidApiKey: 'API Key 无效或已过期',
    accessDenied: '访问被拒绝',
    apiNotFound: 'API 地址不存在',
    rateLimit: '请求过于频繁，请稍后再试',
    serverError: '服务器错误，请稍后再试'
  }
};
