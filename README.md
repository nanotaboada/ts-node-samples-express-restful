# 🧪 RESTful API with Node.js and Express.js in TypeScript

[![Node.js CI](https://github.com/nanotaboada/ts-node-samples-express-restful/actions/workflows/node.js.yml/badge.svg)](https://github.com/nanotaboada/ts-node-samples-express-restful/actions/workflows/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nanotaboada_ts-node-samples-express-restful&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=nanotaboada_ts-node-samples-express-restful)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/c845d2bc280d4840a86a56a91407cea7)](https://app.codacy.com/gh/nanotaboada/ts-node-samples-express-restful/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![codecov](https://codecov.io/gh/nanotaboada/ts-node-samples-express-restful/graph/badge.svg?token=VxKaWl2DfD)](https://codecov.io/gh/nanotaboada/ts-node-samples-express-restful)
[![CodeFactor](https://www.codefactor.io/repository/github/nanotaboada/ts-node-samples-express-restful/badge)](https://www.codefactor.io/repository/github/nanotaboada/ts-node-samples-express-restful)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Proof of Concept for a RESTful API made with [Node.js](https://nodejs.org/) [LTS/Jod (v22)](https://nodejs.org/en/blog/release/v22.11.0) and [Express.js](https://expressjs.com/) 5 in [TypeScript](https://www.typescriptlang.org/). Manage football player data with SQLite, Sequelize ORM, Swagger documentation, and in-memory caching.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✅ RESTful CRUD operations for football player data
- 📚 Interactive API documentation with Swagger UI
- ⚡ In-memory caching with node-cache (1-hour TTL)
- 🏥 Health check endpoint for monitoring
- 🐳 Full Docker containerization with Docker Compose
- 🗄️ SQLite database with Sequelize ORM
- 🔒 Security headers with Helmet
- 🧪 Comprehensive integration tests with Jest and Supertest
- 🎨 TypeScript strict mode enabled
- 🔄 Hot reload with nodemon for development

## Tech Stack

- **Runtime**: Node.js 22 (LTS/Jod)
- **Framework**: Express.js 5
- **Language**: TypeScript 5.9
- **Module System**: Native ECMAScript Modules (ESM)
- **Database**: SQLite3 with Sequelize ORM
- **Testing**: Jest 30 with Supertest
- **Documentation**: Swagger (OpenAPI 3.0)
- **Caching**: node-cache
- **Security**: Helmet, CORS
- **Containerization**: Docker with multi-stage builds
- **Code Quality**: ESLint, Prettier, Commitlint
- **Dev Tools**: tsx (TypeScript executor), nodemon

> **Note:** This project uses native ESM (ECMAScript Modules) with TypeScript. While the repository name references `ts-node` (the original implementation), the project now uses **`tsx`** for faster, cleaner TypeScript execution without experimental flags.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) 22 (LTS/Jod) or higher
- npm (comes with Node.js)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional, for containerized setup)

## Quick Start

### Clone the repository

```bash
git clone https://github.com/nanotaboada/ts-node-samples-express-restful.git
cd ts-node-samples-express-restful
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The server will start on `http://localhost:9000` with the following output:

```console
> ts-node-samples-express-restful@1.0.0 dev
> nodemon

[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `tsx ./src/server.ts`
🚀 Running at http://localhost:9000
```

### Access the application

- API: `http://localhost:9000`
- Swagger Documentation: `http://localhost:9000/swagger/`
- Health Check: `http://localhost:9000/health`

## API Documentation

Interactive API documentation is available via Swagger UI at:

```text
http://localhost:9000/swagger/
```

![API Documentation](assets/images/swagger.png)

You can also access the OpenAPI JSON specification at `http://localhost:9000/swagger.json`.

## API Endpoints

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| GET    | `/players`                            | Retrieve all players           |
| GET    | `/players/:id`                        | Retrieve player by ID          |
| GET    | `/players/squadNumber/:squadNumber`   | Retrieve player by squad number|
| POST   | `/players`                            | Create a new player            |
| PUT    | `/players/:id`                        | Update an existing player      |
| DELETE | `/players/:id`                        | Delete a player                |
| GET    | `/health`                             | Health check endpoint          |

## Testing

Run the test suite with Jest:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run coverage

# Run linter
npm run lint

# Validate commit message format
npm run lint:commit
```

Tests are located in the `tests/` directory and use Supertest for integration testing. Coverage reports are generated for controllers, services, and routes only.

## Docker

This project includes full Docker support with multi-stage builds and Docker Compose for easy deployment.

### Build the Docker image

```bash
npm run docker:build
# or
docker compose build
```

### Start the application

```bash
npm run docker:up
# or
docker compose up
```

> **Note**: On first run, the container copies a pre-seeded SQLite database into a persistent volume. On subsequent runs, that volume is reused and the data is preserved.

### Stop the application

```bash
npm run docker:down
# or
docker compose down
```

### Reset the database

To remove the volume and reinitialize the database from the built-in seed file:

```bash
docker compose down -v
```

The containerized application runs on port 9000 and includes health checks that monitor the `/health` endpoint every 30 seconds.

## Environment Variables

Create a `.env` file in the root directory to customize configuration:

```env
# Server port (default: 9000)
PORT=9000

# Database storage path (default: storage/players-sqlite3.db)
# In Docker: /storage/players-sqlite3.db
STORAGE_PATH=storage/players-sqlite3.db
```

## Project Structure

```text
src/
├── app.ts              # Express app setup & middleware configuration
├── server.ts           # HTTP server initialization & lifecycle
├── controllers/        # Request handlers with Swagger annotations
├── services/           # Business logic + caching layer
├── database/           # Sequelize DB access (interfaces + implementations)
├── models/             # Sequelize models (Player)
├── routes/             # Express Router definitions
├── docs/               # Swagger configuration & doc generation
└── middlewares/        # Custom middleware (swagger CSP)

tests/                  # Integration tests with supertest
scripts/                # Docker entrypoint & healthcheck scripts
storage/                # Pre-seeded SQLite database
```

**Architecture**: Layered architecture (Route → Controller → Service → Database) with dependency injection via constructors and interface-based contracts.

![Simplified, conceptual project structure and main application flow](assets/images/structure.svg)

_Figure: Simplified, conceptual project structure and main application flow. Not all dependencies are shown._

## Available Scripts

| Script            | Description                                      |
|-------------------|--------------------------------------------------|
| `npm run dev`     | Start development server with hot reload        |
| `npm start`       | Run compiled application from `dist/`            |
| `npm run build`   | Compile TypeScript to JavaScript                |
| `npm test`        | Run Jest tests with --detectOpenHandles flag    |
| `npm run coverage`| Generate test coverage report                    |
| `npm run lint`    | Run ESLint on all files                          |
| `npm run lint:commit` | Validate last commit message format          |
| `npm run swagger:docs` | Generate swagger.json from JSDoc annotations |
| `npm run docker:build` | Build Docker image                           |
| `npm run docker:up`    | Start Docker container                       |
| `npm run docker:down`  | Stop and remove Docker volume                |

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct and the process for submitting pull requests.

Key guidelines:

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Ensure all tests pass (`npm test`)
- Run linter before committing (`npm run lint`)
- Keep changes small and focused

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Acknowledgments**: This solution has been developed using [Visual Studio Code](https://code.visualstudio.com/).

All trademarks, registered trademarks, service marks, product names, company names, or logos mentioned are the property of their respective owners and are used for identification purposes only.
