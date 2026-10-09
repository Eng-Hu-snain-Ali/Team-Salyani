/**
 * Review Controller
 */
const {
  createReview,
  getReviewByBookingId,
  getReviewsByUstadId,
  refreshUstadRatingStats,
} = require('./review.queries');
const { getBookingById } = require('../booking/booking.queries');
const { sendNotification } = require('../notification/notification.service');
const { sendSuccess } = require('../../utils/response');
const { buildPaginationMeta } = require('../../utils/response');
const {
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} = require('../../utils/errors');
const {
  BOOKING_STATUS,
  NOTIFICATION_TYPE,
  ROLES,
  PAGINATION,
} = require('../../utils/constants');

/**
 * POST /reviews
 * Customer submits a review for a completed booking
 */
const createReviewHandler = async (req, res, next) => {
  try {
    const { booking_id, rating, comment } = req.body;

    if (!booking_id) throw new ValidationError('booking_id is required');
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new ValidationError('rating must be an integer between 1 and 5');
    }

    // Check booking
    const booking = await getBookingById(booking_id);
    if (!booking) throw new NotFoundError('Booking not found');

    // Must be the customer who booked it
    if (booking.user_id !== req.user.id) {
      throw new ForbiddenError('You can only review bookings you made');
    }

    // Must be completed or paid
    if (booking.status !== BOOKING_STATUS.COMPLETED && booking.status !== BOOKING_STATUS.PAID) {
      throw new ValidationError(`Cannot review booking in status '${booking.status}'. Must be completed or paid.`);
    }

    if (!booking.ustad_id) {
      throw new ValidationError('Cannot review booking without assigned ustad');
    }

    // Check if review already exists
    const existing = await getReviewByBookingId(booking_id);
    if (existing) {
      throw new ConflictError('A review has already been submitted for this booking');
    }

    // Create review
    const review = await createReview({
      bookingId: booking_id,
      userId: req.user.id,
      ustadId: booking.ustad_id,
      rating,
      comment: comment || null,
    });

    // Refresh ustad's rating and review count
    await refreshUstadRatingStats(booking.ustad_id);

    // Send notification to ustad
    const io = req.app.get('io');
    await sendNotification({
      recipientId: booking.ustad_id,
      recipientRole: ROLES.USTAD,
      type: NOTIFICATION_TYPE.REVIEW_RECEIVED,
      title: 'New Review Received ⭐',
      message: `You received a ${rating}-star review from ${booking.customer_name || 'Customer'}.`,
      data: { booking_id, review_id: review.id, rating },
      io,
    });

    sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reviews/booking/:bookingId
 * Get review for a specific booking
 */
const getBookingReviewHandler = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const review = await getReviewByBookingId(bookingId);
    if (!review) throw new NotFoundError('Review not found for this booking');

    // Access check: customer, ustad, or admin
    if (
      req.user.role !== ROLES.ADMIN &&
      review.user_id !== req.user.id &&
      review.ustad_id !== req.user.id
    ) {
      throw new ForbiddenError('Access denied to this review');
    }

    sendSuccess(res, review, 'Review retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reviews/ustad/:ustadId
 * Public endpoint: get all reviews for an ustad (paginated)
 */
const getUstadReviewsHandler = async (req, res, next) => {
  try {
    const { ustadId } = req.params;
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;

    const { reviews, total } = await getReviewsByUstadId(ustadId, { page, limit });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, reviews, 'Ustad reviews retrieved successfully', 200, meta);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReviewHandler,
  getBookingReviewHandler,
  getUstadReviewsHandler,
};
