/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE journal_commit (
      commit_sha VARCHAR(64) NOT NULL,
      journal_id INTEGER,
      user_id INTEGER REFERENCES users(id),
      FOREIGN KEY (commit_sha) REFERENCES commits(commit_sha) ON DELETE CASCADE,
      FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
      PRIMARY KEY(journal_id, commit_sha)
      );`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
    DROP TABLE journal_commit;
  `)
};
