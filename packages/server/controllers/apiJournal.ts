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
        const repoIds = repositoryData.rows.map((repo) => Number(repo.id));

        const notifications = await journalDb.raw(
          `SELECT id, repo_id FROM notifications WHERE repo_id=ANY(?) AND user_id=? AND has_seen=false ORDER BY created_at DESC LIMIT 10`,
          [repoIds, githubId],
        );

        const groupByRepoId = groupBy(notifications.rows, "repo_id");

        const modifiedRepositoryDataHasNotifs = repositoryData.rows.map(
          (repo) => {
            return {
              ...repo,
              hasAlerts: groupByRepoId[repo.id]?.length > 0,
              notifications: notifications.rows,
            };
          },
        );

        return res.status(200).json(modifiedRepositoryDataHasNotifs);
      }

      return res.status(404).json({ message: "No repositories found" });
    }
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.patch("/repo/notifications", async (req, res) => {
  try {
    if (journalJwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)) {
      // const { githubId } = journalJwt.decode(req.cookies.accessToken);
      const githubId = 1;
      // const { notificationInfo } = req.body;
      console.log("req.body", req.body);

      const notificationIds = req.body.map((notification) =>
        Number(notification.id),
      );

      const repoId = req.body[0].repo_id;

      await journalDb.raw(
        `UPDATE notifications SET has_seen=true WHERE id = ANY(?) AND user_id=? AND repo_id=?`,
        [notificationIds, githubId, repoId],
      );

      // console.log("updatedNotifications", updatedNotifications.rows);

      return res.status(200).json({ message: "Notifications updated" });
    }
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.get("/repo/:repoId", async (req, res) => {
  try {
    if (journalJwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)) {
      // const { githubId } = journalJwt.decode(req.cookies.accessToken);
      const githubId = 1;
      const { repoId } = req.params;

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
          pushes p
      LEFT JOIN commits c ON p.id = c.push_id
      LEFT JOIN notifications n ON p.id = n.push_id
      WHERE 
          p.repo_id = ? AND p.user_id = ?
      ORDER BY 
          p.created_at DESC
      LIMIT 10;`,
        [repoId, githubId],
      );

      const pushList = map(
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

      console.log("rawPush", firstTenPushesWithNotif.rows);
      console.log("pushList", pushList);

      const journals = await journalDb.raw(
        `SELECT * FROM journals WHERE user_id=? AND repo_id=? ORDER BY created_at DESC LIMIT 10`,
        [githubId, repoId],
      );

      const tasks = await journalDb.raw(
        `SELECT * FROM tasks WHERE user_id=? AND repo_id=?`,
        [githubId, repoId],
      );

      const checklist = await journalDb.raw(
        `SELECT * FROM checklist WHERE user_id=? AND task_id = ANY(?)`,
        [githubId, tasks.rows.map((task) => task.id)],
      );

      const journalIds = journals.rows.map((journal) => Number(journal.id));

      const journalTasks = await journalDb.raw(
        `SELECT * FROM journal_task join tasks ON journal_task.task_id = tasks.id WHERE journal_task.journal_id = ANY(?) AND tasks.repo_id=? AND tasks.user_id=?`,
        [journalIds, repoId, githubId],
      );

      const journalCommits = await journalDb.raw(
        `SELECT * FROM journal_commit join commits ON journal_commit.commit_sha = commits.commit_sha WHERE journal_commit.journal_id = ANY(?) AND journal_commit.user_id=?`,
        [journalIds, githubId],
      );

      const modifiedJournals = journals.rows.map((journal) => {
        return {
          ...journal,
          tasks: journalTasks.rows.filter(
            (journalTask) => journalTask.journal_id === journal.id,
          ),
          commits: journalCommits.rows.filter(
            (journalCommit) => journalCommit.journal_id === journal.id,
          ),
        };
      });

      console.log("modifiedJournals", modifiedJournals);

      const firstTenNotifs = await journalDb.raw(
        `SELECT * FROM notifications WHERE user_id=? AND repo_id=? ORDER BY created_at DESC LIMIT 10`,
        [githubId, repoId],
      );

      const tasksWithChecklist = tasks.rows.map((task) => {
        return {
          ...task,
          checklists: checklist.rows.filter(
            (checklistItem) => checklistItem.task_id === task.id,
          ),
        };
      });

      return res.status(200).json({
        pushes: pushList,
        journals: modifiedJournals,
        tasks: tasksWithChecklist,
        journalTasks: journalTasks.rows,
        notifications: firstTenNotifs.rows,
      });
    }
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

module.exports = journalRouter;
