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

Use R2/S3 signed URLs for upload and download. For public personal use, `S3_PUBLIC_BASE_URL` can be enabled later.

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

## Deployment

Initial VPS deployment can run:

```text
Next.js container
PostgreSQL managed by user or separate VPS service
Reverse proxy with HTTPS
R2/S3 bucket for APKs
```

The local `docker-compose.yml` includes PostgreSQL for development only. Production should point `DATABASE_URL` to the VPS database that the user creates.
