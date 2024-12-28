import React from "react";
import type { AIProvider } from "../config";

interface AIModel {
  id: string;
  name?: string;
}

interface ModelSelectProps {
  provider: AIProvider | null;
  models: AIModel[];
  selectedModel: string | null;
  isLoading: boolean;
  onChange: (modelId: string) => void;
  className?: string;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  provider,
  models,
  selectedModel,
  isLoading,
  onChange,
  className = "",
}) => {
  if (!provider || models.length === 0) return null;

  return (
    <div className="settings-section">
      <label htmlFor="model" className="settings-label">
        AI Model
      </label>
      <div className="select-wrapper">
        <select
          id="model"
          className={`model-select ${className}`}
          value={selectedModel || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        >
          {isLoading ? (
            <option>Loading models...</option>
          ) : (
            models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name || model.id}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};
