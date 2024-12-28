export interface AIProvider {
  name: string;
  baseUrl: string;
  model: string;
}

export const providers: AIProvider[] = [
  { name: "ChatGPT", baseUrl: "https://api.openai.com/v1", model: "gpt-4" },
  {
    name: "Google AI",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.0-flash-exp",
  },
  {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.1-8b-instant",
  },
  {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "openai/gpt-4-turbo",
  },
];
