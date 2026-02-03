/**
 * 聊天消息底部工具栏
 * 负责模型切换和重新生成等操作
 */

import { T } from '@/i18n';
import { getShortModelName } from '@/utils';
import { regenerateIcon, modelIcon } from '@/ui';

/**
 * 消息底部工具栏配置
 */
export interface MessageFooterConfig {
  /** 使用的模型 ID */
  usedModel: string;
  /** 已添加的模型列表 */
  addedModels: string[];
  /** 重新生成回调 */
  onRegenerate: (messageDiv: HTMLElement, model: string) => void;
}

/**
 * 添加消息底部操作栏
 * @param messageDiv - 消息 DOM 元素
 * @param config - 配置选项
 */
export function addMessageFooter(
  messageDiv: HTMLElement,
  config: MessageFooterConfig
): void {
  if (messageDiv.querySelector('.sa-message-footer')) return;

  const { usedModel, addedModels, onRegenerate } = config;

  const footerDiv = document.createElement('div');
  footerDiv.className = 'sa-message-footer';

  const modelBtn = document.createElement('div');
  modelBtn.className = 'sa-msg-btn';
  modelBtn.title = usedModel;
  modelBtn.dataset.model = usedModel;
  modelBtn.innerHTML = `
    ${modelIcon}
    <span class="sa-msg-btn-text">${getShortModelName(usedModel)}</span>
    <span class="sa-msg-btn-arrow">◀</span>
  `;

  const popup = document.createElement('div');
  popup.className = 'sa-msg-btn-popup';
  modelBtn.appendChild(popup);

  modelBtn.onclick = (e) => {
    e.stopPropagation();
    const isOpen = modelBtn.classList.toggle('open');
    modelBtn.querySelector('.sa-msg-btn-arrow')!.textContent = isOpen ? '▼' : '◀';
    if (isOpen) {
      renderModelPopup(popup, modelBtn, messageDiv, addedModels, onRegenerate);
    }
  };

  const regenBtn = document.createElement('div');
  regenBtn.className = 'sa-msg-btn';
  regenBtn.title = T.regenerate;
  regenBtn.innerHTML = `
    ${regenerateIcon}
    <span>${T.regenerate}</span>
  `;
  regenBtn.onclick = () => {
    const currentModel = modelBtn.dataset.model!;
    onRegenerate(messageDiv, currentModel);
  };

  footerDiv.appendChild(modelBtn);
  footerDiv.appendChild(regenBtn);
  messageDiv.appendChild(footerDiv);
}

/**
 * 渲染消息模型切换弹出菜单
 */
function renderModelPopup(
  popup: HTMLElement,
  modelBtn: HTMLElement,
  messageDiv: HTMLElement,
  addedModels: string[],
  onRegenerate: (messageDiv: HTMLElement, model: string) => void
): void {
  if (addedModels.length === 0) {
    popup.innerHTML = `<div class="sa-model-dropdown-empty">${T.noModelsAdded}</div>`;
    return;
  }

  const currentModel = modelBtn.dataset.model;
  popup.innerHTML = addedModels
    .map(
      (id) =>
        `<div class="sa-msg-btn-option ${id === currentModel ? 'selected' : ''}" data-model="${id}">${getShortModelName(id)}</div>`
    )
    .join('');

  popup.querySelectorAll('.sa-msg-btn-option').forEach((item) => {
    (item as HTMLElement).onclick = (e) => {
      e.stopPropagation();
      const newModel = (item as HTMLElement).dataset.model!;
      modelBtn.dataset.model = newModel;
      modelBtn.querySelector('.sa-msg-btn-text')!.textContent = getShortModelName(newModel);
      modelBtn.title = newModel;
      modelBtn.classList.remove('open');
      modelBtn.querySelector('.sa-msg-btn-arrow')!.textContent = '◀';
      onRegenerate(messageDiv, newModel);
    };
  });
}
