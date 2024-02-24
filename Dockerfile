FROM node:20-alpine
WORKDIR /app
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/app/node_modules,sharing=locked \
    npm install -g npm@latest && \
    npm install
COPY . .
RUN chmod +x /app/launch.sh
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 -G nodejs nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3437
ENTRYPOINT ["/app/launch.sh"]