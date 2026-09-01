# TODO: App Deployer Web

## Phase 1: Base Project

- [x] Create Next.js TypeScript structure.
- [x] Add Material UI theme and shell.
- [x] Add Prisma schema for PostgreSQL.
- [x] Add tRPC base router.
- [x] Add S3/R2 storage helper.
- [x] Add env files.
- [x] Add Dockerfile and Compose skeleton.

## Phase 2: Database

- [x] Install dependencies.
- [x] Run Prisma generate.
- [x] Run first migration.
- [x] Use Basic Auth env for MVP admin access.
- [x] Add uniqueness validation for package names and version codes.

## Phase 3: Admin UI

- [x] Dashboard mobile client download card.
- [x] App create form.
- [x] App detail page.
- [x] Release upload form.
- [x] Release list per app.
- [x] Release download button.
- [x] Delete app button.
- [x] Delete release button.
- [x] Storage settings read-only panel.

## Phase 4: Upload Flow

- [x] Generate signed upload URL.
- [x] Upload APK to S3/R2.
- [x] Calculate SHA-256 client-side.
- [x] Save release metadata after upload succeeds.
- [x] Validate APK file extension.
- [x] Delete APK object from R2 when release is deleted.
- [x] Delete all APK objects from R2 when app is deleted.

## Phase 5: Mobile API

- [x] Bootstrap App Deployer Mobile download endpoint.
- [x] Public endpoint for app list.
- [x] Public endpoint for latest release by package name.
- [x] Signed download URL endpoint.
- [ ] Optional token auth for private access.

## Phase 6: VPS Deployment

- [ ] Point `.env` to production PostgreSQL.
- [ ] Create R2 bucket and access keys.
- [ ] Build Docker image.
- [ ] Configure reverse proxy and HTTPS.
- [ ] Validate `/api/health` from VPS.
