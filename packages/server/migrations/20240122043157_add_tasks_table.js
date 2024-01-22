/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
  CREATE TYPE task_state AS ENUM ('OP', 'DN', 'IP');
  `);

  return knex.raw(`
  CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    repo_id INTEGER REFERENCES repositories(repo_id),
    user_id INTEGER REFERENCES users(github_id),
    state task_state DEFAULT 'OP',
    due_date DATE,
    title VARCHAR(40) NOT NULL,
  );`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
  DROP TYPE task_state;`);

  knex.raw(`
  DROP TABLE tasks;`);
};
