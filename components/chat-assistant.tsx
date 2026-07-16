"use client";

// ============================================================
// StadiumFlow AI - Gemini-Powered Chat Assistant
// Smart assistant with full context awareness
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  X,
  MessageSquare,
  Sparkles,
  Loader2,
} from "lucide-react";
import { chatWithGemini, type GeminiChatMessage } from "@/lib/gemini";
import { useAttendeeStore } from "@/lib/store";
import { sanitizeInput } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "Where is the shortest food line?",
  "Best route to my seat?",
  "Where are the nearest restrooms?",
  "What's the match score?",
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm your StadiumFlow AI assistant. I can help you navigate the stadium, find short queues, order food, and more! What do you need?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addChatMessage, profile } = useAttendeeStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = sanitizeInput(text || input);
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const geminiHistory: GeminiChatMessage[] = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    addChatMessage({ role: "user", parts: [{ text: messageText }] });

    try {
      const contextMessage = `[Context: User ${profile.name}, seat ${profile.seatSection} Row ${profile.seatRow} #${profile.seatNumber}, ${profile.ticketType} ticket, entered via ${profile.entryGate}]\n\nUser: ${messageText}`;

      const response = await chatWithGemini(contextMessage, geminiHistory);

      const assistantMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      addChatMessage({ role: "model", parts: [{ text: response }] });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#00FF87] border-[3px] border-black text-black font-black uppercase tracking-wider shadow-[4px_4px_0_#000] transition-all duration-300 hover:scale-105 hover:shadow-[2px_2px_0_#000] hover:translate-y-1 hover:translate-x-1"
        aria-label="Open AI chat assistant"
      >
        <MessageSquare className="w-5 h-5" aria-hidden="true" />
        <span className="hidden sm:inline">Ask AI</span>
        <Sparkles className="w-4 h-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-0 right-0 z-50 w-full sm:w-[420px] sm:bottom-4 sm:right-4 h-[85vh] sm:h-[600px] flex flex-col bg-white border-[3px] border-black shadow-[8px_8px_0_#000] rounded-t-xl sm:rounded-xl overflow-hidden animate-slide-up"
      role="dialog"
      aria-label="AI Chat Assistant"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-black bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFE600] border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0_#000]">
            <Bot className="w-5 h-5 text-black" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-black text-black uppercase tracking-wide">StadiumFlow AI</h2>
            <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF87] border border-black animate-pulse" aria-hidden="true" />
              Online
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg border-2 border-transparent hover:border-black hover:bg-gray-100 transition-all hover:shadow-[2px_2px_0_#000]"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 text-black" aria-hidden="true" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0_#000] text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#00FF87] text-black rounded-br-sm"
                  : "bg-white text-black rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00C6FF] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center mt-1">
                <User className="w-4 h-4 text-black" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center mt-1">
              <Bot className="w-4 h-4 text-black" aria-hidden="true" />
            </div>
            <div className="px-4 py-3 rounded-xl rounded-bl-sm border-2 border-black shadow-[3px_3px_0_#000] bg-white">
              <Loader2 className="w-5 h-5 text-black animate-spin" aria-label="Thinking..." />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto pb-4">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-white text-black border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-y-[1px] hover:translate-x-[1px] hover:bg-gray-100 transition-all"
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t-[3px] border-black bg-[#F5F0E8]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ASK STADIUMFLOW AI..."
            className="flex-1 px-4 py-3 rounded-lg bg-white text-black placeholder-gray-500 font-bold text-sm border-[3px] border-black shadow-[4px_4px_0_#000] focus:outline-none focus:shadow-[2px_2px_0_#000] focus:translate-y-[2px] focus:translate-x-[2px] transition-all"
            disabled={isLoading}
            aria-label="Type your message"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 p-3 rounded-lg bg-[#00C6FF] border-[3px] border-black text-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
