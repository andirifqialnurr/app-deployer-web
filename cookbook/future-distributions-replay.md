# Future Contract: Distributions and Replay Capture

`Distributions` and `Start Replay Capture` are intentionally out of the active
backend scope for the current private APK delivery MVP.

The mobile app may show these actions as DeployGate-style placeholders, but the
web backend should not expose production endpoints for them until the product
rules are defined.

## Distributions

Future distributions can represent controlled release audiences such as:

- internal testers;
- staging teams;
- client-specific groups;
- public/private release links;
- temporary access windows.

Suggested future data model:

```text
Distribution
  id
  appId
  name
  channel
  isActive
  accessPolicy
  createdAt
  updatedAt

DistributionRelease
  distributionId
  releaseId
  isPinned
  createdAt
```

Suggested future API shape:

```text
GET /api/apps/{appId}/distributions
POST /api/admin/apps/{appId}/distributions
POST /api/admin/distributions/{id}/releases
DELETE /api/admin/distributions/{id}/releases/{releaseId}
```

Security rules to define before implementation:

- who can create or edit distributions;
- whether distribution links are public, token-protected, or login-protected;
- whether an inactive release can remain visible in a distribution;
- whether downloads should be logged per distribution.

## Replay Capture

Replay capture is a future diagnostic feature, not part of the current download
pipeline.

Before implementing it, define whether it means:

- screen recording;
- session event replay;
- network/API request capture;
- crash reproduction capture;
- user-submitted diagnostic bundle.

Suggested future API shape:

```text
POST /api/apps/{appId}/replay-sessions
GET /api/apps/{appId}/replay-sessions
GET /api/replay-sessions/{id}
```

Security and privacy rules to define before implementation:

- explicit user consent before capture starts;
- retention duration;
- redaction of secrets, tokens, personal data, and file paths;
- who can view or delete captured sessions;
- whether uploads go to R2/S3 and how object access is signed.

## Current MVP behavior

For now:

- mobile may show these actions as `Coming soon`;
- web should not create database tables or storage objects for them;
- upload, revision, install, update, open, uninstall, and download reliability
  remain the active scope.
