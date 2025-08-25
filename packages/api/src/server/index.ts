import type { AuthInstance } from '@repo/auth/server';
import type { DatabaseInstance } from '@repo/db/client';
import todoRouter, { type TodoAllProcedure } from './router/todo';
import {
  createTRPCContext as createTRPCContextInternal,
  createTRPCRouter,
} from './trpc';
import type { RouterOutput } from './utils';

export const appRouter = createTRPCRouter({
  todos: todoRouter,
});

export const createApi = ({
  auth,
  db,
}: {
  auth: AuthInstance;
  db: DatabaseInstance;
}) => {
  return {
    trpcRouter: appRouter,
    createTRPCContext: ({ headers }: { headers: Headers }) =>
      createTRPCContextInternal({ auth, db, headers }),
  };
};

export type AppRouter = typeof appRouter;
export type { TodoAllProcedure, RouterOutput };
