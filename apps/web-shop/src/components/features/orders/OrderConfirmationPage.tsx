"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, ShoppingBag, Truck, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/lib/api/orders-api";
import type { OrderDto } from "@/types/order";

export function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { data: session } = useSession();
  const token = (session as { accessToken?: string })?.accessToken;

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(!!(orderId && token));

  useEffect(() => {
    if (!orderId || !token) return;
    let cancelled = false;
    ordersApi.getOrderById(orderId, token)
      .then((res) => { if (!cancelled) setOrder(res); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground mt-3">Retrieving order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="bg-surface-card rounded-3xl border border-border/70 p-6 sm:p-10 text-center shadow-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-secondary block">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
            Thank you for your order!
          </h1>
          {order && (
            <p className="text-sm text-muted-foreground mt-2">
              Order Number: <span className="font-extrabold text-foreground">{order.orderNumber}</span>
            </p>
          )}
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          We have received your order and are preparing your fresh Baguio Ube Halaya treats for delivery!
        </p>

        {/* Info Grid */}
        {order && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4 border-t border-border/60">
            <div className="p-4 bg-surface-low rounded-2xl border border-border/50">
              <Truck className="w-5 h-5 text-primary mb-2" />
              <h4 className="text-xs font-bold text-muted-foreground uppercase">Estimated Delivery</h4>
              <p className="text-sm font-extrabold text-foreground mt-1">2–4 Business Days</p>
            </div>

            <div className="p-4 bg-surface-low rounded-2xl border border-border/50">
              <Calendar className="w-5 h-5 text-primary mb-2" />
              <h4 className="text-xs font-bold text-muted-foreground uppercase">Payment Method</h4>
              <p className="text-sm font-extrabold text-foreground mt-1">
                {order.paymentMethod === "CashOnDelivery" ? "Cash on Delivery" : "Online Payment"}
              </p>
            </div>

            <div className="p-4 bg-surface-low rounded-2xl border border-border/50">
              <ShoppingBag className="w-5 h-5 text-primary mb-2" />
              <h4 className="text-xs font-bold text-muted-foreground uppercase">Total Amount</h4>
              <p className="text-sm font-extrabold text-primary-dark mt-1">₱{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          {order && (
            <Button asChild variant="outline" className="rounded-full px-6 font-bold text-xs">
              <Link href={`/orders/${order.id}`}>View Order Details</Link>
            </Button>
          )}
          <Button asChild className="rounded-full px-8 bg-primary text-white font-bold hover:bg-primary-dark shadow-sm">
            <Link href="/products" className="flex items-center justify-center gap-2">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
