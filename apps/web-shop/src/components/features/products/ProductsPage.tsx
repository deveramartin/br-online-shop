"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductFilterBar } from "./ProductFilterBar";
import { ProductGrid } from "./ProductGrid";
import { Button } from "@/components/ui/button";

export function ProductsPage() {
  const { products, pagination, loading, error, params, setParams } = useProducts();

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header matching .design-ref */}
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Our Artisan Collection
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            Discover the authentic taste of Tarlac. Each jar is slow-cooked to perfection using heirloom recipes and premium purple yams.
          </p>
        </header>

        {/* Filter & Sort Bar */}
        <ProductFilterBar params={params} onChange={setParams} />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-error-container border border-error/20 text-on-error-container text-sm">
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
              className="rounded-xl border-border"
            >
              Previous
            </Button>
            <span className="text-xs text-muted font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setParams({ ...params, page: pagination.page + 1 })}
              className="rounded-xl border-border"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
