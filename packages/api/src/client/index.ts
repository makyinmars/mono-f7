import {
  createTRPCClient,
  type HTTPHeaders,
  httpLink,
  isNonJsonSerializable,
  loggerLink,
  splitLink,
} from '@trpc/client';
import type { TRPCCombinedDataTransformer } from '@trpc/server';
import SuperJSON from 'superjson';
import type { AppRouter } from '../server';

export const transformer: TRPCCombinedDataTransformer = {
  input: {
    serialize: (obj) => {
      if (isNonJsonSerializable(obj)) {
        return obj;
      }
      return SuperJSON.serialize(obj);
    },
    deserialize: (obj) => {
      if (isNonJsonSerializable(obj)) {
        return obj;
      }
      return SuperJSON.deserialize(obj);
    },
  },
  output: SuperJSON,
};

export interface APIClientOptions {
  serverUrl: string;
  headers: HTTPHeaders;
}

export const createTrpcClient = ({ serverUrl, headers }: APIClientOptions) => {
  console.log('serverUrl', serverUrl);
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === 'development' ||
          (op.direction === 'down' && op.result instanceof Error),
      }),
      splitLink({
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          url: serverUrl,
          transformer,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              /**
               * https://trpc.io/docs/client/cors
               *
               * This is required if you are deploying your frontend (web)
               * and backend (server) on two different domains.
               */
              credentials: 'include',
            });
          },
          headers,
        }),
        false: httpLink({
          url: serverUrl,
          transformer,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              /**
               * https://trpc.io/docs/client/cors
               *
               * This is required if you are deploying your frontend (web)
               * and backend (server) on two different domains.
               */
              credentials: 'include',
            });
          },
          headers,
        }),
      }),
    ],
  });
};
