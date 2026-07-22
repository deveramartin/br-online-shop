# Refactor Plan: HomePage & ProfilePage

Splits two oversized page-level components (`HomePage.tsx` at 377 lines and `ProfilePage.tsx` at 364 lines) into focused sub-components and custom hooks to bring each file under the ~200-line cap per the `next-refactor` skill.

---

## Metrics

| File | Current Lines | Target |
|---|---|---|
| `HomePage.tsx` | 377 | ≤ 200 |
| `ProfilePage.tsx` | 364 | ≤ 200 |

---

## Proposed Changes

### HomePage (`apps/web-shop/src/components/features/home/`)

`HomePage.tsx` currently contains **six distinct rendering concerns** inlined as one monolith. Each becomes a focused co-located sub-component.

#### [MODIFY] `HomePage.tsx`
- Becomes a thin orchestrator (~50 lines): imports and composes the five new sub-components below.

#### [NEW] `HomeHeroSection.tsx`
- **Lines extracted**: ~40 (lines 11–52)
- **Concern**: Hero headline, CTA buttons, logo image, decorative background blobs.

#### [NEW] `HomeTrustBadges.tsx`
- **Lines extracted**: ~30 (lines 54–87)
- **Concern**: Trust badges bar ("100% Real Yam", "Slow Cooked Fresh", "Fast Local Delivery").

#### [NEW] `HomeSignatureCollection.tsx`
- **Lines extracted**: ~107 (lines 89–215)
- **Concern**: "The Signature Collection" section header + 4 product cards.
  - Extracts a reusable `HomeProductCard` component inside this file to eliminate repeated card markup (reduces ~80 lines of duplication to a data-driven list).

#### [NEW] `HomeBrandStory.tsx`
- **Lines extracted**: ~49 (lines 217–266)
- **Concern**: "Est. 1985" brand story section with image and features grid.

#### [NEW] `HomeTestimonials.tsx`
- **Lines extracted**: ~66 (lines 268–337)
- **Concern**: "Loved by Generations" testimonials grid.

#### [NEW] `HomeNewsletter.tsx`
- **Lines extracted**: ~34 (lines 339–373)
- **Concern**: Newsletter subscribe CTA section with gradient background.

---

### ProfilePage (`apps/web-shop/src/components/features/profile/`)

`ProfilePage.tsx` mixes data-fetching, address CRUD logic, profile form state, and three separate tab views in one file. Split into a custom hook and three tab components.

#### [NEW] `useProfilePage.ts` → `apps/web-shop/src/hooks/useProfilePage.ts`
- **Concern**: All stateful logic extracted from `ProfilePage.tsx`:
  - Session/token resolution
  - `user` + `addresses` state + `isLoadingUser`
  - Address modal state (`isAddressModalOpen`, `editingAddress`, `isSavingAddress`)
  - Profile form (`useForm`, `profileSchema`, success/error messages)
  - `useEffect` data fetch (`getMe` + `getAddresses`)
  - All handlers: `onProfileSubmit`, `handleOpenAddAddress`, `handleEditAddress`, `handleSaveAddress`, `handleDeleteAddress`
- Returns a single typed object consumed by `ProfilePage`.

#### [MODIFY] `ProfilePage.tsx`
- Becomes a thin orchestrator (~60 lines):
  - Calls `useProfilePage()` to get all state & handlers.
  - Renders the sidebar nav + routes to the three tab sub-components.
  - Renders `<AddressModal />`.

#### [NEW] `ProfileSidebar.tsx`
- **Lines extracted**: ~45 (lines 136–177)
- **Concern**: Navigation sidebar with tab buttons and Sign Out.
- Props: `activeTab`, `onTabChange`, `onSignOut`.

#### [NEW] `ProfilePersonalTab.tsx`
- **Lines extracted**: ~80 (lines 186–264)
- **Concern**: Avatar header, success/error banners, profile edit form.
- Props: `user`, `form`, `onSubmit`, `successMessage`, `errorMessage`.

#### [NEW] `ProfileAddressesTab.tsx`
- **Lines extracted**: ~38 (lines 267–302)
- **Concern**: Address list, empty state, "Add New" button.
- Props: `addresses`, `onAddNew`, `onEdit`, `onDelete`.

#### [NEW] `ProfileOrdersTab.tsx`
- **Lines extracted**: ~43 (lines 305–347)
- **Concern**: Order history table (placeholder data).
- No props required currently.

---

## File Tree Summary

```
apps/web-shop/src/
├── components/features/home/
│   ├── HomePage.tsx                  ← MODIFY (orchestrator, ~50 lines)
│   ├── HomeHeroSection.tsx           ← NEW
│   ├── HomeTrustBadges.tsx           ← NEW
│   ├── HomeSignatureCollection.tsx   ← NEW  (includes HomeProductCard internally)
│   ├── HomeBrandStory.tsx            ← NEW
│   ├── HomeTestimonials.tsx          ← NEW
│   └── HomeNewsletter.tsx            ← NEW
├── components/features/profile/
│   ├── ProfilePage.tsx               ← MODIFY (orchestrator, ~60 lines)
│   ├── ProfileSidebar.tsx            ← NEW
│   ├── ProfilePersonalTab.tsx        ← NEW
│   ├── ProfileAddressesTab.tsx       ← NEW
│   └── ProfileOrdersTab.tsx          ← NEW
└── hooks/
    └── useProfilePage.ts             ← NEW
```

---

## Validation Plan

### Checklist
- [ ] All target files are under ~200 lines.
- [ ] Each component has a single, concise responsibility.
- [ ] All imports resolve correctly (no broken paths).
- [ ] `ProfilePage` still renders the `AddressModal` correctly.
- [ ] Build passes: `pnpm --filter web-shop build` (or `dev` server has no TS errors).

### Manual Verification
- Navigate to `/` — all Home sections render (Hero, Trust Badges, Collection, Brand Story, Testimonials, Newsletter).
- Navigate to `/profile` (authenticated) — sidebar tabs switch correctly, profile form submits, addresses CRUD works.
