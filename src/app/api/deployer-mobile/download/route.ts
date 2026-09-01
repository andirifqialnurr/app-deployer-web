import { getDeployerMobileConfig } from "@/lib/env";
import { createDownloadResponse } from "@/server/storage/s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = getDeployerMobileConfig();

  if (!config.objectKey) {
    return new Response("App Deployer Mobile APK is not configured.", {
      status: 404,
    });
  }

  const versionName = config.versionName === "Not set" ? "latest" : config.versionName;
  return createDownloadResponse({
    objectKey: config.objectKey,
    fileName: `app-deployer-mobile-${versionName}.apk`,
  });
}
