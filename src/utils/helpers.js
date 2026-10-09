const { PAGINATION } = require('./constants');

/**
 * Extract and validate pagination params from query string
 * @param {object} query - req.query
 * @returns {{ page: number, limit: number, offset: number }}
 */
const getPaginationParams = (query) => {
  let page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
  let limit = parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Sanitize a search string — trim + escape SQL special chars
 * @param {string} str
 * @returns {string}
 */
const sanitizeSearch = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim().replace(/[%_\\]/g, '\\$&');
};

/**
 * Pick only allowed keys from an object (safe mass-assignment)
 * @param {object} obj - Source object
 * @param {string[]} allowed - Keys to keep
 * @returns {object}
 */
const pick = (obj, allowed) => {
  return allowed.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Remove keys with null or undefined values from an object
 * Useful for building dynamic UPDATE queries
 * @param {object} obj
 * @returns {object}
 */
const removeEmpty = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );
};

/**
 * Format a phone number to E.164 format for Pakistan (+92...)
 * Accepts: 03001234567, +923001234567, 923001234567
 * @param {string} phone
 * @returns {string} formatted phone or original if can't parse
 */
const formatPakistaniPhone = (phone) => {
  if (!phone) return phone;
  const cleaned = phone.replace(/\s|-/g, '');
  if (cleaned.startsWith('+92')) return cleaned;
  if (cleaned.startsWith('92')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+92${cleaned.slice(1)}`;
  return phone;
};

/**
 * Mask a phone number for safe display: +923001234567 → +92300***4567
 * @param {string} phone
 * @returns {string}
 */
const maskPhone = (phone) => {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 6) + '***' + phone.slice(-4);
};

/**
 * Generate a random 6-digit OTP string
 * @returns {string}
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate platform commission and ustad earning from a job price
 * @param {number} totalAmount - Job price in PKR
 * @param {number} commissionPercent - Platform commission % (default from env)
 * @returns {{ commission: number, ustadEarning: number }}
 */
const calculateCommission = (totalAmount, commissionPercent = parseFloat(process.env.PLATFORM_COMMISSION_PERCENT || 10)) => {
  const commission = parseFloat((totalAmount * (commissionPercent / 100)).toFixed(2));
  const ustadEarning = parseFloat((totalAmount - commission).toFixed(2));
  return { commission, ustadEarning };
};

/**
 * Convert a JS Date or ISO string to a readable Pakistan timezone string
 * @param {Date|string} date
 * @returns {string}
 */
const toPKT = (date) => {
  return new Date(date).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
};

module.exports = {
  getPaginationParams,
  sanitizeSearch,
  pick,
  removeEmpty,
  formatPakistaniPhone,
  formatPhone: formatPakistaniPhone,
  maskPhone,
  generateOTP,
  calculateCommission,
  toPKT,
};
