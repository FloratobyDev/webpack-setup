const verifyToken = require("../verifyToken.ts");
const { groupBy, map, uniqBy } = require("lodash");
const journalRouter = require("express").Router();
const journalDb = require("../dbRequest.ts");
const journalJwt = require("jsonwebtoken");
const dayjs = require("dayjs");

journalRouter.get("/repositories", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { githubId } = userInfo;
      const repositoryData = await journalDb.raw(
        `SELECT * FROM repositories WHERE user_id=?`,
        [githubId],
      );

      console.log("repositoryData", repositoryData.rows);

      if (repositoryData.rows?.length) {
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

        console.log(
          "modifiedRepositoryDataHasNotifs",
          modifiedRepositoryDataHasNotifs,
        );

        return res.status(200).json(modifiedRepositoryDataHasNotifs);
      }
      console.log("No repositories found");
      return res.status(200).json([]);
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.patch("/user", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return res.status(200).json(userInfo);
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.get("/repositories/:repoId", async (req, res) => {
  console.log("none here");

  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      console.log("hiii");

      const { githubId } = userInfo;
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

      const journals = await journalDb.raw(
        `SELECT j.*, 
         CASE
          WHEN bookmarks.journal_id IS NOT NULL THEN true
          ELSE false
         END AS is_bookmarked
         FROM journals j
         LEFT JOIN bookmarks 
         ON j.id = bookmarks.journal_id 
         WHERE j.user_id=? AND j.repo_id=? 
         ORDER BY created_at 
         DESC LIMIT 10`,
        [githubId, repoId],
      );

      console.log("journals", journals.rows);

      const tasks = await journalDb.raw(
        `SELECT * FROM tasks WHERE user_id=? AND repo_id=?`,
        [githubId, repoId],
      );

      const checklist = await journalDb.raw(
        `SELECT * FROM checklists WHERE user_id=? AND task_id = ANY(?)`,
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

      const bookmarks = await journalDb.raw(
        `SELECT * FROM bookmarks WHERE user_id=? AND repo_id=?`,
        [githubId, repoId],
      );

      const bookmarkIds = bookmarks.rows.map((bookmark) => bookmark.journal_id);

      console.log("bookmarkIds", bookmarkIds);

      const bookmarkedJournals = await journalDb.raw(
        `SELECT * FROM journals WHERE id = ANY(?) AND repo_id=?`,
        [bookmarkIds, repoId],
      );

      const bookmarkedTasks = await journalDb.raw(
        `SELECT * FROM journal_task join tasks ON journal_task.task_id = tasks.id WHERE journal_task.journal_id = ANY(?) AND tasks.repo_id=? AND tasks.user_id=?`,
        [bookmarkIds, repoId, githubId],
      );

      const bookmarkedCommits = await journalDb.raw(
        `SELECT * FROM journal_commit join commits ON journal_commit.commit_sha = commits.commit_sha WHERE journal_commit.journal_id = ANY(?) AND journal_commit.user_id=?`,
        [bookmarkIds, githubId],
      );

      const modifiedBookmarks = bookmarkedJournals.rows.map((journal) => {
        return {
          ...journal,
          tasks: bookmarkedTasks.rows.filter(
            (journalTask) => journalTask.journal_id === journal.id,
          ),
          commits: bookmarkedCommits.rows.filter(
            (journalCommit) => journalCommit.journal_id === journal.id,
          ),
          is_bookmarked: true,
        };
      });

      return res.status(200).json({
        pushes: pushList,
        journals: modifiedJournals,
        tasks: tasksWithChecklist,
        journalTasks: journalTasks.rows,
        notifications: firstTenNotifs.rows,
        bookmarkedJournals: modifiedBookmarks,
      });
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.post("/users", (req, res) => {
  journalDb.raw("SELECT * FROM users")
    .then((data) => {
      console.log(data.rows);
      res.json(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error fetching users" });
    });
});

journalRouter.post("/users", (req, res) => {
  journalDb.raw("SELECT * FROM users")
    .then((data) => {
      console.log(data.rows);
      res.json(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error fetching users" });
    });
});

journalRouter.post("/notifications", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      console.log("req.body", req.body);

      // const notificationIds = req.body.map((notification) =>
      //   Number(notification.id),
      // );
      // await journalDb.raw(
      //   `UPDATE notifications SET has_seen=true WHERE id = ANY(?) RETURNING *`,
      //   [notificationIds],
      // );

      return res.status(200).json({ message: "Notifications updated" });
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.post("/notifications/:id", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { githubId } = userInfo;
      const { id } = req.params;
      const updatedNotification = await journalDb.raw(
        `UPDATE notifications SET has_interacted=true WHERE id=? AND user_id=? RETURNING *`,
        [Number(id), githubId],
      );

      console.log("updateNotification", updatedNotification);

      return res.status(200).json({
        id: updatedNotification.rows[0].id,
        has_interacted: updatedNotification.rows[0].has_interacted,
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.post("/tasks", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      // const { githubId } = journalJwt.decode(req.cookies.accessToken);
      const value = await new Promise((resolve) => {
        setTimeout(() => {
          // return res.status(400).json({ message: "Failed" });
          resolve(null);
        }, 2000);
      });

      console.log("value", value);

      const { githubId } = userInfo;
      const { newTask, rest } = req.body;

      console.log("req.body", req.body);

      const newTaskId = await journalDb.raw(
        `INSERT INTO tasks (title, difficulty, state, user_id, repo_id, due_date) VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
        [
          newTask.title,
          newTask.difficulty,
          newTask.state,
          githubId,
          rest.repo_id,
          newTask.due_date ?? null,
        ],
      );

      // console.log("newTaskId", newTaskId.rows);
      // console.log("newTask.checklists", newTask.checklists);

      const modifiedChecklistWithoutId = newTask.checklists.map((checklist) => {
        return {
          content: checklist.content,
          task_id: newTaskId.rows[0].id,
          user_id: githubId,
          is_done: checklist.is_done,
        };
      });

      if (modifiedChecklistWithoutId.length) {
        const newTaskChecklists = await journalDb("checklists")
          .returning("*")
          .insert(modifiedChecklistWithoutId);
        const newTaskChecklistsWithoutTaskIdAndUserId = newTaskChecklists.map(
          (checklist) => {
            return {
              id: checklist.id,
              content: checklist.content,
              is_done: checklist.is_done,
            };
          },
        );
        return res.status(200).json({
          id: newTaskId.rows[0].id,
          checklists: newTaskChecklistsWithoutTaskIdAndUserId,
        });
      }

      return res.status(200).json({ id: newTaskId.rows[0].id, checklists: [] });
    });
  } catch (err) {
    console.log("err", err);

    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.patch("/tasks/:id", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { githubId } = userInfo;
      const { id } = req.params;
      const { state } = req.body;

      console.log("id", id);

      const updatedTask = await journalDb.raw(
        `UPDATE tasks SET state=? WHERE id=? AND user_id=? RETURNING *`,
        [state, Number(id), githubId],
      );

      return res.status(200).json({
        id: updatedTask.rows[0].id,
        state: updatedTask.rows[0].state,
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.patch("/checklists/:id", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      // const { githubId } = journalJwt.decode(req.cookies.accessToken);
      const { githubId } = userInfo;
      const { id: checklistId } = req.params;
      const { taskId, isDone } = req.body;

      const updatedChecklists = await journalDb.raw(
        `UPDATE checklists SET is_done=? WHERE id=? AND user_id=? AND task_id=? RETURNING *`,
        [isDone, checklistId, githubId, taskId],
      );
      console.log("req.body", req.body, updatedChecklists.rows);

      return res.status(200).json(updatedChecklists.rows[0]);
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.post("/calendar", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { githubId } = userInfo;
      const { date } = req.body;

      const newDate = await journalDb.raw(
        `INSERT INTO calendar (date, user_id) VALUES (?, ?) RETURNING *`,
        [date, githubId],
      );

      console.log("newDate", newDate.rows[0]);

      return res.status(200).json({ message: "Success" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.get("/calendar/:month", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { githubId } = userInfo;

      const dateNow = dayjs();
      const firstDayOfMonth = dayjs(dateNow).startOf("month");
      const lastDayOfMonth = dayjs(dateNow).endOf("month");

      const dates = await journalDb.raw(
        `SELECT * FROM calendar WHERE user_id=? AND date BETWEEN ? AND ?`,
        [githubId, firstDayOfMonth, lastDayOfMonth],
      );

      const Alldates = dates.rows.map((date) => {
        return dayjs(date.date).format("YYYY-MM-DD");
      });
      console.log("dates", Alldates);
      return res.status(200).json(Alldates);
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.post("/journals", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { githubId } = userInfo;
      console.log("userInfo", userInfo);

      const { journal, rest } = req.body;

      const newJournal = await journalDb.raw(
        `INSERT INTO journals (status, content, title, user_id, repo_id) VALUES (?, ?, ?, ?, ?) RETURNING *`,
        [journal.status, journal.content, journal.title, githubId, rest.repoId],
      );

      const newJournalId = newJournal.rows[0].id;

      let newJournalTasks = [];

      if (journal.tasks.length > 0) {
        newJournalTasks = await journalDb("journal_task")
          .returning("*")
          .insert(
            journal.tasks.map((task) => ({
              journal_id: newJournalId,
              task_id: task.id,
            })),
          );
      }

      let newJournalCommits = [];

      if (journal.commits.length > 0) {
        newJournalCommits = await journalDb("journal_commit")
          .returning("*")
          .insert(
            journal.commits.map((commit) => ({
              journal_id: newJournalId,
              commit_sha: commit.commit_sha,
              user_id: githubId,
            })),
          );
      }

      // const newJournalTasksWithTaskTitle = newJournalTasks.map((task) => {
      //   return {
      //     ...task,
      //     title: journal.tasks.find((t) => t.id === task.task_id).title,
      //   };
      // });

      // const newJournalCommitsWithCommitDescription = newJournalCommits.map(
      //   (commit) => {
      //     return {
      //       ...commit,
      //       description: journal.commits.find(
      //         (c) => c.commit_sha === commit.commit_sha,
      //       ).description,
      //     };
      //   },
      // );

      const currentDate = dayjs();
      const lastDatePosted = dayjs(req.cookies.lastJournalPostDate);

      const isSameDay = currentDate.isSame(lastDatePosted, "day");

      if (!isSameDay || !req.cookies.lastJournalPostDate) {
        res.cookie("lastJournalPostDate", dayjs().toISOString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        const newDate = await journalDb.raw(
          `INSERT INTO calendar (date, user_id) VALUES (?, ?) RETURNING *`,
          [currentDate, githubId],
        );
        console.log("newDate", newDate.rows[0]);
      } else {
        console.log("no bookmark created");
      }

      return res.status(200).json({ message: "Success" });
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.post("/bookmarks", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { githubId } = userInfo;
      const { journalId, repoId } = req.body;

      const newBookmark = await journalDb.raw(
        `INSERT INTO bookmarks (journal_id, user_id, repo_id) VALUES (?, ?, ?) RETURNING *`,
        [journalId, githubId, repoId],
      );

      console.log("newBookmark", newBookmark.rows[0]);

      return res.status(200).json({
        newBookmark: newBookmark.rows[0],
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

journalRouter.delete("/bookmarks", async (req, res) => {
  try {
    verifyToken(req, async (err, userInfo) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { githubId } = userInfo;
      const { bookmarkId } = req.query;

      const deletedBookmark = await journalDb.raw(
        `DELETE FROM bookmarks WHERE journal_id=? AND user_id=? RETURNING *`,
        [Number(bookmarkId), githubId],
      );

      console.log("deletedBookmark", deletedBookmark.rows[0]);

      return res.status(200).json({ message: "Success" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

module.exports = journalRouter;
