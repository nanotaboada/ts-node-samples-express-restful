import { Sequelize } from 'sequelize';
import { join } from 'path';

/**
 * Initializes a new Sequelize instance with SQLite dialect.
 *
 * @see {@link https://sequelize.org/master/manual/getting-started.html}
 */
const sequelize: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, 'players-sqlite3.db'),
    logging: console.log,
});

export default sequelize;
