"use client";

import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductDetailInfo } from "./ProductDetailInfo";
import { RelatedProducts } from "./RelatedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ProductDetailPageProps {
  id: string;
}

export function ProductDetailPage({ id }: ProductDetailPageProps) {
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg space-y-8">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <Skeleton className="lg:col-span-7 w-full aspect-[4/3] rounded-2xl" />
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-8 w-1/3 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="max-w-container-max mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-h2 text-h2 text-on-surface font-extrabold text-2xl">Product Not Found</h2>
        <p className="mt-2 text-on-surface-variant font-body-md max-w-md text-muted-foreground">
          {error || "The requested product could not be located."}
        </p>
        <Button asChild className="mt-6 bg-primary text-white font-label-md rounded-full px-6">
          <Link href="/products">&larr; Return to Shop</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      {/* Breadcrumbs matching .design-ref/product_detail */}
      <nav className="mb-stack-md flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-6">
        <Link href="/products" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-on-surface font-semibold">{product.name}</span>
      </nav>

      {/* Main Grid Section matching .design-ref/product_detail */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:items-start">
        <ProductImageGallery images={product.images} name={product.name} />
        <ProductDetailInfo product={product} />
      </section>

      {/* Related Products Section matching .design-ref/product_detail */}
      <RelatedProducts category={product.category} currentProductId={product.id} />
    </main>
  );
}
