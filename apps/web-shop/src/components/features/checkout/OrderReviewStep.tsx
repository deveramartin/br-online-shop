"use client";

import Image from "next/image";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItemDto } from "@/types/cart";
import type { ShippingAddressRequest } from "@/types/order";

interface OrderReviewStepProps {
  items: CartItemDto[];
  shippingAddress: ShippingAddressRequest;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  onBack: () => void;
  onNext: () => void;
}

export function OrderReviewStep({
  items,
  shippingAddress,
  subtotal,
  shippingFee,
  totalAmount,
  onBack,
  onNext,
}: OrderReviewStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary" />
        Review Your Order
      </h2>

      {/* Shipping Address Summary Card */}
      <div className="bg-surface-low rounded-2xl border border-border/70 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            Shipping To
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-xs font-semibold text-primary h-7 px-2">
            Change
          </Button>
        </div>
        <p className="text-xs font-bold text-foreground">{shippingAddress.recipientName} ({shippingAddress.phone})</p>
        <p className="text-xs text-muted-foreground">
          {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
        </p>
      </div>

      {/* Items List */}
      <div className="bg-surface-card rounded-2xl border border-border/70 p-4 space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h3>

        <div className="divide-y divide-border/60">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-low shrink-0 border border-border/40">
                <Image
                  src={item.images?.[0] || "/placeholder-ube.jpg"}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate">{item.productName}</h4>
                <p className="text-[11px] text-muted-foreground">
                  Qty: {item.quantity} × ₱{item.unitPrice.toFixed(2)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-primary-dark">
                  ₱{item.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-surface-low rounded-2xl border border-border/70 p-4 space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Items Subtotal</span>
          <span className="font-bold text-foreground">₱{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping Fee</span>
          <span className="font-bold text-foreground">₱{shippingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span className="font-bold text-foreground">₱0.00</span>
        </div>
        <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-extrabold">
          <span>Total</span>
          <span className="text-primary-dark">₱{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="rounded-full px-6 text-xs font-bold gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Shipping
        </Button>
        <Button type="button" onClick={onNext} className="rounded-full px-8 bg-primary text-white font-bold hover:bg-primary-dark shadow-sm">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
