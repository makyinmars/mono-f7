import { env } from "@apps/admin/env";
import { createAuthClient } from "@repo/auth/client";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    apiBaseUrl: env.PUBLIC_API_URL,
  }
);

export type AuthSession =
  | ReturnType<typeof createAuthClient>["$Infer"]["Session"]
  | null;
