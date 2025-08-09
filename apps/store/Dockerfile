FROM oven/bun:alpine AS base

WORKDIR /app

ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1
ENV CI=1
ENV PORT=3000

# Install system dependencies for Alpine + Bun
RUN apk update && apk add --no-cache libc6-compat

# =========================================================================== #

FROM base AS builder

# Install Turbo globally
RUN bun add --global turbo

# Copy entire monorepo
COPY . .

# Prune the workspace for store app only
# https://turbo.build/repo/docs/guides/tools/docker#the-solution
RUN turbo prune store --docker

# =========================================================================== #

FROM base AS installer

# Build arguments for environment configuration
# ARG PUBLIC_SERVER_URL
# ENV PUBLIC_SERVER_URL=${PUBLIC_SERVER_URL}

# Copy pruned workspace package.json files
COPY --from=builder /app/out/json/ .

# Copy original root lockfile for reference
COPY --from=builder /app/bun.lock ./bun.lock

# Install dependencies using simple bun install
# Note: Avoiding --frozen-lockfile and --production due to known Bun v1.2.19 issues:
# - Lockfile parsing errors in Docker containers and monorepos
# - Version mismatch issues between lockfile creation and install
# - Production mode parsing failures with dev dependencies
# Ref: https://github.com/oven-sh/bun/issues (known Docker + frozen-lockfile issues)
RUN bun install

# Copy pruned workspace source files
COPY --from=builder /app/out/full/ .

# Build the TanStack Start application
RUN bun turbo build

# =========================================================================== #

FROM base AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

USER appuser

# Copy built application from installer stage
COPY --from=installer --chown=appuser:appgroup /app/apps/store/.output ./
COPY --from=installer --chown=appuser:appgroup /app/apps/store/public ./public

# Expose application port
EXPOSE 3000

# Health check for production readiness
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD bun --version || exit 1

# Start the TanStack Start server with Bun
CMD ["bun", "server/index.mjs"]
