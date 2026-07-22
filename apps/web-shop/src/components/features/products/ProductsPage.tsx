"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductFilterBar } from "./ProductFilterBar";
import { ProductGrid } from "./ProductGrid";
import { Button } from "@/components/ui/button";

export function ProductsPage() {
  const { products, pagination, loading, error, params, setParams } = useProducts();

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Product Catalog
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Explore our handcrafted collection of premium heritage goods and signature lifestyle products.
          </p>
        </div>

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
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
