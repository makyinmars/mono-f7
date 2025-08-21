import { createAuthClient } from '@repo/auth/client';
import { env } from '~/env';

export const authClient = createAuthClient({
  apiBaseUrl: env.PUBLIC_API_URL,
});

export type AuthSession =
  | ReturnType<typeof createAuthClient>['$Infer']['Session']
  | null;
