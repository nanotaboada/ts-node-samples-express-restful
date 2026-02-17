# Agent Instructions

## Project Overview

Proof of Concept REST API built with Node.js 24 (LTS), Express.js 5, and TypeScript in native ESM mode. Demonstrates modern REST patterns with layered architecture (Routes → Controllers → Services → Database), Sequelize ORM for SQLite, in-memory caching, Swagger documentation, and comprehensive integration testing. Part of a multi-language repository comparison project.

## Structure

```tree
/src                - application code (Express app, controllers, services)
  /controllers      - request handlers with Swagger JSDoc annotations
  /services         - business logic with caching layer (node-cache)
  /routes           - Express Router definitions with middleware
  /database         - Sequelize database access (interfaces + implementations)
  /models           - Sequelize models (Player)
  /docs             - Swagger configuration and doc generation
  /middlewares      - custom middleware (rate limiter, validators, CSP)
  /utils            - logging configuration (Pino)
/tests              - integration tests (Supertest with Jest)
/storage            - pre-seeded SQLite database
/scripts            - utility scripts (Docker entrypoint, healthcheck)
/.github/workflows  - CI/CD workflows (node-ci.yml, node-cd.yml)
```

## Common Workflows

### Adding a new endpoint

1. **Create interface and implementation in `/src/controllers/`**
   - Add route handler with proper TypeScript types
   - Add Swagger JSDoc annotations for OpenAPI documentation
   - Implement error handling with try/catch blocks
2. **Add service logic in `/src/services/`**
   - Create interface and implementation with dependency injection
   - Add caching logic if needed (node-cache with 1-hour TTL)
   - Use Sequelize models for database operations
3. **Register route in `/src/routes/`**
   - Add route to Express Router with appropriate middleware
   - Apply validators, rate limiters as needed
4. **Add integration tests in `/tests/`**
   - Follow test naming convention: `it('Request {METHOD} {/path} {context} → Response {outcome}', ...)`
   - Test success and error cases with Supertest
   - Verify status codes, response bodies, headers
5. **Update OpenAPI documentation**
   - Run `npm run swagger:docs` to regenerate Swagger JSON
   - Verify in Swagger UI at `http://localhost:9000/api-docs`

### Modifying database schema

1. **Update model in `/src/models/`**
   - Modify Sequelize model definition with TypeScript types
   - Update interface to match new schema
2. **Update pre-seeded database file** (this project uses pre-seeded SQLite, not migrations)
   - Manually update `storage/players-sqlite3.db` using SQLite CLI or GUI tool
   - Alternative: Write a one-off script with Sequelize sync + seeding logic
   - For Docker: Rebuild image with `docker compose build` (updated database is baked in)
3. **Review safety considerations**
   - SQLite with pre-seeded data is for demo/PoC purposes only
   - No migration system - schema changes must be applied manually to the seed file
   - Breaking the database file will require manual recreation (no auto-sync)
4. **Add tests for schema changes**
   - Test model validations (required fields, data types)
   - Test service layer with new schema
5. **Update affected services and controllers**
   - Modify service methods to handle new fields
   - Update controller request/response types
   - Refresh Swagger documentation

### Running tests locally

```bash
# Unit tests (currently integration tests cover most use cases)
npm test

# Integration tests with coverage (matches CI)
npm run coverage

# Watch mode for development
npm test -- --watch

# Specific test file
npm test -- player-test.ts

# Run with verbose output for debugging
npm test -- --verbose
```

**Note**: Tests require Node.js 24.x (`nvm use` or check `.nvmrc`)

### Running tests in Docker

```bash
# Build and test in container
docker compose build
docker compose up -d
docker compose logs -f

# Execute tests inside container
docker compose exec app npm test

# Stop and clean up
docker compose down -v
```

### Local development setup

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
# Server: http://localhost:9000
# Swagger UI: http://localhost:9000/api-docs

# Run in production mode
npm run build
npm start

# Lint and format code
npm run lint
npx prettier --write .

# Type check without building
npx tsc --noEmit
```

### Creating a release

1. **Update CHANGELOG.md**
   - Move items from `[Unreleased]` to new versioned section with format `## [X.Y.Z - termname] - YYYY-MM-DD`
   - Use football terminology names (assist, bicyclekick, corner, etc.) as defined in CHANGELOG.md
   - Commit and push CHANGELOG changes before tagging

2. **Create and push tag**

   ```bash
   git tag -a v1.1.0-bicyclekick -m "Release 1.1.0 - Bicycle-kick"
   git push origin v1.1.0-bicyclekick
   ```

3. **CI/CD automatically handles**
   - Runs full test suite with coverage
   - Builds Docker image with multi-stage process
   - Pushes to GHCR with three tags: version (`1.1.0`), term name (`bicyclekick`), `latest`
   - Creates GitHub Release with auto-generated notes

**Pre-release validation**:

```bash
npm run lint && npm run build && npm run coverage
```

## Autonomy Levels

### Proceed freely

- **Route handlers and controllers**
  - Add/modify endpoint handlers
  - Update Swagger JSDoc annotations
  - Add request/response validation
- **Service layer logic**
  - Implement business logic
  - Add caching strategies
  - Optimize database queries
- **Unit and integration tests**
  - Add test cases following naming convention
  - Improve test coverage
  - Refactor test utilities
- **Documentation updates**
  - Improve code comments
  - Update Swagger annotations
  - Clarify inline documentation
- **Code quality improvements**
  - Refactor for better type safety
  - Optimize imports and dependencies
  - Improve error handling patterns

### Ask before changing

- **Database schemas**
  - Adding/removing/modifying Sequelize model fields
  - Changing data types or constraints
  - Altering relationships between models
- **Dependencies (`package.json`)**
  - Adding new npm packages
  - Upgrading major versions of existing packages
  - Removing dependencies
- **CI/CD configuration** (`.github/workflows/`)
  - Modifying build/test/deploy pipeline steps
  - Changing environment variables or secrets
  - Altering trigger conditions
- **Docker setup** (`Dockerfile`, `compose.yml`)
  - Changing base images
  - Modifying multi-stage build process
  - Altering container configuration
- **Environment variable requirements**
  - Adding new required environment variables
  - Changing default values
  - Modifying validation logic
- **Node.js version** (`.nvmrc`, `package.json` engines)
  - Upgrading/downgrading Node.js LTS version
  - Affects local dev, CI, CD, and Docker environments

### Never modify

- **`.env` files** (gitignored, user-specific)
- **Production configurations** (not in this repository)
- **Deployment secrets** (managed via GitHub Secrets)
- **`storage/players-sqlite3.db`** (pre-seeded database, versioned in repo, used in Docker image)
- **Generated files** (`dist/`, `coverage/`, `swagger.json`)

## Pre-commit Checks

Run these before committing (enforced by CI):

```bash
# 1. Linter must pass (ESLint)
npm run lint

# 2. Type checking must pass
npx tsc --noEmit

# 3. All tests must pass with coverage maintained
npm run coverage

# 4. Commit message format validation (Conventional Commits)
npm run lint:commit

# Optional: Auto-format code before committing
npx prettier --write .
```

**Automated checks in CI**:

- Commitlint validates commit message format
- ESLint enforces code style
- TypeScript compiler checks types
- Jest runs integration tests with coverage reports
- Codecov uploads coverage data

## Cross-repo Context

This TypeScript/Node.js/Express implementation is part of a multi-language REST API comparison project, demonstrating identical functionality across different technology stacks.

**Consistency requirements across implementations**:

- **API Contract**: All implementations expose identical REST endpoints (`/health`, `/players/*`) with matching request/response schemas
- **Test Naming**: Action-oriented pattern `Request {METHOD} {/path} {context} → Response {outcome}` (consistent across all stacks)
- **HTTP Status Codes**: RFC 9110 compliant codes with Title Case descriptions (`200 OK`, `404 Not Found`, etc.)
- **Release Naming**: Alphabetically ordered codenames using domain-specific terminology (football for this project)
- **Project Structure**: Layered architecture pattern (routes/handlers → controllers → services → database)
- **Documentation**: Swagger/OpenAPI specifications for all endpoints
- **CI/CD**: Separate workflows for validation (CI) and deployment (CD)
- **Docker**: Multi-stage builds optimized for production, published to GHCR

**Key characteristics of this TypeScript/Express implementation**:

- Native ESM with `.js` extensions in imports (not CommonJS)
- Strict TypeScript with interface-based dependency injection
- Constructor injection pattern for testability
- Sequelize ORM for database abstraction
- In-memory caching layer with node-cache
- Pino structured logging with correlation IDs

**Note**: When making architectural decisions, consider alignment with other stack implementations for comparative analysis purposes.
