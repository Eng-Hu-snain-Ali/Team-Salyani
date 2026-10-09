/**
 * Notification Controller
 */
const {
  getNotificationsByRecipient,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require('./notification.queries');
const { sendSuccess } = require('../../utils/response');
const { buildPaginationMeta } = require('../../utils/response');
const { NotFoundError } = require('../../utils/errors');
const { PAGINATION } = require('../../utils/constants');

/**
 * GET /notifications
 * Get paginated notifications for current authenticated user
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;

    const { notifications, total } = await getNotificationsByRecipient(req.user.id, { page, limit });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, notifications, 'Notifications retrieved successfully', 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /notifications/unread-count
 * Get count of unread notifications
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await getUnreadNotificationCount(req.user.id);
    sendSuccess(res, { unread_count: count }, 'Unread count retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /notifications/:id/read
 * Mark a single notification as read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await markNotificationAsRead(id, req.user.id);
    if (!updated) {
      throw new NotFoundError('Notification not found or access denied');
    }

    sendSuccess(res, updated, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /notifications/read-all
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const updatedCount = await markAllNotificationsAsRead(req.user.id);
    sendSuccess(res, { updated_count: updatedCount }, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
