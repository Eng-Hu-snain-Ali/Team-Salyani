/**
 * Admin Routes — /api/v1/admin
 */
const express = require('express');
const router = express.Router();
const {
  getDashboardStatsHandler,
  getRevenueReportHandler,
  getUsersHandler,
  getUserDetailHandler,
  toggleUserBlockHandler,
  getUstadsHandler,
  getUstadDetailHandler,
  verifyUstadHandler,
  rejectUstadHandler,
  toggleUstadBlockHandler,
  getPendingKycHandler,
  reviewDocumentHandler,
  getBookingsHandler,
  getBookingDetailHandler,
  getReviewsHandler,
  toggleReviewVisibilityHandler,
} = require('./admin.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');

// All admin routes require admin role
router.use(authenticate);
router.use(authorize('admin'));

// ─── Dashboard & Revenue ───────────────────────────────────
router.get('/dashboard/stats', getDashboardStatsHandler);
router.get('/dashboard/revenue', getRevenueReportHandler);

// ─── Customers Management ─────────────────────────────────
router.get('/users', getUsersHandler);
router.get('/users/:id', getUserDetailHandler);
router.patch('/users/:id/block', toggleUserBlockHandler);

// ─── Ustads & KYC Management ──────────────────────────────
router.get('/ustads/pending-kyc', getPendingKycHandler);
router.get('/ustads', getUstadsHandler);
router.get('/ustads/:id', getUstadDetailHandler);
router.patch('/ustads/:id/verify', verifyUstadHandler);
router.patch('/ustads/:id/reject', rejectUstadHandler);
router.patch('/ustads/:id/block', toggleUstadBlockHandler);
router.patch('/documents/:id/review', reviewDocumentHandler);

// ─── Bookings Management ──────────────────────────────────
router.get('/bookings', getBookingsHandler);
router.get('/bookings/:id', getBookingDetailHandler);

// ─── Reviews Management ───────────────────────────────────
router.get('/reviews', getReviewsHandler);
router.patch('/reviews/:id/visibility', toggleReviewVisibilityHandler);

module.exports = router;
