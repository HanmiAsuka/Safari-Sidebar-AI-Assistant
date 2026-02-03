import type { I18NText } from '@/types';

/** 英文文本 */
export const en: I18NText = {
  title: 'AI Assistant',
  appendMode: 'Append Mode',
  clear: 'Clear Chat',
  clearConfirm: 'Clear all messages?',
  settings: 'Settings',
  close: 'Close',
  back: 'Back',
  welcome: '<p>Hi! Press <code>Ctrl + X</code> to toggle.</p><p><b>Tip:</b> Hold <code>x</code> key to select multiple texts.</p>',
  placeholder: 'Ask a question (Empty input will explain selection)...',
  save: 'Save Settings',
  saved: 'Saved',
  saving: 'Saving...',
  aborted: '— Aborted —',
  noResponse: 'No response received',
  storageWarn: 'Warning: Async GM API not supported here.',
  labels: {
    apiKey: 'API Key',
    model: 'Model',
    temp: 'Temperature',
    prompt: 'System Prompt',
    theme: 'Theme',
    url: 'API URL',
    provider: 'Provider'
  },
  themeOpts: {
    auto: 'Auto (System)',
    dark: 'Dark',
    light: 'Light'
  },
  prompts: {
    defaultSys: 'You are a helpful AI assistant. Answer concisely.',
    defaultSummary: `You are a webpage content extraction expert. Please create a concise summary of the following webpage content to provide effective context for an AI assistant.

Important rules:
1. **Extract only meaningful text**: Ignore code snippets, file listings, technical repetitive content, menu item lists
2. **Strict length control**: Summary should be 500-1000 words maximum
3. **Filter noise**: Skip navigation menus, footer links, ads, technical metadata
4. **Focus on core**: Only keep article body, product descriptions, user comments, and main content

Output format:
## Page Type
Brief description (e.g., technical docs, news article, product page, code repository)

## Core Content
Summarize main content in 2-5 sentences

## Key Points
- Top 3-5 most important information points
- Keep each point to one line

Note: For code repositories (like GitHub), only describe project name, brief description, and main features - do not list filenames or code content.`,
    explain: 'Please explain this content:',
    explainMulti: 'Please explain these contents:',
    ref: 'References',
    block: 'Block'
  },
  thinking: 'Deep Thinking',
  thinkingInProgress: 'Thinking',
  waitingAI: 'AI is thinking',
  deepThink: 'Think',
  deepThinkTip: 'Click to select thinking level',
  thinkingLevels: {
    none: 'Auto',
    low: 'Light',
    medium: 'Medium',
    high: 'Deep'
  },
  thinkingLevelDesc: {
    none: 'Decided by the Model',
    low: 'Simple reasoning',
    medium: 'Moderate reasoning',
    high: 'Deep reasoning analysis'
  },
  regenerate: 'Regenerate',
  clearContext: 'Clear Context',
  clearContextTip: 'Clear context while keeping chat history',
  contextCleared: '— Context Cleared —',
  menu: 'Toggle AI Sidebar',
  modelManage: 'Manage Models',
  manage: 'Manage',
  modelList: 'Model List',
  modelListUrl: 'Models API URL',
  addModel: 'Add',
  removeModel: 'Remove',
  removeAll: 'Remove All',
  addedModels: 'Added Models',
  deprecatedModels: 'These models may be deprecated',
  loadingModels: 'Loading models...',
  loadModelsFailed: 'Failed to load models',
  noModelsAdded: 'No models added yet',
  clickManageToAdd: "Click 'Manage' to add models",
  switchModel: 'Switch Model',
  currentModel: 'Current Model',
  searchModels: 'Search models...',
  reset: 'Reset',

  // Settings sections
  systemSettings: 'System Settings',
  chatModelSettings: 'Chat Model Settings',
  summaryModelSettings: 'Summary Model Settings',

  // Provider management
  providerManage: 'Provider Management',
  provider: 'Provider',
  providerName: 'Name',
  providerType: 'Type',
  addProvider: 'Add Provider',
  deleteProvider: 'Delete',
  saveProvider: 'Save',
  noProviders: 'No providers added yet',
  defaultProviderName: 'OpenRouter',
  providerTypes: {
    openrouter: 'OpenRouter',
    openai: 'OpenAI',
    aihubmix: 'AIHubMix',
    custom: 'Custom'
  },
  defaultModel: 'Default Model',
  providerValidation: {
    nameRequired: 'Please enter provider name',
    apiKeyRequired: 'Please enter API Key',
    defaultModelRequired: 'Please select a default model'
  },

  // Summary feature
  enableSummary: 'Enable Summary',
  summaryPrompt: 'Summary Prompt',
  summarizing: 'AI is generating page summary',
  summaryComplete: 'Summary complete',
  summaryFailed: 'Summary generation failed',
  summaryErrorPrefix: 'Error: ',
  pageSummary: 'Page Summary',
  clickToViewSummary: 'Click to view summary',
  errors: {
    requestFailed: 'Request failed',
    networkError: 'Network connection error',
    timeout: 'Request timeout',
    requestCancelled: 'Request cancelled',
    invalidApiKey: 'Invalid or expired API Key',
    accessDenied: 'Access denied',
    apiNotFound: 'API endpoint not found',
    rateLimit: 'Rate limited, please try again later',
    serverError: 'Server error, please try again later'
  }
};
