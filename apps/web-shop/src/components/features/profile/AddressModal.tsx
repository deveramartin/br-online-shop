"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormData } from "@/lib/validators/auth";
import type { AddressDto } from "@/types/auth";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => Promise<void>;
  initialData?: AddressDto | null;
  isLoading?: boolean;
}

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: AddressModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "Home",
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Philippines",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        label: initialData.label,
        street: initialData.street,
        city: initialData.city,
        province: initialData.province,
        postalCode: initialData.postalCode,
        country: initialData.country,
        isDefault: initialData.isDefault,
      });
    } else {
      reset({
        label: "Home",
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Philippines",
        isDefault: false,
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit: SubmitHandler<AddressFormData> = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Address" : "Add New Address"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField label="Label" error={errors.label?.message} htmlFor="addr-label">
          <input
            id="addr-label"
            type="text"
            placeholder="e.g. Home, Office"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            {...register("label")}
          />
        </FormField>

        <FormField label="Street Address" error={errors.street?.message} htmlFor="addr-street">
          <input
            id="addr-street"
            type="text"
            placeholder="123 Purple Lane, Brgy. San Jose"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            {...register("street")}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="City" error={errors.city?.message} htmlFor="addr-city">
            <input
              id="addr-city"
              type="text"
              placeholder="Quezon City"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              {...register("city")}
            />
          </FormField>

          <FormField label="Province / State" error={errors.province?.message} htmlFor="addr-province">
            <input
              id="addr-province"
              type="text"
              placeholder="Metro Manila"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              {...register("province")}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Postal Code" error={errors.postalCode?.message} htmlFor="addr-postal">
            <input
              id="addr-postal"
              type="text"
              placeholder="1100"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              {...register("postalCode")}
            />
          </FormField>

          <FormField label="Country" error={errors.country?.message} htmlFor="addr-country">
            <input
              id="addr-country"
              type="text"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              {...register("country")}
            />
          </FormField>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="addr-default"
            type="checkbox"
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
            {...register("isDefault")}
          />
          <label htmlFor="addr-default" className="text-sm font-medium text-gray-700 cursor-pointer">
            Set as default shipping address
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Saving..." : initialData ? "Save Changes" : "Add Address"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
