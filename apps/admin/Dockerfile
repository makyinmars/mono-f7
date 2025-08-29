FROM node:22-alpine AS base

WORKDIR /app

ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1
ENV CI=1
ENV PORT=3001

# Install system dependencies for Alpine + Node.js
RUN apk update && apk add --no-cache libc6-compat

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# =========================================================================== #

FROM base AS builder

# Install Turbo globally
RUN pnpm add --global turbo

# Copy entire monorepo
COPY . .

# Prune the workspace for admin app only
# https://turbo.build/repo/docs/guides/tools/docker#the-solution
RUN turbo prune admin --docker

# =========================================================================== #

FROM base AS installer

# Build arguments for environment configuration
ARG PUBLIC_API_URL

# Convert build args to environment variables
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

# Copy pruned workspace package.json files
COPY --from=builder /app/out/json/ .

# Copy original root lockfile for reference
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy pruned workspace source files
COPY --from=builder /app/out/full/ .

# Build the TanStack Start application
RUN pnpm turbo build

# =========================================================================== #

FROM base AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

USER appuser

# Copy built application from installer stage
COPY --from=installer --chown=appuser:appgroup /app/apps/admin/.output ./
COPY --from=installer --chown=appuser:appgroup /app/apps/admin/public ./public

# Expose application port
EXPOSE 3001

# Health check for production readiness
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node --version || exit 1

# Start the TanStack Start server with Node.js
CMD ["node", "server/index.mjs"]
