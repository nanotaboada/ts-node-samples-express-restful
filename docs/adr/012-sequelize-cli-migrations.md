# ADR-012: Use Sequelize CLI for Schema Migrations

## Status

Accepted

Date: 2026-06-02

## Context

The initial architecture (see [ADR-005](005-use-sqlite-sequelize.md)) relied on a pre-seeded SQLite
file committed to the repository, with schema changes applied by directly editing
`storage/players-sqlite3.db`. As the schema evolved, manual edits became error-prone and
inconsistent across development, test, and Docker environments.

Sequelize CLI provides versioned, reversible migration files with a clear lifecycle. The
`predev` hook runs all pending migrations automatically on `npm run dev`, so the database is
always up to date without manual intervention.

## Decision

We will use Sequelize CLI (`sequelize-cli`) for all schema changes.

- Migration files live in `database/migrations/` with a timestamp prefix (e.g. `20260101000001-create-players-table.js`)
- Each file exports `async up(queryInterface, Sequelize)` and `async down(queryInterface)` using CommonJS `module.exports`
- Migration files use CommonJS syntax (required by `sequelize-cli`, which loads `.sequelizerc` via `require()` regardless of `package.json "type": "module"`)
- `database/package.json` sets `"type": "commonjs"` to ensure migration files in that directory load as CJS within the ESM package
- `npm run predev` runs `db:migrate` automatically before starting the dev server
- `npm run db:reset` (`undo:all` + `migrate`) restores a clean known state
- Schema changes require a new migration file; directly editing `storage/players-sqlite3.db` is no longer acceptable

## Consequences

### Positive

- Schema changes are versioned, reversible, and reproducible across development, test, and Docker environments
- `predev` automation eliminates manual database setup steps
- `db:reset` restores a clean known state for debugging

### Negative

- Migration files must use CommonJS `module.exports` syntax, which is inconsistent with the rest of the codebase (ESM). The `.sequelizerc` and `database/package.json` explain why.

### Neutral

- `storage/players-sqlite3.db` remains in the repository as the runtime database; it is now managed by migrations rather than committed edits
