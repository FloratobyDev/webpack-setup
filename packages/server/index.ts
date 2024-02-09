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

if (process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: "https://git-journal-frontend.onrender.com",
    credentials: true,
  }));
  app.use(express.static("public"));
  
  const pathRewriteMiddleware = (req, res, next) => {
    // Example of rewriting: replace "/api" with "/new-api" in the path
    req.url = req.url.replace(/^\/api/, "");

    // Log the new URL for demonstration purposes
    console.log("Rewritten URL:", req.url);

    // Continue to the next middleware/route handler
    next();
  };

  // Use the path rewrite middleware globally
  app.use(pathRewriteMiddleware);
}

buildOctokitWebhooks();

const validateTokenMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.cookies.accessToken;

  if (token == null) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is not valid
    // console.log("user", user);
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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}!`);
});
