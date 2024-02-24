FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN npm install -g npm@latest && \
    npm install
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 -G nodejs nextjs
COPY . .
RUN chmod +x /app/launch.sh
USER nextjs
EXPOSE 24498
ENTRYPOINT ["/app/launch.sh"]