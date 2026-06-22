const jwt = require("jsonwebtoken");
const { INVALID_AUTHENTICATION } = require("../utils/errors");

const { JWT_SECRET = "dev-secret" } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(INVALID_AUTHENTICATION)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(INVALID_AUTHENTICATION)
      .send({ message: "Authorization required" });
  }

  req.user = payload;
  return next();
};

module.exports = auth;
