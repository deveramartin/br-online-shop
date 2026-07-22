"use client";

import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductDetailInfo } from "./ProductDetailInfo";
import { RelatedProducts } from "./RelatedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductDetailPageProps {
  id: string;
}

export function ProductDetailPage({ id }: ProductDetailPageProps) {
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Product Not Found</h2>
        <p className="mt-2 text-sm text-neutral-500 max-w-md">
          {error || "The requested product could not be located."}
        </p>
        <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
          <Link href="/products">&larr; Return to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          &larr; Back to Catalog
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ProductImageGallery images={product.images} name={product.name} />
          <ProductDetailInfo product={product} />
        </div>

        {/* Related Products */}
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>
    </div>
  );
}
