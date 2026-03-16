"use client";

import { AI_RESPONSES } from "@/data/constants";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi! I'm your AI assistant. Ask me anything, brainstorm ideas, or paste text to improve. Save the whole chat as a note anytime.",
    },
  ]);
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  function handleScroll() {
    const container = chatContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollButton(distanceFromBottom > 200);
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  function handleSend() {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: "user", text: input };
    const aiMessage: ChatMessage = {
      role: "ai",
      text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
    };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  }
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-10 py-6 border-b border-border flex-shrink-0">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-text">
            AI Assistant
          </h2>
          <p className="text-subtle text-sm mt-1">
            Brainstorm, summarize, think out loud — then save the chat as a
            note.
          </p>
        </div>
        <button className="bg-purple text-card font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-purple/90 transition-all shadow-lg shadow-purple/20 flex-shrink-0">
          📝 Save as Note
        </button>
      </div>

      {/* messages */}

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-10 py-6 flex flex-col gap-4 relative"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI avatar */}
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple to-sky flex items-center justify-center text-xs text-card font-bold mr-3 mt-1 flex-shrink-0">
                ✦
              </div>
            )}
            {/* Bubble */}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-card text-text rounded-tl-sm"
                  : "bg-purple text-card rounded-tr-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-12 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-subtext hover:text-purple hover:border-purple transition-all shadow-lg z-10"
        >
          ↓
        </button>
      )}

      {/* input */}
      <div className="px-10 py-5 border-t border-border flex-shrink-0">
        <div className="flex gap-3 items-end">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything... (Enter to send)"
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-text text-sm placeholder:text-muted focus:outline-none focus:border-purple transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-purple text-card cursor-pointer font-semibold px-5 py-3 rounded-xl text-sm hover:bg-purple/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple/20 flex-shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
