const path = require("path");
const cors = require("cors");
const db = require("./dbRequest.ts");
const dotenv = require("dotenv");
const express = require("express");
// const path = require("path");

dotenv.config();

// console.log("db", hello());

const app = express();
// Serve static files from the React app
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("public"));
}

app.get("/verify", (req, res) => {
  res.json({ user: "Michael Musrhush" });
});

app.get("/user", (req, res) => {
  db.raw("SELECT * FROM users");
  res.json({ user: "Michael" });
});

app.get("/users", (req, res) => {
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

app.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const clientID = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientID,
          client_secret: clientSecret,
          code,
        }),
      },
    );

    const data = await response.json();

    // Initialize Octokit with the access token
    const octokit = new Octokit({
      auth: data.access_token,
    });

    // Fetch user details
    const userResponse = await octokit.request("GET /user");
    req.session.user = {
      accessToken: data.access_token,
      githubId: userResponse.data.id,
    };

    res.redirect(`http://localhost:5173/authorize`);
  } catch (err) {
    res.status(500).redirect(`http://localhost:5173/`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
