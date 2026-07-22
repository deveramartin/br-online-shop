"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "./ProductGrid";

export function ProductsPage() {
  const { products, loading, error } = useProducts({ pageSize: 12 });

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Boutique Header */}
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Our Artisan Collection
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            Discover the authentic taste of Tarlac. Each jar is slow-cooked to perfection using heirloom recipes and premium purple yams.
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-error-container border border-error/20 text-on-error-container text-sm">
            {error}
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
