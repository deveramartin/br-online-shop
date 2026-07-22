# Epic 3: Product Catalog (P0)

## Overview

This plan covers implementing the full product catalog feature — backend entity + API endpoints, seed data, and the two new frontend pages (catalog list + product detail). The landing page (3.2) is already partially complete; only the remaining unchecked items are in scope.

---

## Scope (backlogs.md)

### 3.1 Product data model — Backend
- [x] `Product` entity (id, name, description, price, images[], stock, category enum, SKU, active status)
- [x] Database seed script for 8 initial products across 5 categories
- [x] `GET /api/products` — paginated product list
- [x] `GET /api/products/{id}` — single product detail
- [x] (P1) `GET /api/products?category=&sort=&search=` — filter/sort/search

### 3.3 Product catalog page — Frontend
- [x] Product grid page using shadcn Card components
- [x] (P1) Sort/filter UI bar using shadcn Select & Input
- [x] Loading skeletons (shadcn Skeleton)

### 3.4 Product detail page — Frontend
- [x] Image gallery (interactive thumbnail switcher)
- [x] Quantity selector (+/- buttons)
- [x] Add to Cart button (with stock validation & feedback UI)
- [x] Related products section
- [x] Backend: Stock/inventory check before add-to-cart

---

## Decisions & User Preferences
- **Categories**: Strict C# and TypeScript `ProductCategory` enums (`Apparel`, `Accessories`, `Collectibles`, `Footwear`, `Equipment`).
- **Add to Cart**: Interactive feedback toast notification when clicking Add to Cart for MVP.
- **Images**: High-quality Unsplash image URLs for initial seed data.
- **UI Components**: Mandatory 100% shadcn/ui components (`Card`, `Badge`, `Button`, `Input`, `Select`, `Skeleton`).

---

## Implemented Architecture & Files

### Backend — `apps/api-oos`

#### `Models/ProductCategory.cs` & `Models/Product.cs`
- `ProductCategory` enum and `Product` EF Core entity with JSON conversion for `List<string> Images` and string conversion for `Category`.

#### `Data/AppDbContext.cs` & `Data/Seed/SeedData.cs`
- Added `DbSet<Product> Products` to `AppDbContext.cs`.
- Seeded 8 products across 5 categories in `SeedData.cs`.

#### DTOs & Contracts
- `DTOs/Responses/ProductDto.cs`
- `DTOs/Responses/PagedResult.cs`
- `DTOs/Requests/ProductQueryParams.cs`

#### Interfaces & Layered Architecture
- `Interfaces/Repositories/IProductRepository.cs` & `Repositories/ProductRepository.cs`
- `Interfaces/Services/IProductService.cs` & `Services/ProductService.cs`
- `Mappers/ProductMapper.cs`
- `Controllers/ProductsController.cs`

#### Tests (`tests/ApiOos.Tests`)
- `tests/ApiOos.Tests/Services/ProductServiceTests.cs`
- `tests/ApiOos.Tests/Controllers/ProductsControllerTests.cs`

---

### Frontend — `apps/web-shop`

#### `src/types/product.ts`
- `ProductCategory` enum, `Product` interface, `PagedResult<T>`, `ProductQueryParams`.

#### `src/lib/api/api-client.ts`
- Added `productsApi.getProducts()` and `productsApi.getProduct(id)`.

#### `src/hooks/`
- `useProducts.ts`: Custom hook for list, filtering, and pagination.
- `useProduct.ts`: Custom hook for single product lookup.

#### `src/components/ui/` (shadcn UI Primitives)
- `badge.tsx`, `skeleton.tsx`, `select.tsx`, `card.tsx`, `button.tsx`, `input.tsx`.

#### `src/components/features/products/`
- `ProductCard.tsx` (Card, Badge)
- `ProductGrid.tsx` (Skeleton, Card grid)
- `ProductFilterBar.tsx` (Input, Select, Category pills)
- `ProductsPage.tsx` (Button, FilterBar, Grid, Pagination)
- `ProductImageGallery.tsx` (Thumbnail switcher)
- `ProductDetailInfo.tsx` (Badge, Button, Quantity control)
- `RelatedProducts.tsx` (Recommendations grid)
- `ProductDetailPage.tsx` (Gallery, DetailInfo, RelatedProducts, Skeleton)

#### App Routes
- `src/app/products/page.tsx`
- `src/app/products/[id]/page.tsx`

---

## Verification Summary

### Automated Tests
- **Backend Unit Tests**: `dotnet test` → Passed 7/7 (100%).
- **Frontend Typecheck & Build**: `npx tsc --noEmit` & `npm run build` → Passed cleanly with 0 errors.

### Manual Verification
- Verified `/api/products` pagination, search, category filter, and sorting.
- Verified `/api/products/{id}` detail response.
- Verified `/products` catalog page and `/products/[id]` detail page navigation.
