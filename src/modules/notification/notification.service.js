/**
 * Notification Service — Helper to persist and emit real-time notifications
 */
const { createNotification } = require('./notification.queries');
const { SOCKET_EVENTS, socketRoom } = require('../../utils/constants');

/**
 * Persist notification and push via Socket.io if available
 */
const sendNotification = async ({
  recipientId,
  recipientRole,
  type,
  title,
  message,
  data = null,
  io = null,
}) => {
  try {
    const notification = await createNotification({
      recipientId,
      recipientRole,
      type,
      title,
      message,
      data,
    });

    if (io) {
      io.to(socketRoom.user(recipientId)).emit(SOCKET_EVENTS.NEW_NOTIFICATION, {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        created_at: notification.created_at,
      });
    }

    return notification;
  } catch (err) {
    console.error('Failed to send notification:', err.message);
    return null;
  }
};

module.exports = { sendNotification };
