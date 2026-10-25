# CLAUDE.md

## Overview

REST API for managing football players built with Node.js and Express.js in TypeScript (native ESM). Implements CRUD operations with a layered architecture, Sequelize ORM + SQLite, in-memory caching, Swagger documentation, and Pino structured logging.

## Architecture

**Layer rule**: `Routes → Controllers → Services → Database`. Never skip a layer. Controllers must not contain business logic — they parse the request, call one service method, and send the response. Services own all caching and Sequelize operations.

**DI wiring**: All instances are manually composed in `src/app.ts` using constructor injection:
`PlayerDatabase → PlayerService → PlayerController → PlayerRoute` (and the same for Health and middleware).
When adding a new dependency, wire it here.

**Migrations**: files in `database/migrations/` are CommonJS (Sequelize CLI requirement), unlike the ESM `src/` tree.

## Coding Guidelines

- **Module system**: Native ESM — always include `.js` extension in relative imports. Node.js native ESM resolves modules at runtime with no extension inference; omitting `.js` causes a `MODULE_NOT_FOUND` error at runtime even though `tsc` compiles cleanly. See [ADR-003](docs/adr/003-use-native-esm.md).
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

### Pre-commit Checks

1. Update `CHANGELOG.md` `[Unreleased]` section (Added / Changed / Fixed / Removed)
2. `npm run lint` — ESLint must pass
3. `npx tsc --noEmit` — TypeScript must compile clean
4. `npm run coverage` — all tests must pass, coverage maintained
5. `npm run swagger:docs` — regenerate `swagger.json` if any endpoint changed
6. `npm run lint:commit` — Conventional Commits validation
7. Commit message follows Conventional Commits format (enforced by commitlint)
8. If this commit introduces or changes an architectural decision, update `CLAUDE.md` and create or amend the relevant ADR in `docs/adr/`

## Invariants (never change without explicit discussion)

- **Port**: 9000
- **API contract**: endpoints, HTTP status codes, and response shapes are fixed; do not change them without explicit discussion
- **Commit format**: `type(scope): description (#issue)` — max 80 chars
- **Conventional Commits types**: `feat` `fix` `chore` `docs` `test` `refactor` `ci` `perf`
- **CHANGELOG.md** `[Unreleased]` section must be updated before every commit

## Architecture Decision Records

Significant architectural decisions are documented in [`docs/adr/`](docs/adr/) (ADR-001–015). Load these before proposing structural changes — they explain the **why** behind the key decisions in this project. When proposing a change that alters an accepted decision, create a new ADR rather than editing the existing one.

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
- `storage/players-sqlite3.db` (runtime database, managed by Sequelize CLI migrations — do not edit directly)
- Generated files (`dist/`, `coverage/`, `swagger.json`)
- Port configuration (9000)
- Production configurations or deployment secrets

### Creating Issues

This project uses Spec-Driven Development (SDD): discuss in Plan mode first, create a GitHub Issue as the spec artifact, then implement. Always offer to draft an issue before writing code. Issue templates live in the `create-issue` skill.

### Key workflows

Step-by-step guides for adding an endpoint and modifying the schema live in the `api-workflows` skill.

**Cross-repo consistency**: API contracts (endpoints, schemas, HTTP status codes), release naming (football terminology, alphabetical), and CI/CD patterns must stay consistent across all stacks (.NET, Go, Java, Python, Rust).

**After completing work**: Suggest a branch name (e.g. `feat/add-player-stats`) and a commit message following Conventional Commits:

```text
feat(scope): description (#issue)

Co-Authored-By: <the line Claude Code provides for the current model>
```

## Claude Code

- Run `/pre-commit` to execute the full pre-commit checklist for this project.
