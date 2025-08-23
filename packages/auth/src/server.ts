import type { DatabaseInstance } from '@repo/db/client';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export interface AuthOptions {
  storeUrl: string;
  adminUrl: string;
  authSecret: string;
  db: DatabaseInstance;
  cookieDomain?: string;
}

export type AuthInstance = ReturnType<typeof createAuth>;

/**
 * This function is abstracted for schema generations in cli-config.ts
 */
export const getBaseOptions = (db: DatabaseInstance) =>
  ({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),

    /**
     * Only uncomment the line below if you are using plugins, so that
     * your types can be correctly inferred:
     */
    // plugins: [],
  }) satisfies BetterAuthOptions;

export const createAuth = ({
  storeUrl,
  adminUrl,
  db,
  authSecret,
  cookieDomain,
}: AuthOptions) => {
  console.log('store url', storeUrl);
  console.log('admin url', adminUrl);
  console.log('cookie domain', cookieDomain);

  // Build trusted origins array
  const trustedOrigins = [new URL(storeUrl).origin, new URL(adminUrl).origin];

  // For production with wildcard support
  if (cookieDomain) {
    // Add wildcard pattern for all subdomains
    trustedOrigins.push(`https://*${cookieDomain}`);
    trustedOrigins.push(`http://*${cookieDomain}`); // For staging environments
  }

  return betterAuth({
    ...getBaseOptions(db),
    secret: authSecret,
    trustedOrigins,
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    advanced: {
      // Configure for cross-origin development (localhost different ports)
      useSecureCookies: false, // false for localhost development
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: false, // set to true in production with HTTPS
      },
      // Only enable cross-subdomain cookies in production with a domain
      ...(cookieDomain && {
        crossSubDomainCookies: {
          enabled: true,
          domain: cookieDomain,
        },
      }),
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
    },
  });
};
