/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "password",
      database: "newest_db",
    },
    migrations: {
      directory: __dirname + "/packages/server/migrations",
    },
    seeds: {
      directory: __dirname + "/packages/server/seeds",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      connectionString: process.env.INTERNAL_DB,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: __dirname + "/packages/server/migrations",
      tableName: "knex_migrations",
    },
  },
};
