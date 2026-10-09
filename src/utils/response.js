const { HTTP_STATUS } = require('./constants');

/**
 * Send a standardized success response
 *
 * @param {object} res        - Express response object
 * @param {any}    data       - Payload to send (null to omit)
 * @param {string} message    - Human-readable success message
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {object} meta       - Optional pagination metadata
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 *
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable error message
 * @param {string} code - Machine-readable error code
 * @param {Array}  details - Optional validation error details
 */
const sendError = (res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'An error occurred', code = 'INTERNAL_ERROR', details = null) => {
  const response = {
    success: false,
    message,
    error: { code },
  };

  if (details !== null) response.error.details = details;

  return res.status(statusCode).json(response);
};

/**
 * Build pagination meta object for list responses
 *
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} total - Total count of items
 */
const buildPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: Number(page),
    limit: Number(limit),
    total: Number(total),
    total_pages: totalPages,
    has_next: Number(page) < totalPages,
    has_prev: Number(page) > 1,
  };
};

module.exports = { sendSuccess, sendError, buildPaginationMeta };
