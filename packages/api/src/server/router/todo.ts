import { desc, eq } from "@repo/db";
import {
  apiTodoCreate,
  apiTodoId,
  apiTodoUpdate,
  apiTodoUpsert,
  todos,
  user,
} from "@repo/db/schema";

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../trpc";
import type { RouterOutput } from "../utils";

export type TodoAllProcedure = RouterOutput["todo"]["list"];

const todoRouter = {
  list: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.db.query.todos.findMany({
        orderBy: desc(todos.createdAt),
      })
  ),

  byId: publicProcedure.input(apiTodoId).query(async ({ ctx, input }) => {
    const parsed = apiTodoId.safeParse(input);

    if (!parsed.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      });
    }

    if (!parsed.data.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No id provided",
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
      .where(eq(todos.id, parsed.data.id));

    if (!dbTodo) {
      throw new TRPCError({
        code: "BAD_REQUEST",
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
          code: "BAD_REQUEST",
          message: parsed.error.issues.map((i) => i.message).join(", "),
        });
      }

      const [created] = await ctx.db
        .insert(todos)
        .values({
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
          code: "BAD_REQUEST",
          message: parsed.error.issues.map((i) => i.message).join(", "),
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

  upsert: protectedProcedure
    .input(apiTodoUpsert)
    .mutation(async ({ ctx, input }) => {
      const parsed = apiTodoUpsert.safeParse(input);

      if (!parsed.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: parsed.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { id, ...data } = parsed.data;

      if (id) {
        // Update existing todo
        const [updated] = await ctx.db
          .update(todos)
          .set({
            ...data,
          })
          .where(eq(todos.id, id))
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No todo found with ID ${id}`,
          });
        }

        return updated;
      }

      // Create new todo
      const [created] = await ctx.db
        .insert(todos)
        .values({
          ...data,
        })
        .returning();

      return created;
    }),

  delete: protectedProcedure
    .input(apiTodoId)
    .mutation(async ({ ctx, input }) => {
      const parsed = apiTodoId.safeParse(input);

      if (!parsed.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: parsed.error.issues.map((i) => i.message).join(", "),
        });
      }

      if (!parsed.data.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No id provided",
        });
      }

      const [deleted] = await ctx.db
        .delete(todos)
        .where(eq(todos.id, parsed.data.id))
        .returning();
      return deleted;
    }),
} satisfies TRPCRouterRecord;

export default todoRouter;
