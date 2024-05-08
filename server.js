const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

// it loads the .env file content into the process.env so we can access it
dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");

// requiring the routes
const authRoute = require("./routes/userRouter");
const storeRoute = require("./routes/storeRouter");

// requiring the error classes
const ApiError = require("./utils/ApiError");

// requiring the custom error middleware
const globalErrorMiddleware = require("./middlewares/errorMiddleware");

// connecting to the database
dbConnection();

// express app
const app = express();

// our middlewares
app.use(morgan("dev"));
app.use(express.json());

// our routes
app.use("/users", authRoute);
app.use("/stores", storeRoute);

app.all("*", (req, res, next) => {
  // creating the error through our custom error class
  next(new ApiError(`can't find this route ${req.url}`, 400));
});

// Global error handler middleware for is operational errors (errors we are expected to receive)
app.use(globalErrorMiddleware);

// the server is listening
const server = app.listen(3000, () => {
  console.log("listening on port", 3000);
});

// handling errors (rejections) outside express (dbConnection fail for example)
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection ", err.message);
  // this gives us the ability to handle the currently running req s before exit the process
  server.close(() => {
    console.log("the server is shutting down");
    process.exit(1);
  });
});
