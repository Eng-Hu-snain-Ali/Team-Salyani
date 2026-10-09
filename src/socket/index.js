/**
 * Socket.io Handlers — Real-time Chat, Tracking & Notifications
 */
const jwt = require('jsonwebtoken');
const {
  SOCKET_EVENTS,
  socketRoom,
  NOTIFICATION_TYPE,
  ROLES,
} = require('../utils/constants');
const {
  createChatMessage,
  markMessageAsRead,
  getChatRoomById,
} = require('../modules/chat/chat.queries');
const { sendNotification } = require('../modules/notification/notification.service');

const initSocketHandlers = (io) => {
  // ─── Socket Authentication Middleware ─────────────────────────
  io.use((socket, next) => {
    try {
      const authHeader = socket.handshake.headers.authorization;
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error(`Authentication error: ${err.message}`));
    }
  });

  // ─── Socket Connection ────────────────────────────────────────
  io.on('connection', (socket) => {
    const user = socket.user;
    console.log(`🔌 Authenticated socket connected: ${socket.id} (User: ${user?.id}, Role: ${user?.role})`);

    // Automatically join user's private room
    if (user?.id) {
      socket.join(socketRoom.user(user.id));
    }

    if (user?.role === ROLES.ADMIN) {
      socket.join(socketRoom.admin);
    }

    // ═════════════════════════════════════════════════════════════
    //  CHAT EVENTS
    // ═════════════════════════════════════════════════════════════

    // Client joins a chat room
    socket.on(SOCKET_EVENTS.JOIN_CHAT, ({ chat_room_id }) => {
      if (chat_room_id) {
        const roomName = `chat:${chat_room_id}`;
        socket.join(roomName);
        console.log(`User ${user.id} joined ${roomName}`);
      }
    });

    // Client leaves a chat room
    socket.on(SOCKET_EVENTS.LEAVE_CHAT, ({ chat_room_id }) => {
      if (chat_room_id) {
        const roomName = `chat:${chat_room_id}`;
        socket.leave(roomName);
        console.log(`User ${user.id} left ${roomName}`);
      }
    });

    // Client sends message via Socket.io
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data, ack) => {
      try {
        const { chat_room_id, content, message_type = 'text', image_url = null } = data;
        if (!chat_room_id || (!content && !image_url)) {
          if (ack) ack({ success: false, error: 'chat_room_id and content required' });
          return;
        }

        const room = await getChatRoomById(chat_room_id);
        if (!room) {
          if (ack) ack({ success: false, error: 'Chat room not found' });
          return;
        }

        // Check participation
        if (room.user_id !== user.id && room.ustad_id !== user.id) {
          if (ack) ack({ success: false, error: 'Not a member of this chat room' });
          return;
        }

        const message = await createChatMessage({
          chatRoomId: chat_room_id,
          senderId: user.id,
          senderRole: user.role,
          messageType: message_type,
          content,
          imageUrl: image_url,
        });

        const payload = {
          id: message.id,
          chat_room_id,
          sender_id: user.id,
          sender_role: user.role,
          message_type: message.message_type,
          content: message.content,
          image_url: message.image_url,
          created_at: message.created_at,
        };

        // Broadcast to chat room & booking room
        io.to(`chat:${chat_room_id}`).emit(SOCKET_EVENTS.NEW_MESSAGE, payload);
        io.to(`booking:${room.booking_id}`).emit(SOCKET_EVENTS.NEW_MESSAGE, payload);

        // Notify other party
        const recipientId = user.role === ROLES.CUSTOMER ? room.ustad_id : room.user_id;
        const recipientRole = user.role === ROLES.CUSTOMER ? ROLES.USTAD : ROLES.CUSTOMER;

        await sendNotification({
          recipientId,
          recipientRole,
          type: NOTIFICATION_TYPE.NEW_MESSAGE,
          title: 'New Message 💬',
          message: content || 'Sent an image',
          data: { chat_room_id, booking_id: room.booking_id, message_id: message.id },
          io,
        });

        if (ack) ack({ success: true, data: payload });
      } catch (err) {
        console.error('Socket send_message error:', err.message);
        if (ack) ack({ success: false, error: err.message });
      }
    });

    // Client is typing
    socket.on(SOCKET_EVENTS.TYPING, ({ chat_room_id }) => {
      if (chat_room_id) {
        socket.to(`chat:${chat_room_id}`).emit(SOCKET_EVENTS.USER_TYPING, {
          sender_id: user.id,
          sender_role: user.role,
        });
      }
    });

    // Client read a message
    socket.on(SOCKET_EVENTS.MESSAGE_READ, async ({ message_id }) => {
      if (message_id) {
        try {
          await markMessageAsRead(message_id);
        } catch (err) {
          console.error('Socket message_read error:', err.message);
        }
      }
    });

    // ═════════════════════════════════════════════════════════════
    //  LIVE TRACKING EVENTS
    // ═════════════════════════════════════════════════════════════

    // Customer subscribes to ustad live location for a booking
    socket.on(SOCKET_EVENTS.START_TRACKING, ({ booking_id }) => {
      if (booking_id) {
        const roomName = socketRoom.tracking(booking_id);
        socket.join(roomName);
        console.log(`Tracking started for booking ${booking_id} by user ${user.id}`);
      }
    });

    // Customer stops tracking
    socket.on(SOCKET_EVENTS.STOP_TRACKING, ({ booking_id }) => {
      if (booking_id) {
        const roomName = socketRoom.tracking(booking_id);
        socket.leave(roomName);
        console.log(`Tracking stopped for booking ${booking_id} by user ${user.id}`);
      }
    });

    // Ustad emits live coordinates
    socket.on(SOCKET_EVENTS.UPDATE_LOCATION, ({ booking_id, lat, lng }) => {
      if (booking_id && lat && lng) {
        io.to(socketRoom.tracking(booking_id)).emit(SOCKET_EVENTS.LOCATION_UPDATE, {
          ustad_id: user.id,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          timestamp: new Date().toISOString(),
        });
      }
    });

    // ─── Disconnection ──────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
    });
  });
};

module.exports = initSocketHandlers;
