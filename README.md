# YouTube Video Summarizer Chrome Extension

A Chrome extension that uses AI to generate summaries of YouTube videos using their subtitles.

## Features

- Adds a "Summarize" button to YouTube video pages
- Extracts video subtitles (including auto-generated ones)
- Supports multiple AI providers (ChatGPT, Google AI, Groq)
- Customizable API settings
- Clean and modern UI

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Build the extension:
   ```bash
   bun run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `public` directory from this project

## Configuration

1. Click the extension icon in Chrome
2. Enter your API key for your chosen AI provider
3. Select your preferred AI provider
4. Click "Save Settings"

## Supported AI Providers

- **ChatGPT**: Uses OpenAI's GPT-4 model
- **Google AI**: Uses Google's Gemini Pro model
- **Groq**: Uses Mixtral-8x7B model

## Development

To start development with hot reloading:

```bash
bun run dev
```

## Building for Production

To build the extension for production:

```bash
bun run build
```

The built extension will be in the `public` directory.

## License

MIT
