"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
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
    <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}
