const cors = require("cors");
const db = require("./dbRequest.ts");
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const buildOctokitWebhooks = require("./buildOctokitWebhooks.ts");
const authController = require("./controllers/authRoutes.ts");
const journalController = require("./controllers/journalRoutes.ts");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const http = require("http");
const { App } = require("octokit");
const { createNodeMiddleware } = require("@octokit/webhooks");
const webhookDb = require("./dbRequest.ts");
// const verifyToken = require("./verifyToken.ts");

dotenv.config();

const app = express();
app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.json()); // Use express.json() middleware
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded() middleware

// Serve static files from the React app
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

const pathRewriteMiddleware = (req, res, next) => {
  req.url = req.url.replace(/^\/api/, "");
  // Log the new URL for demonstration purposes
  console.log("Rewritten URL:", req.url);

  // Continue to the next middleware/route handler
  next();
};

if (process.env.NODE_ENV === "production") {
  // Use cors middleware for CORS configuration
  app.use(
    cors({
      origin: "https://git-journal-frontend.onrender.com",
      credentials: true,
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    }),
  );

  app.use(express.static("public"));

  // Continue using the path rewrite middleware if needed
  app.use(pathRewriteMiddleware);
}

// buildOctokitWebhooks();

const validateTokenMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.cookies.accessToken;

  console.log("tokennnn", token, req.cookies);

  if (token == null) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is not valid
    console.log("user jwt", user);
    req.user = user; // Add the user payload to the request
    next(); // Proceed to the next middleware or route handler
  });
};

app.get("/verify", validateTokenMiddleware, async (req, res) => {
  console.log("req.user", req.user);

  try {
    const userInfo = await db.raw(
      "SELECT username FROM users WHERE github_id = ?",
      [req.user.githubId],
    );
    res.json({ user: userInfo.rows[0].username });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

app.post("/user", validateTokenMiddleware, (req, res) => {
  db.raw("SELECT * FROM users");
  res.json({ user: "Michael" });
});

app.get("/users", validateTokenMiddleware, (req, res) => {
  db.raw("SELECT * FROM users")
    .then((data) => {
      console.log(data.rows);
      res.json(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error fetching users" });
    });
});

app.post("/users", validateTokenMiddleware, (req, res) => {
  console.log("req.body", req.body);
  db.raw("SELECT * FROM users")
    .then((data) => {
      console.log(data.rows);
      res.json(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error fetching users" });
    });
});

app.use("/auth", authController);
app.use("/journal", journalController);

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
    const ownerId = payload.repository.owner.id;

    if (!repoExists) {
      await addRepository(payload);
    }

    const pushId = await addPush(payload);
    await handleCommitsAndNotifications(payload, pushId);
  } catch (err) {
    console.error("Error handling push:", err);
  }
}

async function checkIfRepoExists(payload) {
  try {
    const result = await webhookDb.raw(
      `SELECT 1 FROM repositories WHERE id=? AND user_id=? LIMIT 1`,
      [payload.repository.id, payload.repository.owner.id],
    );
    return result.rows[0];
  } catch (err) {
    console.error("Failed to check if repo exists", err);
    return null;
  }
}

async function addRepository(payload) {
  try {
    await webhookDb.raw(
      `INSERT INTO repositories (id, user_id, name, description) VALUES (?, ?, ?, ?)`,
      [
        payload.repository.id,
        payload.repository.owner.id,
        payload.repository.name,
        payload.repository.description,
      ],
    );
    console.log("Added repository");
  } catch (err) {
    console.error("Failed to add repository", err);
    throw err; // rethrow to handle in the main function
  }
}

async function addPush(payload) {
  try {
    const pushResult = await webhookDb.raw(
      "INSERT INTO pushes (repo_id, user_id) VALUES (?, ?) RETURNING id",
      [payload.repository.id, payload.repository.owner.id],
    );
    return pushResult.rows[0].id;
  } catch (err) {
    console.error("Failed to create push", err);
    throw err;
  }
}

async function handleCommitsAndNotifications(payload, pushId) {
  try {
    await addNotifications(payload, pushId);
    await addCommits(payload, pushId);
  } catch (err) {
    console.error("Error in handling commits and notifications", err);
  }
}

async function addNotifications(payload, pushId) {
  try {
    await webhookDb.raw(
      "INSERT INTO notifications (user_id, push_id, repo_id) VALUES (?, ?, ?)",
      [payload.repository.owner.id, pushId, payload.repository.id],
    );
  } catch (err) {
    console.error("Failed to add notification", err);
  }
}

async function addCommits(payload, pushId) {
  const { commits } = payload;

  const commitRows = commits.map((commit) => [
    commit.id,
    pushId,
    payload.repository.owner.id,
    commit.message,
  ]);

  try {
    await webhookDb.raw(
      `INSERT INTO commits (commit_sha, push_id, user_id, description) VALUES ${commits
        .map(() => "(?, ?, ?, ?)")
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

const webhookPath = "/api/webhook";

const middleware = createNodeMiddleware(octokitApp.webhooks, {
  path: webhookPath,
});

app.use(webhookPath, middleware);

// This creates a Node.js server that listens for incoming HTTP requests (including webhook payloads from GitHub) on the specified port. When the server receives a request, it executes the `middleware` function that you defined earlier. Once the server is running, it logs messages to the console to indicate that it is listening.
// http.createServer(middleware).listen(port, () => {
//   console.log(`Server is listening for events at: ${webhookPath}`);
//   console.log("Press Ctrl + C to quit.");
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}!`);
});
