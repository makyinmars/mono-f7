FROM oven/bun:alpine AS base

# This Dockerfile is optimized for TanStack Start with Bun runtime
# Based on Turbo example but adapted for Bun and TanStack Start

FROM base AS builder
# Check https://github.com/oven-sh/bun to understand why libc6-compat might be needed for Alpine
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN bun add -g turbo
COPY . .
RUN turbo prune store --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN bun turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 appuser
USER appuser

# Copy the built TanStack Start application
COPY --from=installer --chown=appuser:appgroup /app/apps/store/.output ./
COPY --from=installer --chown=appuser:appgroup /app/apps/store/public ./public

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["bun", "server/index.mjs"]
