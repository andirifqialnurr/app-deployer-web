import { redirect } from "next/navigation";
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
    include: { app: true },
  });

  if (!release) {
    return new Response("Release not found", { status: 404 });
  }

  const fileName = `${release.app.packageName}-${release.versionCode}.apk`;
  const signedUrl = await createDownloadUrl(release.apkObjectKey, fileName);
  redirect(signedUrl);
}
