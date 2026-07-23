import { apiClient } from "@/lib/api/api-client";
import type { BotReplyResponse, TicketSummary } from "@/types/chat";

const CRM_BASE_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://localhost:7001";

export const supportApi = {
  async getBotReply(userMessage: string, ticketId?: string, token?: string): Promise<BotReplyResponse> {
    return await apiClient.post<BotReplyResponse>(
      "/bot/reply",
      { ticketId: ticketId || "", userMessage },
      { token }
    );
  },

  async getCustomerTickets(customerId: string): Promise<TicketSummary[]> {
    try {
      const res = await fetch(`${CRM_BASE_URL}/api/v1/tickets?customerId=${customerId}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.items || [];
    } catch {
      return [];
    }
  },

  async getTicketDetails(ticketId: string): Promise<TicketSummary | null> {
    try {
      const res = await fetch(`${CRM_BASE_URL}/api/v1/tickets/${ticketId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async cancelTicket(ticketId: string): Promise<boolean> {
    try {
      const res = await fetch(`${CRM_BASE_URL}/api/v1/tickets/${ticketId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
