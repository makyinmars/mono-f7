import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
});

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
