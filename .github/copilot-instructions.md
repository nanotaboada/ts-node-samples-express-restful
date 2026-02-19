# GitHub Copilot Instructions

## Overview

REST API for managing football players built with Node.js and Express.js in TypeScript (native ESM). Implements CRUD operations with a layered architecture, Sequelize ORM + SQLite, in-memory caching, Swagger documentation, and Pino structured logging. Part of a cross-language comparison study (.NET, Go, Java, Python, Rust).

## Tech Stack

- **Runtime**: Node.js 24 LTS (Krypton)
- **Language**: TypeScript (strict mode, native ESM)
- **Framework**: Express.js 5
- **ORM**: Sequelize
- **Database**: SQLite
- **Caching**: node-cache (in-memory, 1-hour TTL)
- **Logging**: Pino (structured, with request correlation IDs)
- **Security**: Helmet, CORS, express-rate-limit
- **Testing**: Jest 30 + Supertest
- **Linting/Formatting**: ESLint + Prettier
- **API Docs**: Swagger (JSDoc annotations → swagger.json)
- **Containerization**: Docker (multi-stage builds)

## Structure

```text
src/
├── controllers/        — request handlers + Swagger JSDoc + try/catch      [HTTP layer]
├── routes/             — Express Router definitions + middleware
├── services/           — business logic + node-cache caching               [business layer]
├── database/           — Sequelize interfaces + implementations            [data layer]
├── models/             — Sequelize Player model
├── middlewares/        — rate limiter, validators, CSP
├── docs/               — Swagger config and doc generation
└── utils/              — Pino logging configuration
tests/                  — Jest + Supertest integration tests
storage/                — pre-seeded SQLite database (versioned, used in Docker image)
scripts/                — Docker entrypoint and healthcheck scripts
```

**Layer rule**: `Routes → Controllers → Services → Database`. Controllers must not contain business logic. Services handle all caching and Sequelize operations.

## Coding Guidelines

- **Module system**: Native ESM — always include `.js` extension in relative imports (omitting it breaks ESM at runtime)
- **Naming**: camelCase (variables/functions), PascalCase (classes/types/interfaces), kebab-case (file names, e.g. `player-service.ts`)
- **Type safety**: Strict TypeScript; never use `any`; prefer interfaces over types
- **DI**: Constructor injection with interface-based abstractions
- **Async**: All I/O uses async/await; never callbacks or synchronous calls
- **Logging**: Pino only; never `console.log`
- **Imports**: Group external deps → internal modules → types; alphabetically sorted within groups
- **Formatting**: Prettier (4 spaces, single quotes, 127 width) — enforced pre-commit
- **Tests**: naming `it('Request {METHOD} {/path} {context} → Response {outcome}')` — METHOD ALL CAPS, status codes Title Case (e.g. `200 OK`, `404 Not Found`); mock external deps only; use real test database (no Sequelize mocking)
- **Avoid**: `any` without justification, missing `.js` in imports, mixing CommonJS with ESM, sync file ops, `console.log`, `@ts-ignore` without comments, mocking Sequelize models

## Commands

### Quick Start

```bash
npm install
npm run dev             # http://localhost:9000
npm run build && npm start
npm test                # all tests
npm run coverage        # tests + coverage
npm run lint
npx tsc --noEmit        # type check
npx prettier --write .
docker compose up
docker compose down -v
```

### Pre-commit Checks

1. Update `CHANGELOG.md` `[Unreleased]` section (Added / Changed / Fixed / Removed)
2. `npm run lint` — ESLint must pass
3. `npx tsc --noEmit` — TypeScript must compile clean
4. `npm run coverage` — all tests must pass, coverage maintained
5. `npm run lint:commit` — Conventional Commits validation
6. Commit message follows Conventional Commits format (enforced by commitlint)

### Commits

Format: `type(scope): description (#issue)` — max 80 chars
Types: `feat` `fix` `chore` `docs` `test` `refactor` `ci` `perf`
Example: `feat(api): add player stats endpoint (#42)`

## Agent Mode

### Proceed freely

- Route handlers and controllers
- Service layer logic and caching
- Unit and integration tests
- Documentation updates
- Code quality and formatting improvements

### Ask before changing

- Database schema (Sequelize model fields)
- Dependencies (`package.json`)
- Node.js version (`.nvmrc`, `package.json engines`)
- CI/CD configuration (`.github/workflows/`)
- Docker setup
- Environment variables
- API contracts (breaking changes)

### Never modify

- `.env` files
- `storage/players-sqlite3.db` (pre-seeded, versioned, used in Docker image)
- Generated files (`dist/`, `coverage/`, `swagger.json`)
- Port configuration (9000)
- Production configurations or deployment secrets

### Key workflows

**Add an endpoint**: Create interface + implementation in `src/controllers/` with Swagger JSDoc + try/catch → add service logic in `src/services/` with caching + Sequelize operations → register route in `src/routes/` → add integration tests following naming convention → run `npm run swagger:docs` → run pre-commit checks.

**Modify schema**: Update Sequelize model in `src/models/` → manually update `storage/players-sqlite3.db` (no migration system) → rebuild Docker image with `docker compose build` → update services, controllers, and tests → run `npm run coverage`.

**Cross-repo consistency**: API contracts (endpoints, schemas, HTTP status codes), release naming (football terminology, alphabetical), and CI/CD patterns must stay consistent across all stacks.

**After completing work**: Suggest a branch name (e.g. `feat/add-player-stats`) and a commit message following Conventional Commits including co-author line:

```text
feat(scope): description (#issue)

Co-authored-by: Copilot <175728472+Copilot@users.noreply.github.com>
```
