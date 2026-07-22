# E-Commerce Website Monorepo (`br-online-shop`)

Monorepo containing the .NET Web API backend (`apps/api-oos`) and Next.js frontend (`apps/web-shop`).

## Repository Layout
```
br-online-shop/
├── apps/
│   ├── api-oos/          → .NET Web API solution (enforces dotnet-structure skill)
│   ├── web-shop/         → Next.js 16 + React 19 + Tailwind v4 (online shop)
│   └── web-oos/          → Next.js 16 + React 19 + Tailwind v4 (order & ops system)
├── packages/
│   ├── shared-types/     → Shared TypeScript types / DTO contracts
│   └── config/           → Shared tsconfig & base configs
├── docs/
│   ├── adr/              → Architecture Decision Records
│   ├── plans/            → Implementation plans
│   └── specs/            → Project backlogs & requirements
├── docker-compose.yml    → Local PostgreSQL & pgAdmin services
├── pnpm-workspace.yaml   → Monorepo workspace configuration
└── turbo.json            → Turborepo pipeline configuration
```

## Prerequisites
- **Node.js**: `v20+`
- **pnpm**: `v9+`
- **.NET SDK**: `8.0+` / `9.0+`
- **Docker**: For local database container

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` in `apps/web-shop` and `.env` in `apps/api-oos`.

### 3. Run Local Database
```bash
docker-compose up -d
```

### 4. Run Development Servers
- Frontend (Shop): `pnpm dev:web`
- Frontend (OOS): `pnpm dev:oos`
- Backend: `dotnet run` inside `apps/api-oos`

## Verification & Tooling
- Run linter across workspace: `pnpm run lint`
- Run type checker: `pnpm run type-check`

