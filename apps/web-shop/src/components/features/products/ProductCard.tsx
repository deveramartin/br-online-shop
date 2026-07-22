"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
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

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0] || DEFAULT_IMAGE;
  const categoryLabel = CATEGORY_NAMES[product.category] || "Artisanal";

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="product-card-hover group flex flex-col h-full bg-surface-card border border-border/70 rounded-2xl overflow-hidden shadow-none hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-square bg-surface-container overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized={primaryImage.startsWith("http")}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="bg-primary text-white font-label-sm text-[11px] px-3 py-1 rounded-full uppercase tracking-wider border-none">
              {categoryLabel}
            </Badge>
          </div>
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <Badge variant="destructive" className="font-label-sm text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 flex flex-col flex-grow">
          <h3 className="font-h3 text-h3 text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-on-surface-variant font-body-md text-body-md mb-4 flex-grow line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-primary font-bold text-lg">
              ₱{product.price.toFixed(2)}
            </span>
            <Button
              size="icon"
              className="bg-primary text-white p-2 h-9 w-9 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-sm"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
