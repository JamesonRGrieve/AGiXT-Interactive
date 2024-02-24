FROM node:20-alpine
WORKDIR /app
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/app/node_modules,sharing=locked \
    npm install -g npm@latest && \
    npm install
COPY . .
RUN chmod +x /app/launch.sh
EXPOSE 3437
ENTRYPOINT ["/app/launch.sh"]