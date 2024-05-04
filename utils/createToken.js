const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  return token;
};

module.exports = createToken;
