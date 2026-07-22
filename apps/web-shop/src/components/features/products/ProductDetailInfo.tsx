"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Star, Truck, Leaf, Minus, Plus, ChevronUp } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductDetailInfoProps {
  product: Product;
}

const CATEGORY_NAMES: Record<number | string, string> = {
  0: "Jams",
  1: "Pastries",
  2: "GiftSets",
  3: "Sweets",
  Jams: "Jams",
  Pastries: "Pastries",
  GiftSets: "GiftSets",
  Sweets: "Sweets",
};

import { useCart } from "@/hooks/useCart";

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [openHeritage, setOpenHeritage] = useState(false);
  const [openIngredients, setOpenIngredients] = useState(false);

  const { addToCart, loading } = useCart();
  const inStock = product.stock > 0;
  const categoryLabel = CATEGORY_NAMES[product.category] || "Artisanal";

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product.id, quantity);
  };


  return (
    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
      {/* Category & Badge Header */}
      <div>
        <div className="flex gap-2 mb-3">
          <Badge className="bg-secondary/15 text-secondary hover:bg-secondary/20 border-none px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold">
            {categoryLabel}
          </Badge>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-none px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold">
            Artisanal
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
          {product.name}
        </h1>

        {/* Price & Rating */}
        <div className="flex items-center gap-4">
          <p className="text-primary text-3xl font-extrabold">
            ₱{product.price.toFixed(2)}
          </p>
          <div className="flex items-center text-secondary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
            ))}
            <span className="ml-2 text-muted text-xs font-semibold">
              (124 Reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/70 w-full"></div>

      {/* Description */}
      <p className="text-base text-muted leading-relaxed font-normal">
        {product.description}
      </p>

      {/* Quantity & Actions */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-wider text-muted font-bold">Quantity:</span>
          <div className="flex items-center border border-border rounded-xl overflow-hidden h-12 bg-surface-card shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || !inStock}
              className="px-4 hover:bg-surface-low transition-colors text-primary border-r border-border disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="text"
              readOnly
              value={quantity}
              className="w-12 text-center border-none bg-transparent focus:ring-0 text-base font-bold text-foreground"
            />
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock || !inStock}
              className="px-4 hover:bg-surface-low transition-colors text-primary border-l border-border disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            disabled={!inStock || loading}
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white font-bold py-4 rounded-full hover:bg-primary-dark shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShoppingBag className="w-5 h-5" />
            {loading ? "Adding..." : inStock ? `Add ${quantity} to Cart` : "Out of Stock"}
          </button>


          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="flex-1 bg-surface-card border border-primary text-primary font-bold py-4 rounded-full hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary" : ""}`} />
            {wishlisted ? "Wishlisted" : "Wishlist"}
          </button>
        </div>
      </div>


      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="p-4 rounded-2xl border border-border/70 bg-surface-card flex items-center gap-3 shadow-sm">
          <Truck className="w-8 h-8 text-secondary shrink-0" />
          <div>
            <p className="text-xs font-bold text-foreground">Fast Delivery</p>
            <p className="text-[11px] text-muted">Metro Manila 24h</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-border/70 bg-surface-card flex items-center gap-3 shadow-sm">
          <Leaf className="w-8 h-8 text-secondary shrink-0" />
          <div>
            <p className="text-xs font-bold text-foreground">Organic</p>
            <p className="text-[11px] text-muted">No Preservatives</p>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="pt-6 space-y-3">
        <div className="border-b border-border/70 pb-4">
          <button
            onClick={() => setOpenHeritage(!openHeritage)}
            className="w-full flex justify-between items-center text-left font-bold text-foreground text-sm"
          >
            <span>Product Heritage</span>
            {openHeritage ? <ChevronUp className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-muted" />}
          </button>
          {openHeritage && (
            <div className="pt-3 text-muted text-sm leading-relaxed animate-fade-in">
              Our recipe dates back to 1952, passed down through the Raphael family. We use a proprietary slow-churning process that takes over 4 hours for every batch to ensure the signature consistency.
            </div>
          )}
        </div>

        <div className="border-b border-border/70 pb-4 pt-1">
          <button
            onClick={() => setOpenIngredients(!openIngredients)}
            className="w-full flex justify-between items-center text-left font-bold text-foreground text-sm"
          >
            <span>Ingredients &amp; Nutritional Info</span>
            {openIngredients ? <ChevronUp className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-muted" />}
          </button>
          {openIngredients && (
            <div className="pt-3 text-muted text-sm leading-relaxed animate-fade-in">
              Fresh Purple Yam, Condensed Milk, Evaporated Milk, Butter, Cane Sugar, and a touch of Vanilla. All-natural, gluten-free, and contains dairy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
