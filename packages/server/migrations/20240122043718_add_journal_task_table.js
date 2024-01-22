/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE journal_task (
    journal_id INTEGER REFERENCES journals(id),
    task_id INTEGER REFERENCES tasks(id),
    PRIMARY KEY (journal_id, task_id)
  );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
  DROP TABLE journal_task;
  `);
};
