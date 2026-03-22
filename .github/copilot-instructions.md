# Custom Instructions

## Overview

REST API for managing football players built with Node.js and Express.js in TypeScript (native ESM). Implements CRUD operations with a layered architecture, Sequelize ORM + SQLite, in-memory caching, Swagger documentation, and Pino structured logging. Part of a cross-language comparison study (.NET, Go, Java, Python, Rust).

## Tech Stack

| Category         | Technology                                    |
|------------------|-----------------------------------------------|
| Runtime          | Node.js 24 LTS (Krypton)                      |
| Language         | TypeScript (strict mode, native ESM)          |
| Framework        | Express.js 5                                  |
| ORM              | Sequelize                                     |
| Database         | SQLite                                        |
| Caching          | node-cache (in-memory, 1-hour TTL)            |
| Logging          | Pino (structured, with request correlation IDs) |
| Security         | Helmet, CORS, express-rate-limit              |
| Testing          | Jest 30 + Supertest                           |
| Linting/Formatting | ESLint + Prettier                           |
| API Docs         | Swagger (JSDoc `@openapi` annotations → `swagger.json`) |
| Containerization | Docker (multi-stage builds)                   |

## Structure

```text
src/
├── app.ts              — Express app factory; manual DI wiring of all instances
├── server.ts           — entry point; starts HTTP server
├── controllers/        — request handlers + @openapi JSDoc + try/catch      [HTTP layer]
├── routes/             — Express Router definitions + middleware wiring
├── services/           — business logic + node-cache caching                [business layer]
├── database/           — Sequelize interfaces + implementations             [data layer]
├── models/             — Sequelize Player model + IPlayer interface
├── middlewares/        — rate limiter, validators, Swagger CSP middleware
├── docs/               — Swagger config and doc generation
└── utils/              — Pino logger configuration
tests/                  — Jest + Supertest integration tests (real SQLite DB)
storage/                — pre-seeded SQLite database (versioned, used in Docker image)
scripts/                — Docker entrypoint and healthcheck scripts
```

**Layer rule**: `Routes → Controllers → Services → Database`. Never skip a layer. Controllers must not contain business logic — they parse the request, call one service method, and send the response. Services own all caching and Sequelize operations.

**DI wiring**: All instances are manually composed in `src/app.ts` using constructor injection:
`PlayerDatabase → PlayerService → PlayerController → PlayerRoute` (and the same for Health and middleware).
When adding a new dependency, wire it here.

## Coding Guidelines

- **Module system**: Native ESM — always include `.js` extension in relative imports. Node.js native ESM resolves modules at runtime with no extension inference; omitting `.js` causes a `MODULE_NOT_FOUND` error at runtime even though `tsc` compiles cleanly.
- **Naming**: camelCase (variables/functions), PascalCase (classes/types/interfaces), kebab-case (file names, e.g. `player-service.ts`)
- **Type safety**: Strict TypeScript; never use `any`; prefer interfaces over types
- **DI**: Constructor injection with interface-based abstractions — every class depends on an interface, not a concrete type
- **Async**: All I/O uses async/await; never callbacks or synchronous calls
- **Logging**: Pino only; never `console.log`. Use structured fields: `logger.info({ playerId: id, action: 'createPlayer' }, 'Creating player')`.
- **Imports**: Group external deps → internal modules → types; alphabetically sorted within each group
- **Formatting**: Prettier (4 spaces, single quotes, 127 width) — enforced pre-commit
- **Avoid**: `any` without justification, missing `.js` in imports, mixing CommonJS with ESM, sync file ops, `console.log`, `@ts-ignore` without comments, mocking Sequelize models

### Test conventions

- **Naming**: `it('Request {METHOD} {/path} {context} → Response {outcome}')` — METHOD in ALL CAPS, status codes in Title Case (e.g. `200 OK`, `404 Not Found`)
- **Structure**: `describe('Integration Tests') → describe('GET'|'POST'|...) → describe('/players/:id') → it(...)`
- **Body**: Use Arrange / Act / Assert comment sections for each test
- **DB**: Tests hit the real SQLite database (loaded via `.env.test`); never mock Sequelize models
- **State management**: `afterEach` deletes the stub player (cleanup); write tests (`PUT`, `DELETE`) use `beforeEach` to seed via POST
- **Validator errors**: Validators return `{ errors: [...] }` where each error has a `path` field matching the field name; assert with `response.body.errors` and `hasFieldError(errors, 'fieldName')`

### Caching strategy

- Cache lives in `PlayerService`; `PlayerDatabase` has no cache awareness
- Cache keys: `'retrieveAll'`, `` `player_${id}` ``, `` `player_squad_${squadNumber}` ``
- All mutating operations (`createAsync`, `updateAsync`, `deleteAsync`) call `this.cache.flushAll()` — no targeted invalidation

### Rate limiting

- Two limiters, both configured in `src/middlewares/rate-limiter.ts`:
  - `generalLimiter`: applied app-wide (default 100 req/window)
  - `strictLimiter`: applied to POST/PUT/DELETE on `/players` (default 20 req/window)
- Env vars `RATE_LIMIT_ENABLED`, `RATE_LIMIT_MAX_GENERAL`, `RATE_LIMIT_MAX_STRICT` control behaviour; tests use these to skip rate-limit-dependent cases when limits are too high

### Swagger

- `@openapi` JSDoc annotations live in the controller *implementation* files (e.g. `player-controller.ts`), directly above each method
- Regenerate `swagger.json` after any endpoint change: `npm run swagger:docs`
- `swagger.json` is a generated file — never edit it directly

## Commands

### Quick Start

```bash
npm install
npm run dev             # http://localhost:9000
npm run build && npm start
npm test                # all tests
npm run coverage        # tests + coverage report
npm run lint
npx tsc --noEmit        # type check only
npx prettier --write .
docker compose up
docker compose down -v
```

### Pre-commit Checks

1. Update `CHANGELOG.md` `[Unreleased]` section (Added / Changed / Fixed / Removed)
2. `npm run lint` — ESLint must pass
3. `npx tsc --noEmit` — TypeScript must compile clean
4. `npm run coverage` — all tests must pass, coverage maintained
5. `npm run swagger:docs` — regenerate `swagger.json` if any endpoint changed
6. `npm run lint:commit` — Conventional Commits validation
7. Commit message follows Conventional Commits format (enforced by commitlint)

### Commits

Format: `type(scope): description (#issue)` — max 80 chars
Types: `feat` `fix` `chore` `docs` `test` `refactor` `ci` `perf`
Example: `feat(api): add player stats endpoint (#42)`

## Agent Mode

### Proceed freely

- Route handlers and controllers
- Service layer logic and caching
- Unit and integration tests
- Swagger JSDoc annotations and doc regeneration
- Documentation updates
- Code quality and formatting improvements

### Ask before changing

- Database schema (Sequelize model fields or `IPlayer` interface)
- Dependencies (`package.json`)
- Node.js version (`.nvmrc`, `package.json engines`)
- CI/CD configuration (`.github/workflows/`)
- Docker setup
- Environment variables or `.env.test`
- API contracts (endpoints, request/response shapes, HTTP status codes — breaking changes)
- Rate limiter thresholds or topology

### Never modify

- `.env` files
- `storage/players-sqlite3.db` (pre-seeded, versioned, used in Docker image)
- Generated files (`dist/`, `coverage/`, `swagger.json`)
- Port configuration (9000)
- Production configurations or deployment secrets

### Key workflows

**Add an endpoint**:
1. Define interface method in `src/controllers/player-controller-interface.ts`
2. Implement in `src/controllers/player-controller.ts` with `@openapi` JSDoc + try/catch
3. Add service method in `src/services/player-service-interface.ts` + implementation in `src/services/player-service.ts` with caching + cache invalidation as needed
4. Add database method in `src/database/player-database-interface.ts` + `src/database/player-database.ts` using Sequelize
5. Register route in `src/routes/player-route.ts` (wire validator middleware if needed)
6. Wire any new instances in `src/app.ts`
7. Add integration tests in `tests/player-test.ts` following naming and Arrange/Act/Assert conventions
8. Run `npm run swagger:docs` to regenerate `swagger.json`
9. Run pre-commit checks

**Modify schema**:
1. Update `IPlayer` interface in `src/models/player-interface.ts`
2. Update Sequelize model in `src/models/player-model.ts`
3. Manually update `storage/players-sqlite3.db` (no migration system exists)
4. Rebuild Docker image: `docker compose build`
5. Update services, controllers, validators, and tests
6. Run `npm run coverage`

**Cross-repo consistency**: API contracts (endpoints, schemas, HTTP status codes), release naming (football terminology, alphabetical), and CI/CD patterns must stay consistent across all stacks (.NET, Go, Java, Python, Rust).

**After completing work**: Suggest a branch name (e.g. `feat/add-player-stats`) and a commit message following Conventional Commits:

```text
feat(scope): description (#issue)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
