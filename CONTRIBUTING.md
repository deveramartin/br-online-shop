# Contributing Guidelines

Thank you for contributing to the `br-online-shop` monorepo!

## Branching Strategy
- `main`: Production-ready code
- Feature branches: `feat/<epic-number>-<short-description>` (e.g. `feat/epic-1-backend-setup`)
- Fix branches: `fix/<bug-description>`

## Commit Message Standards
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add product grid component`
- `fix: resolve CORS issue on auth endpoint`
- `docs: update setup instructions in README`
- `chore: bump dependencies`

## Architectural Layering Rules
- **Backend (`apps/api-oos`)**: Strict Controller → Service → Repository layering defined in `dotnet-structure` skill.
- **Frontend (`apps/web-shop`)**: Clean App Router composition with feature isolation defined in `web-nextjs-structure` skill.

## Submitting a Pull Request
1. Ensure all local tests and lints pass: `pnpm run lint` & `pnpm run type-check`.
2. Open a PR against `main` using the PR template.
3. CI checks must pass before merging.
