import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(async ({ ctx }) => ctx.session),
} satisfies TRPCRouterRecord;
