import path from 'node:path';
import { Sequelize } from 'sequelize';

// Read from env var, fallback to relative path (for local dev)
const storagePath = process.env.STORAGE_PATH ?? path.join(process.cwd(), 'storage', 'players-sqlite3.db');

/**
 * Initializes a new Sequelize instance with SQLite dialect.
 *
 * @see {@link https://sequelize.org/master/manual/getting-started.html}
 */
const sequelize: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: console.log,
});

export default sequelize;
