# Epic 4: Cart & Checkout

## Background

Epic 3 (Product Catalog) is complete. The backend exposes `GET /api/products` and `GET /api/products/{id}` with stock tracking via `Product.Stock`. The frontend has product listing, detail pages, and a stub cart icon in the `Header` (currently hardcoded to `0`).

This epic covers the full shopping flow: Cart → Checkout → Payment → Order Confirmation.

---

## Open Questions

> [!IMPORTANT]
> **Cart strategy**: The backlog says "server-persisted for logged-in users, local state for guests." This plan implements **hybrid cart**:
> - **Guests**: Zustand store (localStorage-persisted) only.
> - **Logged-in users**: Zustand store synced to backend (`/api/cart`) on load and on every mutation.
>
> Do you want to support guests adding to cart at all, or require login before adding? **Please confirm before proceeding.**

> [!IMPORTANT]
> **Payment provider**: Stripe is recommended. This requires a Stripe account + test API keys. Do you have Stripe keys ready, or should payment integration be mocked/stubbed for now (UI only, no real Stripe SDK call)?

> [!NOTE]
> **Stripe vs PayPal**: The backlog lists both. Stripe is recommended for developer experience. Confirm preferred provider.

> [!NOTE]
> **Shipping cost and tax logic**: For MVP, should shipping and tax be hardcoded (e.g., flat ₱100 shipping, 0% tax) or calculated dynamically (e.g., based on province)?

---

## Proposed Changes

### 4.1 — Shopping Cart

---

#### Backend

##### [NEW] `Models/Cart.cs`
```
Cart (Id, UserId, CreatedAt, UpdatedAt)
CartItem (Id, CartId, ProductId, Quantity, UnitPrice, CreatedAt)
```

##### [NEW] `Models/CartItem.cs`

##### [MODIFY] `Data/AppDbContext.cs`
- Add `DbSet<Cart>` and `DbSet<CartItem>`
- Configure relationships: `User 1→1 Cart`, `Cart 1→N CartItem`, `CartItem N→1 Product`

##### [NEW] `DTOs/Responses/Cart/CartDto.cs`, `CartItemDto.cs`

##### [NEW] `DTOs/Requests/Cart/AddCartItemRequest.cs`, `UpdateCartItemRequest.cs`

##### [NEW] `Validators/AddCartItemValidator.cs`, `UpdateCartItemValidator.cs`

##### [NEW] `Interfaces/Repositories/ICartRepository.cs`

##### [NEW] `Repositories/CartRepository.cs`
- `GetCartByUserId`, `GetOrCreateCartAsync`, `AddItem`, `UpdateItemQuantity`, `RemoveItem`, `ClearCart`
- Before adding/updating: validate against `Product.Stock`

##### [NEW] `Interfaces/Services/ICartService.cs`

##### [NEW] `Services/CartService.cs`
- Business logic: stock validation, price snapshot at add-to-cart time

##### [NEW] `Controllers/CartController.cs`
- `[Authorize]` on all endpoints
- `GET /api/cart` → return cart with items
- `POST /api/cart/items` → add item (stock check)
- `PUT /api/cart/items/{id}` → update quantity (stock check)
- `DELETE /api/cart/items/{id}` → remove item
- `DELETE /api/cart` → clear entire cart

##### [NEW] `Mappers/CartMapper.cs`

##### [MODIFY] `Extensions/ServiceCollectionExtensions.cs`
- Register `ICartRepository → CartRepository`
- Register `ICartService → CartService`

##### EF Migration
- `dotnet ef migrations add AddCartAndCartItem`

---

#### Frontend

##### [NEW] `types/cart.ts`
```ts
CartItem { id, productId, productName, productImage, unitPrice, quantity, stock }
Cart { items: CartItem[], subtotal, itemCount }
```

##### [NEW] `lib/api/cart-api.ts`
- `cartApi.getCart(token)`
- `cartApi.addItem(productId, quantity, token)`
- `cartApi.updateItem(cartItemId, quantity, token)`
- `cartApi.removeItem(cartItemId, token)`
- `cartApi.clearCart(token)`

##### [NEW] `lib/stores/useCartStore.ts` (Zustand)
- State: `items[]`, `isLoading`, `isSyncing`
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `syncFromServer`, `setItems`
- Persist to `localStorage` for guests
- On login: merge guest cart → server cart

##### [NEW] `hooks/useCart.ts`
- Wraps `useCartStore` + exposes `cartCount`, `subtotal`, `addToCart`, `removeFromCart`, `updateQuantity`
- Auto-syncs with backend if user is authenticated

##### [MODIFY] `components/shared/Header.tsx`
- Import `useCart` hook
- Replace hardcoded `0` badge with `cartCount` from store
- Wire cart icon to open `CartSheet`

##### [NEW] `components/features/cart/CartSheet.tsx`
- Uses shadcn `Sheet` (side drawer) triggered by cart icon in header
- Lists `CartItem` rows with qty controls and remove buttons
- Shows subtotal + "Go to Checkout" CTA
- Empty state: illustration + "Start Shopping" link

##### [NEW] `components/features/cart/CartItemRow.tsx`
- Product image, name, unit price, quantity stepper, remove button

##### [NEW] `components/features/cart/EmptyCartState.tsx`

##### [NEW] `app/cart/page.tsx` — Full cart page
- Mirrors CartSheet content but full-page layout
- Sticky order summary panel on desktop

##### [NEW] `components/features/cart/CartPage.tsx` (feature component)
- Cart item list + editable quantities
- Subtotal / proceed to checkout

##### [NEW] `components/features/products/AddToCartButton.tsx`
- Replace the stub "Add to Cart" button on the product detail page
- Calls `useCart().addToCart(productId, qty)`
- Stock validation feedback

---

### 4.2 — Checkout Flow

---

#### Backend

##### [NEW] `DTOs/Requests/Orders/CheckoutRequest.cs`
```
{ AddressId (or inline address), CartId }
```

##### [NEW] `DTOs/Responses/Orders/CheckoutSummaryDto.cs`
```
{ Items[], Subtotal, ShippingFee, Tax, Total, ShippingAddress }
```

##### [NEW] `Controllers/OrdersController.cs` (stub — just checkout preview for 4.2)
- `POST /api/orders/checkout` — validates cart, calculates totals, returns `CheckoutSummaryDto` (does NOT create order yet; order is created after payment in 4.3)

##### [NEW] `Interfaces/Services/IOrderService.cs`

##### [NEW] `Services/OrderService.cs`
- `CalculateCheckoutSummary`: stock re-validation, subtotal, flat shipping & tax for MVP

---

#### Frontend

##### [NEW] `app/checkout/page.tsx`
- Route-guard: redirect to `/signin` if unauthenticated
- Multi-step layout (Step 1: Shipping → Step 2: Review → Step 3: Payment)

##### [NEW] `components/features/checkout/CheckoutPage.tsx`
- Orchestrates stepper state machine

##### [NEW] `components/features/checkout/CheckoutStepper.tsx`
- Progress indicator (3 steps)

##### [NEW] `components/features/checkout/ShippingStep.tsx`
- Step 1: Shipping address selection (saved addresses) or new address form
- Pre-fill from user's saved addresses via `userApi.getAddresses()`

##### [NEW] `components/features/checkout/OrderReviewStep.tsx`
- Step 2: Summary of items, shipping address, cost breakdown
- Calls `POST /api/orders/checkout` to get server-calculated totals

##### [NEW] `lib/validators/checkout.ts`
- Zod schema for new address form

---

### 4.3 — Payment Integration

---

#### Backend

> [!NOTE]
> If Stripe keys aren't ready, this section will be implemented as a **mock** — the endpoint accepts a fake `paymentMethodId` and always returns success.

##### [NEW] `Models/Payment.cs`
```
Payment (Id, OrderId, Status, Provider, ProviderReference, Amount, Currency, CreatedAt)
```

##### [NEW] `Configurations/StripeSettings.cs`
- `SecretKey`, `WebhookSecret`, `PublishableKey`

##### [MODIFY] `appsettings.json` + `.env.example`
- Add `Stripe:SecretKey`, `Stripe:WebhookSecret`, `Stripe:PublishableKey`

##### [MODIFY] `Extensions/ServiceCollectionExtensions.cs`
- Register `IPaymentService → StripePaymentService`

##### [NEW] `Interfaces/Services/IPaymentService.cs`

##### [NEW] `Services/StripePaymentService.cs`
- `CreatePaymentIntentAsync(amount, currency)` → returns `clientSecret`

##### [MODIFY] `Controllers/OrdersController.cs`
- `POST /api/orders/payment-intent` — create Stripe PaymentIntent, return `clientSecret`
- `POST /api/orders/webhook` — handle `payment_intent.succeeded` and `payment_intent.payment_failed`; mark order paid/failed

---

#### Frontend

##### [NEW] `components/features/checkout/PaymentStep.tsx`
- Step 3: Stripe Elements form (card number, expiry, CVC)
- Trust/security badges (SSL, Secure Checkout copy)
- Payment error display

##### [NEW] `lib/stripe.ts`
- Initialize `loadStripe()` with publishable key

---

### 4.4 — Order Confirmation & History

---

#### Backend

##### [NEW] `Models/Order.cs`
```
Order (Id, UserId, Status, Subtotal, ShippingFee, Tax, Total, ShippingAddressSnapshot [json], CreatedAt, UpdatedAt)
OrderItem (Id, OrderId, ProductId, ProductName, UnitPrice, Quantity)
```
- `OrderStatus` enum: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

##### [NEW] `Models/OrderItem.cs`

##### [MODIFY] `Data/AppDbContext.cs`
- Add `DbSet<Order>`, `DbSet<OrderItem>`, `DbSet<Payment>`
- Configure relationships

##### [NEW] `DTOs/Responses/Orders/OrderDto.cs`, `OrderItemDto.cs`

##### [NEW] `Interfaces/Repositories/IOrderRepository.cs`

##### [NEW] `Repositories/OrderRepository.cs`
- `CreateOrder`, `GetOrderById`, `GetOrdersByUserId`

##### [MODIFY] `Services/OrderService.cs`
- `CreateOrderAsync`: atomically create `Order` + `OrderItem`s, decrement `Product.Stock`, clear `Cart`

##### [MODIFY] `Controllers/OrdersController.cs`
- `POST /api/orders` — called by webhook handler after successful payment to finalize order record
- `GET /api/orders` — user's order list (paginated)
- `GET /api/orders/{id}` — single order detail

##### [NEW] Email: Order Confirmation
- Send email via existing SMTP/SendGrid (or stub log if not configured)

---

#### Frontend

##### [NEW] `app/orders/confirmation/page.tsx`
- Shows after successful checkout redirect with order ID in query param

##### [NEW] `components/features/orders/OrderConfirmationPage.tsx`
- Order number, items summary, estimated delivery, "Continue Shopping" CTA

##### [NEW] `app/orders/[id]/page.tsx`
- Order detail page

##### [NEW] `components/features/orders/OrderDetailPage.tsx`
- Full order detail: items, status badge, shipping address, payment info

##### [MODIFY] Profile → Order History tab
- Order list in profile → "Order History" tab
- Status badges with color coding

##### [NEW] `types/order.ts`
```ts
OrderStatus, OrderItemDto, OrderDto, OrderSummary
```

##### [NEW] `lib/api/orders-api.ts`
- `ordersApi.getOrders(token)`
- `ordersApi.getOrder(id, token)`
- `ordersApi.createPaymentIntent(token)`

##### [NEW] `hooks/useOrders.ts`
- Fetch user orders with loading/error state

---

## File Summary

### Backend (`apps/api-oos/`)

| Type | Count |
|------|-------|
| New Models | 5 (`Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`) |
| New Controllers | 2 (`CartController`, `OrdersController`) |
| New Services | 3 (`CartService`, `OrderService`, `StripePaymentService`) |
| New Repositories | 2 (`CartRepository`, `OrderRepository`) |
| New DTOs | ~12 |
| New Validators | 3 |
| New Interfaces | 5 |
| EF Migrations | 2 |

### Frontend (`apps/web-shop/`)

| Type | Count |
|------|-------|
| New Pages | 4 (`/cart`, `/checkout`, `/orders/confirmation`, `/orders/[id]`) |
| New Feature Components | ~14 |
| New Hooks | 2 (`useCart`, `useOrders`) |
| New Store | 1 (`useCartStore` - Zustand) |
| New API modules | 2 (`cart-api.ts`, `orders-api.ts`) |
| New Types | 2 (`cart.ts`, `order.ts`) |
| Modified | `Header.tsx`, `api-client.ts`, Profile order history tab |

---

## Verification Plan

### Automated
- `dotnet build` — zero errors after migrations and new files
- `dotnet ef migrations add` — clean migration script
- `pnpm type-check` — zero TypeScript errors in web-shop

### Manual E2E
1. Browse products → click "Add to Cart" → cart badge updates
2. Open CartSheet → adjust quantity → remove item → verify subtotal
3. Click "Checkout" → step through Shipping → Review → Payment
4. Submit test card (Stripe test mode) → land on Order Confirmation page
5. Check Profile → Order History tab shows the new order
6. Verify `Product.Stock` decremented in DB after checkout
7. Guest flow: add items → prompted to login → cart preserved

---

## Assumptions

- Stripe will be used with test keys for development; real keys for production.
- Shipping fee: flat ₱100 for MVP; tax: 0% (can be parameterized later).
- Guest cart support is in-scope (Zustand local state only; no backend cart until login).
- Order confirmation email is best-effort (log if SMTP unconfigured).
- No admin order management UI is in scope for this epic.
