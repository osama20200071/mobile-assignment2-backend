const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createStoreValidator = [
  //  1- setting the rules
  check("name")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("the Store name is required"),
  // check("location").notEmpty({ ignore_whitespace: true }),
  check("location.lat").notEmpty().withMessage("Latitude is required."),
  check("location.lon").notEmpty().withMessage("Longitude is required."),
  //  2- catch the error if there is a violation in the rules
  validatorMiddleware,
];

exports.getStoreValidator = [
  //  1- setting the rules
  check("storeId").isMongoId().withMessage("invalid Store id"),
  //  2- catch the error if there is a violation in the rules
  validatorMiddleware,
];

exports.deleteStoreValidator = [
  check("storeId").isMongoId().withMessage("invalid Store id"),
  validatorMiddleware,
];

exports.addFavStoreValidator = [
  check("storeId").isMongoId().withMessage("invalid Store id"),
  validatorMiddleware,
];
