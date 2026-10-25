---
name: api-workflows
description: Step-by-step checklists for adding a new player endpoint or modifying the Player schema (model, migration, tests) in this project.
---

# Key workflows

**Add an endpoint**:

1. Define interface method in `src/controllers/player-controller-interface.ts`
2. Implement in `src/controllers/player-controller.ts` with `@openapi` JSDoc + try/catch
3. Add service method in `src/services/player-service-interface.ts` + implementation in `src/services/player-service.ts` with caching + cache invalidation as needed
4. Add database method in `src/database/player-database-interface.ts` + `src/database/player-database.ts` using Sequelize
5. Register route in `src/routes/player-route.ts` (wire validator middleware if needed)
6. Wire any new instances in `src/app.ts`
7. Add integration tests in `tests/player-test.ts` following naming and Arrange/Act/Assert conventions
8. Run `npm run swagger:docs` to regenerate `swagger.json`
9. Run pre-commit checks

**Modify schema** (ask before changing — see CLAUDE.md "Ask before changing"):

1. Update `IPlayer` interface in `src/models/player-interface.ts`
2. Update Sequelize model in `src/models/player-model.ts`
3. Generate a migration: `npx sequelize-cli migration:generate --name describe-the-change`
4. Edit the generated file in `database/migrations/` — implement `up` and `down`
5. Apply the migration: `npm run db:migrate`
6. Rebuild Docker image: `docker compose build`
7. Update services, controllers, validators, and tests
8. Run `npm run coverage`
