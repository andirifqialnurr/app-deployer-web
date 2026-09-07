import { z } from "zod";
import { androidPackageNameSchema } from "@/lib/android-package-name";
import { adminProcedure, createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.mobileApp.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        releases: {
          where: { isActive: true },
          orderBy: { versionCode: "desc" },
          take: 1,
        },
      },
    });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2).max(80),
        packageName: androidPackageNameSchema,
        description: z.string().max(240).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.mobileApp.create({ data: input });
    }),

  latest: publicProcedure
    .input(
      z.object({
        packageName: androidPackageNameSchema,
        channel: z.enum(["DEV", "STABLE"]).default("STABLE"),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.appRelease.findFirst({
        where: {
          channel: input.channel,
          isActive: true,
          app: {
            packageName: input.packageName,
            isActive: true,
          },
        },
        orderBy: { versionCode: "desc" },
        include: { app: true },
      });
    }),
});
