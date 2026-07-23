"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import { createSignalRConnection } from "@/lib/signalr";
import { apiClient } from "@/lib/api/api-client";
import type { ChatMessage, SupportTicketResponse } from "@/types/chat";

const CRM_BASE_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://localhost:7001";

export function useChat() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const userId = session?.user?.id;

  // Initialize or retrieve ticketId
  const getOrCreateTicket = useCallback(async () => {
    if (!userId) return null;

    const storageKey = `br_chat_ticket_${userId}`;
    const existingTicket = localStorage.getItem(storageKey);
    if (existingTicket) {
      setTicketId(existingTicket);
      return existingTicket;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post<SupportTicketResponse>("/webhooks/support-ticket", {});
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
  }, [userId]);

  // Fetch initial message history
  const fetchMessages = useCallback(async (activeTicketId: string) => {
    try {
      const res = await fetch(`${CRM_BASE_URL}/api/v1/tickets/${activeTicketId}/messages`);
      if (res.ok) {
        const data: ChatMessage[] = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load message history:", err);
    }
  }, []);

  // Connect SignalR hub
  useEffect(() => {
    if (!ticketId || !isAuthenticated) return;

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
  }, [ticketId, isAuthenticated, userId, fetchMessages]);

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

  const sendMessage = useCallback(
    async (content: string) => {
      if (!ticketId || !userId || !content.trim()) return;

      const connection = connectionRef.current;
      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
          await connection.invoke("SendMessage", ticketId, userId, content.trim());
        } catch (err) {
          console.error("Failed to send message via SignalR:", err);
        }
      }
    },
    [ticketId, userId]
  );

  return {
    isOpen,
    toggleOpen,
    setIsOpen,
    messages,
    unreadCount,
    isConnected,
    isLoading,
    error,
    isAuthenticated,
    sendMessage,
  };
}
