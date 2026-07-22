import { create } from "zustand";
import type { CartDto } from "@/types/cart";

interface CartStore {
  cart: CartDto | null;
  isOpen: boolean;
  loading: boolean;
  error: string | null;

  setCart: (cart: CartDto | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCartStore: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isOpen: false,
  loading: false,
  error: null,

  setCart: (cart) => set({ cart }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCartStore: () => set({ cart: null, isOpen: false, error: null }),
}));
