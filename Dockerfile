FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat git
RUN npm install -g npm@latest
COPY package.json package-lock.json ./
RUN for i in {1..5}; do npm ci && break || sleep 15; done
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 -G nodejs nextjs
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN chmod +x /app/launch.sh
USER nextjs
EXPOSE 24498
ENTRYPOINT ["/app/launch.sh"]