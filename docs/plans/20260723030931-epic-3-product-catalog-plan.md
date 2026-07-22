# Epic 3: Product Catalog (P0)

## Overview

This plan covers implementing the full product catalog feature — backend entity + API endpoints, seed data, and the two new frontend pages (catalog list + product detail). The landing page (3.2) is already partially complete; only the remaining unchecked items are in scope.

---

## Scope (unchecked tasks from backlogs.md)

### 3.1 Product data model — Backend
- [ ] `Product` entity (id, name, description, price, images[], stock, category, SKU, active status)
- [ ] Database seed script for 4–10 initial products
- [ ] `GET /api/products` — paginated product list
- [ ] `GET /api/products/{id}` — single product detail
- [ ] (P1) `GET /api/products?category=&sort=&search=` — filter/sort/search

### 3.3 Product catalog page — Frontend
- [ ] Product grid page using shadcn Card components
- [ ] (P1) Sort/filter UI bar
- [ ] Loading skeletons (shadcn Skeleton)

### 3.4 Product detail page — Frontend
- [ ] Image gallery (carousel or thumbnail switcher)
- [ ] Quantity selector
- [ ] Add to Cart button (with stock validation UI)
- [ ] Related products section
- [ ] Backend: Stock/inventory check before add-to-cart

> **Note:** 3.2 Landing page items are already checked off in backlogs.md (Hero, Featured products, Testimonials are done). Newsletter signup (P1) is deferred.

---

## Proposed Changes

### Backend — `apps/api-oos`

#### [NEW] `Models/Product.cs`
New EF Core entity:
```csharp
public class Product {
  Guid Id, string Name, string Description, decimal Price,
  List<string> Images (JSON column), int Stock,
  string Category, string SKU, bool IsActive,
  DateTime CreatedAt, DateTime UpdatedAt
}
```

#### [MODIFY] `Data/AppDbContext.cs`
- Add `DbSet<Product> Products`
- Add `OnModelCreating` config: required fields, max lengths, JSON column for `Images`, index on `Category` and `SKU` (unique)

#### [NEW] `Data/Seed/ProductSeeder.cs`
- Static seed method called from `Program.cs` in dev
- Seeds 6–8 sample BR brand products with realistic data (name, desc, price, stock, SKU, category, placeholder image URLs)

#### [NEW] `DTOs/Responses/ProductDto.cs`
```csharp
record ProductDto(Guid Id, string Name, string Description, decimal Price,
  List<string> Images, int Stock, string Category, string SKU, bool IsActive);
```

#### [NEW] `DTOs/Responses/PagedResult.cs`
Generic paged envelope: `{ data: T[], page, pageSize, total, totalPages }`

#### [NEW] `DTOs/Requests/ProductQueryParams.cs`
Query params DTO: `category`, `search`, `sort` (`price_asc`, `price_desc`, `name_asc`), `page`, `pageSize`

#### [NEW] `Interfaces/Repositories/IProductRepository.cs`
```csharp
Task<PagedResult<Product>> GetAllAsync(ProductQueryParams q);
Task<Product?> GetByIdAsync(Guid id);
```

#### [NEW] `Interfaces/Services/IProductService.cs`
```csharp
Task<PagedResult<ProductDto>> GetProductsAsync(ProductQueryParams q);
Task<ProductDto?> GetProductByIdAsync(Guid id);
```

#### [NEW] `Repositories/ProductRepository.cs`
Implements `IProductRepository`. EF Core queries with optional `Where` for category/search, `OrderBy` for sort, `.Skip().Take()` for paging.

#### [NEW] `Mappers/ProductMapper.cs`
`Product → ProductDto` mapping.

#### [NEW] `Services/ProductService.cs`
Implements `IProductService`. Calls repository, maps to DTOs.

#### [NEW] `Validators/ProductQueryParamsValidator.cs`
FluentValidation: valid sort values, page ≥ 1, pageSize 1–100.

#### [NEW] `Controllers/ProductsController.cs`
```
GET /api/products         → GetProducts([FromQuery] ProductQueryParams)
GET /api/products/{id}    → GetProduct(Guid id)
```
Both public (no `[Authorize]`).

#### [MODIFY] `Program.cs`
- Register `IProductRepository` / `ProductRepository`
- Register `IProductService` / `ProductService`
- Call `ProductSeeder.SeedAsync(scope)` in dev environment block

#### [NEW EF Migration]
Add `AddProductTable` migration via `dotnet ef migrations add AddProductTable`

---

### Frontend — `apps/web-shop`

#### [NEW] `src/types/product.ts`
```ts
export interface Product {
  id: string; name: string; description: string; price: number;
  images: string[]; stock: number; category: string; sku: string; isActive: boolean;
}
export interface PagedResult<T> { data: T[]; page: number; pageSize: number; total: number; totalPages: number; }
```

#### [MODIFY] `src/lib/api/api-client.ts`
Add `productsApi` module:
```ts
export const productsApi = {
  getProducts: (params?) => apiClient.get<PagedResult<Product>>('/products', ...),
  getProduct: (id: string) => apiClient.get<Product>(`/products/${id}`),
}
```

#### [NEW] `src/hooks/useProducts.ts`
Custom hook using `useState` + `useEffect` wrapping `productsApi.getProducts`. Returns `{ products, loading, error, pagination }`. Accepts optional filter/sort params.

#### [NEW] `src/hooks/useProduct.ts`
Custom hook for a single product by ID. Returns `{ product, loading, error }`.

#### [NEW] `src/components/features/products/ProductCard.tsx`
shadcn `Card`-based component displaying product image, name, price, category badge. Clicking navigates to detail page.

#### [NEW] `src/components/features/products/ProductGrid.tsx`
Responsive grid of `ProductCard` components. Shows `Skeleton` cards while loading. Handles empty state.

#### [NEW] `src/components/features/products/ProductFilterBar.tsx` *(P1)*
Sort dropdown (shadcn `Select`) + category filter buttons. Emits change events upward.

#### [NEW] `src/components/features/products/ProductsPage.tsx`
Orchestrates `useProducts` + `ProductFilterBar` + `ProductGrid`. Manages local filter/sort state.

#### [NEW] `src/app/products/page.tsx`
App Router page — renders `<ProductsPage />` only (no inline logic).
```tsx
export const metadata = { title: 'Products | BR Online Shop', description: '...' };
export default function ProductsPage() { return <ProductsPageComponent />; }
```

#### [NEW] `src/components/features/products/ProductImageGallery.tsx`
Image switcher: main large image + row of thumbnails. Uses shadcn `AspectRatio`. Keyboard accessible.

#### [NEW] `src/components/features/products/ProductDetailInfo.tsx`
Displays name, price, category, description, quantity selector (`+/-` buttons), stock status, Add to Cart button.

#### [NEW] `src/components/features/products/RelatedProducts.tsx`
Fetches products from same category (excluding current). Renders a horizontal scroll of `ProductCard`s (max 4).

#### [NEW] `src/components/features/products/ProductDetailPage.tsx`
Orchestrates `useProduct(id)` + `ProductImageGallery` + `ProductDetailInfo` + `RelatedProducts`. Handles loading/error states.

#### [NEW] `src/app/products/[id]/page.tsx`
Dynamic App Router page — renders `<ProductDetailPageComponent id={params.id} />`.
```tsx
export async function generateMetadata({ params }) { /* fetch product name for title */ }
export default function ProductDetailPage({ params }) { return <ProductDetailPageComponent id={params.id} />; }
```

---

## Architecture Notes

- **Images**: stored as `string[]` (JSON column in SQLite/Postgres). For MVP, image URLs will be absolute URLs (placeholder services or hosted assets). No file upload required in this epic.
- **Add to Cart button**: Since Epic 4 (cart) hasn't been implemented yet, the button will be present in the UI but show a toast "Coming soon" or be wired to a no-op cart context stub. The **stock check** from 3.4 will be a client-side guard (disable button if `stock === 0`).
- **Pagination**: The catalog page defaults to page 1, pageSize 12. No infinite scroll — simple page controls.
- **No Auth required**: Product endpoints are public.
- **Seed data**: 6–8 BR-brand relevant products across 2–3 categories (e.g. "Apparel", "Accessories", "Collectibles").

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Category design**: Should categories be a hardcoded enum (e.g., `Apparel | Accessories | Collectibles`) or a free-form string on the `Product` model? Enum is safer for filtering; string is more flexible. Which do you prefer?

> [!IMPORTANT]
> **Q2 — Add to Cart behavior (Epic 3 scope)**: Since cart (Epic 4) is not yet built, should the Add to Cart button on the product detail page:
> (a) Be disabled/greyed out with a "Coming soon" label?
> (b) Show a toast notification only?
> (c) Wire to a basic Zustand cart store stub now (so Epic 4 builds on it)?

> [!NOTE]
> **Q3 — Images**: For the MVP seed data, should I use real product photo URLs from a placeholder service (e.g. Unsplash, picsum.photos), or should I generate actual images with the image generation tool?

---

## Verification Plan

### Automated
- Run `dotnet build` after all backend files are created.
- Run `dotnet ef migrations add AddProductTable` and verify migration file.
- Run existing tests: `dotnet test` — no regressions.
- Run `pnpm build` inside `apps/web-shop` to verify TypeScript compilation.

### Manual
1. Start API and verify `GET /api/products` returns seeded data.
2. Verify `GET /api/products?category=Apparel&sort=price_asc&page=1&pageSize=4` returns filtered/sorted results.
3. Verify `GET /api/products/{id}` returns a single product.
4. Open `/products` in the web shop and verify grid renders with skeletons → cards.
5. Click a product card and verify the detail page loads with gallery, quantity selector, and Add to Cart button.
6. Verify responsive layout on mobile breakpoints.
