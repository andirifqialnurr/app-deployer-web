import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { serializeRelease } from "@/lib/release-serializers";
import { db } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  appId: z.string().min(1),
  channel: z.enum(["DEV", "STABLE"]).default("STABLE"),
  versionName: z.string().trim().min(1).max(40),
  versionCode: z.number().int().positive(),
  changelog: z.string().trim().max(500).optional(),
  apkObjectKey: z.string().min(1),
  apkSizeBytes: z.number().int().positive(),
  apkSha256: z.string().length(64),
  contentType: z.string().default("application/vnd.android.package-archive"),
});

export async function POST(request: Request) {
  const input = requestSchema.parse(await request.json());
  const env = getServerEnv();

  const release = await db.appRelease.create({
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
          contentType: input.contentType,
          sizeBytes: input.apkSizeBytes,
          sha256: input.apkSha256,
        },
      },
    },
    include: { app: true },
  });

  return NextResponse.json({ release: serializeRelease(release) });
}
