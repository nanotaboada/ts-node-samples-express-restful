#!/bin/sh
set -e

# Helper function for formatted logging
log() {
    echo "[ENTRYPOINT] $(date '+%Y/%m/%d - %H:%M:%S') | $1"
    return 0
}

log "✔ Starting container..."

STORAGE_PATH="${STORAGE_PATH:-storage/players-sqlite3.db}"

mkdir -p "$(dirname "$STORAGE_PATH")"

if [ ! -f "$STORAGE_PATH" ]; then
    log "⚠️ No existing database file found at $STORAGE_PATH."
else
    log "✔ Existing database file found at $STORAGE_PATH."
fi

# Unlike Diesel/Alembic/Flyway/EF Core, Sequelize CLI does not auto-run on app
# startup, so migrations are applied explicitly here. The CLI checks SequelizeMeta
# and only runs pending migrations, making this call safe to run on every start.
#
# NODE_ENV is forced to "development" (SQLite) regardless of the container env.
# compose.yml sets NODE_ENV=production, which would select the PostgreSQL config
# and fail because the pg package is not installed yet. PostgreSQL support will
# be wired up in issue #549 — at that point this line should use NODE_ENV=production.
log "🗄️ Applying Sequelize migrations (pending only)..."
NODE_ENV=development ./dist/node_modules/.bin/sequelize-cli db:migrate
log "✔ Migrations complete."

log "✔ Ready!"
log "🚀 Launching app..."
log "🔌 API endpoints   | http://localhost:9000/players/"
log "📚 Swagger UI      | http://localhost:9000/swagger/"
exec "$@"
