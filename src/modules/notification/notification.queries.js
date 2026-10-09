/**
 * Notification Queries — Raw SQL queries for notifications
 */
const { query } = require('../../config/database');

/**
 * Create a new notification
 */
const createNotification = async ({
  recipientId,
  recipientRole,
  type,
  title,
  message,
  data = null,
}) => {
  const sql = `
    INSERT INTO notifications (
      recipient_id,
      recipient_role,
      type,
      title,
      message,
      data
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const rows = await query(sql, [
    recipientId,
    recipientRole,
    type,
    title,
    message,
    data ? JSON.stringify(data) : null,
  ]);
  return rows[0];
};

/**
 * Get paginated notifications for a recipient
 */
const getNotificationsByRecipient = async (recipientId, { page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM notifications
    WHERE recipient_id = $1;
  `;
  const countRows = await query(countSql, [recipientId]);
  const total = parseInt(countRows[0].total, 10);

  const dataSql = `
    SELECT *
    FROM notifications
    WHERE recipient_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const rows = await query(dataSql, [recipientId, limit, offset]);

  return { notifications: rows, total };
};

/**
 * Get unread notification count
 */
const getUnreadNotificationCount = async (recipientId) => {
  const sql = `
    SELECT COUNT(*) AS unread_count
    FROM notifications
    WHERE recipient_id = $1 AND is_read = false;
  `;
  const rows = await query(sql, [recipientId]);
  return parseInt(rows[0].unread_count, 10);
};

/**
 * Mark a single notification as read
 */
const markNotificationAsRead = async (id, recipientId) => {
  const sql = `
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE id = $1 AND recipient_id = $2
    RETURNING *;
  `;
  const rows = await query(sql, [id, recipientId]);
  return rows[0] || null;
};

/**
 * Mark all notifications as read for a recipient
 */
const markAllNotificationsAsRead = async (recipientId) => {
  const sql = `
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE recipient_id = $1 AND is_read = false
    RETURNING id;
  `;
  const rows = await query(sql, [recipientId]);
  return rows.length;
};

module.exports = {
  createNotification,
  getNotificationsByRecipient,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
