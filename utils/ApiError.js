// @desc this class is all about operational error
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // 400 and so on => failure
    this.status = `{${statusCode}`.startsWith(4) ? "fail" : "error";
    // operational mean that this error are predictable
    this.isOperational = true;
  }
}

module.exports = ApiError;
