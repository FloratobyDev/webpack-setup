const jwtVer = require("jsonwebtoken");

module.exports = (req, callback) => {
  const token = req.cookies.accessToken;

  jwtVer.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    callback(err, userInfo);
  });
};
