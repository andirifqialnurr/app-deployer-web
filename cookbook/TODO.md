# TODO: App Deployer Web

> Current product target: support a reliable DeployGate-style Android delivery flow.

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

## Phase 7: Mobile Release History API

- [ ] Add an authenticated endpoint to list active revisions for one app.
- [ ] Return version name, version code, channel, upload date, APK size, SHA-256, and changelog.
- [ ] Return app icon metadata or a safe icon URL for the mobile detail page.
- [ ] Define stable ordering for revisions by version code and upload time.
- [ ] Filter inactive apps and inactive releases consistently.
- [ ] Add pagination if the revision history becomes large.
- [ ] Add API contract tests for empty, single-release, and multi-release histories.

## Phase 8: Secure and Downloadable Release Contract

- [ ] Protect app list, revision, download-url, and download endpoints with the intended mobile auth/token model.
- [ ] Ensure a user cannot download a release outside the access policy.
- [ ] Keep APK objects private in R2/S3.
- [ ] Return a short-lived download URL or authenticated download response.
- [ ] Preserve `Content-Length`, `Content-Type`, and `Content-Disposition` for APK downloads.
- [ ] Decide whether background downloads use the current streaming route or a direct signed R2 URL.
- [ ] Add HTTP range/resume support if the chosen Android downloader requires it.
- [ ] Keep SHA-256 and size metadata consistent with the actual object.
- [ ] Add download failure logging without logging credentials or signed URLs.
- [ ] Add an operational reconciliation check for database releases whose R2 object is missing.

## Phase 9: App and Revision Presentation

- [ ] Add app icon upload or icon metadata management.
- [ ] Show app icon, package name, latest version, and release count in app detail.
- [ ] Improve the admin app detail page with a DeployGate-inspired release summary.
- [ ] Show a complete revision list with channel, status, size, checksum, and changelog.
- [ ] Make active/inactive revision state explicit to admins.
- [ ] Keep `Distributions` and `Start Replay Capture` out of the active backend scope for now.
- [ ] Document the future contract for distributions and replay capture without implementing it yet.

## Phase 10: Payment-Free Delivery Operations

- [ ] Add release upload validation for package name, version code, file size, content type, and checksum.
- [ ] Prevent publishing a lower version code as the latest stable release unless explicitly allowed.
- [ ] Keep delete operations synchronized between PostgreSQL and R2.
- [ ] Add safe retry/reconciliation for bootstrap APK replacement.
- [ ] Add an audit trail for upload, publish, deactivate, delete, and bootstrap replacement actions.
- [ ] Add health checks for PostgreSQL, R2 connectivity, and the mobile download path.
- [ ] Document VPS disk usage, Docker cache cleanup, and PostgreSQL volume preservation.

## Phase 11: End-to-End Acceptance

- [ ] Upload a client APK from the web dashboard.
- [ ] Confirm the revision appears in the mobile app.
- [ ] Download through the mobile app and verify byte-based progress.
- [ ] Confirm the Android notification remains visible during background download.
- [ ] Verify SHA-256 before installation.
- [ ] Install a new app, update an existing app, open it, open App Info, and uninstall it.
- [ ] Verify a selected older revision cannot silently downgrade an installed app.
- [ ] Verify the bootstrap APK replacement still works after web image rebuild.
- [ ] Verify the public HTTPS endpoint and private download endpoint from a physical device.
