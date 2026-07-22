"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

interface ProductDetailInfoProps {
  product: Product;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category & Stock Badges */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-xs uppercase tracking-wider font-semibold">
          {product.category}
        </Badge>
        {inStock ? (
          <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
            In Stock ({product.stock} available)
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Title & SKU */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          {product.name}
        </h1>
        <p className="mt-1 text-xs text-neutral-400 font-mono">SKU: {product.sku}</p>
      </div>

      {/* Price */}
      <div className="text-3xl font-bold text-neutral-900 dark:text-white">
        ${product.price.toFixed(2)}
      </div>

      {/* Description */}
      <div className="prose prose-neutral dark:prose-invert text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {product.description}
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800 my-2" />

      {/* Quantity & Add to Cart Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Quantity:</span>
          <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
            <Button
              variant="ghost"
              size="sm"
              disabled={quantity <= 1 || !inStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 rounded-none"
            >
              -
            </Button>
            <span className="w-10 text-center text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={quantity >= product.stock || !inStock}
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-3 rounded-none"
            >
              +
            </Button>
          </div>
        </div>

        {/* Action Button */}
        <Button
          size="lg"
          disabled={!inStock}
          onClick={handleAddToCart}
          className="w-full sm:w-auto px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all"
        >
          {added ? "✓ Added to Cart" : inStock ? `Add ${quantity} to Cart` : "Out of Stock"}
        </Button>

        {added && (
          <p className="text-xs text-purple-600 dark:text-purple-400 animate-fade-in font-medium">
            Item added! (Full cart drawer coming in Epic 4)
          </p>
        )}
      </div>
    </div>
  );
}
