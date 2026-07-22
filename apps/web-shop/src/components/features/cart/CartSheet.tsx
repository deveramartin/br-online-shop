"use client";

import Link from "next/link";
import { ShoppingBag, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { EmptyCartState } from "./EmptyCartState";

export function CartSheet() {
  const {
    items,
    subtotal,
    totalItems,
    isOpen,
    loading,
    error,
    isAuthenticated,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Sheet Content */}
      <div className="relative ml-auto w-full max-w-md bg-surface-card h-full shadow-2xl flex flex-col z-10 border-l border-border animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-low">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-extrabold text-base text-foreground">
              Your Shopping Cart ({totalItems})
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="rounded-full"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 m-4 bg-destructive/10 text-destructive text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
              <ShoppingBag className="w-12 h-12 text-primary" />
              <h3 className="text-base font-bold">Please sign in to view your cart</h3>
              <p className="text-xs text-muted-foreground">
                Sign in to your account to save items and place orders.
              </p>
              <Button asChild onClick={closeCart} className="rounded-full px-6 bg-primary text-white">
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          ) : loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground mt-2">Loading your cart...</p>
            </div>
          ) : items.length === 0 ? (
            <EmptyCartState onClose={closeCart} />
          ) : (
            <div className="space-y-1 divide-y divide-border/60">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {isAuthenticated && items.length > 0 && (
          <div className="p-5 border-t border-border bg-surface-low space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-extrabold text-foreground">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Shipping & Tax calculated at checkout</span>
                <span>₱100.00 estimated</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                onClick={closeCart}
                className="flex-1 rounded-full text-xs font-bold border-border"
              >
                <Link href="/cart">View Cart Page</Link>
              </Button>

              <Button
                asChild
                onClick={closeCart}
                className="flex-1 rounded-full text-xs font-bold bg-primary text-white hover:bg-primary-dark shadow-sm"
              >
                <Link href="/checkout" className="flex items-center justify-center gap-1.5">
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
