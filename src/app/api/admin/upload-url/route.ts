import { NextResponse } from "next/server";
import { z } from "zod";
import { buildApkObjectKey, createUploadUrl } from "@/server/storage/s3";
import { db } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  appId: z.string().min(1),
  versionCode: z.number().int().positive(),
  fileName: z.string().min(1).max(120).refine((value) => value.toLowerCase().endsWith(".apk"), {
    message: "File must use .apk extension.",
  }),
  channel: z.enum(["DEV", "STABLE"]).default("STABLE"),
  contentType: z.string().default("application/vnd.android.package-archive"),
});

export async function POST(request: Request) {
  const input = requestSchema.parse(await request.json());
  const app = await db.mobileApp.findUniqueOrThrow({ where: { id: input.appId } });
  const existingRelease = await db.appRelease.findUnique({
    where: {
      appId_channel_versionCode: {
        appId: input.appId,
        channel: input.channel,
        versionCode: input.versionCode,
      },
    },
  });

  if (existingRelease) {
    return NextResponse.json(
      { error: "Version code already exists for this app and channel." },
      { status: 409 },
    );
  }

  const objectKey = buildApkObjectKey({
    packageName: app.packageName,
    versionCode: input.versionCode,
    fileName: input.fileName,
  });
  const uploadUrl = await createUploadUrl({
    objectKey,
    contentType: input.contentType,
  });

  return NextResponse.json({ objectKey, uploadUrl });
}
