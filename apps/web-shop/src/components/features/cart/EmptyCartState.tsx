"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCartStateProps {
  onClose?: () => void;
}

export function EmptyCartState({ onClose }: EmptyCartStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
      <div className="w-16 h-16 rounded-full bg-surface-low border border-border flex items-center justify-center text-muted">
        <ShoppingBag className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Looks like you haven&apos;t added any delicious Ube treats to your cart yet!
        </p>
      </div>
      <Button asChild onClick={onClose} className="rounded-full px-6 bg-primary text-white hover:bg-primary-dark shadow-sm">
        <Link href="/products">Browse Catalog</Link>
      </Button>
    </div>
  );
}
