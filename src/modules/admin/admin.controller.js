/**
 * Admin Controller
 */
const {
  getPlatformStats,
  getRevenueReport,
  getAdminUsers,
  getAdminUserById,
  updateUserActiveStatus,
  getAdminUstads,
  getAdminUstadById,
  updateUstadVerificationStatus,
  updateUstadActiveStatus,
  getPendingKycUstadsList,
  reviewDocumentStatus,
  getAdminBookings,
  getAdminBookingById,
  getAdminReviews,
  updateReviewVisibility,
} = require('./admin.queries');
const { refreshUstadRatingStats } = require('../review/review.queries');
const { sendNotification } = require('../notification/notification.service');
const { sendSuccess } = require('../../utils/response');
const { buildPaginationMeta } = require('../../utils/response');
const {
  ValidationError,
  NotFoundError,
} = require('../../utils/errors');
const {
  NOTIFICATION_TYPE,
  VERIFICATION_STATUS,
  DOCUMENT_STATUS,
  ROLES,
  PAGINATION,
} = require('../../utils/constants');

/**
 * GET /admin/dashboard/stats
 */
const getDashboardStatsHandler = async (req, res, next) => {
  try {
    const stats = await getPlatformStats();
    sendSuccess(res, stats, 'Platform statistics retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/dashboard/revenue
 */
const getRevenueReportHandler = async (req, res, next) => {
  try {
    const { period = 'daily' } = req.query;
    const report = await getRevenueReport(period);
    sendSuccess(res, report, 'Revenue report retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/users
 */
const getUsersHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const { search, is_active } = req.query;

    const { users, total } = await getAdminUsers({ page, limit, search, isActive: is_active });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, users, 'Customers retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/users/:id
 */
const getUserDetailHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getAdminUserById(id);
    if (!user) throw new NotFoundError('Customer not found');

    sendSuccess(res, user, 'Customer details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/users/:id/block
 */
const toggleUserBlockHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      throw new ValidationError('is_active boolean field is required');
    }

    const updated = await updateUserActiveStatus(id, Boolean(is_active));
    if (!updated) throw new NotFoundError('Customer not found');

    const statusMsg = updated.is_active ? 'unblocked' : 'blocked';
    sendSuccess(res, updated, `Customer account successfully ${statusMsg}`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/ustads
 */
const getUstadsHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const { search, verification_status, is_active } = req.query;

    const { ustads, total } = await getAdminUstads({
      page,
      limit,
      search,
      verificationStatus: verification_status,
      isActive: is_active,
    });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, ustads, 'Ustads retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/ustads/:id
 */
const getUstadDetailHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ustad = await getAdminUstadById(id);
    if (!ustad) throw new NotFoundError('Ustad not found');

    sendSuccess(res, ustad, 'Ustad details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/ustads/:id/verify
 */
const verifyUstadHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateUstadVerificationStatus(id, VERIFICATION_STATUS.VERIFIED);
    if (!updated) throw new NotFoundError('Ustad not found');

    // Notify ustad
    const io = req.app.get('io');
    await sendNotification({
      recipientId: id,
      recipientRole: ROLES.USTAD,
      type: NOTIFICATION_TYPE.KYC_APPROVED,
      title: 'Profile Verified! 🎉',
      message: 'Congratulations! Your ustad profile has been verified. You can now accept booking requests.',
      io,
    });

    sendSuccess(res, {
      ustad_id: updated.id,
      name: updated.name,
      verification_status: updated.verification_status,
      verified_at: new Date().toISOString(),
    }, 'Ustad verified successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/ustads/:id/reject
 */
const rejectUstadHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;

    const updated = await updateUstadVerificationStatus(id, VERIFICATION_STATUS.REJECTED);
    if (!updated) throw new NotFoundError('Ustad not found');

    // Notify ustad
    const io = req.app.get('io');
    await sendNotification({
      recipientId: id,
      recipientRole: ROLES.USTAD,
      type: NOTIFICATION_TYPE.KYC_REJECTED,
      title: 'Verification Rejected',
      message: rejection_reason
        ? `Your profile verification was rejected: ${rejection_reason}`
        : 'Your profile verification was rejected. Please review and re-upload valid documents.',
      data: { rejection_reason },
      io,
    });

    sendSuccess(res, updated, 'Ustad verification rejected');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/ustads/:id/block
 */
const toggleUstadBlockHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      throw new ValidationError('is_active boolean field is required');
    }

    const updated = await updateUstadActiveStatus(id, Boolean(is_active));
    if (!updated) throw new NotFoundError('Ustad not found');

    const statusMsg = updated.is_active ? 'unblocked' : 'blocked';
    sendSuccess(res, updated, `Ustad account successfully ${statusMsg}`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/ustads/pending-kyc
 */
const getPendingKycHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;

    const { ustads, total } = await getPendingKycUstadsList({ page, limit });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, ustads, 'Pending KYC ustads retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/documents/:id/review
 */
const reviewDocumentHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    if (!status || ![DOCUMENT_STATUS.APPROVED, DOCUMENT_STATUS.REJECTED].includes(status)) {
      throw new ValidationError('status must be either "approved" or "rejected"');
    }

    const updated = await reviewDocumentStatus(id, {
      status,
      rejectionReason: rejection_reason || null,
    });
    if (!updated) throw new NotFoundError('Document not found');

    sendSuccess(res, updated, `Document ${status} successfully`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/bookings
 */
const getBookingsHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const { status, search } = req.query;

    const { bookings, total } = await getAdminBookings({ page, limit, status, search });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, bookings, 'Bookings retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/bookings/:id
 */
const getBookingDetailHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getAdminBookingById(id);
    if (!booking) throw new NotFoundError('Booking not found');

    sendSuccess(res, booking, 'Booking details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/reviews
 */
const getReviewsHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const { ustad_id } = req.query;

    const { reviews, total } = await getAdminReviews({ page, limit, ustadId: ustad_id });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, reviews, 'Reviews retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/reviews/:id/visibility
 */
const toggleReviewVisibilityHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_visible } = req.body;

    if (is_visible === undefined) {
      throw new ValidationError('is_visible boolean field is required');
    }

    const updated = await updateReviewVisibility(id, Boolean(is_visible));
    if (!updated) throw new NotFoundError('Review not found');

    // Recalculate ustad stats
    await refreshUstadRatingStats(updated.ustad_id);

    sendSuccess(res, updated, 'Review visibility updated');
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
