import { createTrpcClient } from '@repo/api/client';
import { TRPCProvider } from '@repo/api/react';
import type { AppRouter } from '@repo/api/server';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createIsomorphicFn, createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import type { HTTPHeaders, TRPCClientErrorLike } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import superjson from 'superjson';

const QUERY_STALE_TIME_FIVE_MINUTES = 5 * 60 * 1000;

const getRequestHeaders = createServerFn({ method: 'GET' }).handler(() => {
  const request = getWebRequest();
  const headers = new Headers(request?.headers);

  return Object.fromEntries(headers);
});

const headers = createIsomorphicFn()
  .client(() => ({}))
  .server(() => getRequestHeaders()) as unknown as HTTPHeaders;

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') {
      return 'http://localhost:3035';
    }
    return 'http://localhost:3035';
  })();
  return `${base}/api/trpc`;
}

console.log('getUrl', getUrl());

export const trpcClient = createTrpcClient({
  serverUrl: getUrl(),
  headers,
});

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },

      queries: {
        staleTime: QUERY_STALE_TIME_FIVE_MINUTES,
        retry(failureCount, _err) {
          const err = _err as unknown as TRPCClientErrorLike<AppRouter>;
          const code = err?.data?.code;
          if (
            code === 'BAD_REQUEST' ||
            code === 'FORBIDDEN' ||
            code === 'UNAUTHORIZED'
          ) {
            // if input data is wrong or you're not authorized there's no point retrying a query
            return false;
          }
          const MAX_QUERY_RETRIES = 1;
          return failureCount < MAX_QUERY_RETRIES;
        },
      },
    },
    queryCache: new QueryCache(),
  });
};

export const createServerHelpers = ({
  queryClient,
}: {
  queryClient: QueryClient;
}) => {
  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient,
  });
  return serverHelpers;
};

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </TRPCProvider>
  );
}
