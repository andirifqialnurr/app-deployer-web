CREATE TYPE "AppPlatform" AS ENUM ('ANDROID');
CREATE TYPE "ReleaseChannel" AS ENUM ('DEV', 'STABLE');
CREATE TYPE "StorageProvider" AS ENUM ('S3', 'R2');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MobileApp" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "packageName" TEXT NOT NULL,
  "platform" "AppPlatform" NOT NULL DEFAULT 'ANDROID',
  "iconUrl" TEXT,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MobileApp_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AppRelease" (
  "id" TEXT NOT NULL,
  "appId" TEXT NOT NULL,
  "channel" "ReleaseChannel" NOT NULL DEFAULT 'STABLE',
  "versionName" TEXT NOT NULL,
  "versionCode" INTEGER NOT NULL,
  "changelog" TEXT,
  "apkObjectKey" TEXT NOT NULL,
  "apkSizeBytes" BIGINT NOT NULL,
  "apkSha256" TEXT NOT NULL,
  "minSdkVersion" INTEGER,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AppRelease_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StorageObject" (
  "id" TEXT NOT NULL,
  "provider" "StorageProvider" NOT NULL DEFAULT 'R2',
  "bucket" TEXT NOT NULL,
  "objectKey" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "sizeBytes" BIGINT NOT NULL,
  "sha256" TEXT NOT NULL,
  "releaseId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "StorageObject_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Device" (
  "id" TEXT NOT NULL,
  "label" TEXT,
  "fingerprint" TEXT NOT NULL,
  "platform" "AppPlatform" NOT NULL DEFAULT 'ANDROID',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InstallEvent" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "releaseId" TEXT NOT NULL,
  "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "InstallEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "MobileApp_packageName_key" ON "MobileApp"("packageName");
CREATE UNIQUE INDEX "AppRelease_appId_channel_versionCode_key" ON "AppRelease"("appId", "channel", "versionCode");
CREATE INDEX "AppRelease_appId_channel_isActive_versionCode_idx" ON "AppRelease"("appId", "channel", "isActive", "versionCode");
CREATE UNIQUE INDEX "StorageObject_objectKey_key" ON "StorageObject"("objectKey");
CREATE UNIQUE INDEX "StorageObject_releaseId_key" ON "StorageObject"("releaseId");
CREATE UNIQUE INDEX "Device_fingerprint_key" ON "Device"("fingerprint");

ALTER TABLE "AppRelease" ADD CONSTRAINT "AppRelease_appId_fkey" FOREIGN KEY ("appId") REFERENCES "MobileApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StorageObject" ADD CONSTRAINT "StorageObject_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "AppRelease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InstallEvent" ADD CONSTRAINT "InstallEvent_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InstallEvent" ADD CONSTRAINT "InstallEvent_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "AppRelease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
