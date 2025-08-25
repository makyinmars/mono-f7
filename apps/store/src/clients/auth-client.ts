import { env } from "@apps/store/env";
import { createAuthClient } from "@repo/auth/client";

export const authClient = createAuthClient({
  apiBaseUrl: env.PUBLIC_API_URL,
});

export type AuthUser = ReturnType<
  typeof createAuthClient
>["$Infer"]["Session"]["user"];
export type AuthSession =
  | ReturnType<typeof createAuthClient>["$Infer"]["Session"]["session"]
  | null;

export interface Auth {
  user: AuthUser | null;
  session: AuthSession;
}
