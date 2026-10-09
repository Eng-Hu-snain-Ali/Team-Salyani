/**
 * Auth Routes
 * Base path: /api/v1/auth
 */
const express = require('express');
const router = express.Router();
const {
  sendOtpHandler,
  verifyOtpHandler,
  refreshTokenHandler,
  logoutHandler,
  getMeHandler,
  adminLoginHandler,
} = require('./auth.controller');
const { authenticate } = require('../../middleware/authenticate');
const { authLimiter } = require('../../middleware/rateLimiter');

// Apply strict rate limiting to all auth routes
router.use(authLimiter);

// ─── Public Routes (no token needed) ────────────────────

// POST /api/v1/auth/send-otp
// Send OTP to phone number
router.post('/send-otp', sendOtpHandler);

// POST /api/v1/auth/verify-otp
// Verify OTP and login/register
router.post('/verify-otp', verifyOtpHandler);

// POST /api/v1/auth/refresh
// Refresh access token
router.post('/refresh', refreshTokenHandler);

// POST /api/v1/auth/admin/login
// Admin email+password login
router.post('/admin/login', adminLoginHandler);

// ─── Protected Routes (token required) ──────────────────

// POST /api/v1/auth/logout
router.post('/logout', authenticate, logoutHandler);

// GET /api/v1/auth/me
// Get current user's profile
router.get('/me', authenticate, getMeHandler);

module.exports = router;
