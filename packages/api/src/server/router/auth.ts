import { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
} satisfies TRPCRouterRecord