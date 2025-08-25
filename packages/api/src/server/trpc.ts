import type { AuthInstance } from '@repo/auth/server';
import type { DatabaseInstance } from '@repo/db/client';
import { initTRPC, TRPCError } from '@trpc/server';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';

export const createTRPCContext = async ({
  auth,
  db,
  headers,
}: {
  auth: AuthInstance;
  db: DatabaseInstance;
  headers: Headers;
}): Promise<{
  db: DatabaseInstance;
  session: AuthInstance['$Infer']['Session'] | null;
}> => {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    db,
    session,
  };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,

  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  });
});
