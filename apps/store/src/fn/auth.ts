import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getHeaders } from '@tanstack/react-start/server';
import { authClient } from '~/clients/auth-client';

export const getCurrentUserFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const headers = getHeaders();

  try {
    // Convert headers to a format that fetch can understand
    const headerObject = Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [
        key,
        value?.toString() || '',
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
      error: auth.error || null,
    };
  } catch (error) {
    console.error('Failed to validate session:', error);
    return { session: null, user: null, error: true };
  }
});

export const currentUserQueryOptions = queryOptions({
  queryKey: ['currentUser'],
  queryFn: getCurrentUserFn,
  staleTime: 2 * 60 * 1000, // Cache for 2 minutes (better security)
  gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  retry: false, // Don't retry auth failures
  refetchOnWindowFocus: true, // Revalidate when user returns to tab
  refetchOnReconnect: true, // Revalidate after network reconnection
  networkMode: 'offlineFirst', // Use cache when offline
});
