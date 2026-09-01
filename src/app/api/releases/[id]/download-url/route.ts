import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
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
    },
  });

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 });
  }

  const env = getServerEnv();
  const downloadUrl = new URL(`/api/releases/${release.id}/download`, env.APP_BASE_URL).toString();

  return NextResponse.json({
    releaseId: release.id,
    downloadUrl,
    apkSha256: release.apkSha256,
    apkSizeBytes: Number(release.apkSizeBytes),
  });
}
