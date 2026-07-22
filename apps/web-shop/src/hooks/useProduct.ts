"use client";

import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api/api-client";
import type { Product } from "@/types/product";

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    productsApi
      .getProduct(id)
      .then((res) => {
        if (isMounted) {
          setProduct(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load product");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
}
