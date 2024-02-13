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
const lusca = require("lusca");
const session = require("express-session");
// const verifyToken = require("./verifyToken.ts");

dotenv.config({
  path: ".env.local",
});

const app = express();
buildOctokitWebhooks(app);

console.log('process.env.NODE_ENV', process.env.CLIENT_NAME);

app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.json()); // Use express.json() middleware
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded() middleware
app.use(session({
  secret: "secretIsNotOut123",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(
  lusca({
    csrf: false, // Enable CSRF
    // csp: {
    //   /* Content Security Policy settings */
    // },
    xframe: "SAMEORIGIN",
    p3p: "ABCDEF",
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: "same-origin",
  }),
);

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
      origin: process.env.CLIENT_NAME,
      credentials: true,
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    }),
  );

  app.use(express.static("public"));

}

app.use(pathRewriteMiddleware);

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

app.use("/auth", authController);
app.use("/journal", journalController);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}!`);
});
