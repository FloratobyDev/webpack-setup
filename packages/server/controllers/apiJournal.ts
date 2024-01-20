const journalRouter = require("express").Router();
const journalDb = require("../dbRequest.ts");
const journalJwt = require("jsonwebtoken");

journalRouter.get("/repo", async (req, res) => {
  if (journalJwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)) {
    const { githubId } = journalJwt.decode(req.cookies.accessToken);
    journalDb
      .raw(`SELECT * FROM repositories WHERE user_id=?`, [githubId])
      .then((data) => {
        console.log("data.rows", data.rows);
        return res.status(200).json(data.rows);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
      });
  }
});

module.exports = journalRouter;
