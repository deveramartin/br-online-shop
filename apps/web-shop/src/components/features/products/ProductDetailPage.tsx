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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
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
      <main className="max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-extrabold text-foreground">Product Not Found</h2>
        <p className="mt-2 text-sm text-muted font-medium max-w-md">
          {error || "The requested product could not be located."}
        </p>
        <Button asChild className="mt-6 bg-primary text-white font-bold rounded-full px-6">
          <Link href="/products">&larr; Return to Shop</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted font-semibold">
        <Link href="/products" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-foreground font-bold">{product.name}</span>
      </nav>

      {/* Main Grid Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <ProductImageGallery images={product.images} name={product.name} />
        <ProductDetailInfo product={product} />
      </section>

      {/* Related Products Section */}
      <RelatedProducts category={product.category} currentProductId={product.id} />
    </main>
  );
}
