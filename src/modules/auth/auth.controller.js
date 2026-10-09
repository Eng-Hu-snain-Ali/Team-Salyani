/**
 * Auth Controller
 * Handles HTTP request/response for all auth endpoints
 */
const { sendOtp, verifyOtp, refreshAccessToken, adminLogin } = require('./auth.service');
const { findUserById, findUstadById, findAdminById } = require('./auth.queries');
const { sendSuccess, sendError } = require('../../utils/response');
const { formatPhone } = require('../../utils/helpers');
const { ValidationError, NotFoundError } = require('../../utils/errors');

// ─── POST /auth/send-otp ──────────────────────────────────
/**
 * Send OTP to phone number
 * Body: { phone, role: 'customer'|'ustad' }
 */
const sendOtpHandler = async (req, res, next) => {
  try {
    const { phone, role } = req.body;

    if (!phone) throw new ValidationError('Phone number is required');
    if (!role) throw new ValidationError('Role is required');

    const formattedPhone = formatPhone(phone);
    const result = await sendOtp({ phone: formattedPhone, role });

    sendSuccess(res, result, 'OTP sent successfully', 200);
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/verify-otp ────────────────────────────────
/**
 * Verify OTP and login or register
 * Body: { phone, otp, role, name? }
 * Returns: { user, accessToken, refreshToken, isNew }
 */
const verifyOtpHandler = async (req, res, next) => {
  try {
    const { phone, otp, role, name } = req.body;

    if (!phone) throw new ValidationError('Phone number is required');
    if (!otp) throw new ValidationError('OTP is required');
    if (!role) throw new ValidationError('Role is required');

    const formattedPhone = formatPhone(phone);
    const result = await verifyOtp({ phone: formattedPhone, otp, role, name });

    const message = result.isNew ? 'Registration successful' : 'Login successful';
    sendSuccess(res, result, message, result.isNew ? 201 : 200);
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/refresh ───────────────────────────────────
/**
 * Refresh access token
 * Body: { refreshToken, role }
 * Returns: { accessToken, refreshToken }
 */
const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken, role } = req.body;

    if (!refreshToken) throw new ValidationError('Refresh token is required');
    if (!role) throw new ValidationError('Role is required');

    const result = await refreshAccessToken({ refreshToken, role });
    sendSuccess(res, result, 'Token refreshed successfully');
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/logout ────────────────────────────────────
/**
 * Logout (client-side token invalidation)
 * Stateless JWT — just confirm logout
 */
const logoutHandler = async (req, res) => {
  // JWT is stateless; client must delete tokens
  // In future, maintain a token blacklist if needed
  sendSuccess(res, null, 'Logged out successfully');
};

// ─── GET /auth/me ─────────────────────────────────────────
/**
 * Get currently authenticated user's profile
 * Fetches fresh data from DB, not just JWT payload
 * Requires: Authorization: Bearer <token>
 */
const getMeHandler = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let profile;

    if (role === 'customer') {
      profile = await findUserById(id);
    } else if (role === 'ustad') {
      profile = await findUstadById(id);
    } else if (role === 'admin') {
      profile = await findAdminById(id);
    }

    if (!profile) throw new NotFoundError('User profile not found');

    // Remove sensitive fields
    const { password_hash, auth_user_id, ...safeProfile } = profile;
    sendSuccess(res, { role, profile: safeProfile }, 'Profile fetched successfully');
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/admin/login ───────────────────────────────
/**
 * Admin email/password login
 * Body: { email, password }
 * Returns: { admin, accessToken, refreshToken }
 */
const adminLoginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new ValidationError('Email is required');
    if (!password) throw new ValidationError('Password is required');

    const result = await adminLogin({ email, password });
    sendSuccess(res, result, 'Admin login successful');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendOtpHandler,
  verifyOtpHandler,
  refreshTokenHandler,
  logoutHandler,
  getMeHandler,
  adminLoginHandler,
};
