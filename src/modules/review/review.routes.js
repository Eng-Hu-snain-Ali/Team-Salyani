/**
 * Review Routes — /api/v1/reviews
 */
const express = require('express');
const router = express.Router();
const {
  createReviewHandler,
  getBookingReviewHandler,
  getUstadReviewsHandler,
} = require('./review.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');

// Public route: get reviews for an ustad
router.get('/ustad/:ustadId', getUstadReviewsHandler);

// Protected routes
router.use(authenticate);

// POST /reviews — Customer reviews completed booking
router.post('/', authorize('customer'), createReviewHandler);

// GET /reviews/booking/:bookingId — Get review for a booking
router.get('/booking/:bookingId', getBookingReviewHandler);

module.exports = router;
