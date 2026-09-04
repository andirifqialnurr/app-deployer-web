import { NextResponse } from "next/server";
import { z } from "zod";
import { serializeRelease } from "@/lib/release-serializers";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

const channelSchema = z.enum(["DEV", "STABLE"]).default("STABLE");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ appKey: string }> },
) {
  const { appKey } = await params;
  const url = new URL(request.url);
  const channel = channelSchema.parse(url.searchParams.get("channel") ?? "STABLE");

  const release = await db.appRelease.findFirst({
    where: {
      channel,
      isActive: true,
      app: {
        packageName: appKey,
        isActive: true,
      },
    },
    orderBy: { versionCode: "desc" },
    include: { app: true },
  });

  return NextResponse.json({ release: release ? serializeRelease(release) : null });
}
