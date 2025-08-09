# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo with two applications and shared packages:

### Applications

- **server** - Bun/Hono API server on port 3005
- **store** - TanStack Start app with file-based routing for SSR/SSG capabilities

### Packages

- **@repo/ui** - Shared React component library
- **@repo/typescript-config** - Shared TypeScript configurations

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

# Run Docker containers
bun run docker:run:server    # (when Dockerfile exists)
bun run docker:run:store     # http://localhost:3000
```

### Single App Development

```bash
# Run specific app
turbo dev --filter=server
turbo dev --filter=store

# Build specific app
turbo build --filter=server
turbo build --filter=store
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

