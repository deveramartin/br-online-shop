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
        <Badge className="bg-purple-100 text-[#451077] hover:bg-purple-200 border-none text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {product.category}
        </Badge>
        <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-200 border-none text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Artisanal
        </Badge>
        {inStock ? (
          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30 bg-emerald-50 rounded-full">
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-3xl font-extrabold text-[#451077] dark:text-purple-300">
            ₱{product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
            ))}
            <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              (124 Reviews)
            </span>
          </div>
        </div>
      </div>

      <hr className="border-neutral-200/80 dark:border-neutral-800" />

      {/* Description */}
      <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
        {product.description}
      </p>

      {/* Quantity & Actions matching .design-ref */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Quantity:</span>
          <div className="flex items-center border border-neutral-300 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 h-11">
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity <= 1 || !inStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-full px-3 text-[#451077] rounded-none hover:bg-neutral-100"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center text-base font-bold text-neutral-900 dark:text-neutral-100">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity >= product.stock || !inStock}
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="h-full px-3 text-[#451077] rounded-none hover:bg-neutral-100"
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
            className="flex-1 bg-[#451077] hover:bg-[#5d2d8f] text-white font-bold py-6 rounded-full shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {added ? "✓ Added to Cart" : inStock ? `Add ${quantity} to Cart` : "Sold Out"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setWishlisted(!wishlisted)}
            className="flex-1 border-[#451077] text-[#451077] hover:bg-purple-50 font-bold py-6 rounded-full transition-all flex items-center justify-center gap-2"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-[#451077]" : ""}`} />
            {wishlisted ? "Wishlisted" : "Wishlist"}
          </Button>
        </div>

        {added && (
          <p className="text-xs text-[#451077] dark:text-purple-300 font-semibold text-center sm:text-left">
            Item added! (Full cart drawer coming in Epic 4)
          </p>
        )}
      </div>

      {/* Info Cards matching .design-ref */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-3">
          <Truck className="w-7 h-7 text-[#451077] shrink-0" />
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Fast Delivery</p>
            <p className="text-[11px] text-neutral-500">Metro Manila 24h</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-3">
          <Leaf className="w-7 h-7 text-[#451077] shrink-0" />
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Organic</p>
            <p className="text-[11px] text-neutral-500">No Preservatives</p>
          </div>
        </div>
      </div>
    </div>
  );
}
