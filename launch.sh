#!/bin/sh
echo "" > /app/.env
env | while read -r line; do
  echo "$line" >> /app/.env
done
# Show full env
cat /app/.env
git clone https://github.com/JamesonRGrieve/jrgcomponents-themes /app/themes
set -a
. /app/.env
set +a
theme=$(grep -oP 'THEME_NAME=\K.*' /app/.env)
cp -r /app/themes/$theme/* /app
npm run build
rm /app/.env
npm start