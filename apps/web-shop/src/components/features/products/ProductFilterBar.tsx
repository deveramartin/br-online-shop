"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
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

  const handleSortChange = (value: string) => {
    onChange({
      ...params,
      sort: value === "featured" ? undefined : value,
      page: 1,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = cat === "All" ? !params.category : params.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#451077] text-white shadow-md shadow-purple-900/20"
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
            placeholder="Search catalog..."
            value={params.search || ""}
            onChange={handleSearchChange}
            className="pl-9 text-sm rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-[#451077]"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>

        <Select value={params.sort || "featured"} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] text-sm rounded-xl border-neutral-200 dark:border-neutral-800">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="featured">Sort: Featured</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
