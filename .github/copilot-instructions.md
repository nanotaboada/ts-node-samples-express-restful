# Copilot Instructions

## Project Overview

This is a **RESTful API** built with **Node.js LTS/Krypton (v24.11.1)**, **Express.js 5**, and **TypeScript**. It manages football player data with a SQLite database using Sequelize ORM. The API features Swagger documentation, in-memory caching (node-cache), health checks, and is fully containerized with Docker.

**Module System**: Uses **native ECMAScript Modules (ESM)** with `"type": "module"` in package.json. All relative imports require `.js` extensions.

## Tech Stack

- **Runtime**: Node.js 24 (LTS/Krypton)
- **Framework**: Express.js 5
- **Language**: TypeScript 5.9
- **Module System**: Native ESM (ES2022)
- **Database**: SQLite3 with Sequelize ORM
- **Testing**: Jest 30 with Supertest (ESM mode with experimental VM modules)
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Cache**: node-cache (1-hour TTL)
- **Security**: Helmet, CORS
- **Container**: Docker with multi-stage build, Docker Compose
- **Linting**: ESLint (flat config) with @typescript-eslint
- **Formatting**: Prettier (4 spaces, single quotes, 127 print width)
- **Commits**: Conventional Commits via commitlint (80 char limit)
- **Dev Tools**: tsx (TypeScript executor), nodemon

## Project Structure

```
src/
├── app.ts              # Express app setup & middleware configuration
├── server.ts           # HTTP server initialization & lifecycle
├── controllers/        # Request handlers with Swagger annotations
├── services/           # Business logic + caching layer
├── database/           # Sequelize DB access (interfaces + implementations)
├── models/             # Sequelize models (Player)
├── routes/             # Express Router definitions
├── docs/               # Swagger configuration & doc generation
└── middlewares/        # Custom middleware (swagger CSP)

tests/                  # Integration tests with supertest
scripts/                # Docker entrypoint & healthcheck scripts
storage/                # Pre-seeded SQLite database (copied to volume on first run)
```

**Architecture**: Layered (Route → Controller → Service → Database), dependency injection via constructors, interface-based contracts.

## Common Commands

### Development

```bash
npm install             # Install dependencies
npm run dev             # Start with nodemon + tsx (watches src/**/*.ts)
npm run build           # Compile TypeScript to dist/
npm start               # Run compiled code (node dist/server.js)
```

### Testing & Quality

```bash
npm test                # Run Jest tests (with experimental VM modules for ESM)
npm run coverage        # Generate coverage report (controllers/services/routes only)
npm run lint            # Run ESLint
npm run lint:commit     # Validate last commit message
npm run swagger:docs    # Generate swagger.json from JSDoc annotations (using tsx)
```

### Docker

```bash
npm run docker:build    # Build Docker image
npm run docker:up       # Start container with compose
npm run docker:down     # Stop container and remove volume (resets DB)
```

**Default Port**: `9000` (override with `PORT` env var in `.env`)
**Swagger UI**: `http://localhost:9000/swagger/`
**Health Endpoint**: `http://localhost:9000/health`

## Coding Guidelines

### TypeScript Configuration

- **Target**: ES2022
- **Module**: ES2022 (native ESM)
- **Module Resolution**: bundler
- **Strict mode**: Enabled
- **Output**: `dist/` directory
- **Source maps**: Enabled

### Code Style (Enforced by ESLint + Prettier)

- **Indentation**: 4 spaces (TypeScript), 2 spaces (JSON/YAML)
- **Quotes**: Single quotes
- **Line length**: 127 characters
- **Imports**: All relative imports must include `.js` extension (ESM requirement)
- **Disabled rules**: `@typescript-eslint/no-explicit-any` and unsafe assignment rules (see eslint.config.js)

### Commit Convention (commitlint)

- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, etc.
- **Max header**: 80 characters
- **Max body line**: 80 characters
- Dependabot commits are auto-ignored

### Testing Standards

- **Framework**: Jest with ts-jest ESM preset
- **Mode**: ESM mode with `NODE_OPTIONS='--experimental-vm-modules'`
- **Pattern**: `tests/*-test.ts` (e.g., `player-test.ts`)
- **Style**: Integration tests using supertest against Express app
- **Structure**: Arrange-Act-Assert with descriptive `it()` blocks
- **Coverage**: Only controllers, services, and routes (excludes DB, docs, models, middleware)
- Run tests with `--detectOpenHandles` flag

### API Design Patterns

- **OpenAPI annotations**: Add `@openapi` JSDoc comments in controllers for Swagger
- **Response handling**: Return JSON or status codes (200, 404, 400, 201)
- **Caching**: Service layer flushes cache on CUD operations
- **Binding**: Always `.bind(this.controller)` in route definitions

## Important Implementation Details

### Database

- **Connection**: Sequelize with SQLite (storage path from `STORAGE_PATH` env var or `storage/players-sqlite3.db`)
- **Model**: `Player` with auto-increment `id` and unique `squadNumber`
- **Persistence**: In Docker, pre-seeded DB copied from `/app/hold/` to `/storage/` volume on first run
- **ORM Pattern**: Database layer uses async methods (`selectAllAsync`, `insertAsync`, etc.)

### Docker Workflow

1. **Multi-stage build**: Builder compiles TS and generates Swagger docs; runtime uses minimal Alpine image
2. **Entrypoint**: `/app/entrypoint.sh` copies seed DB to volume if missing
3. **Health check**: Curls `/health` endpoint every 30s
4. **User**: Runs as non-root `express` user
5. **Volume reset**: Use `docker compose down -v` to reinitialize DB

### CI/CD Pipeline (.github/workflows/node.js.yml)

- **Jobs**: build → test → coverage → container (on master push)
- **Node version**: `lts/krypton` from env var
- **Checks**: Commitlint, Jest, ESLint
- **Coverage**: Uploads to Codecov & Codacy
- **Container**: Pushes to GitHub Container Registry (ghcr.io) with `latest` and `sha-*` tags

## Known Patterns & Workarounds

### Environment Variables

- Create `.env` file to override defaults (not committed)
- Key vars: `PORT` (default: 9000), `STORAGE_PATH` (Docker: `/storage/players-sqlite3.db`)

### Caching Strategy

- Service layer uses node-cache with 1-hour TTL (3600s), 10-minute check period
- Cache keys: `retrieveAll`, `player_{id}`, `player_squad_{squadNumber}`
- Invalidation: Full flush (`cache.flushAll()`) on create/update/delete

### Swagger Generation

- Annotations in controllers are extracted to `dist/swagger.json` via `npm run swagger:docs`
- Middleware applies CSP to allow Swagger UI inline scripts
- Access via `/swagger`, `/swagger/index.html`, or `/swagger.json`

## File Naming Conventions

- **Interfaces**: `*-interface.ts` (e.g., `player-service-interface.ts`)
- **Implementations**: `*-<layer>.ts` (e.g., `player-controller.ts`)
- **Tests**: `*-test.ts` (e.g., `player-test.ts`)
- **Stubs**: `*-stub.ts` (e.g., `player-stub.ts`)

## Troubleshooting

### Build/Test Failures

- Ensure `npm ci` (not `npm install`) for reproducible builds
- SQLite database must exist at configured path (auto-created in Docker)
- Tests may leave open handles—use `--detectOpenHandles` flag
- Commitlint runs in CI—verify commit messages locally with `npm run lint:commit`

### Docker Issues

- Volume persistence: DB changes persist across `up`/`down` unless `-v` flag used
- First-run initialization: Entrypoint script copies seed DB only if `/storage/players-sqlite3.db` missing
- Health check failures: Ensure app started on port 9000 and `/health` responds

### Development Workflow

- Use `npm run dev` for hot reload (nodemon watches `src/**/*.ts`)
- Rebuild after major changes: `npm run build`
- Regenerate Swagger docs after controller changes: `npm run swagger:docs`
- Code is auto-compiled on test runs via ts-jest

## References

- **Contribution Guide**: See `CONTRIBUTING.md` for PR workflow and conventions
- **Code of Conduct**: See `CODE_OF_CONDUCT.md`
- **API Docs**: Run locally and visit `/swagger` endpoint
- **Postman Collection**: Available in `postman-collections/` directory
