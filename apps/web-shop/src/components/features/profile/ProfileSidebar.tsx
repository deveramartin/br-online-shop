"use client";

import { User, MapPin, ScrollText, Headphones, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import type { TabType } from "@/hooks/useProfilePage";

interface ProfileSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const tabs = [
    { id: "personal" as TabType, label: "Personal Info", icon: User },
    { id: "addresses" as TabType, label: "Saved Addresses", icon: MapPin },
    { id: "orders" as TabType, label: "Order History", icon: ScrollText },
    { id: "tickets" as TabType, label: "Support Tickets", icon: Headphones },
  ];

  return (
    <div className="w-full">
      <nav className="flex flex-wrap md:flex-col gap-1.5 bg-surface-card p-2 rounded-2xl border border-border shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-low"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <div className="pt-2 md:pt-3 mt-1 md:mt-2 border-t border-border w-full">
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
