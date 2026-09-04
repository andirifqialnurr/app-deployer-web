import { NextResponse } from "next/server";
import { z } from "zod";
import { serializeRelease } from "@/lib/release-serializers";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

const channelSchema = z.enum(["DEV", "STABLE"]).optional();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const channelResult = channelSchema.safeParse(
    url.searchParams.get("channel") ?? undefined,
  );

  if (!channelResult.success) {
    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  }

  const app = await db.mobileApp.findFirst({
    where: { id, isActive: true },
    select: { id: true },
  });

  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const releases = await db.appRelease.findMany({
    where: {
      appId: app.id,
      isActive: true,
      ...(channelResult.data ? { channel: channelResult.data } : {}),
    },
    orderBy: [{ versionCode: "desc" }, { createdAt: "desc" }],
    include: { app: true },
  });

  return NextResponse.json({
    releases: releases.map(serializeRelease),
  });
}
