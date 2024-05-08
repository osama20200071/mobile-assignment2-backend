const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    Status: err.status,
    Message: err.message,
    Stack: err.stack,
  });
};

module.exports = globalErrorMiddleware;
