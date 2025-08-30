FROM node:22-alpine AS base

WORKDIR /app

ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1
ENV CI=1
ENV PORT=3035

# Install system dependencies for Alpine + Node.js
RUN apk update && apk add --no-cache libc6-compat

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# =========================================================================== #

FROM base AS builder

# Set up pnpm global directory
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install Turbo globally
RUN pnpm add --global turbo

# Copy entire monorepo
COPY . .

# Prune the workspace for server app only
# https://turbo.build/repo/docs/guides/tools/docker#the-solution
RUN turbo prune server --docker

# =========================================================================== #

FROM base AS installer

# Build arguments for environment configuration
ARG DATABASE_URL
ARG SERVER_PORT=3035
ARG SERVER_HOST=localhost
ARG SERVER_AUTH_SECRET
ARG PUBLIC_URL_STORE
ARG PUBLIC_URL_ADMIN
ARG AUTH_COOKIE_DOMAIN=""

# Convert build args to environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV SERVER_PORT=${SERVER_PORT}
ENV SERVER_HOST=${SERVER_HOST}
ENV SERVER_AUTH_SECRET=${SERVER_AUTH_SECRET}
ENV PUBLIC_URL_STORE=${PUBLIC_URL_STORE}
ENV PUBLIC_URL_ADMIN=${PUBLIC_URL_ADMIN}
ENV AUTH_COOKIE_DOMAIN=${AUTH_COOKIE_DOMAIN}

# Copy pruned workspace package.json files
COPY --from=builder /app/out/json/ .

# Copy original root lockfile for reference
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy pruned workspace source files
COPY --from=builder /app/out/full/ .

# Build and type check the server application
RUN pnpm turbo build
RUN cd apps/server && pnpm tsc

# =========================================================================== #

FROM base AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

USER appuser

# Copy server application source from installer stage
COPY --from=installer --chown=appuser:appgroup /app/apps/server ./

# Expose application port
EXPOSE 3035

# Health check for production readiness
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node --version || exit 1

# Start the Hono server with Node.js
CMD ["node", "dist/index.js"]
