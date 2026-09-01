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
