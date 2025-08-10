import { desc, eq } from '@repo/db';
import {
  apiTodoCreate,
  apiTodoId,
  apiTodoUpdate,
  todos,
  user,
} from '@repo/db/schema';

import { TRPCError, type TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';

const todoRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.todos.findMany({
      columns: {
        id: true,
        text: true,
        description: true,
        status: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: desc(todos.createdAt),
    });
  }),

  byId: publicProcedure.input(apiTodoId).query(async ({ ctx, input }) => {
    const parsed = apiTodoId.safeParse(input);

    if (!parsed.success) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: parsed.error.issues.map((i) => i.message).join(', '),
      });
    }

    if (!parsed.data.id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No id provided',
      });
    }

    const [dbTodo] = await ctx.db
      .select({
        id: todos.id,
        text: todos.text,
        description: todos.description,
        status: todos.status,
        active: todos.active,
        createdAt: todos.createdAt,
        updatedAt: todos.updatedAt,
        author: {
          id: user.id,
          name: user.name,
        },
      })
      .from(todos)
      .innerJoin(user, eq(todos.userId, user.id))
      .where(eq(todos.id, parsed.data.id));

    if (!dbTodo) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `No such todo with ID ${input.id}`,
      });
    }
    return dbTodo;
  }),

  create: protectedProcedure
    .input(apiTodoCreate)
    .mutation(async ({ ctx, input }) => {
      const parsed = apiTodoCreate.safeParse(input);

      if (!parsed.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: parsed.error.issues.map((i) => i.message).join(', '),
        });
      }

      const [created] = await ctx.db
        .insert(todos)
        .values({
          userId: ctx.session.user.id,
          ...parsed.data,
        })
        .returning();

      return created;
    }),

  update: protectedProcedure
    .input(apiTodoUpdate)
    .mutation(async ({ ctx, input }) => {
      const parsed = apiTodoUpdate.safeParse(input);

      if (!parsed.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: parsed.error.issues.map((i) => i.message).join(', '),
        });
      }
      const [updated] = await ctx.db
        .update(todos)
        .set({
          ...parsed.data,
        })
        .where(eq(todos.id, parsed.data.id as string))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(apiTodoId)
    .mutation(async ({ ctx, input }) => {
      const parsed = apiTodoId.safeParse(input);

      if (!parsed.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: parsed.error.issues.map((i) => i.message).join(', '),
        });
      }

      if (!parsed.data.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No id provided',
        });
      }

      const [deleted] = await ctx.db
        .delete(todos)
        .where(eq(todos.id, parsed.data.id))
        .returning();
      return deleted;
    }),
} as TRPCRouterRecord;

export default todoRouter;
