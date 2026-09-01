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
