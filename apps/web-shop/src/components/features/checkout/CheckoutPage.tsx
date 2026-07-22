"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import type { PaymentMethod, ShippingAddressRequest } from "@/types/order";

import { CheckoutStepper } from "./CheckoutStepper";
import { ShippingStep } from "./ShippingStep";
import { OrderReviewStep } from "./OrderReviewStep";
import { PaymentStep } from "./PaymentStep";

export function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, isAuthenticated, clearCart } = useCart();
  const { createOrder, loading: orderLoading, error: orderError } = useOrders();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressRequest | null>(null);

  const shippingFee = items.length > 0 ? 100 : 0;
  const totalAmount = subtotal + shippingFee;

  if (!isAuthenticated) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-primary mx-auto" />
        <h1 className="text-2xl font-bold">Please sign in to complete checkout</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          You must be logged in to your account to specify shipping addresses and place orders.
        </p>
        <Button asChild className="rounded-full bg-primary text-white px-8">
          <Link href="/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0 && currentStep === 1) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-muted mx-auto" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Add some delicious Baguio Ube Halaya to your cart before proceeding to checkout!
        </p>
        <Button asChild className="rounded-full bg-primary text-white px-8">
          <Link href="/products">Browse Catalog</Link>
        </Button>
      </div>
    );
  }

  const handleShippingSubmit = (address: ShippingAddressRequest) => {
    setShippingAddress(address);
    setCurrentStep(2);
  };

  const handlePlaceOrder = async (paymentMethod: PaymentMethod) => {
    if (!shippingAddress) return;
    try {
      const createdOrder = await createOrder({
        shippingAddress,
        paymentMethod,
      });
      await clearCart();
      router.push(`/orders/confirmation?id=${createdOrder.id}`);
    } catch {
      // Error handled by useOrders state
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Checkout</span>
      </div>

      <CheckoutStepper currentStep={currentStep} />

      {orderError && (
        <div className="p-4 mb-6 max-w-3xl mx-auto bg-destructive/10 text-destructive text-sm rounded-xl font-medium">
          {orderError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
        {/* Step Container */}
        <div className="lg:col-span-8 bg-surface-card rounded-2xl border border-border/70 p-6 sm:p-8 shadow-xs">
          {currentStep === 1 && (
            <ShippingStep
              initialAddress={shippingAddress}
              onNext={handleShippingSubmit}
            />
          )}

          {currentStep === 2 && shippingAddress && (
            <OrderReviewStep
              items={items}
              shippingAddress={shippingAddress}
              subtotal={subtotal}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <PaymentStep
              totalAmount={totalAmount}
              loading={orderLoading}
              onBack={() => setCurrentStep(2)}
              onPlaceOrder={handlePlaceOrder}
            />
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4">
          <div className="bg-surface-card rounded-2xl border border-border/70 p-6 shadow-xs sticky top-24 space-y-4">
            <h3 className="font-extrabold text-base text-foreground border-b border-border pb-3">
              Summary ({totalItems} items)
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-bold text-foreground">₱{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="font-bold text-foreground">₱0.00</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-extrabold">
                <span>Total Due</span>
                <span className="text-primary-dark">₱{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
