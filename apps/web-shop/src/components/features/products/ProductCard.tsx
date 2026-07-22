"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80";

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="h-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-neutral-900/80">
              {product.category}
            </Badge>
          </div>
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <Badge variant="destructive" className="text-sm font-bold uppercase tracking-wider px-3 py-1">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
          <div className="text-xl font-bold text-neutral-900 dark:text-white">
            ${product.price.toFixed(2)}
          </div>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium group-hover:underline flex items-center gap-1">
            View Details &rarr;
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
