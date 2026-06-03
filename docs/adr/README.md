# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for this project.

ADRs document architecturally significant decisions: their context, the decision made, and the consequences — both positive and negative. They answer **why**, not just **what**.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [001](001-interface-based-architecture.md) | Interface-based architecture | Accepted |
| [002](002-uuid-primary-key-and-squad-number-mutation-key.md) | UUID as primary key and squadNumber as mutation key | Accepted |
| [003](003-use-native-esm.md) | Use Native ESM instead of CommonJS | Accepted |
| [004](004-use-express-5.md) | Use Express 5 | Accepted |
| [005](005-use-sqlite-sequelize.md) | Use SQLite with Sequelize ORM | Accepted |
| [006](006-integration-first-testing-strategy.md) | Integration-first testing strategy | Accepted |
| [007](007-node-cache-strategy.md) | Node-cache with 1-hour TTL | Accepted |
| [008](008-use-pino-structured-logging.md) | Use Pino for structured logging | Accepted |
| [009](009-docker-and-compose-strategy.md) | Docker and Compose strategy | Accepted |
| [010](010-use-tsx-over-ts-node.md) | Use tsx instead of ts-node | Accepted |
| [011](011-football-semantic-versioning.md) | Football-themed semantic versioning | Accepted |
| [012](012-sequelize-cli-migrations.md) | Use Sequelize CLI for schema migrations | Accepted |

## Creating a new ADR

1. Copy [`template.md`](template.md) to a new file: `NNN-short-title.md` (zero-padded three-digit number)
2. Fill in all sections following the template guidance
3. Set status to `Proposed` until agreed upon, then `Accepted`
4. Add a row to the index table above
5. Reference the ADR number in the relevant PR or issue

## Lifecycle

| Status | Meaning |
|--------|---------|
| Proposed | Draft under discussion |
| Accepted | Agreed and implemented |
| Deprecated | No longer recommended but not yet replaced |
| Superseded | Replaced by a newer ADR (reference provided) |

ADRs are append-only: once accepted, update the status field only. To reverse or modify a decision, create a new ADR and mark the old one as Superseded.
