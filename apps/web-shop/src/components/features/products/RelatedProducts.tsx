"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";
import type { ProductCategory } from "@/types/product";

interface RelatedProductsProps {
  category: ProductCategory;
  currentProductId: string;
}

export function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const { products, loading } = useProducts({ category, pageSize: 5 });

  const related = products.filter((p) => p.id !== currentProductId).slice(0, 4);

  if (!loading && related.length === 0) {
    return null;
  }

  return (
    <section className="mt-section-gap pt-8 border-t border-border/70">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-h2-mobile md:font-h2 text-h2-mobile md:text-h2 text-on-surface">
            You May Also Love
          </h2>
          <p className="text-on-surface-variant font-body-md text-body-md">
            Perfect pairings for your Ube experience.
          </p>
        </div>
        <Link
          href="/products"
          className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline font-semibold"
        >
          View Shop
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
