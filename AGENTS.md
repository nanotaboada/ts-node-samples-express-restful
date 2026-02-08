# AGENTS.md

> **⚡ Token Efficiency Note**: This file contains complete operational instructions (~2,500 tokens).
> **Auto-loaded**: NO (load explicitly with `#file:AGENTS.md` when you need detailed procedures)
> **When to load**: Complex workflows, troubleshooting, CI/CD setup, detailed architecture questions
> **Related files**: See `#file:.github/copilot-instructions.md` for quick context (auto-loaded, ~500 tokens)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (hot reload with nodemon)
npm run dev
# Server starts on http://localhost:9000

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# View API documentation
# Open http://localhost:9000/api-docs in browser
```

## Node.js Version

This project requires **Node.js 24 (LTS/Krypton)** specified in `.nvmrc`.

If using nvm, asdf, or mise, the correct version activates automatically. Otherwise, ensure Node.js 24 is installed.

## Development Workflow

### Running Tests

```bash
# Run all tests with Jest
npm test

# Run tests with coverage report (matches CI)
npm run coverage

# Run specific test file
npm test -- players.test.ts

# Run tests in watch mode (development)
npm test -- --watch
```

**Coverage requirement**: Tests must maintain coverage. The CI pipeline enforces this with Jest configuration.

### Code Quality

```bash
# Lint code with ESLint (must pass before committing)
npm run lint

# Lint commit message (conventional commits)
npm run lint:commit

# Format code with Prettier (auto-fix)
npx prettier --write .

# TypeScript type checking
npx tsc --noEmit
```

**Pre-commit checklist**:

1. Run `npm run lint` - must pass with no errors
2. Run `npx tsc --noEmit` - must pass type checking
3. Run `npm run coverage` - all tests must pass with coverage

**Style rules**:

- ESLint configuration in `eslint.config.mjs`
- Prettier configuration in `.prettierrc`
- TypeScript strict mode enabled in `tsconfig.json`
- Uses ESM (ECMAScript Modules) - `"type": "module"` in package.json

### Swagger Documentation

```bash
# Regenerate Swagger docs (after changing JSDoc annotations)
npm run swagger:docs

# Swagger annotations are in src/controllers/*.ts
# Configuration in src/docs/swagger-config.ts
```

**Important**: Swagger docs are generated from JSDoc comments in controller files. Edit those, then run `swagger:docs`.

### Database Management

```bash
# Database auto-initializes on first app startup
# Pre-seeded database ships in storage/players.db

# To reset database to seed state (local development)
rm storage/players.db
# Next app startup will recreate via Sequelize sync + seeding

# Database location: storage/players.db
```

**Important**: SQLite database with Sequelize ORM. Auto-syncs schema and seeds with football player data on first run.

## Docker Workflow

```bash
# Build container image
npm run docker:build
# or: docker compose build

# Start application in container
npm run docker:up
# or: docker compose up

# Start in detached mode (background)
docker compose up -d

# View logs
docker compose logs -f

# Stop application
npm run docker:down
# or: docker compose down -v

# Health check (when running)
curl http://localhost:9000/health
```

**First run behavior**: Container initializes SQLite database with seed data. Volume persists data between runs.

## Release Management

### CHANGELOG Maintenance

**Important**: Update CHANGELOG.md continuously as you work, not just before releases.

**For every meaningful commit**:

1. Add your changes to the `[Unreleased]` section in CHANGELOG.md
2. Categorize under the appropriate heading:
   - **Added**: New features
   - **Changed**: Changes in existing functionality
   - **Deprecated**: Soon-to-be removed features
   - **Removed**: Removed features
   - **Fixed**: Bug fixes
   - **Security**: Security vulnerability fixes
3. Use clear, user-facing descriptions (not just commit messages)
4. Include PR/issue numbers when relevant (#123)

**Example**:

```markdown
## [Unreleased]

### Added
- User authentication with JWT tokens (#145)
- Rate limiting middleware for API endpoints

### Deprecated
- Legacy authentication endpoint /api/v1/auth (use /api/v2/auth instead)

### Fixed
- Null reference exception in player service (#147)

### Security
- Fix SQL injection vulnerability in search endpoint (#148)
```

### Creating a Release

When ready to release:

1. **Update CHANGELOG.md**: Move items from `[Unreleased]` to a new versioned section:

   ```markdown
   ## [1.1.0 - bicyclekick] - YYYY-MM-DD
   ```

   Commit and push this change before creating the tag.

2. **Create and push tag**:

   ```bash
   git tag -a v1.1.0-bicyclekick -m "Release 1.1.0 - Bicycle-kick"
   git push origin v1.1.0-bicyclekick
   ```

3. **CD workflow runs automatically** to publish Docker images and create GitHub Release

See [CHANGELOG.md](CHANGELOG.md#how-to-release) for complete release instructions and football terminology naming convention.

## CI/CD Pipeline

### Continuous Integration (node-ci.yml)

**Trigger**: Push to `master` or PR

**Jobs**:

1. **Setup**: Node.js 24 installation, npm ci (clean install)
2. **Lint**: ESLint + commitlint validation
3. **Build**: TypeScript compilation (`npm run build`)
4. **Test**: Jest with coverage report
5. **Coverage**: Upload to Codecov

**Note**: CI only validates code - it does NOT publish Docker images.

### Continuous Deployment (node-cd.yml)

**Trigger**: Version tags in format `v{MAJOR}.{MINOR}.{PATCH}-{TERM}`

Example:

```bash
git tag -a v1.0.0-assist -m "Release 1.0.0 - Assist"
git push origin v1.0.0-assist
```

**Pipeline automatically**:

- Runs full test suite with coverage
- Builds multi-stage Docker image
- Pushes to GHCR with multiple tags (version, term name, latest)
- Generates changelog from commits
- Creates GitHub Release with auto-generated notes

**Football terminology convention**: Alphabetically ordered codenames (assist, bicyclekick, corner, etc.)

**Local validation** (run this before pushing):

```bash
# Matches CI exactly
npm run lint && \
npm run build && \
npm run coverage
```

## Project Architecture

**Structure**: Layered architecture (Routes → Controllers → Services → Database)

```
src/
├── app.ts              # Express app setup & middleware
├── server.ts           # HTTP server initialization

├── controllers/        # Request handlers with Swagger JSDoc
│   └── players.controller.ts

├── services/           # Business logic + caching layer
│   └── players.service.ts

├── database/           # Sequelize DB access
│   ├── interface.database.ts       # DB interface
│   └── implementation.database.ts  # Sequelize implementation

├── models/             # Sequelize models
│   └── player.model.ts             # Player model + schema

├── routes/             # Express Router definitions
│   └── players.routes.ts

├── docs/               # Swagger configuration
│   ├── swagger-config.ts           # OpenAPI spec
│   └── swagger-docs.ts             # Doc generator script

└── middlewares/        # Custom middleware
    └── swagger-csp.middleware.ts   # CSP for Swagger UI

tests/                  # Integration tests
  └── players.test.ts               # Supertest endpoint tests
```

**Key patterns**:

- Native ESM (not CommonJS) - uses `import/export`
- TypeScript strict mode - full type safety
- Sequelize ORM for database operations
- Node-cache for in-memory caching (1-hour TTL)
- Express middleware: Helmet (security), CORS, rate limiting
- Swagger JSDoc annotations for API docs
- Uses `tsx` for running TypeScript (faster than ts-node)

## Environment Variables

Create `.env` for local development (see `.env.test` for example):

```bash
NODE_ENV=development
PORT=9000
DB_PATH=./storage/players.db
```

**Note**: `.env.test` is used automatically during test runs.

## Troubleshooting

### Port already in use

```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9
```

### Module import errors

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Verify Node version
node --version  # Should be v24.x
```

### TypeScript compilation errors

```bash
# Clean build artifacts
rm -rf dist/

# Rebuild
npm run build

# Check for type errors
npx tsc --noEmit
```

### Database locked errors

```bash
# Stop all running instances
pkill -f "node dist/server.js"
pkill -f nodemon

# Reset database
rm storage/players.db
```

### Jest test failures

```bash
# Clear Jest cache
npx jest --clearCache

# Run with verbose output
npm test -- --verbose
```

### Docker issues

```bash
# Clean slate
npm run docker:down
docker compose build --no-cache
npm run docker:up
```

## Testing the API

### Using Swagger UI (Recommended)

Open <http://localhost:9000/api-docs> - Interactive documentation with "Try it out"

### Using Postman

Pre-configured collection available in `postman-collections/`

### Using curl

```bash
# Health check
curl http://localhost:9000/health

# Get all players
curl http://localhost:9000/players

# Get player by ID
curl http://localhost:9000/players/1

# Create player
curl -X POST http://localhost:9000/players \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Pele","lastName":"Nascimento","club":"Santos","nationality":"Brazil","dateOfBirth":"1940-10-23","squadNumber":10}'

# Update player
curl -X PUT http://localhost:9000/players/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Diego","lastName":"Maradona","club":"Napoli","nationality":"Argentina","dateOfBirth":"1960-10-30","squadNumber":10}'

# Delete player
curl -X DELETE http://localhost:9000/players/1
```

## Important Notes

- **Never commit secrets**: No API keys, tokens, or credentials in code
- **Test coverage**: Maintain existing coverage levels (currently high)
- **Commit messages**: Follow conventional commits (enforced by commitlint)
- **Node version**: Must use 24.x for consistency with CI/CD
- **ESM only**: This project uses native ES modules, not CommonJS
- **TypeScript strict**: All type errors must be resolved
- **Database**: SQLite is for demo/development only - not production-ready
- **Package lock**: Always commit `package-lock.json` for reproducible builds
- **tsx vs ts-node**: Project uses `tsx` for better performance with ESM
