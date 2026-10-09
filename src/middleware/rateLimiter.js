const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * General API rate limiter
 * Applied globally to all routes
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Max requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Too many requests from this IP. Please try again after 15 minutes.',
      'RATE_LIMIT_EXCEEDED'
    );
  },
});

/**
 * Strict rate limiter for auth endpoints (OTP requests)
 * Prevents OTP abuse and brute force attacks
 * Max 10 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Too many authentication attempts. Please wait 15 minutes before trying again.',
      'AUTH_RATE_LIMIT'
    );
  },
});

/**
 * Upload rate limiter
 * Max 20 uploads per hour per IP
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Upload limit reached. Maximum 20 uploads per hour.',
      'UPLOAD_RATE_LIMIT'
    );
  },
});

module.exports = { generalLimiter, authLimiter, uploadLimiter };
