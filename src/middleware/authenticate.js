const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');
const { ROLES } = require('../utils/constants');

/**
 * JWT Authentication Middleware
 *
 * Verifies the Bearer token in the Authorization header.
 * On success: attaches decoded user payload to req.user
 * On failure: throws AuthenticationError
 *
 * Usage: router.get('/route', authenticate, controller)
 */
const authenticate = (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided. Please include Authorization: Bearer <token>');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('Token is empty');
    }

    // 2. Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach to request for downstream use
    // decoded shape: { id, role, phone, iat, exp }
    req.user = decoded;

    next();
  } catch (err) {
    // Pass JWT errors to errorHandler (it handles JsonWebTokenError, TokenExpiredError)
    next(err);
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is present, but does NOT block if missing.
 * Use for routes that are public but can have enriched behavior when logged in.
 */
const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
};

/**
 * Role-Based Authorization Factory
 *
 * Returns a middleware that only allows access if req.user.role
 * matches one of the allowed roles.
 *
 * @param {...string} allowedRoles - One or more roles from ROLES constant
 * @returns {function} Express middleware
 *
 * @example
 * router.get('/admin/stats', authenticate, authorize(ROLES.ADMIN), controller);
 * router.post('/bookings', authenticate, authorize(ROLES.CUSTOMER), controller);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      const { ForbiddenError } = require('../utils/errors');
      return next(
        new ForbiddenError(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

module.exports = { authenticate, optionalAuthenticate, authorize };
