import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { askQuestion } from "../utils/ai";
import type { AIProvider } from "../../shared/config";

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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const question = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);

    try {
      let responseText = "";
      for await (const token of askQuestion(question, summary, provider)) {
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
    }
  };

  const renderMarkdown = (text: string) => {
    const rawHtml = marked(text) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages" ref={chatContainerRef}>
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
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about the video..."
          disabled={isLoading}
          className="chat-input"
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
