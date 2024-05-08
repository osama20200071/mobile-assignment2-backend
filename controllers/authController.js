const userModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const createToken = require("../utils/createToken");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.login = asyncHandler(async (req, res, next) => {
  // 1- validate the password and email
  const { password, email } = req.body;

  // validate the email
  const user = await userModel.findOne({ email: email });

  if (!user) {
    return next(new ApiError("the email or password is incorrect", 404));
  }

  // validate the password
  const isCorrect = password === user.password;

  // console.log(user.password, password, isCorrect);
  if (!isCorrect) {
    return next(new ApiError("the email or password is incorrect", 404));
  }

  // create token
  const token = createToken({ userId: user._id });
  res.status(200).json({ data: user, token });
});

exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // create the user
  // the password is hashed using the mongoose middleware
  const user = await userModel.create({ name, email, password });

  // create the jwt
  const token = createToken({ userId: user._id });
  res.status(201).json({ data: user, token });
});

// =================================================================
// for the authentication process
// =================================================================
// @desc  to make sure that the user is authenticated (is loggedIn )
exports.protect = asyncHandler(async (req, res, next) => {
  // check if there is a token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "null") {
    return next(
      new ApiError(
        "There is no token (You are not loggedIn) , login first",
        401
      )
    );
  }

  // check if the token is valid ( and not expired)
  // this verify will throw error if the token is edited (JsonWebTokenError) or expired (TokenExpiredError)
  const decodedToken = jwt.verify(token, process.env.JWT_KEY);
  const id = decodedToken.userId;

  // check if the user already exists and not deleted for example
  const user = await userModel.findOne({ _id: id });

  if (!user) {
    return next(new ApiError("The user no longer exists", 401));
  }

  // for later usages (for checking the role of The user)
  req.user = user;
  return next();
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    users: users,
  });
});

exports.profile = asyncHandler(async (req, res, next) => {
  // check if the user is already logged in
  const user = req.user;
  res.status(200).json({ data: user });
});
