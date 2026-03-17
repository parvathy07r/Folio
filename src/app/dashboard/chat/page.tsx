"use client";

import { AI_RESPONSES } from "@/data/constants";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Save, Send, ArrowDown } from "lucide-react";

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
      <div className="flex items-center justify-between px-10 py-6 flex-shrink-0">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-text">
            AI Assistant
          </h2>
          <p className="text-subtle text-sm mt-1">
            Brainstorm, summarize, think out loud — then save the chat as a
            note.
          </p>
        </div>
        <Button className="bg-purple text-card font-semibold px-4 py-2.5 h-auto rounded-xl text-sm hover:bg-purple/90 shadow-lg shadow-purple/20 flex-shrink-0">
          <Save className="size-4" />
          Save as Note
        </Button>
      </div>

      <Separator />

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
              <Avatar className="size-7 rounded-lg mr-3 mt-1 flex-shrink-0">
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-purple to-sky text-xs text-card font-bold">
                  ✦
                </AvatarFallback>
              </Avatar>
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
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className="absolute bottom-24 right-12 size-10 rounded-full bg-card border-border text-subtext hover:text-purple hover:border-purple shadow-lg z-10"
        >
          <ArrowDown className="size-4" />
        </Button>
      )}

      <Separator />

      {/* input */}
      <div className="px-10 py-5 flex-shrink-0">
        <div className="flex gap-3 items-end">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything... (Enter to send)"
            className="flex-1 bg-card border-border rounded-xl px-4 py-3 h-auto text-text text-sm placeholder:text-muted-foreground focus-visible:border-purple focus-visible:ring-purple/30"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-purple text-card cursor-pointer font-semibold px-5 py-3 h-auto rounded-xl text-sm hover:bg-purple/90 disabled:opacity-40 shadow-lg shadow-purple/20 flex-shrink-0"
          >
            <Send className="size-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
