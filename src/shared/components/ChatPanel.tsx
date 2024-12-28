import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { askQuestion } from "../../content/utils/ai";
import type { AIProvider } from "../config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  summary: string;
  provider: AIProvider;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ summary, provider }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest(".summary-content");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const question = inputValue.trim();
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 0);

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);

    try {
      let responseText = "";
      const previousMessages = messages.slice(0, -1);
      for await (const token of askQuestion(
        question,
        summary,
        provider,
        previousMessages
      )) {
        responseText += token;
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages[newMessages.length - 1]?.role === "assistant") {
            newMessages[newMessages.length - 1].content = responseText;
          } else {
            newMessages.push({ role: "assistant", content: responseText });
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error while processing your question.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const renderMarkdown = (text: string) => {
    const rawHtml = marked(text) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="chat-section">
      <h2>Ask Questions</h2>
      {messages.length > 0 && (
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              {renderMarkdown(message.content)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            isLoading
              ? "Waiting for response..."
              : "Ask a question about the video..."
          }
          className={`chat-input ${isLoading ? "loading" : ""}`}
          ref={inputRef}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="chat-submit-button"
        >
          {isLoading ? "..." : "Ask"}
        </button>
      </form>
    </div>
  );
};
