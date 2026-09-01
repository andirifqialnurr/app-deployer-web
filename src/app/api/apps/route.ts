import { NextResponse } from "next/server";
import { serializeMobileApp } from "@/lib/release-serializers";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const apps = await db.mobileApp.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      releases: {
        where: { isActive: true },
        orderBy: { versionCode: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json({ apps: apps.map(serializeMobileApp) });
}
