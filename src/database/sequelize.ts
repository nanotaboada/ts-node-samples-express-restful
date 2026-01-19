import path from 'node:path';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';

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
    logging: (msg) => logger.debug({ sql: msg }, 'Sequelize Query'),
});

export default sequelize;
