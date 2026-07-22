"use client";

import Link from "next/link";
import { Package, ExternalLink, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";

export function ProfileOrdersTab() {
  const { orders, loading, error } = useOrders();

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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Order History</h2>
        <p className="text-xs text-muted-foreground">Track your recent Ube Jam &amp; Halaya orders.</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground mt-2">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Package className="w-12 h-12 text-muted mx-auto" />
          <h3 className="text-sm font-bold text-foreground">No orders yet</h3>
          <p className="text-xs text-muted-foreground">When you place orders, they will show up here.</p>
          <Button asChild size="sm" className="rounded-full bg-primary text-white font-bold px-6">
            <Link href="/products">Browse Shop</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-low border-b border-border text-xs text-muted-foreground uppercase font-bold">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-low/50 transition-colors">
                  <td className="p-3.5 font-bold text-foreground">{order.orderNumber}</td>
                  <td className="p-3.5 text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-full border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    {order.paymentMethod === "CashOnDelivery" ? "Cash on Delivery" : "Online"}
                  </td>
                  <td className="p-3.5 font-extrabold text-primary-dark">
                    ₱{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold gap-1 text-primary">
                      <Link href={`/orders/${order.id}`}>
                        Details
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
