FROM node:20-alpine AS builder
WORKDIR /aginterative-build
RUN apk add --no-cache python3 make g++ eudev-dev libusb-dev linux-headers eudev-libs
COPY package*.json ./
RUN npm install -g npm@latest && npm ci
COPY . .
ARG AGIXT_SERVER
ARG APP_NAME
ARG APP_URI
RUN chmod +x ./env.sh && ./env.sh
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /aginterative
ENV NODE_ENV=production
RUN apk add --no-cache python3 libusb eudev make g++ linux-headers eudev-libs
COPY package*.json ./
RUN npm install -g npm@latest && npm ci --omit=dev

COPY --from=builder /aginterative-build/public /aginterative/public
COPY --from=builder /aginterative-build/.next/standalone /aginterative/
COPY --from=builder /aginterative-build/.next/static /aginterative/.next/static

EXPOSE 3437
ENV PORT=3437
ENTRYPOINT ["node", "server.js"]
