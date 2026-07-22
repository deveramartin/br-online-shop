# Implementation Plan — EPIC 0: Monorepo Structure & Tooling

**Task:** Set up the monorepo root layout and tooling for `br-online-shop`.  
**Timestamp:** 20260722212840  
**Source of Truth:** `docs/specs/backlogs.md` EPIC 0 (lines 8–62)  
**Design Reference:** `.design-ref/heritage_ube_boutique/DESIGN.md`

---

## Background

The workspace currently looks like:

```
/home/friedrich/workspace/monorepo/br-online-shop/
  .design-ref/          → UI design references (gitignored, Heritage Ube Boutique design system)
  .agents/
  docs/specs/backlogs.md
  oos/                  → EXISTING Next.js 16 app (internal OOS dashboard, OIDC auth via next-auth v5)
  .gitignore            → currently only has `.design-ref/`
  AGENTS.md
```

The `oos/` app is an internal Order & Ops dashboard (OIDC-protected, system-code `OOS`). Per the spec, it will be **moved** to `apps/web-shop/` — keeping its existing auth/OIDC shell intact (to be replaced in Epic 2). A new .NET Web API placeholder goes at `apps/api-oos/`.

### Design System (from `.design-ref/heritage_ube_boutique/DESIGN.md`)
- **Brand:** Heritage Ube Boutique — premium artisanal Filipino food retail
- **Primary:** `#451077` / `#5D2D8F` deep purple
- **Secondary:** `#7748A7` lighter purple
- **Surface/BG:** `#FCF9F8` warm cream
- **Font:** Inter (all weights)
- **Radius:** 8px (standard), 16px (cards), 24px (banners/modals)

---

## Decisions Made

| # | Question | Decision |
|---|---|---|
| Q1 | `oos/` git history | **Discard** — remove `oos/.git`, move files as plain copy |
| Q2 | Package manager | **pnpm** (switch from npm) |
| Q3 | Turborepo vs plain workspaces | **Turborepo** |
| Q4 | .NET API scaffold | **Deferred to Epic 1** — placeholder directory + README only |
| Q5 | Strip OIDC auth from `oos/` during migration | **No** — keep auth intact, replacement is Epic 2 |

---

## Proposed Changes

### Phase 1 — Root Monorepo Skeleton (Story 0.1, 0.2)

#### [MODIFY] `.gitignore` (root — expand from current 1-line file)
Cover both stacks:
```gitignore
# Design references
.design-ref/

# Node / Next.js
node_modules/
.next/
.turbo/
out/
build/
coverage/
.vercel
*.tsbuildinfo
next-env.d.ts

# Environment files
.env*
!.env.example

# .NET
bin/
obj/
*.user
*.suo
.vs/
*.pubxml
*.publishsettings

# Certs / keys
*.pem

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

#### [NEW] `README.md`
Monorepo overview, prerequisites (`.NET 8 SDK`, `Node 20+`, `pnpm 9+`), and local setup steps:
```
clone → pnpm install → copy .env.example files → docker-compose up -d → pnpm run dev:web / dotnet run (in apps/api-oos)
```

#### [NEW] `LICENSE.md`
Placeholder — to be filled with chosen license.

#### [NEW] `.editorconfig`
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{ts,tsx,js,jsx,json,yaml,yml,md}]
indent_style = space
indent_size = 2

[*.{cs,csproj,sln}]
indent_style = space
indent_size = 4
```

#### [NEW] `package.json` (root — pnpm workspaces + Turborepo)
```json
{
  "name": "br-online-shop-monorepo",
  "private": true,
  "packageManager": "pnpm@9.x",
  "scripts": {
    "dev:web": "turbo run dev --filter=web-shop",
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "latest",
    "concurrently": "latest"
  }
}
```

#### [NEW] `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### [NEW] `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "lint": { "outputs": [] },
    "type-check": { "outputs": [] },
    "dev": { "cache": false, "persistent": true },
    "test": { "outputs": [] }
  }
}
```

---

### Phase 2 — Migrate `oos/` → `apps/web-shop/` (Story 0.1)

Steps:
1. `rm -rf oos/.git` — discard nested git repo (history discarded per decision Q1)
2. `mkdir -p apps` and move: `mv oos apps/web-shop`
3. In `apps/web-shop/package.json`: rename `"name": "oos"` → `"name": "web-shop"`
4. Remove `apps/web-shop/node_modules/` and `apps/web-shop/package-lock.json` (will re-install via pnpm at root)
5. Add `apps/web-shop/.env.example` (stubbed vars — OIDC auth vars left in, to be updated in Epic 2)
6. Update `apps/web-shop/tsconfig.json` — extend from `packages/config/tsconfig.base.json` (optional, can defer)

> **Auth note (Q5):** `auth.ts`, `middleware.ts`, `next-auth`, `signin/` route and OIDC callbacks are all **preserved as-is**. Epic 2 will replace them with JWT-based shop auth.

> **Stack stays:** Next.js 16.2 · React 19 · Tailwind v4 · TypeScript — no framework changes needed.

---

### Phase 3 — Backend Placeholder `apps/api-oos/` (Story 0.1)

#### [NEW] `apps/api-oos/README.md`
Placeholder stating: "Full .NET Web API scaffold to be completed in Epic 1."

#### [NEW] `apps/api-oos/.env.example`
Stub with expected vars:
```
CONNECTION_STRING=
JWT_SECRET=
JWT_ISSUER=
CORS_ORIGIN=http://localhost:3004
```

---

### Phase 4 — Packages Skeleton (Story 0.1, 0.4)

#### [NEW] `packages/shared-types/package.json`
```json
{
  "name": "@br-shop/shared-types",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

#### [NEW] `packages/shared-types/src/index.ts`
Empty barrel export — types auto-generated from OpenAPI will go in `src/generated/` after Epic 1.

#### [NEW] `packages/config/tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true
  }
}
```

#### [NEW] `packages/config/package.json`
```json
{ "name": "@br-shop/config", "version": "0.0.1", "private": true }
```

---

### Phase 5 — Docker & Local Dev Environment (Story 0.3)

#### [NEW] `docker-compose.yml`
```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: br-db
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: brshop
      POSTGRES_PASSWORD: brshopdev
      POSTGRES_DB: brshop
    volumes:
      - br_pgdata:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: br-pgadmin
    ports: ["5050:80"]
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@brshop.local
      PGADMIN_DEFAULT_PASSWORD: admin
    depends_on: [db]

volumes:
  br_pgdata:
```

---

### Phase 6 — Shared Type Strategy Decision Doc (Story 0.4)

**Decision: Option B — Auto-generate from OpenAPI** using `openapi-typescript`.

#### [NEW] `docs/adr/0001-shared-types-strategy.md`
Architecture Decision Record documenting:
- Choice of `openapi-typescript` to generate types into `packages/shared-types/src/generated/`
- Run as a `pnpm run codegen` script after `apps/api-oos/` Swagger endpoint is live
- Manual types in `packages/shared-types/src/manual/` for anything not covered by spec

---

### Phase 7 — CI/CD Pipelines (Story 0.5)

#### [NEW] `.github/workflows/web-ci.yml`
```yaml
name: Web CI
on:
  push:
    paths: ['apps/web-shop/**', 'packages/**']
  pull_request:
    paths: ['apps/web-shop/**', 'packages/**']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint type-check build --filter=web-shop
```

#### [NEW] `.github/workflows/api-ci.yml`
```yaml
name: API CI
on:
  push:
    paths: ['apps/api-oos/**']
  pull_request:
    paths: ['apps/api-oos/**']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: '8.x' }
      - run: dotnet restore apps/api-oos/
      - run: dotnet build apps/api-oos/ --no-restore
      - run: dotnet test apps/api-oos/ --no-build --verbosity normal
```

---

### Phase 8 — Code Ownership & Contribution Rules (Story 0.6)

#### [NEW] `CODEOWNERS`
```
apps/api-oos/ @TBD-backend-reviewer
apps/web-shop/ @TBD-frontend-reviewer
packages/ @TBD-frontend-reviewer
```

#### [NEW] `CONTRIBUTING.md`
- Branch naming: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`
- Commit convention: [Conventional Commits](https://www.conventionalcommits.org/)
- PR process: always pass CI before requesting review

#### [NEW] `.github/PULL_REQUEST_TEMPLATE.md`
Standard PR checklist template.

---

## Target Folder Structure (Final)

```
br-online-shop/
  apps/
    api-oos/                    → .NET Web API (placeholder; full scaffold in Epic 1)
      .env.example
      README.md
    web-shop/                   → Next.js 16 + Tailwind v4 + TS (migrated from oos/, auth preserved)
      .env.example
      app/
      components/
      lib/
      types/
      ...
  packages/
    shared-types/               → TS interfaces (auto-gen from OpenAPI, Epic 1+)
      src/index.ts
      package.json
    config/                     → Shared tsconfig, eslint base
      tsconfig.base.json
      package.json
  docs/
    adr/
      0001-shared-types-strategy.md
    specs/
    plans/
  .github/
    workflows/
      api-ci.yml
      web-ci.yml
    PULL_REQUEST_TEMPLATE.md
  docker-compose.yml
  .editorconfig
  .gitignore                    → expanded
  package.json                  → root pnpm workspaces + turbo scripts
  pnpm-workspace.yaml
  turbo.json
  README.md
  LICENSE.md
  CODEOWNERS
  CONTRIBUTING.md
```

---

## Verification Plan

### Automated
- `pnpm install` at root succeeds (no lockfile conflicts)
- `pnpm run dev:web` starts `apps/web-shop` Next.js dev server correctly
- `turbo run lint` passes across all packages

### Manual
- Root folder structure matches spec tree above
- `apps/web-shop/` app starts and OIDC auth still works (no regression)
- `.env.example` files present in both `apps/`
- `docker-compose up -d` starts PostgreSQL + pgAdmin cleanly
- CI workflow YAML files are syntactically valid

---

## Files Summary

| File/Dir | Action | Story |
|---|---|---|
| `.gitignore` | MODIFY (expand) | 0.2 |
| `README.md` | NEW | 0.1 |
| `LICENSE.md` | NEW | 0.1 |
| `.editorconfig` | NEW | 0.2 |
| `package.json` | NEW (root pnpm + turbo scripts) | 0.2 |
| `pnpm-workspace.yaml` | NEW | 0.2 |
| `turbo.json` | NEW | 0.2 |
| `apps/web-shop/` | MOVE from `oos/` (strip nested .git, rename) | 0.1 |
| `apps/web-shop/.env.example` | NEW | 0.3 |
| `apps/api-oos/README.md` | NEW (placeholder) | 0.1 |
| `apps/api-oos/.env.example` | NEW | 0.3 |
| `packages/shared-types/` | NEW (TS stub) | 0.1, 0.4 |
| `packages/config/` | NEW (tsconfig base) | 0.2 |
| `docker-compose.yml` | NEW | 0.3 |
| `docs/adr/0001-shared-types-strategy.md` | NEW | 0.4 |
| `.github/workflows/web-ci.yml` | NEW | 0.5 |
| `.github/workflows/api-ci.yml` | NEW | 0.5 |
| `CODEOWNERS` | NEW | 0.6 |
| `CONTRIBUTING.md` | NEW | 0.6 |
| `.github/PULL_REQUEST_TEMPLATE.md` | NEW | 0.6 |
