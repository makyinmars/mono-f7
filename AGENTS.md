# Repository Guidelines

## Project Structure & Module Organization
Stylo is a Turborepo monorepo. Applications live in `apps/`: `store` (TanStack Start frontend), `server` (Hono API on Bun), and `admin` (Vite React dashboard). Shared code sits in `packages/`—`ui` for components, `helpers` for cross-cutting utilities, `db` for Drizzle schema/migrations, and `typescript-config` for compiler baselines. Keep assets, env examples, and Dockerfiles colocated with the owning workspace.

## Build, Test, and Development Commands
- `bun run dev` — launch all workspace servers via Turbo with hot reload.
- `turbo dev --filter=<app>` — run a single app such as `store` or `server`.
- `bun run build` — execute the Turborepo build graph and type checks.
- `bun run lint` / `bun run format` — run Ultracite linting and formatting (Biome-backed).
- `bun run check-types` — TypeScript no-emit validation across packages.
- `bun run db:migrate` / `bun run db:push` — manage Drizzle migrations in `packages/db`.
- `bun run docker:build[:target]` — build multi-service images; see workspace Dockerfiles.

## Coding Style & Naming Conventions
TypeScript and modern React are the defaults. Ultracite (extending Biome) enforces double quotes, 2-space indentation, and import ordering—always format before pushing. Use `PascalCase` for components and hooks, `camelCase` for functions and variables, and `kebab-case` for folders. Co-locate feature files under `apps/*/src` and prefer small barrels over deep index chains.

## Testing Guidelines
Add unit and integration tests with Vitest; place `*.test.ts` files beside the code they cover and add a `vitest.config.ts` when a package gets its first test. For end-to-end flows, follow `playwright-integration.md` to scaffold `packages/e2e-*` workspaces and run `bun run playwright test`. Document skipped scenarios and include reproduction steps in PRs. Exercise new routes, procedures, and database operations before merge.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit messages (e.g., `update vite config for vercel`). Keep each commit focused and reference issue IDs when helpful. Pull requests should carry a concise summary, screenshots for UI updates, notes on schema or env changes, and a checklist of commands run (`bun run lint`, tests, migrations). Request review once CI passes and link relevant roadmap items from `TODO.md`.

## Environment & Configuration
Workspaces load their own `.env` files—never add a root-level `.env`. Copy from the `.env.example` files in `apps/server`, `apps/store`, and `packages/db`, and commit template updates with any schema changes. Document new secrets in package READMEs and update relevant Turbo task `env` arrays in `turbo.json` when builds need extra variables.
