"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80";

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-800 flex flex-col justify-between">
        <div>
          {/* Image & Badges */}
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <Badge className="bg-[#451077] hover:bg-[#5d2d8f] text-white text-[11px] uppercase tracking-wider px-2.5 py-0.5 font-semibold shadow-sm">
                {product.category}
              </Badge>
            </div>
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <Badge variant="destructive" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
                  Sold Out
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-5 space-y-2">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-[#451077] dark:group-hover:text-purple-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </CardContent>
        </div>

        <CardFooter className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/60 mt-auto">
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Price</span>
            <span className="text-xl font-extrabold text-[#451077] dark:text-purple-300">
              ₱{product.price.toFixed(2)}
            </span>
          </div>

          <Button
            size="icon"
            className="rounded-full bg-[#451077] hover:bg-[#5d2d8f] text-white shadow-md transition-transform active:scale-95"
            aria-label="View Product"
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
