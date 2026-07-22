# Plan: Add Script to Run All Apps in Monorepo Root `package.json`

**Timestamp:** 2026-07-22T22:54:34+08:00  
**Plan File:** `docs/plans/20260722225434-add-run-apps-script-plan.md`

## 1. Overview
The monorepo consists of three applications in the `apps/` directory:
- **`apps/web-shop`**: Next.js customer-facing shop (running on port 3004)
- **`apps/web-oos`**: Next.js backoffice / order management system (running on port 3005)
- **`apps/api-oos`**: ASP.NET Core Web API backend (.NET 10 project)

Currently, the root [`package.json`](file:///home/friedrich/workspace/monorepo/br-online-shop/package.json) contains:
```json
"scripts": {
  "dev:web": "turbo run dev --filter=web-shop",
  "dev:oos": "turbo run dev --filter=web-oos",
  "dev": "turbo run dev",
  "build": "turbo run build",
  "lint": "turbo run lint",
  "type-check": "turbo run type-check"
}
```
`turbo run dev` only starts Node.js/Next.js workspace packages (`web-shop` and `web-oos`), but does not start the `.NET` API (`api-oos`).

We already have `concurrently` installed in `devDependencies` in the root [`package.json`](file:///home/friedrich/workspace/monorepo/br-online-shop/package.json).

---

## 2. Proposed Changes

### Modify [`package.json`](file:///home/friedrich/workspace/monorepo/br-online-shop/package.json)
Add dedicated scripts to run the `.NET` API and all apps concurrently from root:

1. `"dev:api"`: Runs the ASP.NET Core API via `dotnet run --project apps/api-oos/ApiOos.csproj`.
2. `"dev:all"`: Uses `concurrently` to run both the .NET API (`dev:api`) and Turbo web frontend apps (`dev`) in parallel with colored logs and single-command termination (`-k`).

```json
"scripts": {
  "dev:web": "turbo run dev --filter=web-shop",
  "dev:oos": "turbo run dev --filter=web-oos",
  "dev:api": "dotnet run --project apps/api-oos/ApiOos.csproj",
  "dev:all": "concurrently -k -n api,web -c blue,magenta \"pnpm dev:api\" \"pnpm dev\"",
  "dev": "turbo run dev",
  "build": "turbo run build",
  "lint": "turbo run lint",
  "type-check": "turbo run type-check"
}
```

---

## 3. Verification Plan

### Manual Verification
1. Run `pnpm dev:api` from root to verify the .NET API starts.
2. Run `pnpm dev:all` from root to verify all 3 apps (`api-oos`, `web-shop`, `web-oos`) start concurrently.
