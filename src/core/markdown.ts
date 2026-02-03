/**
 * Markdown 配置模块
 * 配置 marked 库的安全渲染器
 * 支持 LaTeX 数学公式渲染
 */

import { escapeHtml } from '@/utils';
import type { MarkedStatic, MarkedRenderer, KaTeXStatic } from '@/types';

// 声明全局变量
declare const marked: MarkedStatic | undefined;
declare const katex: KaTeXStatic | undefined;

/**
 * 配置 Marked 渲染器以增强安全性
 * 主要防止 XSS 攻击：
 * - 过滤危险协议（javascript:, vbscript:, data:）
 * - 为外部链接添加安全属性
 * - 安全处理图片标签
 */
export function configureMarked(): void {
  if (typeof marked === 'undefined') {
    console.warn('Marked library not loaded');
    return;
  }

  const renderer = new marked.Renderer();

  // 保存原始链接渲染方法
  const originalLinkRenderer = renderer.link.bind(renderer);

  /**
   * 安全处理链接 - 防止 javascript: 等危险协议
   */
  renderer.link = function (href: string, title: string | null, text: string): string {
    if (href) {
      const hrefLower = href.toLowerCase().trim();
      // 检查危险协议
      if (
        hrefLower.startsWith('javascript:') ||
        hrefLower.startsWith('vbscript:') ||
        hrefLower.startsWith('data:text/html')
      ) {
        return text || href;
      }
    }

    const link = originalLinkRenderer(href, title, text);
    // 为外部链接添加安全属性
    return link.replace('<a ', '<a target="_blank" rel="noopener noreferrer" ');
  };

  /**
   * 安全处理图片 - 防止 onerror 等事件注入
   */
  renderer.image = function (href: string, title: string | null, text: string): string {
    if (href) {
      const hrefLower = href.toLowerCase().trim();
      if (hrefLower.startsWith('javascript:') || hrefLower.startsWith('data:text/html')) {
        return text || '';
      }
    }

    const escapedHref = escapeHtml(href || '');
    const escapedTitle = escapeHtml(title || '');
    const escapedText = escapeHtml(text || '');

    return `<img src="${escapedHref}" alt="${escapedText}" title="${escapedTitle}" style="max-width:100%">`;
  };

  // 应用配置
  marked.setOptions({
    renderer: renderer as MarkedRenderer,
    headerIds: false,
    mangle: false,
    breaks: true,
    gfm: true
  });
}

/**
 * 安全解析 Markdown 内容
 * @param content - Markdown 文本
 * @returns 解析后的 HTML
 */
export function parseMarkdown(content: string): string {
  if (typeof marked === 'undefined') {
    console.warn('Marked library not loaded, returning plain text');
    return escapeHtml(content);
  }

  try {
    // 先提取 LaTeX 公式，保存到数组中
    const latexBlocks: Array<{ html: string; isBlock: boolean }> = [];
    let processed = content;

    // 生成唯一的占位符 ID
    const placeholderId = `LATEX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 处理块级公式 $$ ... $$ 或 \[ ... \]
    processed = processed.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (_, p1, p2) => {
      const tex = p1 || p2;
      const idx = latexBlocks.length;
      latexBlocks.push({ html: renderLatex(tex.trim(), true), isBlock: true });
      return `${placeholderId}_BLOCK_${idx}_END`;
    });

    // 处理行内公式 $ ... $ 或 \( ... \)（排除 $$ 的情况）
    processed = processed.replace(/\$([^\$\n]+?)\$|\\\(([^\)]+?)\\\)/g, (_, p1, p2) => {
      const tex = p1 || p2;
      const idx = latexBlocks.length;
      latexBlocks.push({ html: renderLatex(tex.trim(), false), isBlock: false });
      return `${placeholderId}_INLINE_${idx}_END`;
    });

    // 解析 Markdown
    let html = marked.parse(processed);

    // 还原 LaTeX - 使用正则匹配占位符（可能被包裹在 <p> 或其他标签中）
    const blockRegex = new RegExp(`${placeholderId}_BLOCK_(\\d+)_END`, 'g');
    const inlineRegex = new RegExp(`${placeholderId}_INLINE_(\\d+)_END`, 'g');

    html = html.replace(blockRegex, (_, idx) => {
      const item = latexBlocks[parseInt(idx)];
      return item ? `<div class="sa-latex-block">${item.html}</div>` : '';
    });

    html = html.replace(inlineRegex, (_, idx) => {
      const item = latexBlocks[parseInt(idx)];
      return item ? `<span class="sa-latex-inline">${item.html}</span>` : '';
    });

    return html;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return escapeHtml(content);
  }
}

/**
 * 渲染 LaTeX 公式
 * @param tex - LaTeX 源码
 * @param displayMode - 是否为块级显示
 * @returns 渲染后的 HTML
 */
function renderLatex(tex: string, displayMode: boolean): string {
  if (typeof katex === 'undefined') {
    // KaTeX 未加载，返回原始公式
    console.warn('KaTeX not loaded, using fallback');
    return `<code class="sa-latex-fallback">${escapeHtml(tex)}</code>`;
  }

  try {
    const result = katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      errorColor: '#cc0000',
      strict: false,
      // 安全设置：不信任所有命令，只允许默认安全的命令
      trust: false
    });
    return result;
  } catch (error) {
    console.warn('LaTeX rendering error:', error);
    return `<code class="sa-latex-error" title="LaTeX Error">${escapeHtml(tex)}</code>`;
  }
}
