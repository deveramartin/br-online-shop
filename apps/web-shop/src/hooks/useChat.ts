"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import { createSignalRConnection } from "@/lib/signalr";
import { apiClient } from "@/lib/api/api-client";
import { supportApi } from "@/lib/api/support-api";
import type { ChatMessage, SupportTicketResponse, BotReplyResponse } from "@/types/chat";

const CRM_BASE_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://localhost:5005";

export type BotPhase = "BOT_GREETING" | "BOT_THINKING" | "BOT_RESPONDED" | "ESCALATE_PROMPT" | "LIVE_AGENT";

export function useChat(initialTicketId?: string) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(initialTicketId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botPhase, setBotPhase] = useState<BotPhase>(initialTicketId ? "LIVE_AGENT" : "BOT_GREETING");

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const token = (session as { accessToken?: string })?.accessToken;
  const isAuthenticated = status === "authenticated" && Boolean(session?.user) && Boolean(token);
  const userId = session?.user?.id;

  // Initialize bot greeting if messages empty
  useEffect(() => {
    if (messages.length === 0 && !initialTicketId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([
        {
          id: "bot-greeting",
          senderId: "bot",
          senderName: "SentraCX AI Assistant",
          senderType: "bot",
          content: "Hello! 👋 Welcome to Bren Raphael's Ube Jam & Halaya Shop support. How can I assist you today?",
          isRead: true,
          sentAt: new Date().toISOString(),
        },
      ]);
    }
  }, [messages.length, initialTicketId]);

  // Initialize or retrieve ticketId
  const getOrCreateTicket = useCallback(async () => {
    if (!userId || !token) return null;

    if (ticketId) return ticketId;

    const storageKey = `br_chat_ticket_${userId}`;
    const existingTicket = localStorage.getItem(storageKey);
    if (existingTicket) {
      setTicketId(existingTicket);
      return existingTicket;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post<SupportTicketResponse>(
        "/webhooks/support-ticket",
        {},
        { token }
      );
      if (res?.ticketId) {
        localStorage.setItem(storageKey, res.ticketId);
        setTicketId(res.ticketId);
        return res.ticketId;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize support chat session.");
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [userId, token, ticketId]);

  // Fetch initial message history from CRM
  const fetchMessages = useCallback(async (activeTicketId: string) => {
    try {
      const res = await fetch(`${CRM_BASE_URL}/api/v1/tickets/${activeTicketId}/messages`);
      if (res.ok) {
        const data: ChatMessage[] = await res.json();
        if (data.length > 0) {
          setMessages(data);
          setBotPhase("LIVE_AGENT");
        }
      }
    } catch (err) {
      console.error("Failed to load message history:", err);
    }
  }, []);

  // Connect SignalR hub ONLY when in LIVE_AGENT phase and ticketId exists
  useEffect(() => {
    if (!ticketId || !isAuthenticated || botPhase !== "LIVE_AGENT") return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages(ticketId);

    const connection = createSignalRConnection();
    connectionRef.current = connection;

    connection.on("ReceiveMessage", (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      if (!isOpenRef.current && msg.senderId !== userId) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    connection
      .start()
      .then(() => {
        setIsConnected(true);
        connection.invoke("JoinTicket", ticketId).catch(console.error);
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
      });

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("LeaveTicket", ticketId).catch(console.error);
      }
      connection.stop().catch(console.error);
      connectionRef.current = null;
      setIsConnected(false);
    };
  }, [ticketId, isAuthenticated, userId, botPhase, fetchMessages]);

  const toggleOpen = useCallback(async () => {
    if (!isOpen && !ticketId && isAuthenticated) {
      const id = await getOrCreateTicket();
      if (id) {
        setIsOpen(true);
        setUnreadCount(0);
      }
    } else {
      setIsOpen((prev) => {
        const next = !prev;
        if (next) setUnreadCount(0);
        return next;
      });
    }
  }, [isOpen, ticketId, isAuthenticated, getOrCreateTicket]);

  const escalateToLiveAgent = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeTicketId = await getOrCreateTicket();
      if (activeTicketId) {
        setBotPhase("LIVE_AGENT");
        // Add system message informing user
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            senderId: "system",
            senderName: "System",
            senderType: "agent",
            content: "You have requested a live support representative. Connecting to SentraCX agent queue...",
            isRead: true,
            sentAt: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getOrCreateTicket]);

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text || !userId) return;

      // 1. If in LIVE_AGENT phase -> send via SignalR
      if (botPhase === "LIVE_AGENT") {
        if (!ticketId) return;
        const connection = connectionRef.current;
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
          try {
            await connection.invoke("SendMessage", ticketId, userId, text);
          } catch (err) {
            console.error("Failed to send message via SignalR:", err);
          }
        }
        return;
      }

      // 2. Otherwise in Bot phase -> handle via AI Analytics bot reply proxy
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        senderId: userId,
        senderName: session?.user?.name || "You",
        senderType: "user",
        content: text,
        isRead: true,
        sentAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setBotPhase("BOT_THINKING");
      setIsBotReplying(true);

      try {
        const reply: BotReplyResponse = await supportApi.getBotReply(text, ticketId || undefined, token);
        
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          senderId: "bot",
          senderName: "SentraCX AI Assistant",
          senderType: "bot",
          content: reply.reply,
          isRead: true,
          sentAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMsg]);
        setBotPhase(reply.shouldEscalate ? "ESCALATE_PROMPT" : "BOT_RESPONDED");
      } catch (err) {
        console.error("Bot reply error:", err);
        setBotPhase("ESCALATE_PROMPT");
      } finally {
        setIsBotReplying(false);
      }
    },
    [botPhase, ticketId, userId, session?.user?.name, token]
  );

  return {
    isOpen,
    toggleOpen,
    setIsOpen,
    messages,
    unreadCount,
    isConnected,
    isLoading,
    isBotReplying,
    botPhase,
    error,
    isAuthenticated,
    sendMessage,
    escalateToLiveAgent,
    ticketId,
  };
}
