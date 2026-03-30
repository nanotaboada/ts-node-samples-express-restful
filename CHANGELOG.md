# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Football Terminology Names ⚽

This project uses football/soccer terminology for release names:

| Letter | Term | Definition | Tag Name |
| ------ | ---- | ---------- | -------- |
| A | Assist | Pass leading to a goal | `assist` |
| B | Bicycle-kick | Overhead kick | `bicyclekick` |
| C | Corner | Corner kick | `corner` |
| D | Dribble | Ball control while moving | `dribble` |
| E | Equalizer | Goal that ties the score | `equalizer` |
| F | Foul | Rule violation | `foul` |
| G | Goal | Scored point | `goal` |
| H | Header | Ball contact with head | `header` |
| I | Interception | Stealing the ball | `interception` |
| J | Juggle | Ball control skill | `juggle` |
| K | Keeper | Goal defender (Goalkeeper) | `keeper` |
| L | Lob | High arcing pass/shot | `lob` |
| M | Marking | Defending an opponent | `marking` |
| N | Nutmeg | Passing ball through legs | `nutmeg` |
| O | Offside | Position rule violation | `offside` |
| P | Penalty | Free kick from penalty spot | `penalty` |
| Q | Quick-throw | Fast throw-in | `quickthrow` |
| R | Red-card | Player ejection | `redcard` |
| S | Save | Goalkeeper blocking shot | `save` |
| T | Tackle | Challenging for the ball | `tackle` |
| U | Upset | Underdog victory | `upset` |
| V | Volley | Kicking ball in midair | `volley` |
| W | Wing | Side area of field | `wing` |
| X | X-Pass | Diagonal crossing pass | `xpass` |
| Y | Yellow-card | Caution warning | `yellowcard` |
| Z | Zone-defense | Area marking strategy | `zonedefense` |

---

## [Unreleased]

### Added

### Changed

### Deprecated

## [2.1.0-dribble] - 2026-03-30

### Added

- 15 substitute players seeded in `storage/players-sqlite3.db`

### Changed

- Player dataset normalised to November 2022 World Cup snapshot: Enzo Fernández (SL Benfica / Liga Portugal), Mac Allister (Brighton & Hove Albion), Messi (Paris Saint-Germain / Ligue 1), Di María `abbrPosition` → `RW`
- Player UUIDs replaced with deterministic UUID v5 values (namespace `f201b13e-c670-473d-885d-e2be219f74c8`, formula `{firstName}-{lastName}`)
- Test fixture for Create/Delete replaced: Paredes (squad 5) → Lo Celso (squad 27)
- Test fixture for Update added: Emiliano Martínez (squad 23) — `firstName` `'Damián'` → `'Emiliano'`, `middleName` cleared
- `playerStub.all` expanded to 26 players; `playerStub.update` added
- `PUT describe` in tests: removed `beforeEach`, added `afterEach` to restore Martínez; all tests retargeted to squad 23
- `rest/players.rest` variables updated: `@newSquadNumber = 27`, `@existingSquadNumber = 23`

### Removed

### Fixed

### Security

---

## [2.0.0 - corner] - 2026-03-29

### Added

- `.envrc` for [direnv](https://direnv.net/) to automatically switch to the required Node.js version via `.nvmrc` on directory entry
- `rest/players.rest` HTTP file with health check, POST, GET (all, by ID, by squad number), PUT, and DELETE requests for VS Code REST Client (`humao.rest-client`)
- `humao.rest-client` added to `.vscode/extensions.json` recommended extensions

### Changed

- `id` field in `Player` model migrated from `INTEGER` to `UUID` (`DataTypes.UUIDV4`, auto-generated on insert) — surrogate key, admin use only
- `PUT /players/:id` route replaced by `PUT /players/squadNumber/:squadNumber` — natural key is now the domain identifier for mutations
- `DELETE /players/:id` route replaced by `DELETE /players/squadNumber/:squadNumber` — natural key is now the domain identifier for mutations
- `POST /players` conflict detection switched from `id`-based to `squadNumber`-based lookup
- `IPlayer.id` type changed from `number` to `string` to reflect UUID
- `updateAsync` and `deleteAsync` in service and database layers refactored to operate on `squadNumber`

### Removed

- `postman-collections/` directory and Postman JSON collection replaced by `rest/players.rest`

---

## [1.0.1 - bicyclekick] - 2026-03-08

### Changed

- Docker entrypoint now prints API and Swagger UI URLs on startup
- Swagger UI CSP updated to include `connect-src 'self'` and `worker-src blob: 'self'`
- Swagger UI static `/swagger/index.html` redirect now registered before static file middleware
- `swaggerUrl` set explicitly so Swagger UI fetches spec from `/swagger.json` instead of falling back to petstore
- Test naming convention updated to action-oriented arrow pattern
- Unified Copilot instructions as canonical single-file format
- Dependency updates: `pino`, `dotenv`, `qs`, `dottie`, `express-rate-limit`, `eslint`, `nodemon`, `commitlint`, `@types/*` and GitHub Actions (`docker/build-push-action`, `docker/login-action`, `docker/setup-buildx-action`, `actions/setup-node`, `actions/upload-artifact`, `actions/download-artifact`)

### Fixed

- Docker container crashed on startup with `unable to determine transport target for "pino-pretty"` — resolved by setting `NODE_ENV=production` in `compose.yml`
- Swagger UI displayed petstore fallback due to missing CSP directives and static file middleware intercepting `/swagger/index.html`

---

## [1.0.0 - assist] - 2026-02-08

Initial release. See [README.md](README.md) for complete feature list and documentation.

---

## How to Release

💡 **Update CHANGELOG.md continuously with every meaningful change before committing!**

### Pre-Release Checklist

- [ ] Release branch created from `master`
- [ ] `CHANGELOG.md` updated with release notes
- [ ] Changes committed and pushed on the release branch
- [ ] Release PR merged into `master`
- [ ] Tag created with correct format: `vX.Y.Z-term`
- [ ] Term is valid (A-Z from the football terminology list above)
- [ ] Tag pushed to trigger CD workflow

### Creating a Release

1. **Create a release branch**

   ```bash
   git checkout master && git pull
   git checkout -b release/vX.Y.Z-term
   ```

2. **Update CHANGELOG.md**

   Move items from `[Unreleased]` to a new version section:

   ```markdown
   ## [X.Y.Z - term] - YYYY-MM-DD
   ```

   Commit and push:

   ```bash
   git add CHANGELOG.md
   git commit -m "chore(release): vX.Y.Z-term"
   git push origin release/vX.Y.Z-term
   ```

3. **Merge the release PR**

   Open a pull request from `release/vX.Y.Z-term` into `master` and merge it. The tag must be created **after** the merge so it points to the correct commit on `master`.

4. **Create and push tag**

   ```bash
   git checkout master && git pull
   git tag -a vX.Y.Z-term -m "Release X.Y.Z - Term"
   git push origin vX.Y.Z-term
   ```

5. **CD pipeline runs automatically**

   GitHub Actions will:
   - Run full test suite with coverage
   - Build Docker image
   - Publish to GHCR with tags: `:X.Y.Z`, `:term`, `:latest`
   - Create GitHub Release with auto-generated notes

### Release Naming Convention

Format: `v{MAJOR}.{MINOR}.{PATCH}-{TERM}`

Example: `v1.0.0-assist`

- **Version**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Term**: Football terminology from the alphabetical list above

### Docker Image Tags

Each release publishes three Docker tags:

```bash
# Pull by semantic version (recommended for production)
docker pull ghcr.io/nanotaboada/ts-node-samples-express-restful:1.0.0

# Pull by term name (memorable, useful for staging)
docker pull ghcr.io/nanotaboada/ts-node-samples-express-restful:assist

# Pull latest (development/testing only)
docker pull ghcr.io/nanotaboada/ts-node-samples-express-restful:latest
```

### Versioning Guidelines

**MAJOR** (x.0.0): Breaking changes to API contracts
**MINOR** (1.x.0): New features, backwards-compatible
**PATCH** (1.0.x): Bug fixes, no new features

### Important Notes

- 💡 Always update CHANGELOG.md `[Unreleased]` section as you work
- 🚫 Never commit secrets, API keys, or credentials
- ✅ Test thoroughly before tagging
- 📝 Use clear, user-facing descriptions in CHANGELOG
- 🏷️ Tags trigger CD pipeline - CI only runs on push/PR
- 🐳 Only releases publish Docker images (not every merge)
