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
  const release = await db.appRelease.findUnique({
    where: { id },
    select: { id: true, apkObjectKey: true },
  });

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 });
  }

  await deleteObject(release.apkObjectKey);
  await db.appRelease.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
