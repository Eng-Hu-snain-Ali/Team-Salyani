/**
 * Auth Service
 * Business logic for authentication
 * Handles JWT generation, OTP flow via Neon Auth, and admin login
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  findUserByPhone, findUserByAuthId, findUserById, createUser,
  findUstadByPhone, findUstadByAuthId, findUstadById, createUstad,
  findAdminByEmail, updateAdminLastLogin,
} = require('./auth.queries');
const { UnauthorizedError, ValidationError, NotFoundError, ConflictError } = require('../../utils/errors');

// ─── JWT Helpers ─────────────────────────────────────────

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
  return { accessToken, refreshToken };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

// ─── Neon Auth OTP Flow ──────────────────────────────────

/**
 * Step 1: Send OTP via Neon Auth
 * Calls Neon Auth endpoint to send OTP to phone
 */
const sendOtp = async ({ phone, role }) => {
  if (!['customer', 'ustad'].includes(role)) {
    throw new ValidationError('Role must be either customer or ustad');
  }

  // Development bypass / fallback
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV OTP] OTP sent to ${phone}: 123456`);
    return { phone, role, message: 'OTP sent successfully' };
  }

  const NEON_AUTH_URL = process.env.NEON_AUTH_URL;
  if (!NEON_AUTH_URL) throw new Error('NEON_AUTH_URL not configured');

  try {
    const response = await fetch(`${NEON_AUTH_URL}/sign-in/phone-number/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new ValidationError(data.message || 'Failed to send OTP');
    }

    return { phone, role, message: 'OTP sent successfully' };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    throw new ValidationError(err.message || 'Failed to send OTP');
  }
};

/**
 * Step 2: Verify OTP and create/login user
 * Verifies OTP with Neon Auth, then creates our app user if new
 */
const verifyOtp = async ({ phone, otp, role, name }) => {
  if (!['customer', 'ustad'].includes(role)) {
    throw new ValidationError('Role must be either customer or ustad');
  }

  let authUserId;

  // Development mode: accept 123456 OTP
  if (process.env.NODE_ENV === 'development' && otp === '123456') {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update('neon_' + phone).digest('hex');
    authUserId = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
  } else {
    const NEON_AUTH_URL = process.env.NEON_AUTH_URL;
    try {
      const response = await fetch(`${NEON_AUTH_URL}/sign-in/phone-number/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, code: otp }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new UnauthorizedError(data.message || 'Invalid OTP');
      }

      authUserId = data.user?.id;
    } catch (err) {
      if (err instanceof UnauthorizedError) throw err;
      throw new UnauthorizedError('OTP verification failed: ' + err.message);
    }
  }

  if (!authUserId) throw new UnauthorizedError('Authentication failed');

  let appUser;
  let isNew = false;

  if (role === 'customer') {
    appUser = await findUserByAuthId(authUserId);
    if (!appUser) {
      if (!name) throw new ValidationError('Name is required for new registration');
      appUser = await createUser({ authUserId, name, phone });
      isNew = true;
    }
  } else {
    // ustad
    appUser = await findUstadByAuthId(authUserId);
    if (!appUser) {
      if (!name) throw new ValidationError('Name is required for new registration');
      appUser = await createUstad({ authUserId, name, phone });
      isNew = true;
    }
  }

  if (!appUser.is_active) {
    throw new UnauthorizedError('Your account has been deactivated. Contact support.');
  }

  const payload = { id: appUser.id, role, authUserId };
  const { accessToken, refreshToken } = generateTokens(payload);

  return {
    isNew,
    user: sanitizeUser(appUser, role),
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async ({ refreshToken, role }) => {
  const decoded = verifyToken(refreshToken);
  if (decoded.type !== 'refresh') throw new UnauthorizedError('Invalid refresh token');

  let appUser;
  if (role === 'customer') {
    appUser = await findUserById(decoded.id);
  } else if (role === 'ustad') {
    appUser = await findUstadById(decoded.id);
  } else {
    throw new UnauthorizedError('Invalid role in token');
  }

  if (!appUser || !appUser.is_active) throw new UnauthorizedError('Account not found or deactivated');

  const payload = { id: appUser.id, role: decoded.role, authUserId: decoded.authUserId };
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);

  return { accessToken, refreshToken: newRefreshToken };
};

// ─── Admin Auth ─────────────────────────────────────────

/**
 * Admin login with email/password
 */
const adminLogin = async ({ email, password }) => {
  const admin = await findAdminByEmail(email);
  if (!admin) throw new UnauthorizedError('Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
  if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

  await updateAdminLastLogin(admin.id);

  const payload = { id: admin.id, role: 'admin', adminRole: admin.role };
  const { accessToken, refreshToken } = generateTokens(payload);

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    accessToken,
    refreshToken,
  };
};

// ─── Helpers ─────────────────────────────────────────────

/**
 * Remove sensitive fields from user/ustad object
 */
const sanitizeUser = (user, role) => {
  const { auth_user_id, ...safe } = user;
  return safe;
};

module.exports = {
  sendOtp,
  verifyOtp,
  refreshAccessToken,
  adminLogin,
  verifyToken,
};
