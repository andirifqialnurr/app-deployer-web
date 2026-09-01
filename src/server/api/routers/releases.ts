import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getServerEnv } from "@/lib/env";
import { buildApkObjectKey, createDownloadUrl, createUploadUrl } from "@/server/storage/s3";

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

  prepareUpload: adminProcedure
    .input(
      z.object({
        appId: z.string().min(1),
        versionCode: z.number().int().positive(),
        fileName: z.string().min(1).max(120),
        contentType: z.string().default("application/vnd.android.package-archive"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const app = await ctx.db.mobileApp.findUniqueOrThrow({
        where: { id: input.appId },
      });
      const objectKey = buildApkObjectKey({
        packageName: app.packageName,
        versionCode: input.versionCode,
        fileName: input.fileName,
      });

      return {
        objectKey,
        uploadUrl: await createUploadUrl({
          objectKey,
          contentType: input.contentType,
        }),
      };
    }),

  createMetadata: adminProcedure
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
      const env = getServerEnv();
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
          storageObject: {
            create: {
              provider: env.STORAGE_PROVIDER.toUpperCase() === "S3" ? "S3" : "R2",
              bucket: env.S3_BUCKET,
              objectKey: input.apkObjectKey,
              contentType: "application/vnd.android.package-archive",
              sizeBytes: input.apkSizeBytes,
              sha256: input.apkSha256,
            },
          },
        },
      });
    }),

  downloadUrl: publicProcedure
    .input(z.object({ releaseId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const release = await ctx.db.appRelease.findFirstOrThrow({
        where: { id: input.releaseId, isActive: true },
        select: { apkObjectKey: true, apkSha256: true, apkSizeBytes: true },
      });

      return {
        downloadUrl: await createDownloadUrl(release.apkObjectKey),
        apkSha256: release.apkSha256,
        apkSizeBytes: Number(release.apkSizeBytes),
      };
    }),
});
