# Safari Sidebar AI Assistant

中文 | [English](README_EN.md)

一个轻量级 Safari 浏览器侧边栏 AI 助手，支持配置提供 OpenAI 风格接口的模型提供商（如 Openrouter、AIHubMix），具备网页摘要和选文解释等功能。

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/565a2f9f-6d03-4c74-b0fb-a88c1203a9a9" />


## 特性

- **侧边栏设计**：不干扰网页浏览，通过 `ctrl+x`(macos) 快捷键唤出/隐藏。
- **网页摘要**：自动生成当前页面的智能摘要，为对话提供背景信息。
- **智能选文**：支持多段文本选中，按住 `x` 键即可连续采集网页片段。
- **深度思考**：支持模型的思考过程显示，提供可选的推理强度。
- **浏览器适配**：需支持用户插件，如 Safari 的 [quoid/userscripts](https://github.com/quoid/userscripts) （我本地的环境是这样），Chrome 用 Tampermonkey 或许也可以，待测试。

## 安装

1. 安装浏览器扩展 (macos: [quoid/userscripts](https://github.com/quoid/userscripts))。
2. 通过 GitHub Releases 获取用户脚本安装。

## 使用指南

### 快捷键

- **Ctrl + x**：快速唤出/隐藏侧边栏。
- **长按 x 键**：进入多段采集模式，此时选中的网页文本会自动加入待发送队列。

### 基础配置

1. 打开侧边栏，点击顶部的**设置**图标。
2. 在 **对话模型设置-模型提供方** 右侧管理按钮点击进入**提供方管理** 页，选择你的 AI 服务商并填入 API Key。
3. 回到 **设置** 页面选择你想要使用的对话模型和摘要模型（可选）。

### 网页摘要

启用摘要功能后，助手会自动分析当前页面的核心内容。在对话时，这些摘要将作为背景上下文提供给 AI，使其能更好地理解你正在查看的页面。

## 开发

本项目使用 Vite 和 TypeScript 开发。

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

