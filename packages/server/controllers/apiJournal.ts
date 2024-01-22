const journalRouter = require("express").Router();
const journalDb = require("../dbRequest.ts");
const journalJwt = require("jsonwebtoken");

journalRouter.get("/repo", async (req, res) => {
  try {
    if (journalJwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)) {
      const { githubId } = journalJwt.decode(req.cookies.accessToken);
      
      const repositoryData = await journalDb.raw(`SELECT * FROM repositories WHERE user_id=?`, [githubId]);
      const repoOne = repositoryData.rows[0];

      const firstTenPushes = await journalDb.raw(`SELECT * FROM push WHERE repo_id=? ORDER BY created_at DESC LIMIT 10`, [repoOne.id]);
      const firstTenNotifs = await journalDb.raw(`SELECT * FROM notifications WHERE user_id=? AND repo_id=? ORDER BY created_at DESC LIMIT 10`, [githubId, repoOne.id]);
      
      // const firstTenPushedByNotifs = await journalDb.raw(`SELECT * FROM push WHERE repo_id IN (?) ORDER BY created_at DESC LIMIT 10`, [firstTenNotifs.rows.map((notif) => notif.repo_id)]);
      // console.log("data.rows", data.rows);
      // return res.status(200).json(data.rows);


    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
 
module.exports = journalRouter;
