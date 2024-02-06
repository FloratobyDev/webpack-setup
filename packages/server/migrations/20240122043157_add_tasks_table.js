/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
  CREATE TYPE task_state AS ENUM ('Open', 'Done', 'In-Progress');
  `);

  await knex.raw(`
  CREATE TYPE difficulty_type AS ENUM ('easy', 'medium', 'hard');`);

  return knex.raw(`
  CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    repo_id INTEGER REFERENCES repositories(id),
    user_id INTEGER REFERENCES users(id),
    state task_state DEFAULT 'Open',
    difficulty difficulty_type DEFAULT 'easy',
    due_date DATE DEFAULT NULL,
    title VARCHAR(200) NOT NULL
  );`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
  DROP TABLE tasks;`);

  await knex.raw(`
  DROP TYPE difficulty_type;`);

  return knex.raw(`
  DROP TYPE task_state;`);
};
