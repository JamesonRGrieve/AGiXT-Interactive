#!/bin/sh
if [ ! -f /app/.env.local ]; then
    env | while IFS='=' read -r name value; do
        printf '%s="%s"\n' "$name" "$value" >>/.env.local
    done
    echo "Created new .env.local file with environment variables"
else
    echo "Using existing .env.local file"
fi

cat /.env.local

set -a
. /.env.local
set +a
