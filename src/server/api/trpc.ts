import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { db } from "@/server/db";

export async function createTRPCContext(opts: { req: Request }) {
  return {
    db,
    req: opts.req,
  };
}

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
