# ADR 0001: Shared TypeScript Types Strategy

## Status
Accepted

## Context
The repository consists of a .NET Web API backend (`apps/api-oos`) and a Next.js frontend (`apps/web-shop`). We require a consistent strategy to maintain strong typing across the frontend while avoiding manual duplication of API contracts.

## Decision
We adopt **Option B: Auto-generate TypeScript types from OpenAPI/Swagger spec** using `openapi-typescript`.

### Workflow
1. The .NET API (`apps/api-oos`) exposes its OpenAPI v3 JSON spec via Swagger (`/swagger/v1/swagger.json`).
2. A script in `packages/shared-types` fetches the spec and generates TypeScript interfaces into `packages/shared-types/src/generated/`.
3. Frontend applications import types from `@br-shop/shared-types`.
4. Manual override/extension types live under `packages/shared-types/src/manual/`.

## Consequences
- Single source of truth for DTO contracts defined in the C# backend.
- Prevents drift between backend responses and frontend consumption.
- CI pipeline validates type safety on every build.
