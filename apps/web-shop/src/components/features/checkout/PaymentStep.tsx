"use client";

import { useState } from "react";
import { ArrowLeft, Banknote, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentMethod } from "@/types/order";

interface PaymentStepProps {
  totalAmount: number;
  loading: boolean;
  onBack: () => void;
  onPlaceOrder: (method: PaymentMethod) => void;
}

export function PaymentStep({ totalAmount, loading, onBack, onPlaceOrder }: PaymentStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CashOnDelivery");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder(selectedMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary" />
        Payment Method
      </h2>

      {/* Payment Selection Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setSelectedMethod("CashOnDelivery")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
            selectedMethod === "CashOnDelivery"
              ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
              : "border-border/70 bg-surface-card hover:border-primary/40"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-foreground">Cash on Delivery</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pay in cash directly to the courier upon receiving your package.
            </p>
          </div>
        </div>

        <div
          onClick={() => setSelectedMethod("CreditCard")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
            selectedMethod === "CreditCard"
              ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
              : "border-border/70 bg-surface-card hover:border-primary/40"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-foreground">Card / Online Payment</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mock payment gateway. Credit/Debit Card or GCash sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* Credit Card Mock Form (if Card selected) */}
      {selectedMethod === "CreditCard" && (
        <div className="bg-surface-low rounded-2xl border border-border/70 p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Test Card Details (Sandbox)
            </span>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Demo Mode
            </span>
          </div>

          <div>
            <Label htmlFor="cardNum">Card Number</Label>
            <Input
              id="cardNum"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mt-1 rounded-xl bg-surface-card"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardExp">Expiry Date</Label>
              <Input
                id="cardExp"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="mt-1 rounded-xl bg-surface-card"
              />
            </div>
            <div>
              <Label htmlFor="cardCvc">CVC / CVV</Label>
              <Input
                id="cardCvc"
                type="password"
                maxLength={4}
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                className="mt-1 rounded-xl bg-surface-card"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security & Total Summary */}
      <div className="bg-surface-card rounded-2xl border border-border/70 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <div>
            <span className="text-xs font-bold text-foreground block">Secure Checkout</span>
            <span className="text-[11px] text-muted-foreground">Encrypted connection & buyer protection</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground block">Total Due</span>
          <span className="text-base font-extrabold text-primary-dark">₱{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="rounded-full px-6 text-xs font-bold gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Review
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="rounded-full px-8 bg-primary text-white font-bold hover:bg-primary-dark shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing Order...
            </>
          ) : (
            `Place Order (₱${totalAmount.toFixed(2)})`
          )}
        </Button>
      </div>
    </form>
  );
}
