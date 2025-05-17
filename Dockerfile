# ------------------------------------------------------------------------------
# Stage 1: Builder
# This stage builds the application and its dependencies.
# ------------------------------------------------------------------------------
FROM node:jod-alpine AS builder

WORKDIR /app

# Copy dependency definition files first.
# This is a best practice to leverage Docker's layer caching.
# If these files don't change between builds, Docker can reuse the cached layer
# from the 'npm ci' step, which is often the most time-consuming.
COPY package.json package-lock.json tsconfig.json ./

# Install all dependencies, including development dependencies (e.g., @types).
# These are needed for the TypeScript compilation and Swagger docs generation.
RUN npm ci

# Copy the entire TypeScript source code into the builder image.
COPY src/ ./src/

# Build (transpile) the TypeScript code into JavaScript, generate Swagger docs,
# and then remove dev dependencies to reduce the size of the builder image.
RUN npm run build && \
    npm run swagger:docs && \
    npm prune --omit=dev

# ------------------------------------------------------------------------------
# Stage 2: Runtime
# This stage creates the final, minimal image to run the application.
# ------------------------------------------------------------------------------
FROM node:jod-alpine AS runtime

WORKDIR /app

# Metadata labels for the image. These are useful for registries and inspection.
LABEL org.opencontainers.image.title="🧪 RESTful API with Node.js and Express.js in TypeScript"
LABEL org.opencontainers.image.description="Proof of Concept for a RESTful API made with Node.js 22 (LTS) and Express.js 4 in TypeScript"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/nanotaboada/ts-node-samples-express-restful"

# Transpiled JavaScript, pruned node_modules and Swagger JSON.
COPY --from=builder --chown=root:root --chmod=755      /app/dist                   ./dist
COPY --from=builder --chown=root:root --chmod=755      /app/node_modules           ./dist/node_modules
COPY --from=builder --chown=root:root --chmod=644      /app/dist/swagger.json      ./dist/swagger.json

# Metadata for container registries (e.g., Docker Hub, GitHub Container Registry).
COPY --chown=root:root --chmod=644      README.md                   ./
COPY --chown=root:root --chmod=755      assets                      ./assets

# Entrypoint script and image-bundled, pre-seeded SQLite database
COPY --chown=root:root --chmod=755      scripts/entrypoint.sh       ./entrypoint.sh
COPY --chown=root:root --chmod=755      storage                     ./docker-compose/storage

# Install SQLite runtime libs, add non-root user and prepare volume mount point
RUN apk add --no-cache sqlite-libs && \
    adduser -D -g "" express && \
    mkdir -p /storage && \
    chown -R express:express /storage

USER express

EXPOSE 9000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/server.js"]
