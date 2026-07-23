"use client";

import { MessageSquare, User } from "lucide-react";
import type { TicketSummary } from "@/types/chat";

interface ConversationHeaderProps {
  ticket: TicketSummary | null;
  ticketId: string;
}

export function ConversationHeader({ ticket, ticketId }: ConversationHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Unclaimed":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Claimed":
      case "Ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-purple-300" />
          <h1 className="text-base font-bold leading-tight">
            {ticket?.title || `Support Ticket #${ticketId.slice(0, 8)}`}
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Ticket ID: <span className="font-mono text-purple-300">{ticketId}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(
            ticket?.status || "Unclaimed"
          )}`}
        >
          {ticket?.status || "Unclaimed"}
        </span>

        <div className="text-right text-xs text-slate-300 hidden sm:block">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-purple-300" /> Agent:{" "}
            {ticket?.assignedToName || "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
}
