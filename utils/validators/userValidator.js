const { check } = require("express-validator");
const userModel = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signupValidator = [
  //  1- setting the rules
  check("name")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("the User name is required"),

  check("email")
    .notEmpty()
    .withMessage("the email is required")
    .custom(async (value) => {
      const user = await userModel.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("the password is required")
    .isLength({ min: 6 })
    .withMessage("the password must be at least 6 characters"),

  //  2- catch the error if there is a violation in the rules
  validatorMiddleware,
];

exports.loginValidator = [
  check("email").notEmpty().withMessage("the email is required"),
  check("password").notEmpty().withMessage("the password is required"),

  //  2- catch the error if there is a violation in the rules
  validatorMiddleware,
];
