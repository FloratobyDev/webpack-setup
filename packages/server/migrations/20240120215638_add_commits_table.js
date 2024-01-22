/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE commits (
    id SERIAL PRIMARY KEY,
    commit_sha VARCHAR(64) NOT NULL,
    push_id INTEGER REFERENCES push(id),
    description VARCHAR(200)
  );`
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
  DROP TABLE commits;`
  );
};
