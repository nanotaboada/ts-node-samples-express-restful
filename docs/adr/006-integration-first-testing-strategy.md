# ADR-006: Integration-first testing strategy

## Status

Accepted

Date: 2026-04-02

## Context

A common testing pattern for layered APIs is to mock the database layer and test each layer in isolation. This approach has a known failure mode: mocked tests pass while real database queries fail — for example, when a Sequelize query option is wrong, when a unique constraint is violated in a way the mock doesn't simulate, or when a migration changes the schema in a way the mock doesn't reflect.

This project experienced exactly this class of regression. Mocked Sequelize tests gave false confidence that the data layer was correct.

SQLite's lightweight, file-based nature makes it practical to run tests against a real database without standing up a server. The same pre-seeded `.db` file used in development can be loaded in the test environment via `.env.test`.

## Decision

We will use Jest and Supertest to run all tests against the real SQLite database. Within the `describe('Integration Tests')` suite, Sequelize models are not mocked.

- Tests load the real SQLite database via the path specified in `.env.test`
- Suite initialisation uses `beforeAll` with direct `PlayerModel.bulkCreate` to seed the full dataset efficiently; this is a deliberate exception to the HTTP-only rule for bootstrap setup
- `beforeEach` seeds test data via POST where individual write operations are tested; `afterEach` cleans up via DELETE
- Supertest drives all non-bootstrap requests through the full Express app stack (middleware, routing, controller, service, database)
- Sequelize methods and models are not mocked in the integration suite

## Consequences

### Positive

- Tests exercise the real query path — Sequelize options, constraints, and model behaviour are all validated
- Full-stack confidence: a passing test suite means the HTTP layer, business logic, and database layer all work together correctly
- No mock divergence: the test database and production database share the same schema and seeding logic

### Negative

- Tests are slower than unit tests with mocks, as each test performs real I/O
- Test isolation requires careful state management — `beforeEach`/`afterEach` hooks must reliably seed and clean up data
- A corrupt or missing `.env.test` or database file causes the entire test suite to fail with a confusing error

### Neutral

- The integration-first approach does not preclude adding unit tests for pure logic functions; it simply means the database layer is never mocked in the integration suite
