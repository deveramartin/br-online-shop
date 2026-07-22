"use client";

import { useState } from "react";
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

const FALLBACK_IMAGES: Record<string, string> = {
  "Classic Ube Halaya": "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80",
  "Ube Crinkle Cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
  "Chunky Ube Jam": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  "Assorted Ube Box": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
  "Ube Halaya w/ Cheese": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
  "Golden Ube Tarts": "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
  "Ube Macapuno Mix": "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
  "Creamy Ube Pastillas": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const initialImg = product.images?.[0] || FALLBACK_IMAGES[product.name] || DEFAULT_FALLBACK;
  const [imgSrc, setImgSrc] = useState(initialImg);

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="product-card-hover group flex flex-col h-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-none hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-square bg-surface-container overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => {
              const fallback = FALLBACK_IMAGES[product.name] || DEFAULT_FALLBACK;
              if (imgSrc !== fallback) {
                setImgSrc(fallback);
              }
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="bg-primary text-white font-label-sm text-[11px] px-3 py-1 rounded-full uppercase tracking-wider border-none">
              {product.category}
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
