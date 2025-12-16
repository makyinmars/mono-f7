import { db } from "@repo/db/client";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "./env";

// Base options for CLI compatibility
export const baseOptions = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
} satisfies BetterAuthOptions;

// Build trusted origins from environment
const trustedOrigins = [
  new URL(env.PUBLIC_URL_STORE).origin,
  new URL(env.PUBLIC_URL_ADMIN).origin,
];

// Singleton auth instance - initialized at module load
export const auth = betterAuth({
  ...baseOptions,
  secret: env.AUTH_SECRET,
  trustedOrigins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
});

// Export type for consumers
export type AuthInstance = typeof auth;
