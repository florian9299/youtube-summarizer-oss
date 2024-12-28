import type { AIProvider } from "../../shared/config";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

async function* streamCompletion(
  provider: AIProvider,
  messages: Message[]
): AsyncGenerator<string, void, unknown> {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (!apiKey) {
    throw new Error(
      "API key not found. Please set your API key in the extension settings."
    );
  }

  const requestBody = {
    model: provider.model,
    messages,
    stream: true,
  };

  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error?.message || "Unknown error"}`);
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk
      .split("\n")
      .filter((line) => line.trim() !== "" && line.trim() !== "data: [DONE]");

    for (const line of lines) {
      try {
        const trimmedLine = line.replace(/^data: /, "").trim();
        if (!trimmedLine) continue;

        const parsed = JSON.parse(trimmedLine);
        const content = parsed.choices[0]?.delta?.content || "";
        if (content) {
          yield content;
        }
      } catch (e) {
        console.warn("Failed to parse streaming response line:", e);
      }
    }
  }
}

export async function* generateSummary(
  transcript: string,
  provider: AIProvider
): AsyncGenerator<string, void, unknown> {
  const prompt = `Provide a concise summary of this YouTube video transcript using markdown formatting:

${transcript}

Required format:
# TLDR
[2-3 sentence overview]

# Key Points
[Main content summary formatted as markdown]

Formatting rules:
- Use bullet points for key points
- Use **bold** for important terms
- Use *italic* for emphasis
- Use > for notable quotes
- Use --- for section breaks
- Use \`code\` for technical terms
- Use [text](link) for any references

Be direct and concise. Do not use introductory phrases like "Here's a summary" or "Let me summarize".`;

  try {
    for await (const token of streamCompletion(provider, [
      { role: "user", content: prompt },
    ])) {
      yield token;
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}

export async function* askQuestion(
  question: string,
  summary: string,
  provider: AIProvider,
  chatHistory: Message[] = []
): AsyncGenerator<string, void, unknown> {
  const systemMessage: Message = {
    role: "system",
    content: `You are a friendly and helpful AI assistant discussing a YouTube video. Here is the video's summary for context:

${summary}

If the user asks something that isn't covered in the summary, you can say so while still trying to be helpful based on the context you have. Be direct and concise in your responses.`,
  };

  const userMessage: Message = { role: "user", content: question };
  const messages = [systemMessage, ...chatHistory, userMessage];

  try {
    for await (const token of streamCompletion(provider, messages)) {
      yield token;
    }
  } catch (error) {
    console.error("Error answering question:", error);
    throw error;
  }
}
