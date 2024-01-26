/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE bookmarks (
    user_id INTEGER REFERENCES users(id),
    journal_id INTEGER REFERENCES journals(id),
    repo_id INTEGER REFERENCES repositories(id),
    PRIMARY KEY (user_id, journal_id)
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
  DROP TABLE bookmarks;
  `);
};
