# Architecture: App Deployer Web

## System Boundary

```text
Admin Browser
  -> Next.js Web
  -> tRPC API
  -> Prisma
  -> PostgreSQL

Next.js Web
  -> S3/R2 bucket for APK files

Android Client
  -> tRPC/API endpoint
  -> signed APK download URL
  -> Android Package Installer
```

## APK Types

There are two APK categories:

- App Deployer Mobile APK: bootstrap installer for the mobile client itself.
- Client App APK: apps uploaded by the admin and installed from the mobile client.

The bootstrap APK is configured by environment variables and downloaded from the dashboard. It is not stored as a normal `MobileApp` row, so it does not appear as a client app.

## Runtime Components

- Next.js renders the admin dashboard.
- tRPC handles typed API calls.
- Prisma handles PostgreSQL access.
- S3/R2 stores APK binaries.
- PostgreSQL stores app, release, and storage metadata.

## Storage Strategy

APK files should not be stored in PostgreSQL.

Object key format:

```text
apks/{packageName}/{versionCode}/{fileName}
```

Bootstrap mobile client object key:

```text
bootstrap/app-deployer-mobile.apk
```

Use R2/S3 signed URLs for upload and download. For public personal use, `S3_PUBLIC_BASE_URL` can be enabled later.

## Bootstrap Flow

```text
Admin builds App Deployer Mobile APK
  -> upload APK object to R2 at DEPLOYER_MOBILE_APK_OBJECT_KEY
  -> set DEPLOYER_MOBILE_* env on VPS
  -> dashboard shows Download Mobile App
  -> client opens dashboard from Android browser
  -> client downloads APK
  -> Android installer asks for confirmation
  -> App Deployer Mobile is installed
```

The first install is manual because the project is not connected to Google Play Store. Later updates to client apps happen from inside App Deployer Mobile.

## Update Contract

The Android client sends:

```text
packageName
installedVersionCode
channel
```

The server returns the latest active release. The client shows an update only when:

```text
latest.versionCode > installedVersionCode
```

Android still requires user confirmation for every install or update. The app can download the APK and open the installer, but cannot silently install it.

## Deployment

Initial VPS deployment can run:

```text
Next.js container
PostgreSQL managed by user or separate VPS service
Reverse proxy with HTTPS
R2/S3 bucket for APKs
```

The local `docker-compose.yml` includes PostgreSQL for development only. Production should point `DATABASE_URL` to the VPS database that the user creates.
