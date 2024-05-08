const { validationResult } = require("express-validator");

// to catch the errors if the rules are violated
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // errors caught if the rules are violated
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validatorMiddleware;
