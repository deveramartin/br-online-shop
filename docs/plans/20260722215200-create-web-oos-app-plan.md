# Implementation Plan — Create Next.js App `web-oos`

## Objective
Create a second Next.js frontend application (`apps/web-oos`) inside the monorepo, adhering to Next.js 16 + React 19 standards, workspace conventions, and design guidelines.

## User Stories / Requirements
- App location: `apps/web-oos`
- App name: `web-oos`
- Stack: Next.js 16, React 19, Tailwind CSS, TypeScript
- Workspace Integration: Root workspace, pnpm, Turborepo pipelines (`build`, `lint`, `type-check`, `dev`), root script (`dev:oos`)
- Code structure: App Router, `src/` directory layout adhering to `web-nextjs-structure` rules

## Proposed Changes

### 1. Scaffold `apps/web-oos`
- `apps/web-oos/package.json`
- `apps/web-oos/tsconfig.json`
- `apps/web-oos/next.config.ts`
- `apps/web-oos/eslint.config.mjs`
- `apps/web-oos/postcss.config.mjs`
- `apps/web-oos/.gitignore`
- `apps/web-oos/.env.example`
- `apps/web-oos/README.md`

### 2. App Structure (`src/`)
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/signin/page.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/auth.ts`
- `src/proxy.ts`
- `src/types/next-auth.d.ts`
- `src/components/ui/`
- `src/components/shared/`
- `src/components/features/`

### 3. Monorepo Integration
- Update root `package.json` with `"dev:oos": "turbo run dev --filter=web-oos"`
- Update root `README.md` layout & commands
- Update `docs/specs/backlogs.md` if applicable

### 4. Verification Plan
- Run `pnpm install`
- Run `pnpm run lint` across monorepo
- Run `pnpm run type-check` across monorepo
- Run `pnpm turbo run build --filter=web-oos`
- Git commit & push to GitHub branch, update PR
