import { initTRPC } from "@trpc/server";
import { TRPCError } from "@trpc/server";
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
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!isBasicAuthValid(ctx.req.headers.get("authorization"))) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Admin authentication is required.",
    });
  }

  return next({ ctx });
});

function isBasicAuthValid(authHeader: string | null) {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword || !authHeader?.startsWith("Basic ")) {
    return false;
  }

  const encoded = authHeader.slice("Basic ".length);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex < 0) {
    return false;
  }

  const email = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  return email === expectedEmail && password === expectedPassword;
}
