#!/bin/sh
echo "" > /app/.env
env | while IFS='=' read -r name value; do
  printf '%s="%s"\n' "$name" "$value" >> /app/.env
done
cat /app/.env
set -a
. /app/.env
set +a
npm install -g npm@latest
npm install
npm run build
rm /app/.env
npm start