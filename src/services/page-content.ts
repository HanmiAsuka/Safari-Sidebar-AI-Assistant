/**
 * 页面内容管理器
 * 负责提取、缓存和检测网页内容变化
 */

import * as Security from '../utils/security';

/** 内容哈希结构 */
interface ContentHash {
  length: number;
  samples: string;
}

/** 页面内容缓存 */
interface PageContentCache {
  url: string;
  hash: ContentHash;
  content: string;
  summary: string | null;
  timestamp: number;
}

/**
 * 页面内容管理器类
 * 使用轻量级哈希检测内容变化，避免重复摘要
 */
export class PageContentManager {
  private cache: PageContentCache | null = null;

  /** 内容变化阈值（20%） */
  private readonly CHANGE_THRESHOLD = 0.2;

  /** 采样间隔 */
  private readonly SAMPLE_INTERVAL = 100;

  /** 采样数量 */
  private readonly SAMPLE_COUNT = 10;

  /**
   * 获取当前页面内容
   * @param maxLength - 最大内容长度
   * @returns 页面内容
   */
  getPageContent(maxLength: number = 15000): string {
    return Security.smartTruncateContent(document.body.innerText, maxLength);
  }

  /**
   * 计算内容的轻量级哈希
   * 使用长度 + 采样字符
   */
  private calculateHash(content: string): ContentHash {
    const samples: string[] = [];
    const interval = Math.floor(content.length / this.SAMPLE_COUNT) || 1;

    for (let i = 0; i < this.SAMPLE_COUNT && i * interval < content.length; i++) {
      const pos = i * interval;
      samples.push(content.charAt(pos));
    }

    return {
      length: content.length,
      samples: samples.join('')
    };
  }

  /**
   * 检测内容是否发生显著变化
   * @param oldHash - 旧哈希
   * @param newHash - 新哈希
   * @returns 是否变化超过阈值
   */
  private hasSignificantChange(oldHash: ContentHash, newHash: ContentHash): boolean {
    // 长度变化超过阈值
    const lengthChange = Math.abs(newHash.length - oldHash.length) / Math.max(oldHash.length, 1);
    if (lengthChange > this.CHANGE_THRESHOLD) {
      return true;
    }

    // 采样字符不同的比例超过阈值
    let differentCount = 0;
    const minLen = Math.min(oldHash.samples.length, newHash.samples.length);
    for (let i = 0; i < minLen; i++) {
      if (oldHash.samples[i] !== newHash.samples[i]) {
        differentCount++;
      }
    }

    const sampleChange = differentCount / Math.max(minLen, 1);
    return sampleChange > this.CHANGE_THRESHOLD;
  }

  /**
   * 检查是否需要重新生成摘要
   * @returns 是否需要重新摘要
   */
  needsResummarize(): boolean {
    const currentUrl = Security.getSafeUrl();

    // 没有缓存
    if (!this.cache) {
      return true;
    }

    // URL 变化
    if (this.cache.url !== currentUrl) {
      return true;
    }

    // 内容变化检测
    const currentContent = this.getPageContent();
    const currentHash = this.calculateHash(currentContent);

    return this.hasSignificantChange(this.cache.hash, currentHash);
  }

  /**
   * 获取缓存的摘要
   * @returns 缓存的摘要，如果没有返回 null
   */
  getCachedSummary(): string | null {
    if (this.needsResummarize()) {
      return null;
    }
    return this.cache?.summary || null;
  }

  /**
   * 更新缓存
   * @param summary - 新的摘要内容
   */
  updateCache(summary: string): void {
    const content = this.getPageContent();
    this.cache = {
      url: Security.getSafeUrl(),
      hash: this.calculateHash(content),
      content,
      summary,
      timestamp: Date.now()
    };
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * 获取缓存的原始内容
   */
  getCachedContent(): string | null {
    return this.cache?.content || null;
  }
}

/** 默认实例 */
export const pageContentManager = new PageContentManager();
