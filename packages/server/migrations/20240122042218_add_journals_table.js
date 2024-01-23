/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
  CREATE TYPE journal_status AS ENUM ('draft', 'published');`);

  return knex.raw(`
  CREATE TABLE journals (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id),
    repo_id INTEGER REFERENCES repositories(id),
    status journal_status DEFAULT 'draft',
    title VARCHAR(40) NOT NULL,
    content text NOT NULL
  );`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
  DROP TABLE journals;`);

  return knex.raw(`
  DROP TYPE journal_status;`);
};
