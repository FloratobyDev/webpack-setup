/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  //create user table in raw sql
  return knex.raw(`
    CREATE TABLE repositories (
      id integer PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      name VARCHAR(40) NOT NULL
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE repositories;
  `);
};
