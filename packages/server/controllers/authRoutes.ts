const authRouter = require("express").Router();
const { Octokit } = require("@octokit/rest");
const authJwt = require("jsonwebtoken");
const authDb = require("../dbRequest.ts");

authRouter.get("/authorize", async (req, res) => {
  try {
    const { code } = req.query;
    // console.log("code", code);

    let response;
    await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      }),
    })
      .then((jsonResponse) => {
        return jsonResponse.json();
      })
      .then((data) => {
        response = data;
        // console.log("data", data);
      })
      .catch((err) => {
        // console.log("err", err);
      });

    // console.log("response", response);
    // Initialize Octokit with the access token

    const octokitInstance = new Octokit({
      auth: response.access_token,
    });

    const userResponse = await octokitInstance.request("GET /user");
    const userName = userResponse.data.login;
    const githubId = userResponse.data.id;

    const userExists = await authDb
      .raw(`SELECT 1 FROM users WHERE github_id = ? LIMIT 1`, [
        userResponse.data.id,
      ])
      .catch((err) => {
        console.log("failed to check if user exists", err);
      });

    if (userExists && !userExists.rows.length) {
      console.log("user does not exist yet");
      await authDb.raw(
        `INSERT INTO users (github_id, username) VALUES (?, ?)`,
        [githubId, userName],
      );
    }

    authJwt.sign(
      {
        githubId: userResponse.data.id,
        accessToken: response.access_token,
      },
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) {
          return res.status(500).redirect(`http://localhost:9000/login`);
        }
        return res
          .cookie("accessToken", token, {
            httpOnly: true,
            sampleSite: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
          })
          .status(200)
          .redirect(`http://localhost:9000/`);
      },
    );
  } catch (err) {
    res.status(500).redirect(`http://localhost:9000/login`);
  }
});

module.exports = authRouter;
