# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Football Terminology Names ⚽

This project uses football/soccer terminology for release names:

| Letter | Term | Definition | Tag Name |
| ------ | ---- | ---------- | -------- |
| A | Assist | Pass leading to a goal | `assist` |
| B | Bicycle-kick | Overhead kick | `bicyclekick` |
| C | Corner | Corner kick | `corner` |
| D | Dribble | Ball control while moving | `dribble` |
| E | Equalizer | Goal that ties the score | `equalizer` |
| F | Foul | Rule violation | `foul` |
| G | Goal | Scored point | `goal` |
| H | Header | Ball contact with head | `header` |
| I | Interception | Stealing the ball | `interception` |
| J | Juggle | Ball control skill | `juggle` |
| K | Keeper | Goal defender (Goalkeeper) | `keeper` |
| L | Lob | High arcing pass/shot | `lob` |
| M | Marking | Defending an opponent | `marking` |
| N | Nutmeg | Passing ball through legs | `nutmeg` |
| O | Offside | Position rule violation | `offside` |
| P | Penalty | Free kick from penalty spot | `penalty` |
| Q | Quick-throw | Fast throw-in | `quickthrow` |
| R | Red-card | Player ejection | `redcard` |
| S | Save | Goalkeeper blocking shot | `save` |
| T | Tackle | Challenging for the ball | `tackle` |
| U | Upset | Underdog victory | `upset` |
| V | Volley | Kicking ball in midair | `volley` |
| W | Wing | Side area of field | `wing` |
| X | X-Pass | Diagonal crossing pass | `xpass` |
| Y | Yellow-card | Caution warning | `yellowcard` |
| Z | Zone-defense | Area marking strategy | `zonedefense` |

---

## [Unreleased]

### Added

- ADR-013: Use Full-Replace PUT as the Partial Update Strategy
- ADR-014: Adopt AI-Assisted Development Workflow
- ADR-015: Adopt Spec-Driven Development (SDD)

### Changed

- Validation errors now return `422 Unprocessable Entity` instead of `400 Bad Request`
  to distinguish field-level validation failures from malformed requests (RFC 4918) (#585)
- Consolidated project guidance from `.github/copilot-instructions.md` into `CLAUDE.md`;
  removed the stub `@` include directive and deleted the now-redundant source file (#639)
- Corrected `CLAUDE.md` "Modify schema" workflow to use Sequelize CLI migrations instead
  of the stale "manually update `storage/players-sqlite3.db`" instruction (#639)
- Updated `docs/adr/005-use-sqlite-sequelize.md` to remove the stale "no migration system"
  claim and reference the new ADR-012 (#639)
- Created `docs/adr/012-sequelize-cli-migrations.md` to formally document the Sequelize CLI
  migration decision (migration file location, CommonJS requirement, `predev` automation) (#639)
- Updated `.coderabbit.yaml`: corrected controller path HTTP status codes (added 409 Conflict
  and 422 Unprocessable Entity, removed 400), expanded ESM `.js` import instruction with
  ADR-003 reference, added `database/migrations/**/*.js` path instruction, updated
  `copilot-instructions.md` references to `CLAUDE.md` (#639)

### Fixed

### Removed

---

## [2.1.1 - Equalizer] - 2026-04-14

### Added

- `lint` job to CI workflow as the first gate, running commitlint and ESLint before
  `build`; all downstream jobs (`build → test → coverage`) now depend on it (#577)

- Sequelize CLI migration infrastructure to replace the pre-seeded SQLite database
  file with version-controlled, reversible migrations (#107):
  - `.sequelizerc`: CLI config pointing to `config/database.cjs` and `database/migrations/`
  - `config/database.cjs`: environment config for `development` (SQLite via `STORAGE_PATH`),
    `test` (in-memory SQLite), and `production` (PostgreSQL, stubbed for #549)
  - `database/package.json`: sets `"type": "commonjs"` so migration files load as CJS
    in the ESM package
  - `database/migrations/20260101000001-create-players-table.js`: DDL — creates
    the `players` table with UUID primary key
  - `database/migrations/20260101000002-seed-starting-11.js`: DML — seeds 11
    starting players
  - `database/migrations/20260101000003-seed-substitute-players.js`: DML — seeds
    15 substitute players
  - `db:migrate`, `db:migrate:undo`, `db:migrate:undo:all`, `db:reset` npm scripts
  - Database Migrations section in `README.md`
- `sequelize-cli` to `dependencies` (runtime dependency — required by Docker
  entrypoint to apply migrations on startup) (#107)
- `predev` npm lifecycle hook runs `db:migrate` automatically before `npm run dev`,
  ensuring the local database is initialized before the app starts (#107)
- Architecture Decision Records (ADRs) in `docs/adr/` documenting 11 key decisions (#479)
- Architecture Decisions section in `README.md` linking to the ADR index
- Runtime verification step in CD workflow to confirm tag commit is reachable from master before build/publish (#556)
- Jest globals (`globals.jest`) to ESLint flat config for test files, fixing `no-undef` on Jest APIs
- Clarifying comments to test lifecycle hooks explaining hook execution order and DB isolation strategy
- ADR guidelines in `CONTRIBUTING.md` (section 4)
- ADR reference in `.github/copilot-instructions.md`

### Changed

- Replaced `tests/player-stub.ts` property bag with `tests/player-fake.ts` factory
  functions (`makeAllPlayers`, `makeExistingPlayer`, `makeNonexistentPlayer`,
  `makeUnknownPlayer`, `makePlayerBySquadNumber`); all call sites in `player-test.ts`
  updated to assign factory results to named `const` variables before use (#576)
- `tests/tsconfig.json`: added test-specific TypeScript config extending the root,
  with `"types": ["jest", "node"]` and `"noEmit": true`, so VS Code resolves Jest
  globals for files in `tests/`
- `jest.config.ts`: pointed ts-jest transform at `tests/tsconfig.json`
- `scripts/entrypoint.sh`: replaced pre-seeded database copy logic with
  `sequelize-cli db:migrate` (idempotent via `SequelizeMeta`); added `log()`
  helper with timestamps matching the cross-project entrypoint pattern (#107)
- `Dockerfile`: replaced `COPY storage/ ./hold/` with `COPY database/`,
  `COPY config/`, `COPY .sequelizerc` to include migration files in the runtime
  image (#107)
- `.gitignore`: replaced `players-sqlite3.db-shm` / `players-sqlite3.db-wal`
  with `*.db` (#107)
- `README.md`: updated Containerized Deployment feature description and
  Containers section to reflect migration-based initialization; updated Command
  Summary table with migration commands (#107)
- `tests/player-stub.ts`: added JSDoc comment documenting the three-term data-state
  vocabulary (`existing`, `nonexistent`, `unknown`) and added `unknown` property
  (id + squadNumber) for 404-by-lookup test scenarios (#574)
- `tests/player-test.ts`: renamed three test descriptions from `nonexistent` to
  `unknown` and updated their bodies to reference `playerStub.unknown` (#574)

### Fixed

- `dateOfBirth` values now round-trip correctly at runtime: Sequelize's SQLite
  `DATE` parser appends the timezone offset only when the stored string lacks
  `+`, turning `'...T...Z'` into `'...Z+00:00'` (invalid). Seed migrations now
  store dates in Sequelize's own `_stringify` format (`'YYYY-MM-DD HH:mm:ss.SSS
  +00:00'`), which satisfies the parser's `+` check. `PlayerModel.create` /
  `PlayerModel.update` are unaffected — they go through the type pipeline and
  store the correct format automatically. Local storage path is resolved via
  `STORAGE_PATH` in `config/database.cjs`; Docker initialization runs through
  `scripts/entrypoint.sh` (#107)

### Removed

- `storage/players-sqlite3.db`: pre-seeded binary database file removed from
  version control; database is now initialized at runtime via migrations (#107)
- `.sonarcloud.properties`: SonarCloud Automatic Analysis configuration —
  sources, tests, coverage exclusions aligned with `codecov.yml` (#561)
- `.dockerignore`: added `.claude/`, `CLAUDE.md`, `.coderabbit.yaml`,
  `.sonarcloud.properties`, `CHANGELOG.md`, `README.md`; removed stale
  `.codeclimate.yml` entry (#561)

## [2.1.0 - Dribble] - 2026-03-31

### Added

- 15 substitute players seeded in `storage/players-sqlite3.db`

### Changed

- Player dataset normalised to November 2022 World Cup snapshot: Enzo Fernández (SL Benfica / Liga Portugal), Mac Allister (Brighton & Hove Albion), Messi (Paris Saint-Germain / Ligue 1), Di María `abbrPosition` → `RW`
- Player UUIDs replaced with deterministic UUID v5 values (namespace `f201b13e-c670-473d-885d-e2be219f74c8`, formula `{firstName}-{lastName}`)
- Test fixtures renamed for clarity: `playerStub.nonexistent` (Lo Celso, squad 27 — not seeded, used for POST/DELETE) and `playerStub.existing` (Emiliano Martínez, squad 23 — always seeded, used for PUT)
- `playerStub.all` expanded to 26 players
- `PUT describe` in tests: removed `beforeEach`, added `afterEach` to restore Martínez; all tests retargeted to squad 23
- `rest/players.rest` variables updated: `@newSquadNumber = 27`, `@existingSquadNumber = 23`
- Tests switched to in-memory SQLite (`STORAGE_PATH=:memory:`) — seeded via `beforeAll`, production DB never touched during test runs
- Docker: run `docker compose down -v` before `docker compose up` to pick up the rebuilt seeded DB from `storage/players-sqlite3.db` (see #551)

### Removed

### Fixed

### Security

---

## [2.0.0 - Corner] - 2026-03-29

### Added

- `.envrc` for [direnv](https://direnv.net/) to automatically switch to the required Node.js version via `.nvmrc` on directory entry
- `rest/players.rest` HTTP file with health check, POST, GET (all, by ID, by squad number), PUT, and DELETE requests for VS Code REST Client (`humao.rest-client`)
- `humao.rest-client` added to `.vscode/extensions.json` recommended extensions

### Changed

- `id` field in `Player` model migrated from `INTEGER` to `UUID` (`DataTypes.UUIDV4`, auto-generated on insert) — surrogate key, admin use only
- `PUT /players/:id` route replaced by `PUT /players/squadNumber/:squadNumber` — natural key is now the domain identifier for mutations
- `DELETE /players/:id` route replaced by `DELETE /players/squadNumber/:squadNumber` — natural key is now the domain identifier for mutations
- `POST /players` conflict detection switched from `id`-based to `squadNumber`-based lookup
- `IPlayer.id` type changed from `number` to `string` to reflect UUID
- `updateAsync` and `deleteAsync` in service and database layers refactored to operate on `squadNumber`

### Removed

- `postman-collections/` directory and Postman JSON collection replaced by `rest/players.rest`

---

## [1.0.1 - Bicycle-kick] - 2026-03-08

### Changed

- Docker entrypoint now prints API and Swagger UI URLs on startup
- Swagger UI CSP updated to include `connect-src 'self'` and `worker-src blob: 'self'`
- Swagger UI static `/swagger/index.html` redirect now registered before static file middleware
- `swaggerUrl` set explicitly so Swagger UI fetches spec from `/swagger.json` instead of falling back to petstore
- Test naming convention updated to action-oriented arrow pattern
- Unified Copilot instructions as canonical single-file format
- Dependency updates: `pino`, `dotenv`, `qs`, `dottie`, `express-rate-limit`, `eslint`, `nodemon`, `commitlint`, `@types/*` and GitHub Actions (`docker/build-push-action`, `docker/login-action`, `docker/setup-buildx-action`, `actions/setup-node`, `actions/upload-artifact`, `actions/download-artifact`)

### Fixed

- Docker container crashed on startup with `unable to determine transport target for "pino-pretty"` — resolved by setting `NODE_ENV=production` in `compose.yml`
- Swagger UI displayed petstore fallback due to missing CSP directives and static file middleware intercepting `/swagger/index.html`

---

## [1.0.0 - Assist] - 2026-02-08

Initial release. See [README.md](README.md) for complete feature list and documentation.

<!-- Template for new releases:
## [X.Y.Z - Term] - YYYY-MM-DD

### Added

### Changed

### Fixed

### Removed
-->

[unreleased]: https://github.com/nanotaboada/ts-node-samples-express-restful/compare/v2.1.1-equalizer...HEAD
[2.1.1 - Equalizer]: https://github.com/nanotaboada/ts-node-samples-express-restful/compare/v2.1.0-dribble...v2.1.1-equalizer
[2.1.0 - Dribble]: https://github.com/nanotaboada/ts-node-samples-express-restful/compare/v2.0.0-corner...v2.1.0-dribble
[2.0.0 - Corner]: https://github.com/nanotaboada/ts-node-samples-express-restful/compare/v1.0.1-bicyclekick...v2.0.0-corner
[1.0.1 - Bicycle-kick]: https://github.com/nanotaboada/ts-node-samples-express-restful/compare/v1.0.0-assist...v1.0.1-bicyclekick
[1.0.0 - Assist]: https://github.com/nanotaboada/ts-node-samples-express-restful/releases/tag/v1.0.0-assist
