# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production
ARG APP_ENV=production
ARG NODE_ENV=production
ARG PORT=3000
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 -G nodejs nextjs

ENV NODE_ENV production
ARG APP_ENV=production
ARG NODE_ENV=production
ARG PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the `node_modules` from builder
COPY --from=builder /app/node_modules ./node_modules
# Copy the `package.json` and `package-lock.json` from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]