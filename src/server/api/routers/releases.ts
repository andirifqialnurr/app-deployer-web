import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const releaseRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ appId: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.appRelease.findMany({
        where: input?.appId ? { appId: input.appId } : undefined,
        orderBy: { createdAt: "desc" },
        include: { app: true },
      });
    }),

  createMetadata: publicProcedure
    .input(
      z.object({
        appId: z.string(),
        channel: z.enum(["DEV", "STABLE"]).default("STABLE"),
        versionName: z.string().min(1).max(40),
        versionCode: z.number().int().positive(),
        changelog: z.string().max(500).optional(),
        apkObjectKey: z.string().min(1),
        apkSizeBytes: z.number().int().positive(),
        apkSha256: z.string().length(64),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.appRelease.create({
        data: {
          appId: input.appId,
          channel: input.channel,
          versionName: input.versionName,
          versionCode: input.versionCode,
          changelog: input.changelog,
          apkObjectKey: input.apkObjectKey,
          apkSizeBytes: input.apkSizeBytes,
          apkSha256: input.apkSha256,
        },
      });
    }),
});
