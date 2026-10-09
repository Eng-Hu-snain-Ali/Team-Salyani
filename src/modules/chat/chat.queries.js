/**
 * Chat Queries — Raw SQL queries for chat rooms & messages
 */
const { query } = require('../../config/database');

/**
 * Get chat room by ID
 */
const getChatRoomById = async (id) => {
  const sql = `
    SELECT
      cr.*,
      u.name AS customer_name,
      u.profile_image_url AS customer_profile_image,
      ust.name AS ustad_name,
      ust.profile_image_url AS ustad_profile_image,
      b.status AS booking_status
    FROM chat_rooms cr
    JOIN users u ON u.id = cr.user_id
    JOIN ustads ust ON ust.id = cr.ustad_id
    JOIN bookings b ON b.id = cr.booking_id
    WHERE cr.id = $1;
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
};

/**
 * Get chat room by booking ID
 */
const getChatRoomByBookingId = async (bookingId) => {
  const sql = `
    SELECT *
    FROM chat_rooms
    WHERE booking_id = $1;
  `;
  const rows = await query(sql, [bookingId]);
  return rows[0] || null;
};

/**
 * Create chat room
 */
const createChatRoom = async ({ bookingId, userId, ustadId }) => {
  const sql = `
    INSERT INTO chat_rooms (booking_id, user_id, ustad_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (booking_id) DO UPDATE SET is_active = true
    RETURNING *;
  `;
  const rows = await query(sql, [bookingId, userId, ustadId]);
  return rows[0];
};

/**
 * Get all chat rooms for a user (customer or ustad)
 */
const getChatRoomsForUser = async (userId, role) => {
  const isCustomer = role === 'customer';
  const filterCol = isCustomer ? 'cr.user_id' : 'cr.ustad_id';

  const sql = `
    SELECT
      cr.id,
      cr.booking_id,
      cr.is_active,
      cr.created_at,
      -- Participant info (the other party)
      CASE WHEN $2 = 'customer' THEN ust.id ELSE u.id END AS other_party_id,
      CASE WHEN $2 = 'customer' THEN ust.name ELSE u.name END AS other_party_name,
      CASE WHEN $2 = 'customer' THEN ust.profile_image_url ELSE u.profile_image_url END AS other_party_photo,
      CASE WHEN $2 = 'customer' THEN 'ustad' ELSE 'customer' END AS other_party_role,
      -- Last message info
      last_msg.id AS last_message_id,
      last_msg.content AS last_message_content,
      last_msg.message_type AS last_message_type,
      last_msg.created_at AS last_message_time,
      -- Unread count for current user
      COALESCE(unread.count, 0) AS unread_count
    FROM chat_rooms cr
    JOIN users u ON u.id = cr.user_id
    JOIN ustads ust ON ust.id = cr.ustad_id
    -- Last message
    LEFT JOIN LATERAL (
      SELECT id, content, message_type, created_at
      FROM chat_messages
      WHERE chat_room_id = cr.id
      ORDER BY created_at DESC
      LIMIT 1
    ) last_msg ON true
    -- Unread count
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS count
      FROM chat_messages
      WHERE chat_room_id = cr.id AND sender_id != $1 AND is_read = false
    ) unread ON true
    WHERE ${filterCol} = $1
    ORDER BY COALESCE(last_msg.created_at, cr.created_at) DESC;
  `;

  return await query(sql, [userId, role]);
};

/**
 * Insert a chat message
 */
const createChatMessage = async ({
  chatRoomId,
  senderId,
  senderRole,
  messageType = 'text',
  content,
  imageUrl = null,
}) => {
  const sql = `
    INSERT INTO chat_messages (
      chat_room_id,
      sender_id,
      sender_role,
      message_type,
      content,
      image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const rows = await query(sql, [chatRoomId, senderId, senderRole, messageType, content, imageUrl]);
  return rows[0];
};

/**
 * Get messages for a chat room (paginated)
 */
const getChatMessagesByRoomId = async (chatRoomId, { page = 1, limit = 50 } = {}) => {
  const offset = (page - 1) * limit;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM chat_messages
    WHERE chat_room_id = $1;
  `;
  const countRows = await query(countSql, [chatRoomId]);
  const total = parseInt(countRows[0].total, 10);

  const dataSql = `
    SELECT *
    FROM chat_messages
    WHERE chat_room_id = $1
    ORDER BY created_at ASC
    LIMIT $2 OFFSET $3;
  `;
  const rows = await query(dataSql, [chatRoomId, limit, offset]);

  return { messages: rows, total };
};

/**
 * Mark messages in room as read (by current reader)
 */
const markRoomMessagesAsRead = async (chatRoomId, readerId) => {
  const sql = `
    UPDATE chat_messages
    SET is_read = true, read_at = NOW()
    WHERE chat_room_id = $1 AND sender_id != $2 AND is_read = false
    RETURNING id;
  `;
  const rows = await query(sql, [chatRoomId, readerId]);
  return rows.length;
};

/**
 * Mark single message as read
 */
const markMessageAsRead = async (messageId) => {
  const sql = `
    UPDATE chat_messages
    SET is_read = true, read_at = NOW()
    WHERE id = $1 AND is_read = false
    RETURNING *;
  `;
  const rows = await query(sql, [messageId]);
  return rows[0] || null;
};

module.exports = {
  getChatRoomById,
  getChatRoomByBookingId,
  createChatRoom,
  getChatRoomsForUser,
  createChatMessage,
  getChatMessagesByRoomId,
  markRoomMessagesAsRead,
  markMessageAsRead,
};
