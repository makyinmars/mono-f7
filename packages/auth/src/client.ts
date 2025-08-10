import { createAuthClient as createBetterAuthClient } from 'better-auth/react';

export interface AuthClientOptions {
  apiBaseUrl: string;
}

export function createAuthClient(options: AuthClientOptions) {
  return createBetterAuthClient({
    baseURL: options.apiBaseUrl,
    // plugins: [],
  });
}
