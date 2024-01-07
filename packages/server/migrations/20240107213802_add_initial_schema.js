/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  //create user table in raw sql
  return knex.raw(`
    CREATE TABLE users (
      id serial PRIMARY KEY,
      email text UNIQUE NOT NULL,
      password text NOT NULL,
      created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE users;
  `);
};
