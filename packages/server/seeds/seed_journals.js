/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("checklist").del();
  await knex("bookmarks").del();
  await knex("journal_task").del();
  await knex("tasks").del();
  await knex("journals").del();
  await knex("notifications").del();
  await knex("commits").del();
  await knex("pushes").del();
  await knex("repositories").del();
  await knex("users").del();

  await knex.raw(`
    INSERT INTO users (github_id, username)
    VALUES (1, 'test_user'),
           (2, 'test_user2'),
           (3, 'test_user3');
  `);

  await knex.raw(`
  INSERT INTO repositories (user_id, name, description)
  VALUES (1, 'test_repo', 'test description'),
         (1, 'test_repo2', 'test description2'),
         (1, 'test_repo3', 'test description3'),
         (2, 'test_repo2', 'test description2'),
         (3, 'test_repo3', 'test description3');
  `);

  await knex.raw(`
  INSERT INTO pushes (repo_id, user_id)
  VALUES (1, 1),
         (1, 1),
         (3, 3),
         (2, 1);
  `);

  await knex.raw(`
  INSERT INTO commits (commit_sha, user_id, push_id, description)
  VALUES ('test_sha', 1, 1, 'test description'),
         ('test_sha2', 2, 1, 'test description2'),
         ('test_sha3', 3, 1, 'test description2'),
         ('test_sha4', 1, 4, 'test description4'),
         ('test_sha5', 1, 2, 'test description5');
  `);

  await knex.raw(`
  INSERT INTO notifications (user_id, push_id, repo_id)
  VALUES (1, 1, 1),
         (1, 2, 1),
         (2, 2, 2),
         (3, 3, 3);
  `);

  await knex.raw(`
  INSERT INTO journals (user_id, repo_id, status, title, content)
  VALUES (1, 1, 'draft', 'test title', 'test content'),
         (1, 2, 'draft', 'test title2', 'test content2'),
         (1, 3, 'published', 'test title3', 'test content3'),
         (1, 1, 'published', 'test title4', 'test content4'),
         (1, 1, 'published', 'test title5', 'test content5');

  `);

  await knex.raw(`
  INSERT INTO tasks (repo_id, user_id, state, due_date, title)
  VALUES (1, 1, 'Open', '2021-01-01', 'test task'),
         (1, 1, 'In-Progress', '2021-01-01', 'test task2'),
         (3, 1, 'Done', '2021-01-01', 'test task3');
  `);

  await knex.raw(`
  INSERT INTO journal_task (journal_id, task_id)
  VALUES (1, 1),
         (2, 2),
         (3, 3);
  `);

  await knex.raw(`
  INSERT INTO bookmarks (user_id, journal_id)
  VALUES (1, 1),
         (2, 2),
         (3, 3);
  `);

  await knex.raw(`
  INSERT INTO checklist (task_id, user_id, is_done, content)
  VALUES (1, 1, FALSE, 'test checklist'),
         (1, 1, FALSE, 'test checklist2'),
         (3, 2, FALSE, 'test checklist3');
  `);

  await knex.raw(`
  INSERT INTO journal_commit (journal_id, user_id, commit_sha)
  VALUES (1, 1, 'test_sha'),
         (4, 1, 'test_sha2'),
         (5, 1, 'test_sha2');`);
};
