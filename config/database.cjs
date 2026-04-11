'use strict';

// This file uses the .cjs extension to guarantee CommonJS loading regardless
// of the root "type": "module" declaration. A plain .js extension would make
// Node.js treat it as ESM, causing require() in sequelize-cli to fail.
//
// The development config reads STORAGE_PATH from the environment so that both
// the local app (./storage/players-sqlite3.db by default) and the Docker
// container (/storage/players-sqlite3.db via compose.yml) use the same config
// section without needing a separate environment entry.
//
// The production config targets PostgreSQL and is intentionally left using
// environment variables — it will be fully wired up when PostgreSQL support
// is added in issue #549.

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: process.env.STORAGE_PATH || './storage/players-sqlite3.db',
        logging: false,
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    },
    production: {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: false,
    },
};
