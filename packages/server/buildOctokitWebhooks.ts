const http = require("http");
const { App } = require("octokit");
const { createNodeMiddleware } = require("@octokit/webhooks");
const webhookDb = require("./dbRequest.ts");

module.exports = function buildOctokitWebhooks() {
  // This creates a new instance of the Octokit App class.
  const octokitApp = new App({
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    webhooks: {
      secret: process.env.WEBHOOK_SECRET,
    },
  });

  async function handlePush({ octokit, payload }) {
    if (payload) {
      const repoExists = await webhookDb
        .raw(
          `SELECT 1 FROM repositories WHERE repo_id=? AND user_id=? LIMIT 1`,
          [payload.repository.id, payload.repository.owner.id]
        )
        .catch((err) => {
          console.log("failed to check if repo exists", err);
        });

      const hasRepo = repoExists && repoExists.rows.length;

      console.log("hasRepo", hasRepo, repoExists);

      if (!hasRepo) {
        webhookDb
          .raw(
            `INSERT INTO repositories (repo_id, user_id, name) VALUES (?, ?, ?)`,
            [
              payload.repository.id,
              payload.repository.owner.id,
              payload.repository.name,
            ]
          )
          .then(() => {
            console.log("added repository");
            webhookDb
              .raw("INSERT INTO push (repo_id) VALUES (?) RETURNING id", [
                payload.repository.id,
              ])
              .then((pushId) => {
                const { commits } = payload;
                const commitRows = commits.map((commit) => {
                  return [commit.id, pushId.rows[0].id, commit.message];
                });
                webhookDb
                  .raw(
                    "INSERT INTO notifications (user_id, push_id, repo_id) VALUES (?, ?, ?)",
                    [
                      payload.repository.owner.id,
                      pushId.rows[0].id,
                      payload.repository.id,
                    ]
                  )
                  .catch((err) => {
                    console.log("failed to add notification", err);
                  });

                webhookDb
                  .raw(
                    `INSERT INTO commits (commit_sha, push_id, description) VALUES ${commits
                      .map(() => "(?, ?, ?)")
                      .join(", ")}`,
                    commitRows.flat()
                  )
                  .then(() => {
                    console.log("added commits");
                  })
                  .catch((err) => {
                    console.log("failed to add commits", err);
                  });
              })
              .catch((err) => {
                console.log("failed to create push", err);
              });
          })
          .catch((err) => {
            console.log("failed to add repository", err);
          });
      } else {
        webhookDb
          .raw("INSERT INTO push (repo_id) VALUES (?) RETURNING id", [
            payload.repository.id,
          ])
          .then((pushId) => {
            const { commits } = payload;
            const commitRows = commits.map((commit) => {
              return [commit.id, pushId.rows[0].id, commit.message];
            });
            webhookDb
              .raw(
                "INSERT INTO notifications (user_id, push_id, repo_id) VALUES (?, ?, ?)",
                [
                  payload.repository.owner.id,
                  pushId.rows[0].id,
                  payload.repository.id,
                ]
              )
              .catch((err) => {
                console.log("failed to add notification", err);
              });

            webhookDb
              .raw(
                `INSERT INTO commits (commit_sha, push_id, description) VALUES ${commits
                  .map(() => "(?, ?, ?)")
                  .join(", ")}`,
                commitRows.flat()
              )
              .then(() => {
                console.log("added commits");
              })
              .catch((err) => {
                console.log("failed to add commits", err);
              });
          })
          .catch((err) => {
            console.log("failed to create push", err);
          });
      }
    }
  }

  // octokitApp.webhooks.on("pull_request", handlePush);
  octokitApp.webhooks.on("push", handlePush);
  // octokitApp.webhooks.on("repository", handlePush);
  // octokitApp.webhooks.on("fork", handlePush);

  octokitApp.webhooks.onError((error) => {
    console.log("error");
    if (error.name === "AggregateError") {
      console.error(`Error processing request: ${error.event}`);
    } else {
      console.error(error);
    }
  });

  const port = 3000;
  const host = "localhost";
  const webhookPath = "/api/webhook";
  const localWebhookUrl = `http://${host}:${port}${webhookPath}`;

  const middleware = createNodeMiddleware(octokitApp.webhooks, {
    path: webhookPath,
  });

  // This creates a Node.js server that listens for incoming HTTP requests (including webhook payloads from GitHub) on the specified port. When the server receives a request, it executes the `middleware` function that you defined earlier. Once the server is running, it logs messages to the console to indicate that it is listening.
  http.createServer(middleware).listen(port, () => {
    console.log(`Server is listening for events at: ${localWebhookUrl}`);
    console.log("Press Ctrl + C to quit.");
  });
};
