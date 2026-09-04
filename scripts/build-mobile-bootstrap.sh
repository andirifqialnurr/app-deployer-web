#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
MOBILE_REPO_DIR="${MOBILE_REPO_DIR:-$WEB_DIR/../app-deployer-mobile}"
MOBILE_KEYSTORE_PATH="${MOBILE_KEYSTORE_PATH:-/opt/apps/app-deployer/secrets/app-deployer-mobile-release.jks}"
MOBILE_SIGNING_ENV_FILE="${MOBILE_SIGNING_ENV_FILE:-/opt/apps/app-deployer/secrets/mobile-signing.env}"
MOBILE_BUILDER_IMAGE="${MOBILE_BUILDER_IMAGE:-app-deployer-mobile-builder:3.44.0}"
OUTPUT_PATH="${1:?Usage: build-mobile-bootstrap.sh <output-apk-path>}"

if [[ ! -d "$MOBILE_REPO_DIR" ]]; then
  echo "Mobile repository not found: $MOBILE_REPO_DIR" >&2
  exit 1
fi

if [[ ! -f "$MOBILE_REPO_DIR/.env" ]]; then
  echo "Mobile .env not found: $MOBILE_REPO_DIR/.env" >&2
  exit 1
fi

if [[ ! -f "$MOBILE_KEYSTORE_PATH" ]]; then
  echo "Mobile signing keystore not found: $MOBILE_KEYSTORE_PATH" >&2
  exit 1
fi

if [[ ! -f "$MOBILE_SIGNING_ENV_FILE" ]]; then
  echo "Mobile signing env file not found: $MOBILE_SIGNING_ENV_FILE" >&2
  exit 1
fi

MOBILE_VERSION_CODE="${MOBILE_VERSION_CODE:-$(git -C "$MOBILE_REPO_DIR" log -1 --format=%ct)}"

if [[ ! "$MOBILE_VERSION_CODE" =~ ^[0-9]+$ ]]; then
  echo "Mobile version code must be numeric: $MOBILE_VERSION_CODE" >&2
  exit 1
fi

mkdir -p "$(dirname -- "$OUTPUT_PATH")"
OUTPUT_DIR="$(cd -- "$(dirname -- "$OUTPUT_PATH")" && pwd)"
OUTPUT_FILE="$(basename -- "$OUTPUT_PATH")"

echo "Building mobile builder image ..."
docker build --pull \
  --file "$MOBILE_REPO_DIR/Dockerfile.release" \
  --tag "$MOBILE_BUILDER_IMAGE" \
  "$MOBILE_REPO_DIR"

echo "Building signed mobile APK ..."
docker run --rm \
  --entrypoint /bin/bash \
  --env-file "$MOBILE_SIGNING_ENV_FILE" \
  --env "ANDROID_KEYSTORE_FILE=/run/secrets/app-deployer-mobile-release.jks" \
  --env "BOOTSTRAP_APK_FILENAME=$OUTPUT_FILE" \
  --env "MOBILE_VERSION_CODE=$MOBILE_VERSION_CODE" \
  --volume "$MOBILE_REPO_DIR:/workspace" \
  --volume "$MOBILE_KEYSTORE_PATH:/run/secrets/app-deployer-mobile-release.jks:ro" \
  --volume "$OUTPUT_DIR:/artifacts" \
  --workdir /workspace \
  "$MOBILE_BUILDER_IMAGE" \
  -lc '
    set -euo pipefail
    flutter config --no-analytics
    flutter pub get
    flutter build apk --release --no-pub --build-number "$MOBILE_VERSION_CODE"
    install -m 0644 build/app/outputs/flutter-apk/app-release.apk "/artifacts/$BOOTSTRAP_APK_FILENAME"
  '

if [[ ! -s "$OUTPUT_PATH" ]]; then
  echo "Mobile APK was not produced: $OUTPUT_PATH" >&2
  exit 1
fi

echo "Mobile APK ready: $OUTPUT_PATH"
