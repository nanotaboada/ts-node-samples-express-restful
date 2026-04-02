# ADR-002: UUID as primary key and squadNumber as mutation key

## Status

Accepted

Date: 2026-04-02

## Context

The data model needs two types of identifiers:

1. A stable internal key for the database row, used in the `GET /players/:id` lookup
2. A human-meaningful key that clients can know and use without first performing a lookup

Sequential integer primary keys expose row count and insertion order, and are trivially enumerable. UUIDs solve this but are opaque — a client that wants to update player number 10 should not need to first discover that their UUID is `3fa85f64-5717-4562-b3fc-2c963f66afa6`.

Football players are naturally identified by their squad number within a team. `squadNumber` is already unique (enforced at the DB level), stable over the lifetime of a season, and directly meaningful to anyone familiar with the domain.

## Decision

We will use UUID v4 as the surrogate primary key (`id`) and `squadNumber` as the natural business key for all mutation and secondary lookup routes.

- `id` is generated at the database layer via `DataTypes.UUIDV4`; it is never supplied by the client on creation
- `squadNumber` carries a `unique` constraint in the Sequelize model
- Mutation routes (`PUT`, `DELETE`) and the secondary lookup (`GET /players/squadNumber/:squadNumber`) all use `squadNumber` as the URL parameter
- Clients never need to know the UUID to perform any operation on a player

## Consequences

### Positive

- No sequential ID exposure; UUIDs are non-enumerable and safe to expose in URLs
- Clients can construct mutation URLs from domain knowledge alone (e.g. `DELETE /players/squadNumber/10`)
- The natural key constraint is enforced at the DB level, preventing duplicate squad numbers

### Negative

- Two unique keys must be maintained and kept consistent throughout the stack
- `GET /players/:id` still uses UUID, so the API surface has two different lookup patterns that may surprise consumers
- UUID primary keys are larger and slightly slower to index than integers

### Neutral

- The UUID is still returned in all responses, so consumers that prefer to use it can
- This pattern mirrors common practice in production APIs that distinguish internal from external identifiers
