#!/bin/sh
echo "" > /app/.env.local
env | while IFS='=' read -r name value; do
  printf '%s="%s"\n' "$name" "$value" >> /app/.env.local
done
# Show full env
cat /app/.env.local
git clone https://github.com/JamesonRGrieve/jrgcomponents-themes /app/themes
set -a
. /app/.env.local
set +a
theme=$(grep '^THEME_NAME=' /app/.env.local | cut -d'=' -f2)
cp -r /app/themes/$theme/* /app
npm install -g npm@latest
npm install
npm run build
rm /app/.env.local
npm start