const authRouter = require("express").Router();
const { Octokit } = require("@octokit/rest");

authRouter.get("/authorize", async (req, res) => {
  try {
    const { code } = req.query;
    console.log("code", code);

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
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        response = data;
        console.log("data", data);
      })
      .catch((err) => {
        console.log("err", err);
      });

    console.log("response", response);
    // Initialize Octokit with the access token

    const octokitInstance = new Octokit({
      auth: response.access_token,
    });

    // Fetch user details
    const userResponse = await octokitInstance.request("GET /user");
    console.log("userResponse", userResponse);

    jwt.sign(
      {
        githubId: userResponse.data.id,
        accessToken: response.access_token,
      },
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) {
          console.log("err", err);

          return res.status(500).redirect(`http://localhost:9000/login`);
        }
        return res
          .cookie("accessToken", token, {
            httpOnly: true,
            sampleSite: true,
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
