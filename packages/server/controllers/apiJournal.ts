const { groupBy, map, uniqBy } = require("lodash");
const journalRouter = require("express").Router();
const journalDb = require("../dbRequest.ts");
const journalJwt = require("jsonwebtoken");

journalRouter.get("/repo", async (req, res) => {
  try {
    if (journalJwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)) {
      // const { githubId } = journalJwt.decode(req.cookies.accessToken);
      const githubId = 1;
      const repositoryData = await journalDb.raw(
        `SELECT * FROM repositories WHERE user_id=?`,
        [githubId],
      );

      if (repositoryData.rows.length) {
        const repoOne = repositoryData.rows[0];
        console.log("repositoryData", repositoryData.rows);

        const firstTenPushesWithCommits = await journalDb.raw(
          `SELECT * FROM push join commits ON push.id = commits.push_id AND push.user_id = commits.user_id WHERE repo_id=? ORDER BY created_at DESC LIMIT 10`,
          [repoOne.id],
        );

        const firstTenPushesWithNotif = await journalDb.raw(
          `SELECT 
          p.id AS push_id,
          p.created_at,
          c.commit_sha,
          c.description AS commit_description,
          n.id AS notification_id,
          n.has_seen,
          n.has_interacted
      FROM 
          push p
      LEFT JOIN commits c ON p.id = c.push_id
      LEFT JOIN notifications n ON p.id = n.push_id
      WHERE 
          p.repo_id = ?
      ORDER BY 
          p.created_at DESC
      LIMIT 10;`,
          [repoOne.id],
        );

        console.log("firstTenPushesWithNotif", firstTenPushesWithNotif.rows);

        // Assuming 'results' is the array of objects you got from the SQL query
        const groupedResults = map(
          groupBy(firstTenPushesWithNotif.rows, "push_id"),
          (value, key) => ({
            push_id: Number(key),
            created_at: value[0].created_at,
            commits: uniqBy(value, "commit_sha").map((commit) => ({
              commit_sha: commit.commit_sha,
              description: commit.commit_description,
            })),
            notification_id: value[0].notification_id,
            has_interacted: value[0].has_interacted,
            has_seen: value[0].has_seen,
          }),
        );

        // console.log(groupedResults);

        console.log("groupedResults", groupedResults);

        const journals = await journalDb.raw(
          `SELECT * FROM journals WHERE user_id=? AND repo_id=? ORDER BY created_at DESC LIMIT 10`,
          [githubId, repoOne.id],
        );

        console.log("journals", journals.rows);

        const tasks = await journalDb.raw(
          `SELECT * FROM tasks WHERE user_id=? AND repo_id=?`,
          [githubId, repoOne.id],
        );

        console.log("tasks", tasks.rows);

        const checklist = await journalDb.raw(
          `SELECT * FROM checklist WHERE user_id=? AND task_id = ANY(?)`,
          [githubId, tasks.rows.map((task) => task.id)],
        );

        console.log("checklist", checklist.rows);

        // console.log('type', repoOne.id, githubId, journals.rows.map((journal) => journal.id));

        const journalIds = journals.rows.map((journal) => Number(journal.id));

        const journalTasks = await journalDb.raw(
          `SELECT * FROM journal_task join tasks ON journal_task.task_id = tasks.id WHERE journal_task.journal_id = ANY(?) AND tasks.repo_id=? AND tasks.user_id=?`,
          [journalIds, repoOne.id, githubId],
        );

        console.log("journal_tasks", journalTasks.rows);

        const firstTenNotifs = await journalDb.raw(
          `SELECT * FROM notifications WHERE user_id=? AND repo_id=? ORDER BY created_at DESC LIMIT 10`,
          [githubId, repoOne.id],
        );

        const modifiedRepositoryDataHasNotifs = repositoryData.rows.map(
          (repo) => {
            const notifs = firstTenNotifs.rows.filter(
              (notif) => notif.repo_id === repo.id && notif.has_seen === false,
            );
            return { ...repo, hasAlerts: notifs.length > 0 };
          },
        );

        const modifiedPushesWithCommitsHasNotifs =
          firstTenPushesWithCommits.rows.map((push) => {
            const notifs = firstTenNotifs.rows.filter(
              (notif) =>
                notif.push_id === push.id && notif.has_interacted === false,
            );
            return { ...push, notifications: notifs };
          });

        return res.status(200).json({
          repositories: modifiedRepositoryDataHasNotifs,
          commits: modifiedPushesWithCommitsHasNotifs,
          groupedResults,
          journals: journals.rows,
          tasks: tasks.rows,
          checklist: checklist.rows,
          journalTasks: journalTasks.rows,
          notifications: firstTenNotifs.rows,
        });
      }

      return res.status(404).json({ message: "No repositories found" });

      // const firstTenPushedByNotifs = await journalDb.raw(`SELECT * FROM push WHERE repo_id IN (?) ORDER BY created_at DESC LIMIT 10`, [firstTenNotifs.rows.map((notif) => notif.repo_id)]);
      // console.log("data.rows", data.rows);
      // return res.status(200).json(data.rows);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = journalRouter;
