# YouTube Summary Extension

A Chrome extension that generates concise summaries of YouTube videos using AI. Supports multiple AI providers including OpenAI, Google AI, and OpenRouter.

## Features

- Generate summaries of YouTube videos
- Chat with AI about the video content
- Support for multiple AI providers
- Real-time streaming responses
- Dark mode interface

## Installation

### Method 1: Direct Installation (Recommended)

1. Go to the [Releases](../../releases) page
2. Download `source.zip` from the latest release
3. Extract the ZIP file
4. Install dependencies:
   ```bash
   bun install
   ```
5. Build the extension:
   ```bash
   bun run build
   ```
6. Open Chrome and navigate to `chrome://extensions`
7. Enable "Developer mode" in the top right
8. Click "Load unpacked" and select the `dist` directory

### Method 2: Manual Build

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/youtube-summarizer-oss.git
   cd youtube-summarizer-oss
   ```
2. Follow steps 4-8 from Method 1

## Configuration

1. Click the extension icon in Chrome
2. Select your preferred AI provider
3. Enter your API key
4. Optional: Select a specific model from the available options

## Usage

1. Navigate to any YouTube video
2. Click the "Summarize" button below the video
3. Wait for the AI to generate a summary
4. Use the chat feature to ask questions about the video

## Development

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Watch for changes during development
bun run dev
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
