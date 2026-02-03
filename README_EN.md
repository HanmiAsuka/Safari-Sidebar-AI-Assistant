# Safari Sidebar AI Assistant

[中文](README.md) | English

A lightweight Safari sidebar AI assistant. It supports configuring model providers compatible with OpenAI-style interfaces (such as OpenRouter, AIHubMix) and features web page summarization and selected text explanation.

## Demo

<div align="center">
  <video src="https://github.com/user-attachments/assets/3b5f6933-34b9-40bb-8700-5993249aa278" muted autoplay loop playsinline width="80%" style="max-width: 800px;"></video>
</div>

## Features

- **Sidebar Design**: Non-intrusive to web browsing. Toggle visibility via the `ctrl+x` (macOS) shortcut.
- **Page Summary**: Automatically generates intelligent summaries of the current page to provide background context for conversations.
- **Smart Selection**: Supports multi-segment text selection. Hold the `x` key to continuously collect web page snippets.
- **Deep Thinking**: Supports displaying the model's reasoning process with optional reasoning intensity.
- **Browser Adaptation**: Requires a browser extension that supports loading user scripts.
    - **Safari**: [quoid/userscripts](https://github.com/quoid/userscripts) (Recommended/Tested environment).
    - **Chrome/Other**: Tampermonkey (Pending testing).

## Installation

1. Install a browser extension manager (macOS + Safari: [quoid/userscripts](https://github.com/quoid/userscripts), Chrome: Tampermonkey).
2. Install the user script via **GitHub Releases**.

## User Guide

### Shortcuts

- **Ctrl + x**: Quickly show/hide the sidebar.
- **Long press 'x'**: Enter multi-segment collection mode. Selected web text will be automatically added to the sending queue.

### Basic Configuration

1. Open the sidebar and click the **Settings** icon at the top.
2. Click the management button next to **Chat Model Settings - Model Provider** to enter the **Provider Management** page. Select your AI service provider and enter your API Key.
3. Return to the **Settings** page to select your desired Chat Model and Summary Model (optional).

### Web Page Summary

When the summary function is enabled, the assistant automatically analyzes the core content of the current page. During conversations, these summaries serve as background context, helping the AI better understand the page you are viewing.

## Development

This project is built using Vite and TypeScript.

```bash
# Install dependencies
npm install

# Build for production
npm run build
```
