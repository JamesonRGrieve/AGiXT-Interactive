FROM node:20-alpine
WORKDIR /app
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    apk add --no-cache libc6-compat git
COPY . .
RUN chmod +x /app/launch.sh
EXPOSE 3437
ENTRYPOINT ["/app/launch.sh"]