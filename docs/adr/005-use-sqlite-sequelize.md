# ADR-005: Use SQLite with Sequelize ORM

## Status

Accepted

Date: 2026-04-02

## Context

This project is a Proof of Concept for a RESTful API, part of a cross-language comparison study. The database requirements are minimal: persist a small number of football player records, support basic CRUD, and seed consistently across development and test environments.

The primary constraints are:

- Zero external infrastructure: no database server should be required to run or test the project
- Portable: the database file can be versioned, seeded, and bundled into the Docker image
- Abstracted: the data access layer should be swappable without touching business logic (see [ADR-001](001-interface-based-architecture.md))

Sequelize is a mature TypeScript-compatible ORM that supports SQLite and provides a model abstraction that decouples the service layer from raw SQL.

## Decision

We will use SQLite as the database engine and Sequelize as the ORM.

- The pre-seeded database file lives at `storage/players-sqlite3.db` and is versioned in the repository
- Sequelize models are defined in `src/models/` and accessed only through `src/database/`
- Schema management was subsequently adopted via Sequelize CLI migrations (see [ADR-012](012-sequelize-cli-migrations.md))
- The same database file is used in development, tests (via `.env.test`), and the Docker image

## Consequences

### Positive

- No external database server required — the project runs with `npm install && npm run dev`
- The database file can be seeded once and bundled with the Docker image for consistent demo deployments
- Sequelize's abstraction keeps the service layer free of SQLite-specific code
- SQLite's lightweight footprint makes it practical to run tests against the real database (see [ADR-006](006-integration-first-testing-strategy.md))

### Negative

- Not production-ready: SQLite has no concurrent write support and is unsuitable for multi-instance deployments
- The concern about manual schema changes is addressed by adopting Sequelize CLI migrations (see [ADR-012](012-sequelize-cli-migrations.md))
- Sequelize's TypeScript support, while functional, requires some boilerplate (`declare` fields, `Model.init`)

### Neutral

- Swapping SQLite for PostgreSQL or MySQL would require only a Sequelize dialect change and a new connection string — the rest of the stack is unaffected
