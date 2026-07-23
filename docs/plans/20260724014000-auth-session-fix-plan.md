# Fix Authentication Session Synchronization & Profile Navigation Plan

## Problem Summary
When a user logs in via `LoginForm.tsx`, `signIn("credentials", { redirect: false })` is called followed by `router.push(callbackUrl)`. Because `router.push` performs a soft Next.js client-side transition without re-mounting the root `SessionProvider`, `useSession()` on the client continues returning `status = "unauthenticated"` and `session = null` until a full browser page refresh occurs.

This causes cascading issues across the application:
1. **Header User Icon**: `accountHref` evaluates to `/signin`. Clicking it sends the logged-in user to `/signin`, where NextAuth's middleware redirects them back to `/` (Homepage).
2. **Add to Cart**: `useCart.ts` sees `isAuthenticated` as `false`, showing a "Please sign in" toast and redirecting to `/signin`.
3. **Customer Reviews & Ratings**: `useReviews.ts` sees `isAuthenticated` as `false`, displaying "You must be logged in to leave feedback".
4. **Profile Page Access**: Profile data fails to load because `token` in `useProfilePage.ts` is empty.

## Proposed Changes

### 1. `apps/web-shop/src/components/features/auth/LoginForm.tsx`
- On successful credentials authentication, perform a full page transition via `window.location.href = callbackUrl` instead of `router.push(callbackUrl)`. This ensures NextAuth's session cookies are read cleanly upon page mount and `SessionProvider` initializes with `status = "authenticated"` and valid `accessToken`.

### 2. `apps/web-shop/src/components/shared/Header.tsx`
- Ensure `accountHref` correctly maps to `/profile` whenever `status === "authenticated"` or `session?.user` exists.
- Ensure mobile navigation links reflect `isAuthenticated` state accurately.

### 3. `apps/web-shop/src/hooks/useCart.ts`, `useReviews.ts`, `useOrders.ts`
- Audit authentication checks to rely consistently on `status === "authenticated"` and valid `session?.accessToken`.

### 4. `apps/web-shop/src/auth.ts`
- Ensure `jwt` and `session` callbacks preserve `accessToken` and `user` properties across all token refreshes.
- Ensure public paths include `/products`.

## Verification Plan
1. **Login & Redirection**: Sign in with valid credentials. Verify browser redirects to requested `callbackUrl` with session active.
2. **Header Navigation**: Click the User icon in the top header. Verify it navigates directly to `/profile` without redirecting to `/signin` or `/`.
3. **Cart Operations**: Click "Add to Cart" on a product while logged in. Verify item is added successfully without "Please sign in" prompt.
4. **Product Reviews**: Navigate to a product page while logged in. Verify "Write a Review" form is visible and interactive for logged-in user.
5. **Profile Page**: Verify `/profile` loads user details and saved addresses.
