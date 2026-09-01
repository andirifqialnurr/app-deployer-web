#!/usr/bin/env bash
set -euo pipefail

cd /opt/apps/app-deployer-web

echo "Pulling latest code ..."
git pull origin main

echo "Building web image ..."
docker compose build web

echo "Starting database ..."
docker compose up -d postgres

echo "Running database migrations ..."
docker compose run --rm web npx prisma migrate deploy

echo "Starting application ..."
docker compose up -d --build

echo "Current containers:"
docker compose ps

echo "Recent web logs:"
docker compose logs --tail=80 web
