FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN npm install -g npm@latest && \
    npm install
RUN chmod +x /app/launch.sh
RUN touch /app/.env
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 -G nodejs nextjs
COPY . .
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 24498
ENTRYPOINT ["/app/launch.sh"]