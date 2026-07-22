import { User, MapPin, ScrollText, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import type { TabType } from "@/hooks/useProfilePage";

interface ProfileSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  return (
    <aside className="md:col-span-3">
      <nav className="flex flex-col gap-1 bg-white p-2 rounded-xl border border-[var(--border)] shadow-sm">
        <button
          onClick={() => onTabChange("personal")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "personal"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted)] hover:bg-[var(--surface-low)]"
          }`}
        >
          <User className="w-4 h-4" /> Personal Information
        </button>
        <button
          onClick={() => onTabChange("addresses")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "addresses"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted)] hover:bg-[var(--surface-low)]"
          }`}
        >
          <MapPin className="w-4 h-4" /> Saved Addresses
        </button>
        <button
          onClick={() => onTabChange("orders")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted)] hover:bg-[var(--surface-low)]"
          }`}
        >
          <ScrollText className="w-4 h-4" /> Order History
        </button>
        <div className="pt-4 mt-2 border-t border-[var(--border)]">
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[var(--error)] hover:bg-[var(--error-container)]/30 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
