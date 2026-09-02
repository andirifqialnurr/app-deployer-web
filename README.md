# App Deployer Web

Admin website and API for a personal Android APK distribution service.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Fill `DATABASE_URL` and S3/R2 credentials.
3. Install dependencies.

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Main Scope

- Manage Android apps.
- Upload APK releases.
- Store release metadata in PostgreSQL.
- Store APK files in S3/R2-compatible object storage.
- Expose tRPC APIs for the admin web and Android client.

## Bootstrap Mobile APK

Build the mobile client APK, then upload it to R2:

```bash
bun run upload:mobile ../app-deployer-mobile/build/app/outputs/flutter-apk/app-release.apk
```

Set `DEPLOYER_MOBILE_APK_OBJECT_KEY` in `.env` to the uploaded object key. The dashboard download button signs that object at request time.

## Deployment bootstrap build

`deploy.sh` pulls both repositories, builds the mobile client inside the
Flutter Docker builder, and replaces the single R2 bootstrap object at
`bootstrap/app-deployer-mobile.apk`.

The Android `versionCode` defaults to the latest mobile commit timestamp so a
new mobile commit can be installed as an update. Set `MOBILE_VERSION_CODE`
explicitly in the deploy environment if a different monotonically increasing
numbering policy is required.

The VPS must have these one-time prerequisites:

- `../app-deployer-mobile` checked out beside this repository.
- `../app-deployer-mobile/.env` configured with the production API URL.
- A stable keystore at `/opt/app-deployer/secrets/app-deployer-mobile-release.jks`.
- A root-readable signing env file at `/opt/app-deployer/secrets/mobile-signing.env` containing:

```env
ANDROID_KEYSTORE_PASSWORD=replace-me
ANDROID_KEY_ALIAS=app-deployer-mobile
ANDROID_KEY_PASSWORD=replace-me
```

The signing key and signing env file must never be committed. `PUT` to the
same R2 object key is the S3-compatible replacement operation; it does not
create a versioned bootstrap object.
