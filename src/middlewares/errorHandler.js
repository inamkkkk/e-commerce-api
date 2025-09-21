const createHttpError = require('http-errors');

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes (in a real app, use a proper logger)
  console.error(err);

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific Mongoose errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  } else if (err.code === 11000) { // Duplicate key error
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value: ${field}. Please use another value.`;
  } else if (err instanceof createHttpError.HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // TODO: Implement more specific error handling for common scenarios like JWT errors,
  // database connection errors, or other application-specific errors.
  // For example:
  // if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
  //   statusCode = 401;
  //   message = 'Authentication error';
  // }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message});
};

module.exports = errorHandler;