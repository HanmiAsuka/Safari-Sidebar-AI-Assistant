import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import path from 'path';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Safari Sidebar AI Assistant',
        namespace: 'http://tampermonkey.net/',
        version: '1.0.0',
        description: '浏览器侧边栏 AI 助手',
        author: 'HanmiAsuka',
        match: ['*://*/*'],
        grant: [
          'GM.setValue',
          'GM.getValue',
          'GM.registerMenuCommand',
          'GM.xmlHttpRequest',
          'GM_setValue',
          'GM_getValue',
          'GM_registerMenuCommand',
          'GM_xmlhttpRequest',
        ],
        connect: ['openrouter.ai', 'api.openai.com', 'aihubmix.com'],
        require: [
          'https://cdn.jsdelivr.net/npm/marked@17.0.1/lib/marked.umd.min.js',
          'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
        ],
        'run-at': 'document-end',
      },
      build: {
        fileName: 'safari-ai-assistant.user.js',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: false,
  },
});
