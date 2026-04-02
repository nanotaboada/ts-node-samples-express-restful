# ADR-001: Interface-based architecture

## Status

Accepted

Date: 2026-04-02

## Context

The project is a layered REST API with four distinct concerns: HTTP handling, business logic, caching, and data access. Without formal boundaries between layers, logic tends to leak — controllers start querying the database directly, services grow coupled to specific ORM types, and tests become hard to write without spinning up the full stack.

The project also serves an educational purpose. It should demonstrate production-grade patterns that learners can apply beyond this codebase.

- Every class needs a well-defined contract so it can be replaced or tested in isolation
- TypeScript's structural type system makes interface extraction low-cost
- Constructor injection is the simplest DI mechanism that doesn't require a container

## Decision

We will define a TypeScript interface for every major class and wire all dependencies through constructor injection in a single composition root (`src/app.ts`).

- Each class (`PlayerDatabase`, `PlayerService`, `PlayerController`, `PlayerRoute`) depends on an interface, never on a concrete implementation
- The dependency chain flows one way: `PlayerDatabase → PlayerService → PlayerController → PlayerRoute`
- `app.ts` is the sole place where concrete instances are created and passed down
- No DI container is used; manual wiring keeps the graph explicit and easy to follow

## Consequences

### Positive

- Layers are testable in isolation — swap any implementation with a test double via the interface
- The composition root makes all dependencies visible in one place
- Structural coupling is eliminated: the service layer has no knowledge of Sequelize types
- Aligns with the educational goal of demonstrating clean architecture

### Negative

- Every new dependency requires explicit wiring in `app.ts`
- Boilerplate increases: each class requires a matching interface file
- No automatic resolution means adding a deep dependency requires touching multiple constructors

### Neutral

- The pattern scales to a full DI container (e.g. InversifyJS, tsyringe) if the project grows, without changing the interfaces
