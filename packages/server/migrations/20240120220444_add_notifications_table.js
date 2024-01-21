/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  //create user table in raw sql
  return knex.raw(`
  CREATE TABLE notifications (
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(github_id),
    push_id INTEGER REFERENCES push(id),
    repo_id INTEGER REFERENCES repositories(repo_id),
    has_seen BOOLEAN DEFAULT FALSE,
    has_interacted BOOLEAN DEFAULT FALSE
  );
`);
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.raw(`
  DROP TABLE notifications;
`);
};
