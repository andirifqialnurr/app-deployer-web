import type { AppRelease, MobileApp } from "@prisma/client";

export type ReleaseDto = {
  id: string;
  appId: string;
  appName?: string;
  packageName?: string;
  channel: "DEV" | "STABLE";
  versionName: string;
  versionCode: number;
  changelog: string | null;
  apkObjectKey: string;
  apkSizeBytes: number;
  apkSha256: string;
  minSdkVersion: number | null;
  isActive: boolean;
  createdAt: string;
};

export type MobileAppDto = {
  id: string;
  name: string;
  packageName: string;
  iconUrl: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  latestRelease: ReleaseDto | null;
};

export function serializeRelease(
  release: AppRelease & { app?: MobileApp },
): ReleaseDto {
  return {
    id: release.id,
    appId: release.appId,
    appName: release.app?.name,
    packageName: release.app?.packageName,
    channel: release.channel,
    versionName: release.versionName,
    versionCode: release.versionCode,
    changelog: release.changelog,
    apkObjectKey: release.apkObjectKey,
    apkSizeBytes: Number(release.apkSizeBytes),
    apkSha256: release.apkSha256,
    minSdkVersion: release.minSdkVersion,
    isActive: release.isActive,
    createdAt: release.createdAt.toISOString(),
  };
}

export function serializeMobileApp(
  app: MobileApp & { releases: AppRelease[] },
): MobileAppDto {
  return {
    id: app.id,
    name: app.name,
    packageName: app.packageName,
    iconUrl: app.iconUrl,
    description: app.description,
    isActive: app.isActive,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    latestRelease: app.releases[0] ? serializeRelease(app.releases[0]) : null,
  };
}
