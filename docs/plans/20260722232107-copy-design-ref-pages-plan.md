# Plan: Copy and Integrate `.design-ref/` Design Templates into `apps/web-shop`

**Timestamp:** 2026-07-22T23:21:07+08:00  
**Plan File:** `docs/plans/20260722232107-copy-design-ref-pages-plan.md`

## 1. Overview
The `.design-ref/` directory contains HTML templates and design tokens for the entire customer experience:
- **`landing_page/code.html`**: Premium Hero, Artisanal Ube Jam Highlights, Product Bento Grid, Heritage Story, Trust badging.
- **`login_signup/code.html`**: Dual-view Auth layout with decorative background glow, floating cards, forms, and validation styling.
- **`product_catalog/`**, **`product_detail/`**, **`shopping_cart/`**, **`checkout_flow/`**, **`profile_settings/`**: Additional views.

We will integrate these design reference HTML templates into `apps/web-shop` React 19 / Next.js 16 components while preserving existing functional APIs, NextAuth wiring, and form state handling.

---

## 2. Proposed Changes

### 2.1 CSS & Design Tokens
**[MODIFY] [`apps/web-shop/src/app/globals.css`](file:///home/friedrich/workspace/monorepo/br-online-shop/apps/web-shop/src/app/globals.css)**
Add full palette of Material Design 3 / Heritage Ube design tokens from `.design-ref/`:
- `--primary`: `#451077`
- `--primary-container`: `#5d2d8f`
- `--secondary`: `#7748a7`
- `--secondary-container`: `#cb98fe`
- `--surface-bright`: `#fcf9f8`
- `--surface-container`: `#f0eded`
- `--surface-container-low`: `#f6f3f2`
- `--on-primary`: `#ffffff`
- `--on-surface`: `#1c1b1b`
- `--on-surface-variant`: `#4b4451`
- `--outline`: `#7d7482`
- `--outline-variant`: `#cdc3d2`

---

### 2.2 Landing Page (`apps/web-shop/src/app/page.tsx` & `HomePage.tsx`)
**[MODIFY] [`apps/web-shop/src/components/features/home/HomePage.tsx`](file:///home/friedrich/workspace/monorepo/br-online-shop/apps/web-shop/src/components/features/home/HomePage.tsx)**
Convert `.design-ref/landing_page/code.html` into modular Next.js TSX sections:
1. **Hero Section**: Large title, artisanal subtitle, CTA buttons (`Shop Collection`, `Our Story`), product showcase card with fresh batch pill.
2. **Brand Heritage Banner**: Highlight 100% Real Purple Yam, No Artificial Fillers, Family Recipe.
3. **Featured Products Grid**: Product cards with image, price, weight badge, and "Add to Cart" button.
4. **Testimonials & Trust Section**: Badges for Fresh Batch, Fast Local Shipping, Guaranteed Quality.

---

### 2.3 Auth Pages (`apps/web-shop/src/app/(auth)`)
**[MODIFY] [`apps/web-shop/src/components/features/auth/LoginForm.tsx`](file:///home/friedrich/workspace/monorepo/br-online-shop/apps/web-shop/src/components/features/auth/LoginForm.tsx)**
- Adapt markup to match `.design-ref/login_signup/code.html` login card layout while retaining `react-hook-form` + NextAuth `signIn("credentials")`.

**[MODIFY] [`apps/web-shop/src/components/features/auth/SignupForm.tsx`](file:///home/friedrich/workspace/monorepo/br-online-shop/apps/web-shop/src/components/features/auth/SignupForm.tsx)**
- Adapt markup to match `.design-ref/login_signup/code.html` signup card layout while retaining `react-hook-form` + `authApi.register()` backend call.

---

## 3. Verification Plan

### Automated Tests
1. Run `npx tsc --noEmit` in `apps/web-shop` to verify TypeScript compilation.
2. Run `pnpm build` to verify Next.js production build succeeds across all routes.

### Manual Verification
1. Open `/` in browser to verify landing page visual design matches `.design-ref/landing_page/screen.png`.
2. Open `/signin` and `/signup` to verify auth forms match `.design-ref/login_signup/screen.png`.
