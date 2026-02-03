/**
 * 模型相关工具函数
 * 处理模型 ID 的格式化和显示
 */

/**
 * 从完整模型 ID 提取短名称
 * 例如：'openai/gpt-4' -> 'gpt-4'
 *
 * @param modelId - 完整的模型 ID（可能包含供应商前缀）
 * @returns 短模型名称
 *
 * @example
 * getShortModelName('openai/gpt-4') // 'gpt-4'
 * getShortModelName('gpt-4')        // 'gpt-4'
 * getShortModelName('')             // ''
 */
export function getShortModelName(modelId: string): string {
  if (!modelId) return '';
  const parts = modelId.split('/');
  return parts.length > 1 ? parts[1] : modelId;
}
