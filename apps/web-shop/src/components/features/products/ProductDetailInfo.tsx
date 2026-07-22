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

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [openHeritage, setOpenHeritage] = useState(false);
  const [openIngredients, setOpenIngredients] = useState(false);

  const inStock = product.stock > 0;
  const categoryLabel = CATEGORY_NAMES[product.category] || "Artisanal";

  const handleAddToCart = () => {
    if (!inStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="lg:col-span-5 space-y-stack-md sticky top-32">
      <div>
        {/* Badges matching .design-ref/product_detail */}
        <div className="flex gap-2 mb-2">
          <Badge className="bg-secondary/15 text-secondary hover:bg-secondary/20 border-none px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-widest">
            {categoryLabel}
          </Badge>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-none px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-widest">
            Artisanal
          </Badge>
        </div>

        {/* Title matching .design-ref */}
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-surface mb-2 font-extrabold">
          {product.name}
        </h1>

        {/* Price & Rating matching .design-ref */}
        <div className="flex items-center gap-4">
          <p className="text-primary font-h2 text-h2 font-semibold text-3xl">
            ₱{product.price.toFixed(2)}
          </p>
          <div className="flex items-center text-secondary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
            ))}
            <span className="ml-2 text-on-surface-variant font-label-md text-label-md">
              (124 Reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/70 w-full my-4"></div>

      {/* Description */}
      <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
        {product.description}
      </p>

      {/* Quantity & Actions matching .design-ref */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">Quantity:</span>
          <div className="flex items-center border border-border rounded-xl overflow-hidden h-12 bg-surface-card">
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
              className="w-12 text-center border-none bg-transparent focus:ring-0 font-body-md text-body-md text-on-surface font-bold"
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

        {/* Buttons matching .design-ref */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            disabled={!inStock}
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white font-label-md text-label-md py-4 rounded-full hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50"
          >
            <ShoppingBag className="w-5 h-5" />
            {added ? "✓ Added to Cart" : inStock ? `Add ${quantity} to Cart` : "Out of Stock"}
          </button>

          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="flex-1 bg-white border border-primary text-primary font-label-md text-label-md py-4 rounded-full hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-bold"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary" : ""}`} />
            {wishlisted ? "Wishlisted" : "Wishlist"}
          </button>
        </div>

        {added && (
          <p className="text-xs text-primary font-semibold text-center sm:text-left pt-1">
            Item added! (Full cart drawer coming in Epic 4)
          </p>
        )}
      </div>

      {/* Info Cards matching .design-ref */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-4 rounded-2xl border border-border/70 bg-surface-card flex items-center gap-3">
          <Truck className="w-8 h-8 text-secondary shrink-0" />
          <div>
            <p className="font-label-md text-label-md font-bold text-foreground">Fast Delivery</p>
            <p className="text-[12px] text-on-surface-variant">Metro Manila 24h</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-border/70 bg-surface-card flex items-center gap-3">
          <Leaf className="w-8 h-8 text-secondary shrink-0" />
          <div>
            <p className="font-label-md text-label-md font-bold text-foreground">Organic</p>
            <p className="text-[12px] text-on-surface-variant">No Preservatives</p>
          </div>
        </div>
      </div>

      {/* Accordions matching .design-ref */}
      <div className="pt-8 space-y-2">
        <div className="border-b border-border/70 pb-4">
          <button
            onClick={() => setOpenHeritage(!openHeritage)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="font-label-md text-label-md font-bold text-on-surface">Product Heritage</span>
            {openHeritage ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          {openHeritage && (
            <div className="pt-3 text-on-surface-variant font-body-md text-body-md leading-relaxed animate-fade-in">
              Our recipe dates back to 1952, passed down through the Raphael family. We use a proprietary slow-churning process that takes over 4 hours for every batch to ensure the signature consistency.
            </div>
          )}
        </div>

        <div className="border-b border-border/70 pb-4 pt-2">
          <button
            onClick={() => setOpenIngredients(!openIngredients)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="font-label-md text-label-md font-bold text-on-surface">Ingredients &amp; Nutritional Info</span>
            {openIngredients ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          {openIngredients && (
            <div className="pt-3 text-on-surface-variant font-body-md text-body-md leading-relaxed animate-fade-in">
              Fresh Purple Yam, Condensed Milk, Evaporated Milk, Butter, Cane Sugar, and a touch of Vanilla. All-natural, gluten-free, and contains dairy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
