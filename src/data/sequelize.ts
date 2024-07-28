import { Sequelize } from 'sequelize';
import { join } from 'path';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, 'players-sqlite3.db'),
    logging: false,
});

export default sequelize;
