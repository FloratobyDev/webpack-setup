/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE commits (
    commit_sha VARCHAR(64) NOT NULL PRIMARY KEY,
    user_id INTEGER REFERENCES users(github_id),
    push_id INTEGER REFERENCES pushes(id),
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
