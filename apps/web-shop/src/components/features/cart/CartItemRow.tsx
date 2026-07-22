"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItemDto } from "@/types/cart";

interface CartItemRowProps {
  item: CartItemDto;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const imageUrl = item.images?.[0] || "/placeholder-ube.jpg";

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/60 last:border-b-0">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-low border border-border/40 shrink-0">
        <Image
          src={imageUrl}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground truncate">{item.productName}</h4>
        <p className="text-xs text-muted-foreground">₱{item.unitPrice.toFixed(2)} each</p>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-border rounded-lg bg-surface-low overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-surface-card"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2 text-xs font-semibold min-w-[20px] text-center">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-surface-card"
              disabled={item.quantity >= item.stock}
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="font-bold text-sm text-primary-dark block">
          ₱{item.totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
