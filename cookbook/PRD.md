# PRD: App Deployer Web

## Purpose

App Deployer Web is a personal admin dashboard and API for distributing Android APK updates without DeployGate limits.

## Target User

The primary user is the developer who builds private Flutter Android apps and installs updates on personal devices or a small tester group.

## MVP Goals

- Register Android apps by name and package name.
- Upload APK release metadata and store APK files in S3/R2.
- Keep release history per app.
- Serve the latest active release to the Android client.
- Keep UI short, operational, and non-repetitive.

## Non-Goals

- Public app store behavior.
- Silent APK installation.
- iOS support.
- Multi-tenant billing.
- Large enterprise device management.

## Core User Flow

1. Admin logs in.
2. Admin creates an app record.
3. Admin uploads an APK release.
4. Server stores metadata in PostgreSQL.
5. APK file is stored in S3/R2-compatible storage.
6. Android client checks the latest release.
7. Android client downloads the APK and opens the Android installer.

## Product Rules

- `packageName` must never change for the same installed app.
- `versionCode` must increase for updates.
- Changelog text should be short.
- Dashboard, Apps, Releases, and Settings must not duplicate the same information.
- Store APK hash for integrity checks.

## MVP Acceptance

- Admin can create app metadata.
- Admin can prepare release metadata.
- Backend can return latest release by package name and channel.
- Environment supports PostgreSQL and S3/R2 configuration.
- Cookbook is complete enough to continue implementation in stages.
