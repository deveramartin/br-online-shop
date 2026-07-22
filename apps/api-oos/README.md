# API OOS (.NET Web API Backend)

ASP.NET Core Web API backend for the `br-online-shop` monorepo.

## Project Structure (enforced by `dotnet-structure` skill)
```
apps/api-oos/
├── Configurations/         → Options classes (bound from appsettings)
├── Constants/              → App-wide constants
├── Controllers/            → API endpoints (HTTP routing & binding only)
├── Data/                   → DbContext, EF Migrations & Seed data
├── DTOs/                   → Requests & Responses shapes
├── Exceptions/             → Custom exception types
├── Extensions/             → ServiceCollection extensions
├── Filters/                → Action/Exception filters
├── Helpers/                → Utility helper classes
├── Hubs/                   → SignalR real-time hubs
├── Interfaces/             → IRepository and IService contracts
├── Mappers/                → Entity <-> DTO mappers
├── Middleware/             → Custom middleware
├── Models/                 → EF Core entities
├── Repositories/           → Data access implementations
├── Services/               → Business logic implementations
├── Validators/             → FluentValidation validators
└── tests/                  → xUnit / NUnit tests mirroring source tree
```

> Note: Detailed ASP.NET Core project scaffolding will be completed in **EPIC 1**.
