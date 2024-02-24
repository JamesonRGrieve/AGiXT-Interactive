FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN npm install -g npm@latest && \
    npm install
COPY . .
RUN chmod +x /app/launch.sh
EXPOSE 3437
ENTRYPOINT ["/app/launch.sh"]