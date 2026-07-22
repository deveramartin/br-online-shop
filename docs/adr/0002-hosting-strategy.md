# ADR 0002: Hosting & Infrastructure Strategy

## Status
Proposed (Targeting Epic 10 Deployment)

## Context
The application consists of a .NET 10 Web API backend (`apps/api-oos`), a Next.js 16 customer-facing shop (`apps/web-shop`), and an order & operations system (`apps/web-oos`). We require a hosting strategy that supports seamless scaling, SSL, and database persistence.

## Proposed Strategy
1. **Backend API (`apps/api-oos`)**: Azure App Service / AWS ECS (Linux Container) running ASP.NET Core with PostgreSQL database (Azure Database for PostgreSQL / AWS RDS).
2. **Frontend Apps (`apps/web-shop`, `apps/web-oos`)**: Vercel or Cloudflare Pages for optimized Next.js App Router edge caching and zero-config deployment pipelines.
3. **Database**: Managed PostgreSQL 16 instance.

## Consequences
- Decouples frontend edge deployments from backend API releases.
- Simplifies SSL certificate management and custom domain setup.
- Final infrastructure parameters will be validated and provisioned during Epic 10 (Deployment & Launch).
