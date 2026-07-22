"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Star, Truck, Leaf, Minus, Plus } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductDetailInfoProps {
  product: Product;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Badges matching .design-ref */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {product.category}
        </Badge>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Artisanal
        </Badge>
        {inStock ? (
          <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-500/30 bg-emerald-50 rounded-full">
            In Stock ({product.stock})
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs rounded-full">
            Sold Out
          </Badge>
        )}
      </div>

      {/* Title & Ratings matching .design-ref */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-3xl font-extrabold text-primary">
            ₱{product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
            ))}
            <span className="ml-1 text-xs text-muted-foreground font-medium">
              (124 Reviews)
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* Description */}
      <p className="text-base text-muted leading-relaxed">
        {product.description}
      </p>

      {/* Quantity & Actions matching .design-ref */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Quantity:</span>
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-surface-card h-11">
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity <= 1 || !inStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-full px-3 text-primary rounded-none hover:bg-surface-low"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center text-base font-bold text-foreground">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity >= product.stock || !inStock}
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="h-full px-3 text-primary rounded-none hover:bg-surface-low"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Buttons matching .design-ref */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="lg"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-6 rounded-full shadow-lg shadow-purple-950/15 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {added ? "✓ Added to Cart" : inStock ? `Add ${quantity} to Cart` : "Sold Out"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setWishlisted(!wishlisted)}
            className="flex-1 border-primary text-primary hover:bg-primary/5 font-bold py-6 rounded-full transition-all flex items-center justify-center gap-2"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary" : ""}`} />
            {wishlisted ? "Wishlisted" : "Wishlist"}
          </Button>
        </div>

        {added && (
          <p className="text-xs text-primary font-semibold text-center sm:text-left">
            Item added! (Full cart drawer coming in Epic 4)
          </p>
        )}
      </div>

      {/* Info Cards matching .design-ref */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-surface-card flex items-center gap-3">
          <Truck className="w-7 h-7 text-secondary shrink-0" />
          <div>
            <p className="text-xs font-bold text-foreground">Fast Delivery</p>
            <p className="text-[11px] text-muted-foreground">Metro Manila 24h</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-surface-card flex items-center gap-3">
          <Leaf className="w-7 h-7 text-secondary shrink-0" />
          <div>
            <p className="text-xs font-bold text-foreground">Organic</p>
            <p className="text-[11px] text-muted-foreground">No Preservatives</p>
          </div>
        </div>
      </div>
    </div>
  );
}
