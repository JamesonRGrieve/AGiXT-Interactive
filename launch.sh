#!/bin/sh

# Set default values for required variables if not already set
: "${ALLOW_BASIC_SIGN_IN:=false}"
: "${ALLOW_MAGICAL_SIGN_IN:=true}"

# Export the variables so they're included in the env command
export ALLOW_BASIC_SIGN_IN
export ALLOW_MAGICAL_SIGN_IN

# Check if .env exists, create only if it doesn't
if [ ! -f /app/.env ]; then
  # Create .env file and populate with environment variables
  env | while IFS='=' read -r name value; do
    printf '%s="%s"\n' "$name" "$value" >>/app/.env
  done
  echo "Created new .env file with environment variables"
else
  echo "Using existing .env file"
fi

# Display the content of .env file
cat /app/.env

# Load the environment variables
set -a
. /app/.env
set +a

# Install dependencies and build
npm install -g npm@latest
npm install
npm run build

# Clean up
rm /app/.env

# Start the application
npm start
