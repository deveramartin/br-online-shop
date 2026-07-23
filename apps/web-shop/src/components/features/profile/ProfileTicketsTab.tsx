"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Headphones, MessageSquare, Plus, Clock, User, ShieldCheck, Loader2 } from "lucide-react";
import { supportApi } from "@/lib/api/support-api";
import type { TicketSummary } from "@/types/chat";

interface ProfileTicketsTabProps {
  userId?: string;
  onOpenLiveChat?: () => void;
}

export function ProfileTicketsTab({ userId, onOpenLiveChat }: ProfileTicketsTabProps) {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      if (!userId) return;
      setIsLoading(true);
      const data = await supportApi.getCustomerTickets(userId);
      setTickets(data);
      setIsLoading(false);
    }

    loadTickets();
  }, [userId]);

  const getStatusStyle = (status: string) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--primary)] flex items-center gap-2">
            <Headphones className="w-5 h-5" /> Customer Support Tickets
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1 font-medium">
            Track inquiries, requests, and conversations with SentraCX support staff
          </p>
        </div>

        {onOpenLiveChat && (
          <button
            onClick={onOpenLiveChat}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#451077] text-white text-xs font-semibold rounded-xl hover:bg-[#340c5a] shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Start New Live Chat
          </button>
        )}
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400 font-medium">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#451077]" />
          Loading your support tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl">
          <ShieldCheck className="w-10 h-10 text-purple-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No support tickets found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Need help with an order, product, or account inquiry? Click below to start a live support session.
          </p>
          {onOpenLiveChat && (
            <button
              onClick={onOpenLiveChat}
              className="mt-4 px-4 py-2 bg-[#451077] text-white text-xs font-bold rounded-xl hover:bg-[#340c5a] transition-all cursor-pointer"
            >
              Contact Support Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusStyle(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: #{ticket.id.slice(0, 8)}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                  {ticket.title}
                </h4>

                {ticket.description && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {ticket.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-purple-400" />
                    Agent: {ticket.assignedToName || "Unassigned"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/support/${ticket.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-[#451077] hover:bg-[#451077] hover:text-white border border-purple-200 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message Staff
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
