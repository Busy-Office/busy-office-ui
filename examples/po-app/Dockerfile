# Build context = repo root (see docker-compose.yml).
# Stage 1: build the framework and pack the REAL tarball a consumer would get.
FROM node:22-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/docs/package.json ./apps/docs/package.json
RUN npm ci --ignore-scripts
RUN npm run build -w @busy-office/ui
# Stable filename: the consumer stage must not break on version bumps.
RUN mkdir -p /out && npm pack -w @busy-office/ui --pack-destination /out \
    && mv /out/busy-office-ui-*.tgz /out/busy-office-ui.tgz

# Stage 2: the consumer app installs ONLY the tarball.
FROM node:22-alpine
WORKDIR /app
COPY examples/po-app/package.json examples/po-app/server.mjs ./
COPY --from=build /out/busy-office-ui.tgz ./
RUN npm install --omit=dev
EXPOSE 8080
CMD ["node", "server.mjs"]
