class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 4xx for client errors, 5xx for server errors
    this.isOperational = true; // This is a custom error, not a system error

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError; // export the class so it can be used elsewhere in the app.
// Example usage: throw new AppError('Invalid email or password', 401); // 401
