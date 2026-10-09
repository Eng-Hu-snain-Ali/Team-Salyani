/**
 * Auth Queries
 * Raw SQL queries for authentication operations
 */
const { query, transaction } = require('../../config/database');

// ─── USERS ────────────────────────────────────────────────

/**
 * Find user by phone number
 */
const findUserByPhone = async (phone) => {
  const rows = await query('SELECT * FROM users WHERE phone = $1 LIMIT 1', [phone]);
  return rows[0] || null;
};

/**
 * Find user by auth_user_id (Neon Auth ID)
 */
const findUserByAuthId = async (authUserId) => {
  const rows = await query('SELECT * FROM users WHERE auth_user_id = $1 LIMIT 1', [authUserId]);
  return rows[0] || null;
};

/**
 * Find user by ID
 */
const findUserById = async (userId) => {
  const rows = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId]);
  return rows[0] || null;
};

/**
 * Create new customer user
 */
const createUser = async ({ authUserId, name, phone, email }) => {
  const rows = await query(
    `INSERT INTO users (auth_user_id, name, phone, email, role)
     VALUES ($1, $2, $3, $4, 'customer')
     RETURNING *`,
    [authUserId, name, phone, email || null]
  );
  return rows[0];
};

/**
 * Update user profile
 */
const updateUser = async (userId, fields) => {
  const rows = await query(
    `UPDATE users
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         profile_image_url = COALESCE($3, profile_image_url),
         lat = COALESCE($4, lat),
         lng = COALESCE($5, lng),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [fields.name, fields.email, fields.profileImageUrl, fields.lat, fields.lng, userId]
  );
  return rows[0] || null;
};

// ─── USTADS ───────────────────────────────────────────────

/**
 * Find ustad by phone number
 */
const findUstadByPhone = async (phone) => {
  const rows = await query('SELECT * FROM ustads WHERE phone = $1 LIMIT 1', [phone]);
  return rows[0] || null;
};

/**
 * Find ustad by auth_user_id
 */
const findUstadByAuthId = async (authUserId) => {
  const rows = await query('SELECT * FROM ustads WHERE auth_user_id = $1 LIMIT 1', [authUserId]);
  return rows[0] || null;
};

/**
 * Find ustad by ID
 */
const findUstadById = async (ustadId) => {
  const rows = await query('SELECT * FROM ustads WHERE id = $1 LIMIT 1', [ustadId]);
  return rows[0] || null;
};

/**
 * Create new ustad + their wallet atomically
 */
const createUstad = async ({ authUserId, name, phone, email }) => {
  return transaction(async (q) => {
    const ustadRows = await q(
      `INSERT INTO ustads (auth_user_id, name, phone, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [authUserId, name, phone, email || null]
    );
    const ustad = ustadRows[0];

    // Auto-create wallet for new ustad
    await q('INSERT INTO wallets (ustad_id) VALUES ($1)', [ustad.id]);

    return ustad;
  });
};

// ─── ADMINS ───────────────────────────────────────────────

/**
 * Find admin by email
 */
const findAdminByEmail = async (email) => {
  const rows = await query('SELECT * FROM admins WHERE email = $1 AND is_active = true LIMIT 1', [email]);
  return rows[0] || null;
};

/**
 * Find admin by ID
 */
const findAdminById = async (adminId) => {
  const rows = await query('SELECT * FROM admins WHERE id = $1 AND is_active = true LIMIT 1', [adminId]);
  return rows[0] || null;
};

/**
 * Update admin last login timestamp
 */
const updateAdminLastLogin = async (adminId) => {
  await query('UPDATE admins SET last_login_at = NOW() WHERE id = $1', [adminId]);
};

module.exports = {
  findUserByPhone,
  findUserByAuthId,
  findUserById,
  createUser,
  updateUser,
  findUstadByPhone,
  findUstadByAuthId,
  findUstadById,
  createUstad,
  findAdminByEmail,
  findAdminById,
  updateAdminLastLogin,
};
