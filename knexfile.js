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

  production: {
    client: "postgresql",
    connection: {
      connectionString: process.env.INTERNAL_DB,
    },
    migrations: {
      directory: __dirname + "/packages/server/migrations",
      tableName: "knex_migrations",
    },
  },
};
