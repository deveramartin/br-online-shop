export enum ProductCategory {
  Apparel = "Apparel",
  Accessories = "Accessories",
  Collectibles = "Collectibles",
  Footwear = "Footwear",
  Equipment = "Equipment",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: ProductCategory;
  sku: string;
  isActive: boolean;
}

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ProductQueryParams {
  category?: ProductCategory;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}
