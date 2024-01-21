/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE commits (
    id SERIAL PRIMARY KEY,
    commit_sha VARCHAR(60) NOT NULL,
    push_id INTEGER REFERENCES push(id),
    description VARCHAR(400)
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
