# ADR-009: Docker and Compose strategy

## Status

Accepted

Date: 2026-04-02

## Context

The project needs to be runnable in a self-contained environment for demos, CI, and as a reference point in the cross-language comparison. Two distinct concerns apply:

1. **Image size and security**: a naive single-stage build copies development dependencies, TypeScript source, and build tooling into the final image
2. **Local orchestration**: developers and evaluators should be able to start the application with a single command, without installing Node.js or configuring environment variables manually

## Decision

We will use a multi-stage Docker build to produce a lean production image, and Docker Compose to orchestrate the application locally.

- The Dockerfile uses two stages: `builder` (installs all deps, compiles TypeScript) and `production` (copies only `dist/`, `node_modules` production deps, and `storage/`)
- The pre-seeded SQLite database (`storage/players-sqlite3.db`) is bundled into the image and copied to a named volume on first run via the entrypoint script
- Docker Compose defines the service, port mapping (9000), volume, and environment defaults
- Health checks poll `GET /health` every 30 seconds to report container readiness

## Consequences

### Positive

- The production image excludes TypeScript source, dev dependencies, and build tools — smaller attack surface and faster pulls
- `docker compose up` is a complete local setup with no prerequisites beyond Docker
- The named volume preserves data across container restarts; `docker compose down -v` resets it cleanly
- Bundling the seed database means the image is self-contained and demo-ready without any seeding step

### Negative

- Multi-stage builds are more complex to read and maintain than single-stage builds
- The SQLite database file is versioned and bundled, meaning schema changes require a Docker image rebuild
- The entrypoint copy-on-first-run pattern for the seed file adds a small amount of startup logic

### Neutral

- The Compose setup is intentionally minimal (single service, no networking beyond host port mapping); it is not intended as a production deployment configuration
