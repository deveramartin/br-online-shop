"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, MapPin, ScrollText, LogOut, Plus } from "lucide-react";
import { profileSchema, type ProfileFormData, type AddressFormData } from "@/lib/validators/auth";
import type { AddressDto, UserDto } from "@/types/auth";
import { userApi } from "@/lib/api/api-client";
import { AddressCard } from "@/components/features/profile/AddressCard";
import { AddressModal } from "@/components/features/profile/AddressModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type TabType = "personal" | "addresses" | "orders";

export function ProfilePage() {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [user, setUser] = useState<UserDto | null>(null);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDto | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function fetchData() {
      try {
        setIsLoadingUser(true);
        const [meData, addrData] = await Promise.all([
          userApi.getMe(token),
          userApi.getAddresses(token),
        ]);
        if (isMounted) {
          setUser(meData);
          setAddresses(addrData);
          resetProfile({
            fullName: meData.fullName,
            phoneNumber: meData.phoneNumber || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        if (isMounted) setIsLoadingUser(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [token, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileSuccessMessage(null);
    setProfileErrorMessage(null);
    try {
      const updated = await userApi.updateMe(data, token);
      setUser(updated);
      setProfileSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setProfileErrorMessage(err instanceof Error ? err.message : "Failed to update profile.");
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: AddressDto) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (data: AddressFormData) => {
    try {
      setIsSavingAddress(true);
      if (editingAddress) {
        const updated = await userApi.updateAddress(editingAddress.id, data, token);
        setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await userApi.addAddress(data, token);
        setAddresses((prev) => [...prev, created]);
      }

      // Refresh address list to ensure defaults are correctly rendered
      const refreshed = await userApi.getAddresses(token);
      setAddresses(refreshed);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await userApi.deleteAddress(id, token);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete address.");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-[var(--primary)] mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-3">
          <nav className="flex flex-col gap-1 bg-white p-2 rounded-xl border border-[var(--border)] shadow-sm">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "personal"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-low)]"
              }`}
            >
              <User className="w-4 h-4" /> Personal Information
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-low)]"
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Addresses
            </button>
            <button
              onClick={() => setActiveTab("orders")}
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

        {/* Main Content Area */}
        <main className="md:col-span-9 bg-white border border-[var(--border)] rounded-xl p-6 md:p-8 shadow-sm">
          {isLoadingUser ? (
            <div className="p-8 text-center text-gray-500">Loading account info...</div>
          ) : (
            <>
              {/* TAB 1: Personal Info */}
              {activeTab === "personal" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Header / Avatar */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[var(--border)]">
                    <Avatar className="w-20 h-20 border-2 border-[var(--primary)] text-2xl font-bold bg-[var(--primary-fixed)] text-[var(--primary)]">
                      <AvatarFallback>
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                      <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                      <p className="text-sm text-[var(--muted)]">{user?.email}</p>
                      <span className="inline-block mt-2 px-3 py-0.5 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] text-xs font-semibold rounded-full">
                        Artisanal Ube Enthusiast
                      </span>
                    </div>
                  </div>

                  {profileSuccessMessage && (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
                      {profileSuccessMessage}
                    </div>
                  )}

                  {profileErrorMessage && (
                    <div className="p-4 rounded-lg bg-[var(--error-container)] text-[var(--on-error-container)] text-sm font-medium">
                      {profileErrorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="prof-name">Full Name</Label>
                      <Input
                        id="prof-name"
                        type="text"
                        {...registerProfile("fullName")}
                      />
                      {profileErrors.fullName && (
                        <p className="text-xs text-[var(--error)]">{profileErrors.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prof-email">Email Address</Label>
                      <Input
                        id="prof-email"
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prof-phone">Phone Number</Label>
                      <Input
                        id="prof-phone"
                        type="tel"
                        placeholder="+63 917 123 4567"
                        {...registerProfile("phoneNumber")}
                      />
                      {profileErrors.phoneNumber && (
                        <p className="text-xs text-[var(--error)]">{profileErrors.phoneNumber.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmittingProfile}
                        className="bg-[var(--primary)] text-white px-8 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-[var(--primary-dark)] transition-all cursor-pointer"
                      >
                        {isSubmittingProfile ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: Addresses */}
              {activeTab === "addresses" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                    <h2 className="text-xl font-bold text-gray-900">Your Addresses</h2>
                    <Button
                      onClick={handleOpenAddAddress}
                      className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add New
                    </Button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl p-8">
                      <p className="text-gray-500">No saved addresses yet.</p>
                      <button
                        onClick={handleOpenAddAddress}
                        className="mt-4 text-sm font-semibold text-[var(--primary)] hover:underline"
                      >
                        Add your first address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {addresses.map((addr) => (
                        <AddressCard
                          key={addr.id}
                          address={addr}
                          onEdit={handleEditAddress}
                          onDelete={handleDeleteAddress}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Order History Placeholder */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="pb-4 border-b border-[var(--border)]">
                    <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                    <p className="text-xs text-[var(--muted)]">Track your recent Ube Jam &amp; Halaya orders.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[var(--surface-low)] border-b border-[var(--border)]">
                        <tr>
                          <th className="p-3.5 font-semibold text-[var(--muted)]">Order #</th>
                          <th className="p-3.5 font-semibold text-[var(--muted)]">Date</th>
                          <th className="p-3.5 font-semibold text-[var(--muted)]">Status</th>
                          <th className="p-3.5 font-semibold text-[var(--muted)]">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        <tr>
                          <td className="p-3.5 font-semibold">BR-89210</td>
                          <td className="p-3.5 text-gray-600">Oct 12, 2024</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                              Delivered
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold">₱850.00</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-semibold">BR-89195</td>
                          <td className="p-3.5 text-gray-600">Oct 05, 2024</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                              Shipped
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold">₱1,200.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Address Modal */}
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
