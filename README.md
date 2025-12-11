# AI Context Menu Extension

Chrome extension for Comet Browser with AI-powered context menu and OpenAI integration.

## Features
✅ Right-click context menu on selected text
✅ 4 AI options: Summarize, Analyze, Write Blog Post, Send to Suno GPT  
✅ OpenAI API integration
✅ Side panel display + clipboard copy
✅ Auto-inject text into ChatGPT/Suno

## Installation
1. Download this repository as ZIP
2. Extract all files to a folder
3. Open Comet Browser (or Chrome)
4. Navigate to `comet://extensions` or `chrome://extensions`
5. Enable **Developer Mode** (toggle in top right)
6. Click **Load unpacked**
7. Select the extracted folder
8. Click the extension icon in your toolbar
9. Enter your OpenAI API key in the settings

## Usage
1. Select any text on a webpage
2. Right-click to open context menu
3. Choose "AI Assistant" → select an option:
   - **Summarize this text**
   - **Analyze this text**
   - **Write a blog post**
   - **Send to Suno Song GPT**

## Files Included
- `manifest.json` - Extension configuration
- `background.js` - Context menu & OpenAI API logic
- `popup.html` - Settings interface
- `popup.js` - Settings logic
- `sidepanel.html` - Results display
- `sidepanel.js` - Results logic  
- `content-script.js` - ChatGPT text injection

## API Key
You'll need an OpenAI API key. Get one at: https://platform.openai.com/api-keys
