import { redirect } from "next/navigation";
import { getDeployerMobileConfig } from "@/lib/env";
import { createDownloadUrl } from "@/server/storage/s3";

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
  const signedUrl = await createDownloadUrl(
    config.objectKey,
    `app-deployer-mobile-${versionName}.apk`,
  );

  redirect(signedUrl);
}
