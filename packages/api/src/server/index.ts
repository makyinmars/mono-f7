import todoRouter from "./router/todo";
import {
  createTRPCContext as createTRPCContextInternal,
  createTRPCRouter,
} from "./trpc";

export const appRouter = createTRPCRouter({
  todos: todoRouter,
});

export const createApi = () => ({
  trpcRouter: appRouter,
  createTRPCContext: ({ headers }: { headers: Headers }) =>
    createTRPCContextInternal({ headers }),
});

export type AppRouter = typeof appRouter;
export type { TodoAllProcedure } from "./router/todo";
export type { RouterOutput } from "./utils";
