#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

MOBILE_REPO_DIR="${MOBILE_REPO_DIR:-../app-deployer-mobile}"

if [[ ! -d "$MOBILE_REPO_DIR/.git" ]]; then
  echo "Mobile repository is required beside the web repository: $MOBILE_REPO_DIR" >&2
  exit 1
fi

echo "Pulling latest code ..."
git pull origin main

echo "Pulling latest mobile code ..."
git -C "$MOBILE_REPO_DIR" pull origin main

MOBILE_ARTIFACT_DIR="$(mktemp -d)"
trap 'rm -rf "$MOBILE_ARTIFACT_DIR"' EXIT

MOBILE_VERSION_NAME="$(sed -n 's/^version:[[:space:]]*\([^+[:space:]]*\).*/\1/p' "$MOBILE_REPO_DIR/pubspec.yaml" | head -n 1)"
MOBILE_VERSION_CODE="${MOBILE_VERSION_CODE:-$(git -C "$MOBILE_REPO_DIR" log -1 --format=%ct)}"

if [[ -z "$MOBILE_VERSION_NAME" ]]; then
  echo "Could not read mobile version name from $MOBILE_REPO_DIR/pubspec.yaml" >&2
  exit 1
fi

if [[ ! "$MOBILE_VERSION_CODE" =~ ^[0-9]+$ ]]; then
  echo "Mobile version code must be numeric: $MOBILE_VERSION_CODE" >&2
  exit 1
fi

echo "Building latest signed mobile bootstrap APK ..."
MOBILE_VERSION_CODE="$MOBILE_VERSION_CODE" \
  bash scripts/build-mobile-bootstrap.sh "$MOBILE_ARTIFACT_DIR/app-deployer-mobile.apk"

update_env_value() {
  local key="$1"
  local value="$2"

  if grep -q "^${key}=" .env; then
    sed -i "s|^${key}=.*|${key}=\"${value}\"|" .env
  else
    printf '%s="%s"\n' "$key" "$value" >> .env
  fi
}

update_env_value DEPLOYER_MOBILE_VERSION_NAME "$MOBILE_VERSION_NAME"
update_env_value DEPLOYER_MOBILE_VERSION_CODE "$MOBILE_VERSION_CODE"

echo "Building web image ..."
docker compose build web

echo "Starting database ..."
docker compose up -d postgres

echo "Waiting for database readiness ..."
for attempt in {1..30}; do
  if docker compose exec -T postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null 2>&1; then
    echo "Database is ready."
    break
  fi

  if [[ "$attempt" -eq 30 ]]; then
    echo "Database did not become ready in time." >&2
    docker compose logs --tail=80 postgres >&2
    exit 1
  fi

  sleep 2
done

echo "Running database migrations ..."
docker compose run --rm web bunx prisma migrate deploy

echo "Replacing bootstrap APK in R2 ..."
docker compose run --rm --no-deps \
  --volume "$MOBILE_ARTIFACT_DIR:/artifacts:ro" \
  web bun scripts/upload-mobile-bootstrap.mjs /artifacts/app-deployer-mobile.apk

echo "Starting application ..."
docker compose up -d

echo "Current containers:"
docker compose ps

echo "Recent web logs:"
docker compose logs --tail=80 web
