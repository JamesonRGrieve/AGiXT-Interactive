FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache \
  libc6-compat \
  git \
  curl \
  python3 \
  py3-pip \
  make \
  g++ \
  linux-headers
COPY . .
RUN chmod +x /app/launch.sh
EXPOSE 3437
ENTRYPOINT ["/app/launch.sh"]