FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN npm install -g npm@latest && \
    npm install
COPY . .
RUN chmod +x /app/launch.sh
RUN touch /app/.env
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 -G nodejs nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3437
ENTRYPOINT ["/app/launch.sh"]