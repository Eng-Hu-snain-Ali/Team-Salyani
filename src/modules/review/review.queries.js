/**
 * Review Queries — Raw SQL queries for reviews
 */
const { query } = require('../../config/database');

/**
 * Create a review
 */
const createReview = async ({ bookingId, userId, ustadId, rating, comment }) => {
  const sql = `
    INSERT INTO reviews (booking_id, user_id, ustad_id, rating, comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const rows = await query(sql, [bookingId, userId, ustadId, rating, comment]);
  return rows[0];
};

/**
 * Get review by booking ID
 */
const getReviewByBookingId = async (bookingId) => {
  const sql = `
    SELECT
      r.*,
      u.name AS customer_name,
      u.profile_image_url AS customer_profile_image,
      ust.name AS ustad_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    JOIN ustads ust ON ust.id = r.ustad_id
    WHERE r.booking_id = $1;
  `;
  const rows = await query(sql, [bookingId]);
  return rows[0] || null;
};

/**
 * Get reviews for an ustad (public, only visible)
 */
const getReviewsByUstadId = async (ustadId, { page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM reviews
    WHERE ustad_id = $1 AND is_visible = true;
  `;
  const countRows = await query(countSql, [ustadId]);
  const total = parseInt(countRows[0].total, 10);

  const dataSql = `
    SELECT
      r.id,
      r.booking_id,
      r.rating,
      r.comment,
      r.created_at,
      u.name AS customer_name,
      u.profile_image_url AS customer_profile_image
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.ustad_id = $1 AND r.is_visible = true
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const rows = await query(dataSql, [ustadId, limit, offset]);

  return { reviews: rows, total };
};

/**
 * Recalculate and update ustad average rating & total reviews
 */
const refreshUstadRatingStats = async (ustadId) => {
  const sql = `
    UPDATE ustads
    SET
      avg_rating = COALESCE(
        (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE ustad_id = $1 AND is_visible = true),
        0.0
      ),
      total_reviews = (SELECT COUNT(*) FROM reviews WHERE ustad_id = $1 AND is_visible = true),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, avg_rating, total_reviews;
  `;
  const rows = await query(sql, [ustadId]);
  return rows[0] || null;
};

module.exports = {
  createReview,
  getReviewByBookingId,
  getReviewsByUstadId,
  refreshUstadRatingStats,
};
