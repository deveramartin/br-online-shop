"use client";

import { Input } from "@/components/ui/input";
import { ProductCategory, type ProductQueryParams } from "@/types/product";

interface ProductFilterBarProps {
  params: ProductQueryParams;
  onChange: (newParams: ProductQueryParams) => void;
}

export function ProductFilterBar({ params, onChange }: ProductFilterBarProps) {
  const categories = ["All", ...Object.values(ProductCategory)];

  const handleCategoryClick = (cat: string) => {
    onChange({
      ...params,
      category: cat === "All" ? undefined : (cat as ProductCategory),
      page: 1,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...params,
      search: e.target.value || undefined,
      page: 1,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...params,
      sort: e.target.value || undefined,
      page: 1,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = cat === "All" ? !params.category : params.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 md:w-64">
          <Input
            type="text"
            placeholder="Search products..."
            value={params.search || ""}
            onChange={handleSearchChange}
            className="pl-9 text-sm"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={params.sort || ""}
          onChange={handleSortChange}
          className="px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Sort: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
        </select>
      </div>
    </div>
  );
}
