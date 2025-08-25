import { type Auth, authClient } from "@apps/store/clients/auth-client";
import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

export const getCurrentUserFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const headers = getHeaders();

  try {
    // Convert headers to a format that fetch can understand
    const headerObject = Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [
        key,
        value?.toString() || "",
      ])
    );

    const auth = await authClient.getSession({
      fetchOptions: {
        headers: headerObject,
      },
    });

    return {
      session: auth.data?.session || null,
      user: auth.data?.user || null,
    };
  } catch (error) {
    console.error("Failed to validate session:", error);
    return { session: null, user: null };
  }
});

export const currentUserQueryOptions = queryOptions({
  queryKey: ["currentUser"],
  queryFn: getCurrentUserFn,
  staleTime: 30 * 60 * 1000, // Cache for 30 minutes (reduced server load)
  gcTime: 60 * 60 * 1000, // Keep in memory for 60 minutes
  retry: false, // Don't retry auth failures
  refetchOnWindowFocus: true, // Revalidate when user returns to tab
  refetchOnReconnect: true, // Revalidate after network reconnection
  networkMode: "offlineFirst", // Use cache when offline
});

export const assertAuthenticated = (auth: Auth | null) => {
  if (!auth) {
    throw redirect({
      to: "/",
    });
  }

  if (!auth?.user) {
    throw redirect({
      to: "/",
    });
  }
};
