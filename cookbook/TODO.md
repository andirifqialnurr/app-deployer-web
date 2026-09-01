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

- [ ] Install dependencies.
- [ ] Run `npx prisma generate`.
- [ ] Run first migration.
- [ ] Seed admin user.
- [ ] Add uniqueness validation for package names and version codes.

## Phase 3: Admin UI

- [ ] App create form.
- [ ] App detail page.
- [ ] Release upload form.
- [ ] Release list per app.
- [ ] Storage settings read-only panel.

## Phase 4: Upload Flow

- [ ] Generate signed upload URL.
- [ ] Upload APK to S3/R2.
- [ ] Calculate SHA-256 client-side or server-side.
- [ ] Save release metadata after upload succeeds.
- [ ] Validate APK content type and file extension.

## Phase 5: Mobile API

- [ ] Public endpoint for app list.
- [ ] Public endpoint for latest release by package name.
- [ ] Signed download URL endpoint.
- [ ] Optional token auth for private access.

## Phase 6: VPS Deployment

- [ ] Point `.env` to production PostgreSQL.
- [ ] Create R2 bucket and access keys.
- [ ] Build Docker image.
- [ ] Configure reverse proxy and HTTPS.
- [ ] Validate `/api/health` from VPS.
