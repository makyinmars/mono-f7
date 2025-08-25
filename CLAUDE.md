# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo with three applications and shared packages:

### Applications

- **server** - Bun/Hono API server on port 3035
- **store** - TanStack Start app with file-based routing for SSR/SSG capabilities
- **admin** - TanStack Start admin dashboard on port 3001

### Packages

- **@repo/ui** - Shared React component library
- **@repo/typescript-config** - Shared TypeScript configurations
- **@repo/api** - tRPC API layer with type-safe procedures
- **@repo/auth** - Better Auth authentication system with Drizzle adapter
- **@repo/db** - Drizzle ORM database layer with PostgreSQL

## Package Manager & Runtime

- **Package Manager**: Bun (v1.2.19+)
- **Node Version**: >=22
- **Runtime**: Uses Bun for the server app, Node.js for TanStack Start app

## Common Development Commands

### Root Level Commands (run from project root)

```bash
# Install dependencies
bun install

# Start all apps in development mode
bun run dev
# or
turbo dev

# Build all apps and packages  
bun run build
# or
turbo build

# Lint all code using Ultracite
bun run lint
# or
turbo lint

# Format all code using Ultracite
bun run format
# or
turbo format

# Type check all packages
bun run check-types
# or
turbo check-types

# Clean all build artifacts
bun run clean
# or
turbo clean

# Build all Docker images
bun run docker:build
# or
turbo run docker:build

# Build individual Docker images
bun run docker:build:server  # (when Dockerfile exists)
bun run docker:build:store
bun run docker:build:admin

# Run Docker containers
bun run docker:run:server    # (when Dockerfile exists)
bun run docker:run:store     # http://localhost:3000
bun run docker:run:admin     # http://localhost:3001
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

- Uses Bun workspaces catalog feature for centralized dependency versions
- React dependencies (react, react-dom, @types/react, @types/react-dom) are managed via the root catalog
- TypeScript version is centrally managed via catalog

### Build Configuration

- TanStack Start app uses Vite for development with Bun target
- Server app uses Bun's hot reload (`bun run --hot`)
- Turbo handles task orchestration and caching
- Docker builds use multi-stage builds for production optimization

### Shared Components

- UI components are in `packages/ui/src/` with direct exports via `./src/*.tsx`
- Components use 'use client' directive for TanStack Start compatibility

### Docker Configuration

- Store app has Bun-optimized Dockerfile with multi-stage build
- Uses `oven/bun:alpine` base image for minimal footprint
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

