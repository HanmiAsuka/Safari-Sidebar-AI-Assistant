# Safari Sidebar AI Assistant

[中文](README.md) | English

A lightweight AI assistant for the Safari sidebar, supporting OpenAI-compatible model providers (such as OpenRouter, AIHubMix). Features include web page summarization, selected text explanation, and more.

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/565a2f9f-6d03-4c74-b0fb-a88c1203a9a9" />

## Features

- **Sidebar Design**: Non-intrusive browsing experience. Toggle the sidebar visibility with `Ctrl+x` (macOS).
- **Web Summarization**: Automatically generates intelligent summaries of the current page to provide context for your conversations.
- **Smart Selection**: Supports multi-segment text selection. Hold the `x` key to continuously capture text fragments from the webpage.
- **Deep Thinking**: Supports the display of the model's thinking process, offering optional reasoning intensity settings.
- **Browser Compatibility**: Requires a user script manager. Currently tested on Safari with [quoid/userscripts](https://github.com/quoid/userscripts). (Chrome via Tampermonkey may work but is currently untested).

## Installation

1. Install a browser extension manager (macOS: [quoid/userscripts](https://github.com/quoid/userscripts)).
2. Install the userscript via GitHub Releases.

## Usage Guide

### Shortcuts

- **Ctrl + x**: Quickly show/hide the sidebar.
- **Hold 'x' key**: Enter multi-segment collection mode. While holding, selected text on the webpage is automatically added to the pending send queue.

### Basic Configuration

1. Open the sidebar and click the **Settings** icon at the top.
2. In the **Chat Model Settings**, click the management button next to **Model Provider** to enter the **Provider Management** page. Select your AI service provider and enter your API Key.
3. Return to the **Settings** page to select your preferred Chat Model and Summary Model (optional).

### Web Summarization

When the summary function is enabled, the assistant automatically analyzes the core content of the current page. During conversations, these summaries are provided to the AI as background context, enabling it to better understand the page you are viewing.

## Development

This project is built using Vite and TypeScript.

```bash
# Install dependencies
npm install

# Build for production
npm run build
```
