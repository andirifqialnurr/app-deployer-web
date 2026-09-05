import { NextResponse } from "next/server";
import { createDownloadUrl } from "@/server/storage/s3";
import { db } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const release = await db.appRelease.findFirst({
    where: { id, isActive: true },
    select: {
      id: true,
      apkObjectKey: true,
      apkSha256: true,
      apkSizeBytes: true,
      versionCode: true,
      app: {
        select: {
          packageName: true,
        },
      },
    },
  });

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 });
  }

  const downloadUrl = await createDownloadUrl(
    release.apkObjectKey,
    `${release.app.packageName}-${release.versionCode}.apk`,
  );

  return NextResponse.json({
    releaseId: release.id,
    downloadUrl,
    directDownload: true,
    apkSha256: release.apkSha256,
    apkSizeBytes: Number(release.apkSizeBytes),
  });
}
