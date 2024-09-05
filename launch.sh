#!/bin/bash

# Create .env file
echo "" >/app/.env
env | while IFS='=' read -r name value; do
  printf '%s="%s"\n' "$name" "$value" >>/app/.env
done

# Show full env
cat /app/.env

# Load environment variables
set -a
. /app/.env
set +a

# Check if THEME_NAME is defined
if [ -n "$THEME_NAME" ]; then
  theme=$(echo "$THEME_NAME" | tr -d '"')

  # Remove existing themes directory if it exists
  if [ -d "/app/themes" ]; then
    rm -rf /app/themes
  fi

  # Clone themes repository
  git clone https://github.com/JamesonRGrieve/jrgcomponents-themes /app/themes

  # Copy theme files
  cp -r "/app/themes/$theme"/* /app
else
  echo "THEME_NAME is not defined. Skipping theme setup."
fi

# Update npm and install dependencies
npm install -g npm@latest
npm install

# Run the appropriate npm script based on the environment
if [ "$ENV" = "development" ]; then
  npm run dev
else
  npm run build && rm /app/.env && npm start
fi
