# mono-f7

A modern full-stack monorepo built with cutting-edge technologies for scalable web applications. This repository demonstrates the power of combining TanStack Start, tRPC, Drizzle ORM, and Better Auth in a Turborepo structure with Node.js as the runtime.

## 🚀 Vision

This project aims to be a comprehensive example of modern web development practices, featuring:

- **Type-safe full-stack development** with tRPC and TypeScript
- **Modern React patterns** with TanStack Start for server-side rendering
- **Database-first approach** with Drizzle ORM and PostgreSQL
- **Secure authentication** with Better Auth and OAuth providers
- **Containerized deployment** with Docker and Bun optimization
- **Production-ready CI/CD** with comprehensive testing and monitoring

## 📦 What's Inside

### Applications

- **`server`** - Hono API server with Node.js runtime on port 3035
- **`store`** - TanStack Start application with file-based routing for SSR/SSG capabilities

### Packages

#### Current

- **`@repo/ui`** - Shared React component library with shadcn/ui
- **`@repo/typescript-config`** - Centralized TypeScript configurations

#### Planned (See [TODO.md](./TODO.md))

- **`@repo/api`** - tRPC API layer with type-safe procedures
- **`@repo/auth`** - Better Auth authentication system
- **`@repo/db`** - Drizzle ORM database layer

### Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) for all applications
- **Framework**: TanStack Start, Hono
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) with OAuth support
- **API**: [tRPC](https://trpc.io/) for end-to-end type safety
- **UI**: [Tailwind CSS v4](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager**: pnpm workspaces with catalog feature
- **Build Tool**: [Turborepo](https://turbo.build/repo) for monorepo orchestration
- **Code Quality**: [Ultracite](https://github.com/bombshell-dev/ultracite) for linting and formatting
- **Containerization**: Docker with Node.js-optimized images

## 🚀 Getting Started

### Prerequisites

- **pnpm** v10.15.0+ (package manager)
- **Node.js** v22+ (runtime for all applications)
- **PostgreSQL** (for database, can be run via Docker)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd mono-f7
pnpm install
```

### Environment Variables

This project follows Turborepo best practices for environment variables by using **package-specific .env files** instead of a root-level configuration. This prevents environment variable leakage across applications and improves cache efficiency.

#### Setup Environment Files

Copy the example files and configure them for your environment:

```bash
# Server environment variables
cp apps/server/.env.example apps/server/.env

# Store environment variables
cp apps/store/.env.example apps/store/.env

# Database environment variables (for migrations)
cp packages/db/.env.example packages/db/.env
```

#### Configuration Structure

- **`apps/server/.env`** - Server-specific variables (database URL, auth secrets, API settings)
- **`apps/store/.env`** - Frontend-specific variables (API URLs, public configuration)
- **`packages/db/.env`** - Database package variables (used by Drizzle migrations and studio)

Each package includes Zod-based environment validation to ensure type safety and proper configuration.

### Development

Start all applications in development mode:

```bash
# Start all apps simultaneously
pnpm run dev

# Or with Turbo directly
turbo dev
```

Start individual applications:

```bash
# Hono server (port 3035)
turbo dev --filter=server

# TanStack Start app
turbo dev --filter=store
```

### Build

Build all applications and packages:

```bash
# Build everything
pnpm run build

# Build specific app
turbo build --filter=server
turbo build --filter=store
```

### Code Quality

The project uses Ultracite for linting and formatting:

```bash
# Lint all code
pnpm run lint

# Format all code
pnpm run format

# Type check all packages
pnpm run check-types
```

### Docker Development

The project includes Docker support for containerized development and deployment:

```bash
# Build all Docker images
pnpm run docker:build

# Build individual images
pnpm run docker:build:store

# Run containers
pnpm run docker:run:store   # http://localhost:3000
```

## 🗺️ Roadmap

This project follows a structured development approach with clear priorities. See [TODO.md](./TODO.md) for the complete roadmap.

### Current Status

- ✅ Turborepo monorepo structure
- ✅ Hono API server with Node.js
- ✅ TanStack Start application with file-based routing
- ✅ shadcn/ui component library
- ✅ Ultracite linting and formatting with Biome configuration
- ✅ Auto-generated file exclusion in Biome config
- 🚧 Docker containerization (store app completed)

### Next Milestones

1. **Core Infrastructure** - tRPC API, Drizzle ORM, Better Auth, Docker setup
2. **Development Experience** - Testing framework, CI/CD, environment management
3. **Production Ready** - Monitoring, deployment, performance optimization
4. **Enhancements** - Advanced UI patterns, developer tools, analytics

## 🏗️ Project Structure

```
mono-f7/
├── apps/
│   ├── server/       # Hono API server (Node.js)
│   └── store/        # TanStack Start application
├── packages/
│   ├── ui/           # Shared React components
│   └── typescript-config/ # TypeScript configurations
├── TODO.md           # Comprehensive development roadmap
└── CLAUDE.md         # AI assistant instructions
```

## 🚢 Deployment

### Development

All applications run locally with hot reload enabled:

- Store app: <http://localhost:3000> (TanStack Start)
- Server API: <http://localhost:3035>

### Production (Planned)

- **Frontend**: Vercel deployment for TanStack Start app
- **Backend**: Docker containers on Railway/Fly.io
- **Database**: PostgreSQL with automated backups
- **CDN**: Static assets via Vercel Edge Network

## 🤝 Contributing

This project serves as a reference implementation for modern full-stack development. Contributions that align with the roadmap in [TODO.md](./TODO.md) are welcome.

### Development Workflow

1. Install dependencies: `pnpm install`
2. Start development servers: `pnpm run dev`
3. Make changes following existing patterns
4. Run quality checks: `pnpm run lint && pnpm run check-types`
5. Test your changes across all affected applications
6. Build Docker images for deployment: `pnpm run docker:build`

## 📚 Resources

### Core Technologies

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Node.js Runtime](https://nodejs.org/docs/latest/)
- [TanStack Start](https://tanstack.com/start/latest)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)

### Development Tools

- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Ultracite Linter](https://github.com/bombshell-dev/ultracite)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
