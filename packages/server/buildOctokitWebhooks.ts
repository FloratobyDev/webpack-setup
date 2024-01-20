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
      console.log("payload", payload);
      console.log("commits", payload.commits);

      const repoExists = await webhookDb
        .raw(`SELECT 1 FROM repositories WHERE user_id=? AND name=? LIMIT 1`, [
          payload.repository.owner.id,
          payload.repository.name,
        ])
        .catch((err) => {
          console.log("failed to check if repo exists", err);
        });

      console.log("repo", repoExists);

      if (repoExists && !repoExists.rows.length) {
        webhookDb
          .raw(`INSERT INTO repositories (user_id, name) VALUES (?, ?)`, [
            payload.repository.owner.id,
            payload.repository.name,
          ])
          .then(() => {
            console.log("added repository");
          })
          .catch((err) => {
            console.log("failed to add repository", err);
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
