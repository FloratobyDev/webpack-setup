/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE commits (
    commit_sha VARCHAR(64) NOT NULL,
    push_id INTEGER REFERENCES push(id),
    user_id INTEGER REFERENCES users(id),
    description VARCHAR(200),
    PRIMARY KEY (commit_sha, push_id)
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
