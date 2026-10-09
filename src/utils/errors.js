const { HTTP_STATUS } = require('./constants');

/**
 * Base Application Error
 * All custom errors extend this class
 */
class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Operational errors = safe to send to client
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 — Bad Request / Validation Failed
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR');
    this.details = details; // Array of { field, message }
  }
}

/**
 * 401 — Unauthenticated (no valid token)
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'AUTHENTICATION_ERROR');
  }
}

/**
 * 403 — Forbidden (authenticated but no permission)
 */
class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
  }
}

/**
 * 404 — Resource Not Found
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
  }
}

/**
 * 409 — Conflict (duplicate entry, invalid state transition)
 */
class ConflictError extends AppError {
  constructor(message = 'Resource already exists or is in a conflicting state') {
    super(message, HTTP_STATUS.CONFLICT, 'CONFLICT');
  }
}

/**
 * 429 — Rate Limit Exceeded
 */
class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * 500 — Internal Server Error (unexpected)
 */
class InternalError extends AppError {
  constructor(message = 'Something went wrong on our end.') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
};
