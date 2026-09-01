# Schema: App Deployer Web

## Database

Provider: PostgreSQL through Prisma.

## User

Admin account.

Fields:

- `id`
- `email`
- `passwordHash`
- `name`
- `createdAt`
- `updatedAt`

## MobileApp

Android app metadata.

Fields:

- `id`
- `name`
- `packageName`
- `platform`
- `iconUrl`
- `description`
- `isActive`
- `createdAt`
- `updatedAt`

Rules:

- `packageName` is unique.
- Do not create a new app when only uploading a new APK version.

## AppRelease

APK release metadata.

Fields:

- `id`
- `appId`
- `channel`
- `versionName`
- `versionCode`
- `changelog`
- `apkObjectKey`
- `apkSizeBytes`
- `apkSha256`
- `minSdkVersion`
- `isActive`
- `createdAt`

Rules:

- `(appId, channel, versionCode)` is unique.
- `versionCode` must increase for normal update flow.
- Latest release is the active release with the highest `versionCode`.

## StorageObject

S3/R2 object metadata.

Fields:

- `id`
- `provider`
- `bucket`
- `objectKey`
- `contentType`
- `sizeBytes`
- `sha256`
- `releaseId`
- `createdAt`

## Device

Optional device record for later tracking.

Fields:

- `id`
- `label`
- `fingerprint`
- `platform`
- `createdAt`
- `updatedAt`

## InstallEvent

Optional install telemetry.

Fields:

- `id`
- `deviceId`
- `releaseId`
- `installedAt`
