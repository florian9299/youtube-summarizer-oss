import { GoogleGenerativeAI } from "@google/generative-ai";

interface GoogleAIModel {
  name: string;
  displayName?: string;
  supportedGenerationMethods: string[];
}

export async function fetchGoogleAIModels(apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Get the list of available models
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google AI models");
    }

    const data = await response.json();
    const models: GoogleAIModel[] = data.models || [];

    // Filter for chat models only and format them
    return models
      .filter((model) =>
        model.supportedGenerationMethods.includes("generateContent")
      )
      .map((model) => ({
        id: model.name.split("/").pop() || model.name,
        name: model.displayName || model.name,
      }));
  } catch (error) {
    console.error("Error fetching Google AI models:", error);
    throw error;
  }
}
