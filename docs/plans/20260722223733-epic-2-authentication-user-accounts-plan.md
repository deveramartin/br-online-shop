# Epic 2 — Authentication & User Accounts

> **Branch**: `feat/epic-2-auth-user-accounts`
> **Source of truth**: `docs/specs/backlogs.md` §EPIC 2
> **Design reference**: `.design-ref/login_signup/`, `.design-ref/profile_settings/`, `.design-ref/heritage_ube_boutique/DESIGN.md`

---

## Goal Description

Implement a complete, full-stack authentication and user-account system for the **web-shop** customer experience. This covers:

| Task | Summary |
|------|---------|
| 2.1 | User Registration (Signup) |
| 2.2 | User Login + JWT tokens |
| 2.3 | Forgot / Reset Password |
| 2.4 | Profile Settings (personal info, addresses) |
| 2.5 | Logout & session handling |

**Backend**: Custom credential auth built on top of the existing `ApiOos` ASP.NET Core project — using `BCrypt.Net-Next` for hashing and the already-wired `JwtBearer` middleware.
**Frontend**: `apps/web-shop` (Next.js 16/React 19) — replacing the OIDC proxy auth with a credentials-based flow that stores the JWT in an `httpOnly` cookie via a Next.js API route.

---

## User Review Required

**auth.ts strategy change** — Epic 1's `auth.ts` uses an OIDC `authservice` provider pointing to `process.env.AUTH_ISSUER`. Epic 2 will replace this with a Credentials provider calling `POST /api/auth/login`. The existing OIDC wiring will be removed.

**Email sending (Forgot Password)** — For now the plan implements a console/log sink in development (reset token is returned in API response JSON). SMTP/SendGrid integration is deferred. Please confirm this approach.

**Password-change endpoint (2.4)** — `PUT /api/users/me/password` requires the caller to provide their current password. Confirm this design is correct.

---

## Open Questions

**Payment Methods (2.4)** — Requires a payment provider (GCash, PayMaya, Stripe). Sub-task will be deferred — only a UI placeholder tab will be added. Please confirm.

**Avatar upload (2.4)** — Requires object storage. Plan defaults to a local-preview-only `<input type="file">` without backend persistence. Please confirm.

---

## Architecture Overview

```
Browser → POST /api/auth/signin (credentials)
        ↓
Next.js → POST /api/auth/login {email, password}
        ↓
ASP.NET API → SELECT User WHERE email → BCrypt.Verify
        ↓
API → { accessToken, refreshToken, user }
        ↓
Next.js → Set httpOnly cookie (NextAuth session)
        ↓
Browser → GET /profile (protected route)
        ↓
Next.js → GET /api/users/me (Bearer accessToken)
        ↓
Browser ← UserDto → Profile page
```

---

## Proposed Changes

### 0. Git Setup

```bash
git checkout -b feat/epic-2-auth-user-accounts
```

---

### 1. Backend — `apps/api-oos`

#### 1.1 New NuGet package

```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
```

#### 1.2 Domain Models

**[NEW] `Models/User.cs`**
- Guid Id, FullName, Email (unique), PasswordHash
- PhoneNumber?, AvatarUrl?, PreferredLanguage?
- RefreshToken?, RefreshTokenExpiry?
- PasswordResetToken?, PasswordResetTokenExpiry?
- CreatedAt, UpdatedAt, ICollection<Address> Addresses

**[NEW] `Models/Address.cs`**
- Guid Id, UserId (FK), Label, Street, City, Province, PostalCode, Country
- bool IsDefault, CreatedAt

**[MODIFY] `Data/AppDbContext.cs`**
- Add DbSet<User>, DbSet<Address>
- Unique index on User.Email
- Cascade delete User → Addresses

**[NEW] EF Migration**
```bash
dotnet ef migrations add AddUserAndAddress
dotnet ef database update
```

#### 1.3 DTOs

**Requests/Auth/**: RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, RefreshTokenRequest
**Requests/Users/**: UpdateProfileRequest, ChangePasswordRequest, AddressRequest
**Responses/Auth/**: AuthResponse (AccessToken, RefreshToken, UserDto), UserDto
**Responses/Users/**: AddressDto

#### 1.4 Validators (FluentValidation)

**RegisterRequestValidator**: FullName (max 100), Email (valid), Password (min 8, uppercase, digit)
**LoginRequestValidator**: Email (valid), Password (not empty)

#### 1.5 Interfaces

**IUserRepository**: GetByIdAsync, GetByEmailAsync, GetByRefreshTokenAsync, GetByResetTokenAsync, CreateAsync, UpdateAsync, GetAddressesAsync, AddAddressAsync, GetAddressByIdAsync, UpdateAddressAsync, DeleteAddressAsync

**IAuthService**: RegisterAsync, LoginAsync, RefreshAsync, RevokeAsync, ForgotPasswordAsync, ResetPasswordAsync

**IUserService**: GetMeAsync, UpdateMeAsync, ChangePasswordAsync, GetAddressesAsync, AddAddressAsync, UpdateAddressAsync, DeleteAddressAsync

#### 1.6 Repository

**[NEW] `Repositories/UserRepository.cs`** — Implements IUserRepository with AppDbContext (all async EF Core queries)

#### 1.7 Services

**[NEW] `Helpers/JwtTokenHelper.cs`**
- GenerateAccessToken(User) → 60-min JWT using appsettings Jwt section
- GenerateRefreshToken() → 64-byte base64 cryptographic random

**[NEW] `Services/AuthService.cs`**
- Register: BCrypt.HashPassword → create User → generate tokens
- Login: lookup by email → BCrypt.Verify → generate tokens
- Refresh: validate refresh token in DB → issue new pair
- Revoke: clear refresh token in DB
- ForgotPassword: random token + 30min expiry → log to console in dev
- ResetPassword: validate token → BCrypt.HashPassword new → clear token

**[NEW] `Services/UserService.cs`**
- GetMe, UpdateMe, ChangePassword, GetAddresses, AddAddress, UpdateAddress, DeleteAddress

#### 1.8 Controllers

**[NEW] `Controllers/AuthController.cs`** — public endpoints:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

**[NEW] `Controllers/UsersController.cs`** — [Authorize] endpoints:
```
GET    /api/users/me
PUT    /api/users/me
PUT    /api/users/me/password
GET    /api/users/me/addresses
POST   /api/users/me/addresses
PUT    /api/users/me/addresses/{id}
DELETE /api/users/me/addresses/{id}
```

#### 1.9 Service Registration

**[MODIFY] `Extensions/ServiceCollectionExtensions.cs`** — add `AddDomainServices()`:
```csharp
services.AddScoped<JwtTokenHelper>();
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IAuthService, AuthService>();
services.AddScoped<IUserService, UserService>();
```

**[MODIFY] `Program.cs`** — call `builder.Services.AddDomainServices()`

---

### 2. Frontend — `apps/web-shop`

Design faithfully follows `.design-ref/login_signup/screen.png` (centered card + purple blobs) and `.design-ref/profile_settings/screen.png` (sidebar tabs, 3/9 bento grid).

#### 2.1 New packages
```bash
pnpm add react-hook-form zod @hookform/resolvers
```

#### 2.2 Auth re-wiring

**[MODIFY] `src/auth.ts`** — Replace OIDC with Credentials provider:
- `authorize()` calls `apiClient.post<AuthResponse>("/auth/login", credentials)`
- JWT callback stores accessToken + refreshToken on token
- `authorized()` callback allows public paths: /signin, /signup, /forgot-password, /reset-password

**[MODIFY] `src/types/next-auth.d.ts`** — Add `accessToken: string` to Session and User; `refreshToken: string` to User

#### 2.3 New shared types

**[NEW] `src/types/auth.ts`** — AuthResponse, UserDto, AddressDto TypeScript interfaces

#### 2.4 API Client extension

**[MODIFY] `src/lib/api/api-client.ts`** — Add:
- `authApi`: register, forgotPassword, resetPassword
- `userApi`: getMe, updateMe, changePassword, getAddresses, addAddress, updateAddress, deleteAddress

#### 2.5 Validators

**[NEW] `src/lib/validators/auth.ts`** — Zod schemas:
- loginSchema, registerSchema (with cross-field password match refine)
- forgotPasswordSchema, resetPasswordSchema
- addressSchema

#### 2.6 CSS tokens extension

**[MODIFY] `src/app/globals.css`** — Add missing design tokens:
`--surface-variant`, `--error`, `--error-container`, `--primary-fixed`, `--primary-container`, `--on-primary-container`, `--secondary-container`, `--on-secondary-container`, `--outline-variant`

#### 2.7 Auth route group layout

**[NEW] `src/app/(auth)/layout.tsx`** — No site header/footer. Cream background with decorative purple blobs (blur circles) matching design ref. Centered flex layout.

#### 2.8 Pages

| Path | Component | Notes |
|------|-----------|-------|
| `(auth)/signin/page.tsx` | `<LoginForm />` | Move from /signin |
| `(auth)/signup/page.tsx` | `<SignupForm />` | NEW |
| `(auth)/forgot-password/page.tsx` | `<ForgotPasswordForm />` | NEW |
| `(auth)/reset-password/page.tsx` | `<ResetPasswordForm />` | NEW, reads ?token= |
| `profile/page.tsx` | `<ProfilePage />` | NEW, protected |

#### 2.9 Feature Components

**[NEW] `src/components/features/auth/LoginForm.tsx`**
- Card: max-w-md, white bg, brand h1 in primary purple
- Fields: email, password with Forgot Password link
- Submit: pill "Login" button (primary purple)
- Links to /signup

**[NEW] `src/components/features/auth/SignupForm.tsx`**
- Card: max-w-lg
- Fields: Full Name, Email, 2-col (Password + Confirm), ToS checkbox
- Submit: pill "Create Account"

**[NEW] `src/components/features/auth/ForgotPasswordForm.tsx`**
- Single email field → success state "Check your inbox"

**[NEW] `src/components/features/auth/ResetPasswordForm.tsx`**
- Reads token from useSearchParams
- Two password fields → redirect to /signin on success

**[NEW] `src/components/features/profile/ProfilePage.tsx`**
- 3/9 grid layout on desktop
- Sidebar: Personal Info, Saved Addresses, Order History, Sign Out
- Panels: form tabs for each section
- Active tab highlighted with primary-container bg

**[NEW] `src/components/features/profile/AddressCard.tsx`**
- Label, icon, address lines, default badge
- Edit/delete icon buttons

**[NEW] `src/components/features/profile/AddressModal.tsx`**
- Native dialog or div overlay
- react-hook-form + addressSchema
- Fields: Label, Street, City, Province, PostalCode, Country, Is Default

#### 2.10 Shared UI primitives

**[NEW] `src/components/ui/FormField.tsx`** — label + input + error wrapper
**[NEW] `src/components/ui/Modal.tsx`** — generic dialog overlay

---

## File Change Summary

```
apps/api-oos/
  ApiOos.csproj                                         MODIFY
  Models/User.cs                                        NEW
  Models/Address.cs                                     NEW
  Data/AppDbContext.cs                                  MODIFY
  Data/Migrations/AddUserAndAddress.cs                  NEW (generated)
  DTOs/Requests/Auth/{Register,Login,ForgotPassword,
    ResetPassword,RefreshToken}Request.cs               NEW (5 files)
  DTOs/Requests/Users/{UpdateProfile,ChangePassword,
    Address}Request.cs                                  NEW (3 files)
  DTOs/Responses/Auth/{AuthResponse,UserDto}.cs         NEW (2 files)
  DTOs/Responses/Users/AddressDto.cs                    NEW
  Validators/{Register,Login}RequestValidator.cs        NEW (2 files)
  Interfaces/Repositories/IUserRepository.cs            NEW
  Interfaces/Services/{IAuth,IUser}Service.cs           NEW (2 files)
  Repositories/UserRepository.cs                        NEW
  Services/{Auth,User}Service.cs                        NEW (2 files)
  Helpers/JwtTokenHelper.cs                             NEW
  Controllers/{Auth,Users}Controller.cs                 NEW (2 files)
  Extensions/ServiceCollectionExtensions.cs             MODIFY
  Program.cs                                            MODIFY

apps/web-shop/
  package.json                                          MODIFY
  src/auth.ts                                           MODIFY
  src/types/next-auth.d.ts                              MODIFY
  src/types/auth.ts                                     NEW
  src/app/globals.css                                   MODIFY
  src/app/(auth)/layout.tsx                             NEW
  src/app/(auth)/signin/page.tsx                        MODIFY
  src/app/(auth)/signup/page.tsx                        NEW
  src/app/(auth)/forgot-password/page.tsx               NEW
  src/app/(auth)/reset-password/page.tsx                NEW
  src/app/profile/page.tsx                              NEW
  src/lib/api/api-client.ts                             MODIFY
  src/lib/validators/auth.ts                            NEW
  src/components/ui/FormField.tsx                       NEW
  src/components/ui/Modal.tsx                           NEW
  src/components/features/auth/LoginForm.tsx            NEW
  src/components/features/auth/SignupForm.tsx           NEW
  src/components/features/auth/ForgotPasswordForm.tsx   NEW
  src/components/features/auth/ResetPasswordForm.tsx    NEW
  src/components/features/profile/ProfilePage.tsx       NEW
  src/components/features/profile/AddressCard.tsx       NEW
  src/components/features/profile/AddressModal.tsx      NEW
```

---

## Verification Plan

### Automated Tests
```bash
# Backend
cd apps/api-oos && dotnet build && dotnet test

# Frontend
cd apps/web-shop && pnpm lint && pnpm type-check

# Monorepo
pnpm build
```

### Manual Verification

| Flow | Steps | Expected |
|------|-------|----------|
| Signup | /signup → fill → submit | Home, session set |
| Login | /signin → valid creds | Home |
| Invalid login | Wrong password | Inline error |
| Protected route | /profile unauthenticated | Redirect /signin |
| Profile update | Change name, save | Success feedback |
| Add address | Modal → fill → save | Card in list |
| Delete address | Delete button | Card removed |
| Forgot password | Email, submit | Success message |
| Reset password | /reset-password?token=xxx | Redirect /signin |
| Logout | Sign Out button | Redirect /signin |

### Swagger API Verification
- `POST /api/auth/register` → 200 + AuthResponse
- `POST /api/auth/login` → 200 + AuthResponse
- `GET /api/users/me` without Bearer → 401
- `GET /api/users/me` with Bearer → 200 + UserDto

---

## Implementation Order

1. `git checkout -b feat/epic-2-auth-user-accounts`
2. **Backend**: Models → DbContext + Migration → DTOs → Validators → Interfaces → JwtTokenHelper → Repositories → Services → Controllers → Registration
3. **Frontend**: packages → globals.css → types → validators → api-client → auth.ts → layout → pages → feature components
4. Build & verify both apps
5. Update `docs/specs/backlogs.md` — check off Epic 2 tasks
6. `git commit` → PR to main
