"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { MessageSquare, Send, X, Loader2, Lock } from "lucide-react";
import { ChatMessageBubble } from "./ChatMessageBubble";
import type { ChatMessage } from "@/types/chat";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userId?: string;
}

export function ChatPanel({
  isOpen,
  onClose,
  messages,
  sendMessage,
  isConnected,
  isLoading,
  error,
  isAuthenticated,
  userId,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const text = input.trim();
    setInput("");
    setIsSending(true);
    try {
      await sendMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-5 z-50 flex h-[520px] w-80 flex-col overflow-hidden rounded-2xl border border-purple-200/80 bg-white shadow-2xl transition-all sm:w-96">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#451077] px-4 py-3 text-white">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <MessageSquare className="h-5 w-5 text-purple-200" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#451077] ${
                isConnected ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">SentraCX Live Support</h3>
            <p className="text-[11px] text-purple-200">
              {isConnected ? "Connected to Support Agent" : "Connecting..."}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-purple-200 hover:bg-white/10 hover:text-white"
          aria-label="Close live chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Body */}
      {!isAuthenticated ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-3 rounded-full bg-purple-50 p-3 text-[#451077]">
            <Lock className="h-6 w-6" />
          </div>
          <h4 className="mb-1 text-base font-semibold text-slate-900">Sign in required</h4>
          <p className="mb-4 text-xs text-slate-500">
            Please log in to your account to start a live support chat session with our team.
          </p>
          <Link
            href="/signin"
            className="w-full rounded-xl bg-[#451077] py-2.5 text-center text-xs font-medium text-white shadow-sm hover:bg-[#340c5a]"
          >
            Sign In to Chat
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-[#451077]" />
        </div>
      ) : (
        <>
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {error}
              </div>
            )}
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                <MessageSquare className="mb-2 h-8 w-8 text-purple-200" />
                <p className="text-xs">No messages yet. Send a message to start chatting with support!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  isSelf={msg.senderId === userId}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-slate-50/50 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#451077] focus:outline-none focus:ring-1 focus:ring-[#451077]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending || !isConnected}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#451077] text-white shadow-sm hover:bg-[#340c5a] disabled:opacity-50 disabled:hover:bg-[#451077]"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
