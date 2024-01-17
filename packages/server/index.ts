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

app.get("/api/hello", (req, res) => {
  db.raw("SELECT * FROM users")
    .then((data) => {
      console.log(data.rows);
      res.json(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error fetching users" });
    });

  // res.json({ message: "Hello from server!" });
});

app.get("/user", (req, res) => {
  res.json({ user: "Michael" });
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "index.html"));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
