/**
 * Admin Queries — Raw SQL queries for Admin dashboards & moderation
 */
const { query } = require('../../config/database');

/**
 * 1. Dashboard Stats
 */
const getPlatformStats = async () => {
  const sql = `
    SELECT
      (SELECT COUNT(*)::int FROM users WHERE role = 'customer') AS total_customers,
      (SELECT COUNT(*)::int FROM ustads) AS total_ustads,
      (SELECT COUNT(*)::int FROM ustads WHERE verification_status = 'verified') AS verified_ustads,
      (SELECT COUNT(*)::int FROM ustads WHERE verification_status IN ('pending', 'under_review')) AS pending_kyc,
      (SELECT COUNT(*)::int FROM bookings) AS total_bookings,
      (SELECT COUNT(*)::int FROM bookings WHERE status IN ('pending', 'accepted', 'in_progress')) AS active_bookings,
      (SELECT COUNT(*)::int FROM bookings WHERE status IN ('completed', 'paid')) AS completed_bookings,
      (SELECT COUNT(*)::int FROM bookings WHERE status = 'cancelled') AS cancelled_bookings,
      COALESCE((SELECT ROUND(SUM(commission_amount)::numeric, 2) FROM payments WHERE payment_status = 'completed'), 0.00)::float AS total_revenue,
      COALESCE((SELECT ROUND(SUM(commission_amount)::numeric, 2) FROM payments WHERE payment_status = 'completed' AND created_at >= date_trunc('month', NOW())), 0.00)::float AS revenue_this_month,
      COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE is_visible = true), 0.0)::float AS average_rating;
  `;
  const rows = await query(sql);
  return rows[0];
};

/**
 * 2. Revenue Report (daily, weekly, monthly)
 */
const getRevenueReport = async (period = 'daily') => {
  let intervalTrunc = 'day';
  let limitRows = 30;

  if (period === 'weekly') {
    intervalTrunc = 'week';
    limitRows = 12;
  } else if (period === 'monthly') {
    intervalTrunc = 'month';
    limitRows = 12;
  }

  const sql = `
    SELECT
      date_trunc('${intervalTrunc}', created_at) AS period,
      COUNT(*)::int AS total_payments,
      COALESCE(ROUND(SUM(total_amount)::numeric, 2), 0.00)::float AS total_volume,
      COALESCE(ROUND(SUM(commission_amount)::numeric, 2), 0.00)::float AS commission_earned,
      COALESCE(ROUND(SUM(ustad_earning)::numeric, 2), 0.00)::float AS ustad_payouts
    FROM payments
    WHERE payment_status = 'completed'
    GROUP BY date_trunc('${intervalTrunc}', created_at)
    ORDER BY period DESC
    LIMIT ${limitRows};
  `;
  return await query(sql);
};

/**
 * 3. Customer Management
 */
const getAdminUsers = async ({ page = 1, limit = 10, search = null, isActive = null }) => {
  const offset = (page - 1) * limit;
  const conditions = ["role = 'customer'"];
  const params = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(`(name ILIKE $${paramIdx} OR phone ILIKE $${paramIdx} OR email ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  if (isActive !== null) {
    conditions.push(`is_active = $${paramIdx}`);
    params.push(isActive === 'true' || isActive === true);
    paramIdx++;
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const countSql = `SELECT COUNT(*)::int AS total FROM users ${whereClause};`;
  const countRows = await query(countSql, params);
  const total = countRows[0].total;

  const dataSql = `
    SELECT
      id, auth_user_id, name, phone, email, profile_image_url,
      lat, lng, role, is_active, created_at, updated_at
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1};
  `;
  const rows = await query(dataSql, [...params, limit, offset]);

  return { users: rows, total };
};

const getAdminUserById = async (id) => {
  const userSql = `SELECT * FROM users WHERE id = $1;`;
  const userRows = await query(userSql, [id]);
  if (userRows.length === 0) return null;

  const statsSql = `
    SELECT
      (SELECT COUNT(*)::int FROM bookings WHERE user_id = $1) AS total_bookings,
      (SELECT COUNT(*)::int FROM bookings WHERE user_id = $1 AND status = 'paid') AS completed_bookings,
      COALESCE((SELECT ROUND(SUM(total_amount)::numeric, 2) FROM payments WHERE user_id = $1), 0.00)::float AS total_spent,
      (SELECT COUNT(*)::int FROM user_addresses WHERE user_id = $1) AS address_count;
  `;
  const statsRows = await query(statsSql, [id]);

  return {
    ...userRows[0],
    stats: statsRows[0],
  };
};

const updateUserActiveStatus = async (id, isActive) => {
  const sql = `
    UPDATE users
    SET is_active = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, name, is_active;
  `;
  const rows = await query(sql, [isActive, id]);
  return rows[0] || null;
};

/**
 * 4. Ustad Management
 */
const getAdminUstads = async ({
  page = 1,
  limit = 10,
  search = null,
  verificationStatus = null,
  isActive = null,
}) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(`(name ILIKE $${paramIdx} OR phone ILIKE $${paramIdx} OR cnic_number ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  if (verificationStatus) {
    conditions.push(`verification_status = $${paramIdx}`);
    params.push(verificationStatus);
    paramIdx++;
  }

  if (isActive !== null) {
    conditions.push(`is_active = $${paramIdx}`);
    params.push(isActive === 'true' || isActive === true);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*)::int AS total FROM ustads ${whereClause};`;
  const countRows = await query(countSql, params);
  const total = countRows[0].total;

  const dataSql = `
    SELECT
      id, auth_user_id, name, phone, email, cnic_number,
      profile_image_url, bio, lat, lng, avg_rating, total_reviews,
      total_jobs_completed, verification_status, is_available, is_active,
      created_at, updated_at
    FROM ustads
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1};
  `;
  const rows = await query(dataSql, [...params, limit, offset]);

  return { ustads: rows, total };
};

const getAdminUstadById = async (id) => {
  const ustadSql = `SELECT * FROM ustads WHERE id = $1;`;
  const ustadRows = await query(ustadSql, [id]);
  if (ustadRows.length === 0) return null;

  const docsSql = `SELECT * FROM ustad_documents WHERE ustad_id = $1 ORDER BY created_at DESC;`;
  const docs = await query(docsSql, [id]);

  const skillsSql = `
    SELECT us.*, s.name AS service_name
    FROM ustad_skills us
    JOIN services s ON s.id = us.service_id
    WHERE us.ustad_id = $1;
  `;
  const skills = await query(skillsSql, [id]);

  const walletSql = `SELECT * FROM wallets WHERE ustad_id = $1;`;
  const walletRows = await query(walletSql, [id]);

  return {
    ...ustadRows[0],
    documents: docs,
    skills,
    wallet: walletRows[0] || null,
  };
};

const updateUstadVerificationStatus = async (id, status) => {
  const sql = `
    UPDATE ustads
    SET verification_status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, name, verification_status;
  `;
  const rows = await query(sql, [status, id]);
  return rows[0] || null;
};

const updateUstadActiveStatus = async (id, isActive) => {
  const sql = `
    UPDATE ustads
    SET is_active = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, name, is_active;
  `;
  const rows = await query(sql, [isActive, id]);
  return rows[0] || null;
};

const getPendingKycUstadsList = async ({ page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM ustads
    WHERE verification_status IN ('pending', 'under_review');
  `;
  const countRows = await query(countSql);
  const total = countRows[0].total;

  const sql = `
    SELECT
      u.id, u.name, u.phone, u.cnic_number, u.verification_status, u.created_at,
      json_agg(
        json_build_object(
          'id', d.id,
          'document_type', d.document_type,
          'document_url', d.document_url,
          'status', d.status,
          'created_at', d.created_at
        )
      ) FILTER (WHERE d.id IS NOT NULL) AS documents
    FROM ustads u
    LEFT JOIN ustad_documents d ON d.ustad_id = u.id
    WHERE u.verification_status IN ('pending', 'under_review')
    GROUP BY u.id
    ORDER BY u.created_at ASC
    LIMIT $1 OFFSET $2;
  `;
  const rows = await query(sql, [limit, offset]);
  return { ustads: rows, total };
};

const reviewDocumentStatus = async (docId, { status, rejectionReason = null }) => {
  const sql = `
    UPDATE ustad_documents
    SET status = $1, rejection_reason = $2, reviewed_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;
  const rows = await query(sql, [status, rejectionReason, docId]);
  return rows[0] || null;
};

/**
 * 5. Booking Management
 */
const getAdminBookings = async ({ page = 1, limit = 10, status = null, search = null }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (status) {
    conditions.push(`b.status = $${paramIdx}`);
    params.push(status);
    paramIdx++;
  }

  if (search) {
    conditions.push(`(u.name ILIKE $${paramIdx} OR ust.name ILIKE $${paramIdx} OR b.description ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    LEFT JOIN ustads ust ON ust.id = b.ustad_id
    ${whereClause};
  `;
  const countRows = await query(countSql, params);
  const total = countRows[0].total;

  const dataSql = `
    SELECT
      b.*,
      u.name AS customer_name,
      u.phone AS customer_phone,
      ust.name AS ustad_name,
      ust.phone AS ustad_phone,
      ss.name AS sub_service_name,
      s.name AS service_name
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    LEFT JOIN ustads ust ON ust.id = b.ustad_id
    JOIN sub_services ss ON ss.id = b.sub_service_id
    JOIN services s ON s.id = ss.service_id
    ${whereClause}
    ORDER BY b.created_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1};
  `;
  const rows = await query(dataSql, [...params, limit, offset]);

  return { bookings: rows, total };
};

const getAdminBookingById = async (id) => {
  const sql = `
    SELECT
      b.*,
      u.name AS customer_name,
      u.phone AS customer_phone,
      u.profile_image_url AS customer_photo,
      ust.name AS ustad_name,
      ust.phone AS ustad_phone,
      ust.profile_image_url AS ustad_photo,
      ss.name AS sub_service_name,
      s.name AS service_name
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    LEFT JOIN ustads ust ON ust.id = b.ustad_id
    JOIN sub_services ss ON ss.id = b.sub_service_id
    JOIN services s ON s.id = ss.service_id
    WHERE b.id = $1;
  `;
  const rows = await query(sql, [id]);
  if (rows.length === 0) return null;

  const historySql = `
    SELECT * FROM booking_status_history
    WHERE booking_id = $1
    ORDER BY created_at ASC;
  `;
  const history = await query(historySql, [id]);

  const paymentSql = `SELECT * FROM payments WHERE booking_id = $1;`;
  const paymentRows = await query(paymentSql, [id]);

  const reviewSql = `SELECT * FROM reviews WHERE booking_id = $1;`;
  const reviewRows = await query(reviewSql, [id]);

  return {
    ...rows[0],
    status_history: history,
    payment: paymentRows[0] || null,
    review: reviewRows[0] || null,
  };
};

/**
 * 6. Review Moderation
 */
const getAdminReviews = async ({ page = 1, limit = 10, ustadId = null }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (ustadId) {
    conditions.push(`r.ustad_id = $${paramIdx}`);
    params.push(ustadId);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*)::int AS total FROM reviews r ${whereClause};`;
  const countRows = await query(countSql, params);
  const total = countRows[0].total;

  const dataSql = `
    SELECT
      r.*,
      u.name AS customer_name,
      ust.name AS ustad_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    JOIN ustads ust ON ust.id = r.ustad_id
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1};
  `;
  const rows = await query(dataSql, [...params, limit, offset]);

  return { reviews: rows, total };
};

const updateReviewVisibility = async (id, isVisible) => {
  const sql = `
    UPDATE reviews
    SET is_visible = $1
    WHERE id = $2
    RETURNING *;
  `;
  const rows = await query(sql, [isVisible, id]);
  return rows[0] || null;
};

module.exports = {
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
};
