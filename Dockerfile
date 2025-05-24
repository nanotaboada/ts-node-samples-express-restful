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

# Install curl for health check
RUN apk add --no-cache curl

WORKDIR /app

# Metadata labels for the image. These are useful for registries and inspection.
LABEL org.opencontainers.image.title="🧪 RESTful API with Node.js and Express.js in TypeScript"
LABEL org.opencontainers.image.description="Proof of Concept for a RESTful API made with Node.js 22 (LTS) and Express.js 4 in TypeScript"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/nanotaboada/ts-node-samples-express-restful"

# https://rules.sonarsource.com/docker/RSPEC-6504/

# Transpiled JavaScript, pruned node_modules and Swagger JSON.
COPY --from=builder     /app/dist/                  ./dist/
COPY --from=builder     /app/node_modules/          ./dist/node_modules/
COPY --from=builder     /app/dist/swagger.json      ./dist/swagger.json

# Metadata docs for container registries (e.g.: GitHub Container Registry)
COPY --chmod=444        README.md                   ./
COPY --chmod=555        assets/                     ./assets/

# Copy entrypoint and healthcheck scripts
COPY --chmod=555        scripts/entrypoint.sh       ./entrypoint.sh
COPY --chmod=555        scripts/healthcheck.sh      ./healthcheck.sh

# Pre-seeded SQLite database as init bundle
COPY --chmod=555        storage/                    ./docker-compose/

# Install SQLite runtime libs, add non-root user and prepare volume mount point
RUN apk add --no-cache sqlite-libs && \
    addgroup -S express && \
    adduser -S -G express express && \
    mkdir -p /storage && \
    chown -R express:express /storage

USER express

EXPOSE 9000

# https://docs.docker.com/reference/dockerfile/#healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD ["/app/healthcheck.sh"]

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/server.js"]
