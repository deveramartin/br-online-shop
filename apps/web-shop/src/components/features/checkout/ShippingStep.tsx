"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { userApi } from "@/lib/api/api-client";
import type { AddressDto } from "@/types/auth";
import type { ShippingAddressRequest } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus } from "lucide-react";

interface ShippingStepProps {
  initialAddress: ShippingAddressRequest | null;
  onNext: (address: ShippingAddressRequest) => void;
}

export function ShippingStep({ initialAddress, onNext }: ShippingStepProps) {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string })?.accessToken;

  const [savedAddresses, setSavedAddresses] = useState<AddressDto[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  const [recipientName, setRecipientName] = useState(initialAddress?.recipientName || session?.user?.name || "");
  const [street, setStreet] = useState(initialAddress?.street || "");
  const [city, setCity] = useState(initialAddress?.city || "");
  const [province, setProvince] = useState(initialAddress?.province || "");
  const [postalCode, setPostalCode] = useState(initialAddress?.postalCode || "");
  const [phone, setPhone] = useState(initialAddress?.phone || "");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      userApi.getAddresses(token).then((res) => {
        setSavedAddresses(res);
        const defaultAddr = res.find((a) => a.isDefault) || res[0];
        if (defaultAddr && !initialAddress) {
          setSelectedAddressId(defaultAddr.id);
          setRecipientName(session?.user?.name || "");
          setStreet(defaultAddr.street);
          setCity(defaultAddr.city);
          setProvince(defaultAddr.province);
          setPostalCode(defaultAddr.postalCode);
        }
      }).catch(() => {});
    }
  }, [token, session, initialAddress]);

  const handleSelectSaved = (addr: AddressDto) => {
    setSelectedAddressId(addr.id);
    setUseCustomAddress(false);
    setStreet(addr.street);
    setCity(addr.city);
    setProvince(addr.province);
    setPostalCode(addr.postalCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !street.trim() || !city.trim() || !province.trim() || !phone.trim()) {
      setFormError("Please fill out all required shipping fields.");
      return;
    }
    setFormError(null);
    onNext({
      recipientName,
      street,
      city,
      province,
      postalCode,
      phone,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Shipping Address
      </h2>

      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Saved Addresses
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id && !useCustomAddress;
              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelectSaved(addr)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                      : "border-border/70 hover:border-primary/50 bg-surface-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-foreground uppercase">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-secondary/15 text-secondary font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground font-medium truncate">{addr.street}</p>
                  <p className="text-xs text-muted-foreground">
                    {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setUseCustomAddress(true);
              setSelectedAddressId(null);
            }}
            className="rounded-full text-xs font-semibold gap-1.5 border-dashed"
          >
            <Plus className="w-4 h-4" />
            Enter Custom Address
          </Button>
        </div>
      )}

      {formError && (
        <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl font-medium">
          {formError}
        </div>
      )}

      <div className="space-y-4 pt-2 border-t border-border/60">
        <div>
          <Label htmlFor="recipientName">Recipient Full Name *</Label>
          <Input
            id="recipientName"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g. Bren Raphael"
            className="mt-1 rounded-xl"
            required
          />
        </div>

        <div>
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="House/Unit #, Street name"
            className="mt-1 rounded-xl"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City / Municipality *</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Baguio City"
              className="mt-1 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="province">Province *</Label>
            <Input
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="e.g. Benguet"
              className="mt-1 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 2600"
              className="mt-1 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="phone">Contact Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0917XXXXXXX"
              className="mt-1 rounded-xl"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" className="rounded-full px-8 bg-primary text-white font-bold hover:bg-primary-dark shadow-sm">
          Continue to Order Review
        </Button>
      </div>
    </form>
  );
}
