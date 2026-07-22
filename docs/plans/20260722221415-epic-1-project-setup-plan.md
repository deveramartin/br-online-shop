# Implementation Plan — EPIC 1: Project Setup & Infrastructure

**Timestamp:** 20260722221415  
**Source of Truth:** `docs/specs/backlogs.md` EPIC 1 (lines 74–109)  
**Design Reference:** `.design-ref/heritage_ube_boutique/DESIGN.md`  
**Skill References:** `.agents/skills/dotnet-structure/SKILL.md` · `.agents/skills/web-nextjs-structure/SKILL.md`

---

## Background

From Epic 0, the monorepo already has:
- `apps/api-oos/` — minimal `.csproj` + `Program.cs` + `ApiOos.sln` with directory skeleton (all folders with `.gitkeep`)
- `apps/web-shop/` — migrated from `oos/`: Next.js 16 + Tailwind v4 + React 19, restructured under `src/` (App Router, `components/shared/`, `components/ui/`, `components/features/`, `hooks/`, `lib/api/`, `lib/validators/`, `types/`, `__tests__/`, `__mocks__/`)
- `apps/web-oos/` — a second Next.js app (Order & Ops dashboard)
- `packages/shared-types/`, `packages/config/`, `pnpm-workspace.yaml`, `turbo.json`, `docker-compose.yml`, CI pipelines

**Design System** (from `.design-ref/heritage_ube_boutique/DESIGN.md`):
- **Primary:** `#451077` / `#5D2D8F` · **Secondary:** `#7748A7` / `#9363C4`
- **Surface/BG:** `#FCF9F8` warm cream · **Text:** `#1C1B1B` charcoal
- **Font:** Inter (all weights) · **Radius:** `0.5rem` standard, `1rem` cards, `1.5rem` banners
- **Layout:** 1280px max-width, 12-col grid, 1.5rem gutters, 80px+ section gaps

---

## Decisions Locked

| # | Question | Decision |
|---|---|---|
| Q1 | shadcn/ui | **Yes** — Button, Card, Input, Form, Badge, Separator, Sheet, Skeleton, Dialog, Tabs, Accordion |
| Q2 | Fetch strategy | **Native `fetch`** — typed wrapper in `src/lib/api/api-client.ts` |
| Q3 | Error monitoring | **Defer to Epic 10** |
| Q4 | Hosting | **Placeholder values** — Azure App Service (backend), Vercel (frontend) |
| Q5 | Logging | **Serilog** + console sink for structured JSON logs |
| Q6 | `web-oos` scope | **Yes** — include `apps/web-oos/` frontend scaffolding in Epic 1 |

---

## Proposed Changes

### Story 1.1 — Backend (api-oos) Full Scaffold

Expanding from the minimal `ApiOos.csproj` placeholder created in Epic 0.

---

#### [MODIFY] `apps/api-oos/ApiOos.csproj`
Add NuGet packages:
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.*" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.*" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.2" />
<PackageReference Include="Serilog.Sinks.Console" Version="5.0.1" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.*" />
```

#### [NEW] `apps/api-oos/Program.cs` — Full startup
Replace minimal stub with:
- Serilog host builder
- EF Core + PostgreSQL registration via `AddDbContext<AppDbContext>`
- FluentValidation registration (`AddFluentValidationAutoValidation`)
- JWT Bearer auth middleware
- CORS policy for `http://localhost:3000` (web-shop) and `http://localhost:3004`
- Swagger + API versioning
- Global exception handler middleware
- Full `app.Use...` pipeline

#### [NEW] `apps/api-oos/Data/AppDbContext.cs`
```csharp
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // DbSet<> properties added as models are defined in later Epics
}
```

#### [NEW] `apps/api-oos/appsettings.json`
```json
{
  "Serilog": { "MinimumLevel": { "Default": "Information" } },
  "ConnectionStrings": { "DefaultConnection": "" },
  "Jwt": { "Issuer": "", "Audience": "", "SecretKey": "" },
  "AllowedOrigins": ["http://localhost:3000", "http://localhost:3004"],
  "AllowedHosts": "*"
}
```

#### [NEW] `apps/api-oos/appsettings.Development.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=brshop;Username=brshop;Password=brshopdev"
  },
  "Jwt": {
    "Issuer": "https://localhost:5001",
    "Audience": "br-online-shop",
    "SecretKey": "dev-secret-key-min-256-bits-long-for-hmac-sha256"
  }
}
```

#### [NEW] `apps/api-oos/Middleware/GlobalExceptionHandlerMiddleware.cs`
Catches unhandled exceptions, logs via `ILogger`, returns a consistent `ProblemDetails` JSON error response.

#### [NEW] `apps/api-oos/Extensions/ServiceCollectionExtensions.cs`
Extracts long registrations out of `Program.cs` into typed methods: `AddDatabase()`, `AddAuth()`, `AddCorsPolicy()`, `AddSwagger()`.

#### [NEW] `apps/api-oos/Configurations/JwtSettings.cs`
Options class bound from `appsettings.json`:
```csharp
public class JwtSettings
{
    public string Issuer { get; init; } = "";
    public string Audience { get; init; } = "";
    public string SecretKey { get; init; } = "";
}
```

#### [NEW] `apps/api-oos/Controllers/HealthController.cs`
```csharp
[Route("api/health")]
[ApiController]
public class HealthController : ControllerBase
{
    [HttpGet] public IActionResult Get() => Ok(new { Status = "Healthy" });
}
```

#### [MODIFY] `apps/api-oos/tests/ApiOos.Tests/ApiOos.Tests.csproj`
Add:
```xml
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="9.0.*" />
<PackageReference Include="FluentAssertions" Version="6.12.1" />
```

#### [MODIFY] `apps/api-oos/tests/ApiOos.Tests/UnitTest1.cs`
Replace placeholder with a real `HealthControllerTests.cs` file under `tests/ApiOos.Tests/Controllers/`.

---

### Story 1.2 — Frontend (web-shop) Full Scaffold

The `src/` structure is already in place from Epic 0. This story fills in the design system layer.

---

#### [MODIFY] `apps/web-shop/src/app/globals.css`
Replace existing minimal CSS with Heritage Ube Boutique design tokens as CSS custom properties:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', sans-serif;

  /* Brand colors */
  --color-primary:           #451077;
  --color-primary-container: #5D2D8F;
  --color-secondary:         #7748A7;
  --color-secondary-light:   #9363C4;

  /* Surface */
  --color-surface:           #FCF9F8;
  --color-surface-low:       #F6F3F2;
  --color-surface-container: #F0EDED;
  --color-surface-highest:   #E5E2E1;
  --color-white:             #FFFFFF;

  /* Text */
  --color-on-surface:        #1C1B1B;
  --color-on-surface-variant:#4B4451;
  --color-outline:           #7D7482;
  --color-outline-variant:   #CDC3D2;

  /* Semantic */
  --color-error:             #BA1A1A;
  --color-success:           #1B6B3A;

  /* Radius */
  --radius-sm:   0.25rem;
  --radius:      0.5rem;
  --radius-md:   0.75rem;
  --radius-lg:   1rem;
  --radius-xl:   1.5rem;
  --radius-full: 9999px;

  /* Spacing */
  --max-width:    1280px;
  --gutter:       1.5rem;
  --section-gap:  5rem;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-sans); background: var(--color-surface); color: var(--color-on-surface); }
```

#### [NEW] `apps/web-shop/components.json`
shadcn/ui configuration file (after `pnpm dlx shadcn@latest init`):
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "tailwind.config.ts", "css": "src/app/globals.css", "baseColor": "slate", "cssVariables": true },
  "aliases": { "components": "@/components", "utils": "@/lib/utils" }
}
```

#### [NEW] `apps/web-shop/src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

#### [NEW] `apps/web-shop/src/lib/api/api-client.ts`
Typed `fetch` wrapper pointing to `NEXT_PUBLIC_API_URL`:
```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

export async function apiGet<T>(path: string): Promise<T> { ... }
export async function apiPost<T>(path: string, body: unknown): Promise<T> { ... }
// etc.
```

#### [MODIFY] `apps/web-shop/src/app/layout.tsx`
Replace the current OOS-specific layout with a proper shop root layout:
- Load `Inter` font from `next/font/google`
- Apply design token CSS variables
- Remove `HeaderTabs` and `RedirectToLogin` from root layout (auth is Epic 2)
- Set `metadata` title to `"Bren Raphael's Ube Jam & Halaya Shop"`

#### [NEW] `apps/web-shop/src/components/shared/Header.tsx`
Top navigation bar:
- Logo / brand name left
- Nav links: Shop, About (stubs for now)
- Cart icon (stub) right

#### [NEW] `apps/web-shop/src/components/shared/Footer.tsx`
Footer stub with brand name and year.

#### [NEW] `apps/web-shop/src/app/page.tsx`
Landing page — renders a placeholder `<HomePage />` component (full hero content is Epic 3).

#### [NEW] `apps/web-shop/src/components/features/home/HomePage.tsx`
Placeholder component with a hero section showing brand name and coming-soon message styled with design tokens.

#### [MODIFY] `apps/web-shop/.env.example`
Ensure it has `NEXT_PUBLIC_API_URL=http://localhost:5001/api` and add any auth stubs.

---

### Story 1.3 — DevOps / Shared Setup

Items already done in Epic 0: Git branching strategy, CI pipelines.

#### [NEW] `apps/api-oos/Data/Seed/SeedData.cs`
Placeholder seeder class — actual product seed data populated in Epic 3.

#### Migration Workflow Documentation
- **Command to create first migration** (done after EF models defined in Epic 2/3):
  ```bash
  cd apps/api-oos && dotnet ef migrations add InitialCreate --output-dir Data/Migrations
  ```
- Document this in `apps/api-oos/README.md`.

#### [MODIFY] `apps/api-oos/README.md`
Add EF migrations workflow section.

#### Hosting Decision (Deferred)
- Document in `docs/adr/0002-hosting-strategy.md` as a placeholder ADR.
- Finalize in Epic 10.

---

## Target Structure After Epic 1

### Backend (`apps/api-oos/`)
```
apps/api-oos/
├── Configurations/
│   └── JwtSettings.cs          ← [NEW]
├── Controllers/
│   └── HealthController.cs     ← [NEW]
├── Data/
│   ├── AppDbContext.cs         ← [NEW]
│   ├── Migrations/
│   └── Seed/
│       └── SeedData.cs         ← [NEW]
├── Extensions/
│   └── ServiceCollectionExtensions.cs ← [NEW]
├── Middleware/
│   └── GlobalExceptionHandlerMiddleware.cs ← [NEW]
├── appsettings.json             ← [NEW]
├── appsettings.Development.json ← [NEW]
├── Program.cs                   ← [MODIFY — full implementation]
├── ApiOos.csproj                ← [MODIFY — add NuGet packages]
└── tests/ApiOos.Tests/
    └── Controllers/
        └── HealthControllerTests.cs ← [NEW]
```

### Frontend (`apps/web-shop/`)
```
apps/web-shop/src/
├── app/
│   ├── globals.css              ← [MODIFY — Heritage Ube design tokens]
│   ├── layout.tsx               ← [MODIFY — clean shop layout]
│   └── page.tsx                 ← [MODIFY — renders <HomePage />]
├── components/
│   ├── shared/
│   │   ├── Header.tsx           ← [NEW]
│   │   └── Footer.tsx           ← [NEW]
│   └── features/
│       └── home/
│           └── HomePage.tsx     ← [NEW]
└── lib/
    ├── api/
    │   └── api-client.ts        ← [NEW]
    ├── validators/
    └── utils.ts                 ← [NEW]
```

---

## Files Summary

| File | Action | Story |
|---|---|---|
| `apps/api-oos/ApiOos.csproj` | MODIFY (add NuGet packages) | 1.1 |
| `apps/api-oos/Program.cs` | MODIFY (full startup) | 1.1 |
| `apps/api-oos/appsettings.json` | NEW | 1.1 |
| `apps/api-oos/appsettings.Development.json` | NEW | 1.1 |
| `apps/api-oos/Configurations/JwtSettings.cs` | NEW | 1.1 |
| `apps/api-oos/Controllers/HealthController.cs` | NEW | 1.1 |
| `apps/api-oos/Data/AppDbContext.cs` | NEW | 1.1 |
| `apps/api-oos/Data/Seed/SeedData.cs` | NEW | 1.3 |
| `apps/api-oos/Extensions/ServiceCollectionExtensions.cs` | NEW | 1.1 |
| `apps/api-oos/Middleware/GlobalExceptionHandlerMiddleware.cs` | NEW | 1.1 |
| `apps/api-oos/tests/ApiOos.Tests/Controllers/HealthControllerTests.cs` | NEW | 1.1 |
| `apps/api-oos/README.md` | MODIFY (add migrations docs) | 1.3 |
| `docs/adr/0002-hosting-strategy.md` | NEW (placeholder ADR) | 1.3 |
| `apps/web-shop/src/app/globals.css` | MODIFY (Heritage Ube tokens) | 1.2 |
| `apps/web-shop/src/app/layout.tsx` | MODIFY (clean shop layout) | 1.2 |
| `apps/web-shop/src/app/page.tsx` | MODIFY (renders `<HomePage />`) | 1.2 |
| `apps/web-shop/components.json` | NEW (shadcn/ui init) | 1.2 |
| `apps/web-shop/src/lib/utils.ts` | NEW (`cn()` helper) | 1.2 |
| `apps/web-shop/src/lib/api/api-client.ts` | NEW (typed fetch wrapper) | 1.2 |
| `apps/web-shop/src/components/shared/Header.tsx` | NEW | 1.2 |
| `apps/web-shop/src/components/shared/Footer.tsx` | NEW | 1.2 |
| `apps/web-shop/src/components/features/home/HomePage.tsx` | NEW | 1.2 |
| `apps/web-shop/.env.example` | MODIFY | 1.2 |

---

## Verification Plan

### Automated
```bash
# Backend: restore, build, test
dotnet restore apps/api-oos/ && dotnet build apps/api-oos/ && dotnet test apps/api-oos/

# Frontend: turbo build
pnpm turbo run build --filter=web-shop

# Frontend: type check
pnpm turbo run type-check --filter=web-shop
```

### Manual
- `dotnet run --project apps/api-oos` → `GET http://localhost:5001/api/health` returns `{"status":"Healthy"}`
- `GET http://localhost:5001/swagger` → Swagger UI opens and lists `/api/health`
- `pnpm dev:web` → `http://localhost:3004` renders the Heritage Ube shop layout (Inter font, purple primary, cream background)
- Design tokens visible in browser DevTools computed styles
