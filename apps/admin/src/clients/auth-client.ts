import { clientEnv } from "@apps/admin/env";
import { createAuthClient } from "@repo/auth/client";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    apiBaseUrl: clientEnv.VITE_API_URL,
  }
);

export type AuthUser = ReturnType<
  typeof createAuthClient
>["$Infer"]["Session"]["user"];

export type AuthSession =
  | ReturnType<typeof createAuthClient>["$Infer"]["Session"]["session"]
  | null;

export type Auth = {
  user: AuthUser | null;
  session: AuthSession;
};
