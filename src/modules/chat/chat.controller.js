/**
 * Chat Controller
 */
const {
  getChatRoomById,
  getChatRoomsForUser,
  createChatMessage,
  getChatMessagesByRoomId,
  markRoomMessagesAsRead,
} = require('./chat.queries');
const { sendNotification } = require('../notification/notification.service');
const { sendSuccess } = require('../../utils/response');
const { buildPaginationMeta } = require('../../utils/response');
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} = require('../../utils/errors');
const {
  SOCKET_EVENTS,
  NOTIFICATION_TYPE,
  MESSAGE_TYPE,
  ROLES,
  PAGINATION,
} = require('../../utils/constants');

/**
 * GET /chats/rooms
 * List all chat rooms for current user
 */
const getMyRoomsHandler = async (req, res, next) => {
  try {
    const rooms = await getChatRoomsForUser(req.user.id, req.user.role);
    sendSuccess(res, rooms, 'Chat rooms retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /chats/rooms/:id/messages
 * Get paginated messages for a chat room
 */
const getRoomMessagesHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await getChatRoomById(id);
    if (!room) throw new NotFoundError('Chat room not found');

    // Access check: user must be participant in room (or admin)
    if (
      req.user.role !== ROLES.ADMIN &&
      room.user_id !== req.user.id &&
      room.ustad_id !== req.user.id
    ) {
      throw new ForbiddenError('Access denied to this chat room');
    }

    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;

    const { messages, total } = await getChatMessagesByRoomId(id, { page, limit });

    // Mark messages as read for this user
    await markRoomMessagesAsRead(id, req.user.id);

    const meta = buildPaginationMeta(page, limit, total);
    sendSuccess(res, messages, 'Chat messages retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /chats/rooms/:id/messages
 * Send message via REST fallback
 */
const sendMessageHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, message_type = MESSAGE_TYPE.TEXT } = req.body;

    const room = await getChatRoomById(id);
    if (!room) throw new NotFoundError('Chat room not found');

    // Access check
    if (room.user_id !== req.user.id && room.ustad_id !== req.user.id) {
      throw new ForbiddenError('You are not a participant in this chat room');
    }

    const imageUrl = req.uploadedFile ? req.uploadedFile.url : null;
    const msgType = imageUrl ? MESSAGE_TYPE.IMAGE : message_type;

    if (!content && !imageUrl) {
      throw new ValidationError('Message content or image is required');
    }

    const message = await createChatMessage({
      chatRoomId: id,
      senderId: req.user.id,
      senderRole: req.user.role,
      messageType: msgType,
      content: content || null,
      imageUrl,
    });

    // Identify recipient
    const recipientId = req.user.role === ROLES.CUSTOMER ? room.ustad_id : room.user_id;
    const recipientRole = req.user.role === ROLES.CUSTOMER ? ROLES.USTAD : ROLES.CUSTOMER;

    // Emit real-time socket events
    const io = req.app.get('io');
    if (io) {
      const payload = {
        id: message.id,
        chat_room_id: id,
        sender_id: req.user.id,
        sender_role: req.user.role,
        message_type: message.message_type,
        content: message.content,
        image_url: message.image_url,
        created_at: message.created_at,
      };
      io.to(`chat:${id}`).emit(SOCKET_EVENTS.NEW_MESSAGE, payload);
      io.to(`booking:${room.booking_id}`).emit(SOCKET_EVENTS.NEW_MESSAGE, payload);
    }

    // Send push notification
    await sendNotification({
      recipientId,
      recipientRole,
      type: NOTIFICATION_TYPE.NEW_MESSAGE,
      title: 'New Message 💬',
      message: content || 'Sent an image',
      data: { chat_room_id: id, booking_id: room.booking_id, message_id: message.id },
      io,
    });

    sendSuccess(res, message, 'Message sent successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyRoomsHandler,
  getRoomMessagesHandler,
  sendMessageHandler,
};
