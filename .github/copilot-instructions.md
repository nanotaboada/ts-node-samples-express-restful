# Copilot Instructions

## Stack

- **Runtime**: Node.js 24 LTS (Krypton)
- **Framework**: Express.js 5
- **Language**: TypeScript (strict mode)
- **Database**: SQLite with Sequelize ORM
- **Testing**: Jest 30 with Supertest
- **Containerization**: Docker with multi-stage builds

## Project Patterns

- **Layered Architecture**: Routes → Controllers → Services → Database
- **Dependency Injection**: Constructor injection with interface-based abstractions
- **Error Handling**: Try/catch in controllers, centralized error middleware
- **Caching**: In-memory node-cache (1-hour TTL) at service layer
- **Logging**: Pino structured logging with request correlation IDs
- **Security**: Helmet middleware for headers, CORS, express-rate-limit

## Code Conventions

- **Module System**: Native ESM (not CommonJS) - always include `.js` in relative imports
- **Naming**: camelCase for variables/functions, PascalCase for classes/types/interfaces
- **File Naming**: kebab-case with suffixes (`player-service.ts`, `player-controller.ts`)
- **Imports**: Group by external deps → internal modules → types, alphabetically sorted
- **Type Safety**: Strict TypeScript, avoid `any` unless justified, prefer interfaces over types
- **Async**: All I/O operations use async/await, never callbacks or synchronous calls
- **Comments**: JSDoc for public APIs and Swagger annotations, inline comments only when necessary
- **Formatting**: Prettier (4 spaces, single quotes, 127 width) - enforced pre-commit
- **Commit Messages**: Conventional Commits format `type(scope): description (#issue)` (max 80 chars)

## Testing

- **Structure**: Integration tests in `/tests/`, focus on controller/service/route layers
- **Naming Convention**: Action-oriented pattern with visual flow

  ```typescript
  it('Request {METHOD} {/path} {context} → Response {outcome}', async () => {
  ```

  - Example: `it('Request GET /players/{id} existing → Response status 200 OK', async () => {`
  - **Components**: Request/Response (Title Case), METHOD (ALL CAPS), /path (actual endpoint), context (lowercase), outcome (status codes in Title Case like `200 OK`, `404 Not Found`)
- **Mocking**: Use Jest mocks for external dependencies, avoid mocking internal modules
- **Coverage**: Maintain existing coverage levels (controllers, services, routes only)
- **Runner**: Jest with ESM support (`ts-jest` preset), use `--watch` in development

## Avoid

- Using `any` type without explicit justification
- Missing `.js` extensions in relative imports (ESM breaks without them)
- Mixing CommonJS (`require`/`module.exports`) with ESM (`import`/`export`)
- Synchronous file operations (`fs.readFileSync`, `fs.writeFileSync`)
- Missing error handling on async operations (always `try/catch`)
- Using `console.log` instead of Pino logger
- Creating files without interfaces when abstraction is needed
- Ignoring TypeScript errors or using `@ts-ignore` without comments
- Mocking Sequelize models in tests (use real test database)
