"use client";

import { useProfilePage } from "@/hooks/useProfilePage";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfilePersonalTab } from "./ProfilePersonalTab";
import { ProfileAddressesTab } from "./ProfileAddressesTab";
import { ProfileOrdersTab } from "./ProfileOrdersTab";
import { ProfileTicketsTab } from "./ProfileTicketsTab";
import { AddressModal } from "@/components/features/profile/AddressModal";
import { useChat } from "@/hooks/useChat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, Headphones, Sparkles } from "lucide-react";

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

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-6">
      {/* Minimal Header Card */}
      <Card className="p-6 md:p-8 bg-surface-card border-border rounded-3xl shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20 text-2xl font-bold bg-primary/10 text-primary">
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                  {user?.fullName || "Valued Customer"}
                </h1>
                <Badge variant="secondary" className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Customer Account
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{user?.email || ""}</p>
            </div>
          </div>

          {/* Key Account Stats */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <div className="text-center md:text-left">
              <span className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-3 h-3 text-primary" /> Addresses
              </span>
              <span className="text-sm font-extrabold text-foreground">{addresses.length} saved</span>
            </div>

            <div className="text-center md:text-left">
              <span className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center md:justify-start gap-1">
                <Headphones className="w-3 h-3 text-primary" /> Support
              </span>
              <span className="text-sm font-extrabold text-foreground">24/7 AI & Staff</span>
            </div>

            <div className="text-center md:text-left">
              <span className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center md:justify-start gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Status
              </span>
              <span className="text-sm font-extrabold text-emerald-600">Active</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid: Navigation & Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        <main className="md:col-span-9 bg-surface-card border border-border rounded-3xl p-6 md:p-8 shadow-2xs">
          {isLoadingUser ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-medium">
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
