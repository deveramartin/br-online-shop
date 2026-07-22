"use client";

import { useProfilePage } from "@/hooks/useProfilePage";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfilePersonalTab } from "./ProfilePersonalTab";
import { ProfileAddressesTab } from "./ProfileAddressesTab";
import { ProfileOrdersTab } from "./ProfileOrdersTab";
import { AddressModal } from "@/components/features/profile/AddressModal";

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

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-[var(--primary)] mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="md:col-span-9 bg-white border border-[var(--border)] rounded-xl p-6 md:p-8 shadow-sm">
          {isLoadingUser ? (
            <div className="p-8 text-center text-gray-500">Loading account info...</div>
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
