# Build context = repo root (see docker-compose.yml).
# Stage 1: build the framework and pack the REAL tarball a consumer would get.
FROM node:22-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/docs/package.json ./apps/docs/package.json
RUN npm ci --ignore-scripts
RUN npm run build -w @busy-office/ui
RUN mkdir -p /out && npm pack -w @busy-office/ui --pack-destination /out

# Stage 2: the consumer app installs ONLY the tarball.
FROM node:22-alpine
WORKDIR /app
COPY examples/po-app/package.json examples/po-app/server.mjs ./
COPY --from=build /out/busy-office-ui-0.1.0.tgz ./
RUN npm install --omit=dev
EXPOSE 8080
CMD ["node", "server.mjs"]
