/**
 * 滚动控制模块
 * 负责聊天列表的滚动行为
 */

import { CONFIG } from '@/config';

/**
 * 滚动控制器类
 * 提供节流滚动和智能底部检测
 */
export class ScrollController {
  private scrollThrottle: ReturnType<typeof setTimeout> | null = null;
  private chatList: HTMLElement | null = null;

  /**
   * 设置聊天列表元素
   */
  setTarget(chatList: HTMLElement): void {
    this.chatList = chatList;
  }

  /**
   * 滚动到底部
   * @param force - 是否强制滚动（忽略位置检测）
   */
  scrollToBottom(force = false): void {
    if (this.scrollThrottle) {
      clearTimeout(this.scrollThrottle);
    }

    this.scrollThrottle = setTimeout(() => {
      try {
        if (!this.chatList) return;

        if (force) {
          this.chatList.scrollTo({
            top: this.chatList.scrollHeight,
            behavior: 'instant'
          });
        } else {
          const isNearBottom =
            this.chatList.scrollHeight -
              this.chatList.scrollTop -
              this.chatList.clientHeight <=
            CONFIG.SCROLL_BOTTOM_THRESHOLD;
          if (isNearBottom) {
            this.chatList.scrollTo({
              top: this.chatList.scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      } catch (error) {
        console.warn('Scroll error:', error);
      }
    }, CONFIG.SCROLL_THROTTLE_DELAY);
  }

  /**
   * 销毁滚动控制器
   */
  destroy(): void {
    if (this.scrollThrottle) {
      clearTimeout(this.scrollThrottle);
      this.scrollThrottle = null;
    }
    this.chatList = null;
  }
}
