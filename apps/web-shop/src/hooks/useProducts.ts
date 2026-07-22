"use client";

import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api/api-client";
import type { PagedResult, Product, ProductQueryParams } from "@/types/product";

export function useProducts(initialParams?: ProductQueryParams) {
  const [params, setParams] = useState<ProductQueryParams>(initialParams || { page: 1, pageSize: 12 });
  const [data, setData] = useState<PagedResult<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    productsApi
      .getProducts(params)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load products");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.category, params.search, params.sort, params.page, params.pageSize]);

  return {
    products: data?.data ?? [],
    pagination: data
      ? {
          page: data.page,
          pageSize: data.pageSize,
          totalCount: data.totalCount,
          totalPages: data.totalPages,
        }
      : null,
    loading,
    error,
    params,
    setParams,
  };
}
