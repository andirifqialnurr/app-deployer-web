import { NextResponse } from "next/server";
import { deleteObject } from "@/server/storage/s3";
import { db } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const app = await db.mobileApp.findUnique({
    where: { id },
    select: {
      id: true,
      releases: {
        select: { apkObjectKey: true },
      },
    },
  });

  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  for (const release of app.releases) {
    await deleteObject(release.apkObjectKey);
  }

  await db.mobileApp.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
