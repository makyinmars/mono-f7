import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { authClient } from "../clients/auth-client";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    // Forward cookies from the incoming request to the auth server
    const headerObject = Object.fromEntries(request.headers.entries());

    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: headerObject,
      },
    });

    if (!session?.user) {
      throw redirect({ to: "/" });
    }

    return next({ context: { auth: session } });
  }
);
