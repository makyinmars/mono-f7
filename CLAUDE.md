# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo with three applications and shared packages:

### Applications

- **server** - Node.js/Hono API server on port 3035
- **store** - TanStack Start store on port 3000
- **admin** - TanStack Start admin dashboard on port 3001

### Packages

- **@repo/ui** - Shared React component library
- **@repo/typescript-config** - Shared TypeScript configurations
- **@repo/api** - tRPC API layer with type-safe procedures
- **@repo/auth** - Better Auth authentication system with Drizzle adapter
- **@repo/db** - Drizzle ORM database layer with PostgreSQL

## Package Manager & Runtime

- **Package Manager**: pnpm (v10.15.0+)
- **Node Version**: >=22
- **Runtime**: Uses Node.js for the server app and for both apps: admin and store

## Common Development Commands

### Root Level Commands (run from project root)

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm run dev
# or
turbo dev

# Build all apps and packages
pnpm run build
# or
turbo build

# Lint all code using Ultracite
pnpm run lint
# or
turbo lint

# Format all code using Ultracite
pnpm run format
# or
turbo format

# Type check all packages
pnpm run check-types
# or
turbo check-types

# Clean all build artifacts
pnpm run clean
# or
turbo clean

# Build all Docker images
pnpm run docker:build
# or
turbo run docker:build

# Build individual Docker images
pnpm run docker:build:server  # (when Dockerfile exists)
pnpm run docker:build:store
pnpm run docker:build:admin

# Run Docker containers
pnpm run docker:run:server    # (when Dockerfile exists)
pnpm run docker:run:store     # http://localhost:3000
pnpm run docker:run:admin     # http://localhost:3001
```

### Single App Development

```bash
# Run specific app
turbo dev --filter=server
turbo dev --filter=store
turbo dev --filter=admin

# Build specific app
turbo build --filter=server
turbo build --filter=store
turbo build --filter=admin
```

### Component Generation

```bash
# Generate new React component in @repo/ui
cd packages/ui
turbo gen react-component
```

## Code Quality Tools

- **Linting/Formatting**: Ultracite (replaces ESLint) with Biome configuration
- **Pre-commit**: Uses lint-staged to format staged files with Ultracite
- **Git Hooks**: Lefthook configured but currently using example configuration only
- **Biome Config**: Configured to ignore auto-generated files like `routeTree.gen.ts`

## Architecture Notes

### Dependencies Management

- Uses pnpm workspaces with catalog feature for centralized dependency versions
- Catalog configuration is in pnpm-workspace.yaml for better organization
- React dependencies (react, react-dom, @types/react, @types/react-dom) are managed via the catalog
- TypeScript version is centrally managed via catalog

### Build Configuration

- TanStack Start app uses Vite for development with Node.js target
- Server app uses tsx for development with hot reload (`tsx watch`)
- Turbo handles task orchestration and caching
- Docker builds use multi-stage builds for production optimization

### Shared Components

- UI components are in `packages/ui/src/` with direct exports via `./src/*.tsx`
- Components use 'use client' directive for TanStack Start compatibility

### Docker Configuration

- Store app has Node.js-optimized Dockerfile with multi-stage build
- Uses `node:22-alpine` base image for minimal footprint
- Docker commands integrated with Turbo for orchestrated builds
- Production containers run with non-root user for security

### TypeScript Configuration

- Shared configs in `packages/typescript-config/`
- Base config uses strict mode with modern ES2022 target
- NodeNext module resolution for better ESM compatibility
- App-specific path mappings: `@apps/store/*` for store app, `@apps/admin/*` for admin app

### Import Path Conventions

- **@repo/*** - Shared packages (ui, auth, db, api, etc.)
- **@apps/store/*** - Store app internal imports (components, utils, etc.)
- **@apps/admin/*** - Admin app internal imports (components, utils, etc.)
- Path resolution handled by vite-tsconfig-paths plugin in Vite configuration
- TypeScript path mappings configured in each app's tsconfig.json

### Environment Variables Configuration

This project follows Turborepo best practices for environment variable management:

- **Package-specific .env files** - No root-level .env file to prevent variable leakage
- **Environment validation** - Each package uses Zod for type-safe environment validation
- **Turborepo configuration** - Environment variables are specified per task in `turbo.json`

#### File Structure
```
apps/server/.env          # Server-specific variables (DATABASE_URL, SERVER_*, PUBLIC_WEB_URL)
apps/store/.env           # Frontend-specific variables (PUBLIC_*, VITE_*)
packages/db/.env          # Database package variables (DATABASE_URL for migrations)
```

#### Environment Files
- `apps/server/src/env.ts` - Zod schema for server environment validation
- `apps/store/src/env.ts` - Zod schema for store environment validation
- `packages/db/src/env.ts` - Zod schema for database environment validation

#### Turborepo Configuration
Each task in `turbo.json` specifies required environment variables:
- Server tasks: `["DATABASE_URL", "SERVER_*", "PUBLIC_WEB_URL"]`
- Store tasks: `["PUBLIC_*", "VITE_*"]`
- Database tasks: `["DATABASE_URL"]`
