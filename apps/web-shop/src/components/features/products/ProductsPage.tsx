"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductFilterBar } from "./ProductFilterBar";
import { ProductGrid } from "./ProductGrid";
import { Button } from "@/components/ui/button";

export function ProductsPage() {
  const { products, pagination, loading, error, params, setParams } = useProducts();

  return (
    <div className="min-h-screen bg-[#fcf9f8] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header matching .design-ref */}
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#451077] dark:text-purple-300 tracking-tight">
            Our Artisan Collection
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Discover the authentic taste of Tarlac. Each jar is slow-cooked to perfection using heirloom recipes and premium purple yams.
          </p>
        </header>

        {/* Filter & Sort Bar */}
        <ProductFilterBar params={params} onChange={setParams} />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} />

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setParams({ ...params, page: pagination.page - 1 })}
              className="rounded-xl border-neutral-300 dark:border-neutral-800"
            >
              Previous
            </Button>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setParams({ ...params, page: pagination.page + 1 })}
              className="rounded-xl border-neutral-300 dark:border-neutral-800"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
