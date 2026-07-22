"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cartApi } from "@/lib/api/cart-api";
import { useCartStore } from "@/lib/stores/useCartStore";

export function useCart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = (session as { accessToken?: string })?.accessToken;
  const isAuthenticated = status === "authenticated" && !!token;

  const {
    cart,
    isOpen,
    loading,
    error,
    setCart,
    setIsOpen,
    setLoading,
    setError,
    openCart,
    closeCart,
    clearCartStore,
  } = useCartStore();

  const fetchCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart(token);
      setCart(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load cart";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token, setCart, setLoading, setError]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      clearCartStore();
    }
  }, [isAuthenticated, fetchCart, clearCartStore]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!isAuthenticated || !token) {
      router.push("/signin");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartApi.addItem({ productId, quantity }, token);
      setCart(updatedCart);
      openCart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add item to cart";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartApi.updateItem(itemId, { quantity }, token);
      setCart(updatedCart);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update item quantity";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartApi.removeItem(itemId, token);
      setCart(updatedCart);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await cartApi.clearCart(token);
      setCart({
        id: cart?.id || "",
        userId: cart?.userId || "",
        items: [],
        subtotal: 0,
        totalItems: 0,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to clear cart";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    items: cart?.items ?? [],
    totalItems: cart?.totalItems ?? 0,
    subtotal: cart?.subtotal ?? 0,
    isOpen,
    loading,
    error,
    isAuthenticated,
    openCart,
    closeCart,
    setIsOpen,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
