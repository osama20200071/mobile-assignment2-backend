const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

// it loads the .env file content into the process.env so we can access it
dotenv.config({ path: "config.env" });

const storeRoute = require("./routes/storeRouter");
const userRoute = require("./routes/userRouter");
const globalErrorMiddleware = require("./utils/errorMiddleware");

const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
// connecting to the database
dbConnection();

// setup the server
const app = express();

// our middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use("/stores", storeRoute);
app.use("/users", userRoute);
app.all("*", (req, res, next) => {
  // creating the error through our custom error class
  next(new ApiError(`can't find this route ${req.url}`, 400));
});
// Global error handler middleware for is operational errors (errors we are expected to receive)
app.use(globalErrorMiddleware);
app.listen(3000, (err) => {
  if (!err) {
    console.log("server listening on port 3000");
  }
});
