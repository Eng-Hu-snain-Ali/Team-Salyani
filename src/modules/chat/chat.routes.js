/**
 * Chat Routes — /api/v1/chats
 */
const express = require('express');
const router = express.Router();
const {
  getMyRoomsHandler,
  getRoomMessagesHandler,
  sendMessageHandler,
} = require('./chat.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');
const { uploadSingle } = require('../../middleware/upload');
const { CLOUDINARY_FOLDERS } = require('../../utils/constants');

router.use(authenticate);

// GET /chats/rooms — Get all chat rooms for current user
router.get('/rooms', authorize('customer', 'ustad'), getMyRoomsHandler);

// GET /chats/rooms/:id/messages — Get chat messages (paginated)
router.get('/rooms/:id/messages', authorize('customer', 'ustad', 'admin'), getRoomMessagesHandler);

// POST /chats/rooms/:id/messages — Send a message (with optional image)
router.post(
  '/rooms/:id/messages',
  authorize('customer', 'ustad'),
  ...uploadSingle('image', CLOUDINARY_FOLDERS.BOOKINGS),
  sendMessageHandler
);

module.exports = router;
