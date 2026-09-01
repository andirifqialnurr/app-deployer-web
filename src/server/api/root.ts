import { appRouter } from "@/server/api/routers/apps";
import { releaseRouter } from "@/server/api/routers/releases";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const rootRouter = createTRPCRouter({
  apps: appRouter,
  releases: releaseRouter,
});

export type AppRouter = typeof rootRouter;
export const createCaller = createCallerFactory(rootRouter);
export { rootRouter as appRouter };
