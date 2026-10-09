/**
 * Booking Routes — /api/v1/bookings
 */
const express = require('express');
const router = express.Router();
const {
  createBookingHandler,
  listBookings,
  getBooking,
  acceptBookingHandler,
  rejectBookingHandler,
  startBookingHandler,
  completeBookingHandler,
  cancelBookingHandler,
  getStatusHistory,
} = require('./booking.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');
const { uploadBookingPhoto } = require('../../middleware/upload');

// All booking routes need authentication
router.use(authenticate);

// ─── List & Get ───────────────────────────────────────────

// GET /bookings — Customer sees own, Ustad sees assigned
router.get('/', authorize('customer', 'ustad'), listBookings);

// GET /bookings/:id — Single booking detail
router.get('/:id', authorize('customer', 'ustad', 'admin'), getBooking);

// GET /bookings/:id/status-history
router.get('/:id/status-history', authorize('customer', 'ustad', 'admin'), getStatusHistory);

// ─── Create ───────────────────────────────────────────────

// POST /bookings — Customer creates booking (with optional problem image)
router.post(
  '/',
  authorize('customer'),
  ...uploadBookingPhoto,
  createBookingHandler
);

// ─── Ustad Actions ────────────────────────────────────────

// PATCH /bookings/:id/accept
router.patch('/:id/accept', authorize('ustad'), acceptBookingHandler);

// PATCH /bookings/:id/reject
router.patch('/:id/reject', authorize('ustad'), rejectBookingHandler);

// PATCH /bookings/:id/start
router.patch('/:id/start', authorize('ustad'), startBookingHandler);

// PATCH /bookings/:id/complete
router.patch('/:id/complete', authorize('ustad'), completeBookingHandler);

// ─── Shared Actions ───────────────────────────────────────

// PATCH /bookings/:id/cancel — Customer or Ustad can cancel
router.patch('/:id/cancel', authorize('customer', 'ustad'), cancelBookingHandler);

module.exports = router;
