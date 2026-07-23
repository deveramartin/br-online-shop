"use client";

import { useProfilePage } from "@/hooks/useProfilePage";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfilePersonalTab } from "./ProfilePersonalTab";
import { ProfileAddressesTab } from "./ProfileAddressesTab";
import { ProfileOrdersTab } from "./ProfileOrdersTab";
import { ProfileTicketsTab } from "./ProfileTicketsTab";
import { AddressModal } from "@/components/features/profile/AddressModal";
import { useChat } from "@/hooks/useChat";
import { ShieldCheck, ScrollText, Headphones, Sparkles } from "lucide-react";

export function ProfilePage() {
  const {
    activeTab,
    setActiveTab,
    user,
    addresses,
    isLoadingUser,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddress,
    isSavingAddress,
    profileForm,
    profileSuccessMessage,
    profileErrorMessage,
    onProfileSubmit,
    handleOpenAddAddress,
    handleEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
  } = useProfilePage();

  const { toggleOpen: toggleLiveChat } = useChat();

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      {/* Account Banner & Quick Stats Bar */}
      <div className="bg-gradient-to-r from-[#451077] via-[#5c169e] to-[#451077] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">{user?.fullName || "Valued Customer"}</h1>
                <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Verified Member
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1 font-medium">{user?.email || ""}</p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="text-center px-3 border-r border-white/15">
              <span className="block text-xs text-purple-200 font-medium flex items-center justify-center gap-1">
                <ScrollText className="w-3 h-3 text-purple-300" /> Saved
              </span>
              <span className="text-base font-extrabold text-white">{addresses.length} Addr</span>
            </div>

            <div className="text-center px-3 border-r border-white/15">
              <span className="block text-xs text-purple-200 font-medium flex items-center justify-center gap-1">
                <Headphones className="w-3 h-3 text-purple-300" /> Support
              </span>
              <span className="text-base font-extrabold text-white">24/7 Live</span>
            </div>

            <div className="text-center px-3">
              <span className="block text-xs text-purple-200 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" /> Account
              </span>
              <span className="text-base font-extrabold text-emerald-300">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Navigation Sidebar & Active Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="md:col-span-9 bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm">
          {isLoadingUser ? (
            <div className="p-12 text-center text-xs text-slate-500 font-medium">
              Loading account information...
            </div>
          ) : (
            <>
              {activeTab === "personal" && (
                <ProfilePersonalTab
                  user={user}
                  form={profileForm}
                  onSubmit={onProfileSubmit}
                  successMessage={profileSuccessMessage}
                  errorMessage={profileErrorMessage}
                />
              )}

              {activeTab === "addresses" && (
                <ProfileAddressesTab
                  addresses={addresses}
                  onAddNew={handleOpenAddAddress}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
              )}

              {activeTab === "orders" && <ProfileOrdersTab />}

              {activeTab === "tickets" && (
                <ProfileTicketsTab userId={user?.id} onOpenLiveChat={toggleLiveChat} />
              )}
            </>
          )}
        </main>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleSaveAddress}
        initialData={editingAddress}
        isLoading={isSavingAddress}
      />
    </div>
  );
}
