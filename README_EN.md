# Safari Sidebar AI Assistant

[中文](README.md) | English

A Safari browser sidebar AI assistant that supports OpenAI-compatible model providers (such as OpenRouter, AIHubMix), featuring web page summarization and selected text explanation.

## Features

- **Sidebar Design**: Non-intrusive to web browsing. Toggle visibility via the `Ctrl+x` (macOS) shortcut.
- **Web Page Summarization**: Automatically generates smart summaries of the current page to provide context for conversations.
- **Smart Text Selection**: Supports multi-segment text selection. Hold the `x` key to continuously collect web page snippets.
- **Deep Thinking**: Supports displaying the model's reasoning process (Chain of Thought) with optional reasoning intensity.
- **Browser Compatibility**: Requires a userscript manager. Developed and tested on Safari using quoid/userscripts [quoid/userscripts](https://github.com/quoid/userscripts). It may also work on Chrome with Tampermonkey.

## Installation

1. Install a browser extension (macOS: quoid/userscripts [quoid/userscripts](https://github.com/quoid/userscripts)).
2. Get the user script installation via GitHub Releases.

## User Guide

### Shortcuts

- **Ctrl + x**: Quickly toggle the sidebar.
- **Long press `x`**: Enter multi-segment collection mode. While holding the key, selected text on the webpage will be automatically added to the pending queue.

### Basic Configuration

1. Open the sidebar and click the **Settings** icon at the top.
2. Click the management button next to **Model Provider** under Chat Model Settings to enter **Provider Management**. Select your AI service provider and enter your API Key.
3. Select your desired Chat Model and Summary Model (optional) in the settings.

### Web Page Summarization

When the summary feature is enabled, the assistant automatically analyzes the core content of the current page. During conversations, these summaries are provided to the AI as background context, enabling it to better understand the page you are viewing.

## Development

This project is built using Vite and TypeScript.

```bash
# Install dependencies
npm install

# Build for production
npm run build
```