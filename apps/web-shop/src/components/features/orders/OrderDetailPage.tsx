"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Clock, MapPin, Package, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/lib/api/orders-api";
import type { OrderDto } from "@/types/order";

interface OrderDetailPageProps {
  orderId: string;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string })?.accessToken;

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId && token) {
      ordersApi.getOrderById(orderId, token)
        .then((res) => {
          setOrder(res);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load order detail");
          setLoading(false);
        });
    }
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground mt-2">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center space-y-4">
        <Package className="w-16 h-16 text-muted mx-auto" />
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {error || "We couldn't find the requested order."}
        </p>
        <Button asChild className="rounded-full bg-primary text-white px-8">
          <Link href="/profile">Back to Profile</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-bold gap-2">
        <Link href="/profile">
          <ArrowLeft className="w-4 h-4" />
          Back to Order History
        </Link>
      </Button>

      {/* Header Info */}
      <div className="bg-surface-card rounded-2xl border border-border/70 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Order #{order.orderNumber}
            </h1>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusBadge(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-muted-foreground block">Total Amount</span>
          <span className="text-xl font-extrabold text-primary-dark">₱{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="md:col-span-2 bg-surface-card rounded-2xl border border-border/70 p-6 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-base text-foreground border-b border-border pb-3">
            Ordered Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
          </h3>

          <div className="divide-y divide-border/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{item.productName}</h4>
                  <p className="text-xs text-muted-foreground">
                    SKU: {item.productSKU} · Qty: {item.quantity} × ₱{item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-bold text-foreground">
                  ₱{item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-bold text-foreground">₱{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Fee</span>
              <span className="font-bold text-foreground">₱{order.shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span className="font-bold text-foreground">₱{order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-extrabold">
              <span>Total Paid</span>
              <span className="text-primary-dark">₱{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border/70 p-6 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="w-4 h-4 text-primary" />
              Shipping Details
            </h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p className="font-bold text-foreground">{order.shippingRecipientName}</p>
              <p>{order.shippingStreet}</p>
              <p>{order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}</p>
              <p className="pt-1 text-foreground font-semibold">Phone: {order.shippingPhone}</p>
            </div>
          </div>

          <div className="bg-surface-card rounded-2xl border border-border/70 p-6 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Truck className="w-4 h-4 text-primary" />
              Payment & Status
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-bold text-foreground">
                  {order.paymentMethod === "CashOnDelivery" ? "Cash on Delivery" : "Online Payment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="font-bold text-foreground">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
