import React, { useState, useCallback, useEffect } from "react";
import type { AIProvider } from "../config";
import { providers } from "../config";
import { ModelSelect } from "./ModelSelect";
import { fetchGoogleAIModels } from "../utils/googleAI";

interface AIModel {
  id: string;
  name?: string;
}

interface SettingsPanelProps {
  onClose?: () => void;
  showHeader?: boolean;
  className?: string;
  onProviderChange?: (provider: AIProvider) => void;
  onModelChange?: (model: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  showHeader = true,
  className = "",
  onProviderChange,
  onModelChange,
}) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(
    null
  );
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const fetchModels = useCallback(
    async (provider: AIProvider, key: string) => {
      console.log("Fetching models for provider:", provider.name);
      setIsLoadingModels(true);
      setModelError(null);
      try {
        if (provider.name === "Google AI") {
          const models = await fetchGoogleAIModels(key);
          setAvailableModels(models);
          if (models.length > 0) {
            setSelectedModel(models[0].id);
            chrome.storage.sync.set({ selectedModel: models[0].id });
            onModelChange?.(models[0].id);
          }
          return;
        }

        const response = await fetch(`${provider.baseUrl}/models`, {
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();
        console.log("Models response:", data);
        const models = data.data || data.models || [];
        console.log("Parsed models:", models);
        setAvailableModels(
          models.map((m: any) => ({
            id: m.id,
            name: m.name || m.id,
          }))
        );

        if (models.length > 0) {
          console.log("Setting default model:", models[0].id);
          setSelectedModel(models[0].id);
          chrome.storage.sync.set({ selectedModel: models[0].id });
          onModelChange?.(models[0].id);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setModelError("Failed to fetch available models");
        setAvailableModels([]);
        // Use provider's default model when fetch fails
        setSelectedModel(provider.model);
        chrome.storage.sync.set({ selectedModel: provider.model });
        onModelChange?.(provider.model);
      } finally {
        setIsLoadingModels(false);
      }
    },
    [onModelChange]
  );

  // Load saved settings
  useEffect(() => {
    chrome.storage.sync.get(
      ["apiKey", "selectedProvider", "selectedModel"],
      (result) => {
        const provider = result.selectedProvider || providers[0];
        const model = result.selectedModel || provider.model;

        setSelectedProvider(provider);
        setApiKey(result.apiKey || null);
        setSelectedModel(model);

        // Notify parent components
        onProviderChange?.(provider);
        onModelChange?.(model);

        if (!result.apiKey) {
          setApiKeyError("Please set your API key in the extension settings");
        }
      }
    );
  }, [onProviderChange, onModelChange]);

  return (
    <div className={`yt-summary-container ${className}`}>
      {showHeader && (
        <div className="settings-header">
          <h3>AI Provider Settings</h3>
          {onClose && (
            <button onClick={onClose} className="close-button">
              ×
            </button>
          )}
        </div>
      )}
      <div className="settings-content">
        <div className="settings-section">
          <label htmlFor="apiKey">API Key</label>
          <input
            type="password"
            id="apiKey"
            placeholder="Enter your API key"
            className="api-key-input"
            value={apiKey || ""}
            onChange={(e) => {
              const newKey = e.target.value.trim();
              chrome.storage.sync.set({ apiKey: newKey });
              setApiKey(newKey);
              if (!newKey) {
                setApiKeyError("Please set your API key");
              } else {
                setApiKeyError(null);
              }
            }}
          />
        </div>
        <div className="settings-section">
          <label>AI Provider</label>
          {providers.map((provider) => (
            <div
              key={provider.name}
              className={`provider-option ${
                selectedProvider?.name === provider.name ? "selected" : ""
              }`}
              onClick={() => {
                console.log("Selected provider:", provider.name);
                setSelectedProvider(provider);
                setSelectedModel(provider.model);
                chrome.storage.sync.set({
                  selectedProvider: provider,
                  selectedModel: provider.model,
                });
                // Notify parent components
                onProviderChange?.(provider);
                onModelChange?.(provider.model);
              }}
            >
              {provider.name}
            </div>
          ))}
        </div>
        {selectedProvider && availableModels.length > 0 && (
          <ModelSelect
            provider={selectedProvider}
            models={availableModels}
            selectedModel={selectedModel}
            isLoading={isLoadingModels}
            onChange={(modelId) => {
              setSelectedModel(modelId);
              chrome.storage.sync.set({ selectedModel: modelId });
              onModelChange?.(modelId);
            }}
          />
        )}
        {apiKeyError && <div className="error-message">{apiKeyError}</div>}
        {modelError && <div className="warning-message">{modelError}</div>}
      </div>
    </div>
  );
};
