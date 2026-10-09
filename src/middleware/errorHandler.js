const { sendError } = require('../utils/response');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Centralized Error Handler Middleware
 * Must be the LAST middleware registered in app.js
 *
 * Catches all errors passed via next(err) or thrown in async handlers
 */
const errorHandler = (err, req, res, next) => {
  // Log every error (with stack trace in development)
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.error('─── ERROR ───────────────────────────────────');
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.error(err);
    console.error('─────────────────────────────────────────────');
  } else {
    // In production: log minimal info only
    console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);
  }

  // Handle our custom operational errors — safe to send details to client
  if (err instanceof AppError && err.isOperational) {
    return sendError(
      res,
      err.statusCode,
      err.message,
      err.code,
      err.details || null
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token', 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token has expired', 'TOKEN_EXPIRED');
  }

  // Handle multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'File size too large. Maximum 5MB allowed.', 'FILE_TOO_LARGE');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Unexpected file field.', 'UNEXPECTED_FILE');
  }

  // Handle PostgreSQL errors (from Neon)
  if (err.code === '23505') {
    // Unique constraint violation
    return sendError(res, HTTP_STATUS.CONFLICT, 'A record with this value already exists.', 'DUPLICATE_ENTRY');
  }
  if (err.code === '23503') {
    // Foreign key violation
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Related resource not found.', 'FOREIGN_KEY_VIOLATION');
  }
  if (err.code === '22P02') {
    // Invalid UUID or type
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid data format.', 'INVALID_FORMAT');
  }

  // Unknown / unexpected errors — don't leak details in production
  const message = isDev ? err.message : 'Something went wrong on our end.';
  return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message, 'INTERNAL_ERROR');
};

module.exports = errorHandler;
