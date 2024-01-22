/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE checklist (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id),
    is_done BOOLEAN DEFAULT FALSE,
    content VARCHAR(128)
  );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
  DROP TABLE checklist;
  `);
};
