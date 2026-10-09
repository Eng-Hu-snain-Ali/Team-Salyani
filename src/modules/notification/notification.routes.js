/**
 * Notification Routes — /api/v1/notifications
 */
const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require('./notification.controller');
const { authenticate } = require('../../middleware/authenticate');

router.use(authenticate);

// GET /notifications — Paginated list
router.get('/', getMyNotifications);

// GET /notifications/unread-count
router.get('/unread-count', getUnreadCount);

// PATCH /notifications/read-all
router.patch('/read-all', markAllAsRead);

// PATCH /notifications/:id/read
router.patch('/:id/read', markAsRead);

module.exports = router;
