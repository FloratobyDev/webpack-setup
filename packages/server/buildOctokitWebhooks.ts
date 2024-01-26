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
    if (!payload) return;
  
    try {
      const repoExists = await checkIfRepoExists(payload);
      console.log("hasRepo", !!repoExists);
  
      if (!repoExists) {
        await addRepository(payload);
      }
  
      const pushId = await createPush(payload);
      await handleCommitsAndNotifications(payload, pushId);
    } catch (err) {
      console.error("Error handling push:", err);
    }
  }
  
  async function checkIfRepoExists(payload) {
    try {
      const result = await webhookDb.raw(
        `SELECT 1 FROM repositories WHERE repo_id=? AND user_id=? LIMIT 1`,
        [payload.repository.id, payload.repository.owner.id],
      );
      return result && result.rows.length;
    } catch (err) {
      console.error("Failed to check if repo exists", err);
      return false;
    }
  }
  
  async function addRepository(payload) {
    try {
      await webhookDb.raw(
        `INSERT INTO repositories (repo_id, user_id, name) VALUES (?, ?, ?)`,
        [
          payload.repository.id,
          payload.repository.owner.id,
          payload.repository.name,
        ],
      );
      console.log("Added repository");
    } catch (err) {
      console.error("Failed to add repository", err);
      throw err; // rethrow to handle in the main function
    }
  }
  
  async function createPush(payload) {
    try {
      const pushResult = await webhookDb.raw(
        "INSERT INTO push (repo_id) VALUES (?) RETURNING id",
        [payload.repository.id],
      );
      return pushResult.rows[0].id;
    } catch (err) {
      console.error("Failed to create push", err);
      throw err;
    }
  }
  
  async function handleCommitsAndNotifications(payload, pushId) {
    try {
      await insertNotifications(payload, pushId);
      await insertCommits(payload, pushId);
    } catch (err) {
      console.error("Error in handling commits and notifications", err);
    }
  }
  
  async function insertNotifications(payload, pushId) {
    try {
      await webhookDb.raw(
        "INSERT INTO notifications (user_id, push_id, repo_id) VALUES (?, ?, ?)",
        [payload.repository.owner.id, pushId, payload.repository.id],
      );
    } catch (err) {
      console.error("Failed to add notification", err);
    }
  }
  
  async function insertCommits(payload, pushId) {
    const { commits } = payload;
    const commitRows = commits.map((commit) => [commit.id, pushId, commit.message]);
  
    try {
      await webhookDb.raw(
        `INSERT INTO commits (commit_sha, push_id, description) VALUES ${commits
          .map(() => "(?, ?, ?)")
          .join(", ")}`,
        commitRows.flat(),
      );
      console.log("Added commits");
    } catch (err) {
      console.error("Failed to add commits", err);
    }
  }

  octokitApp.webhooks.on("push", handlePush);
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
