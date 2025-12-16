import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { authClient } from "../clients/auth-client";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const headerObject = Object.fromEntries(request.headers.entries());

    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: headerObject,
      },
    });

    console.log("session in middleware", session);

    if (!session?.user) {
      // Redirect to store app login or a dedicated admin login page
      throw redirect({ to: "/" });
    }

    return next({ context: { auth: session } });
  }
);
