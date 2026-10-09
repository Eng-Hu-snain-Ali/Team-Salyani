/**
 * User Queries — Raw SQL for customer profile & addresses
 */
const { query, transaction } = require('../../config/database');

// ─── PROFILE ──────────────────────────────────────────────

/** Get user profile by ID */
const getUserById = async (userId) => {
  const rows = await query(
    `SELECT id, auth_user_id, name, phone, email, profile_image_url,
            lat, lng, role, is_active, created_at, updated_at
     FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

/** Update user profile fields */
const updateUserProfile = async (userId, { name, email, lat, lng, profileImageUrl }) => {
  const rows = await query(
    `UPDATE users
     SET name              = COALESCE($1, name),
         email             = COALESCE($2, email),
         lat               = COALESCE($3, lat),
         lng               = COALESCE($4, lng),
         profile_image_url = COALESCE($5, profile_image_url),
         updated_at        = NOW()
     WHERE id = $6
     RETURNING id, name, phone, email, profile_image_url, lat, lng, role, updated_at`,
    [name, email, lat, lng, profileImageUrl, userId]
  );
  return rows[0] || null;
};

/** Update only user location */
const updateUserLocation = async (userId, { lat, lng }) => {
  const rows = await query(
    `UPDATE users SET lat = $1, lng = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING id, lat, lng, updated_at`,
    [lat, lng, userId]
  );
  return rows[0] || null;
};

// ─── ADDRESSES ────────────────────────────────────────────

/** Get all addresses for a user */
const getUserAddresses = async (userId) => {
  return query(
    `SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
};

/** Get single address by ID (ownership check included) */
const getAddressById = async (addressId, userId) => {
  const rows = await query(
    `SELECT * FROM user_addresses WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [addressId, userId]
  );
  return rows[0] || null;
};

/**
 * Add a new address
 * If is_default = true, unset previous defaults first (in transaction)
 */
const addUserAddress = async (userId, { label, addressLine, city, lat, lng, isDefault }) => {
  return transaction(async (q) => {
    if (isDefault) {
      await q(
        `UPDATE user_addresses SET is_default = false WHERE user_id = $1`,
        [userId]
      );
    }
    const rows = await q(
      `INSERT INTO user_addresses (user_id, label, address_line, city, lat, lng, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, label || 'home', addressLine, city || 'Faisalabad', lat, lng, isDefault || false]
    );
    return rows[0];
  });
};

/** Update an address */
const updateUserAddress = async (addressId, userId, { label, addressLine, city, lat, lng, isDefault }) => {
  return transaction(async (q) => {
    if (isDefault) {
      await q(
        `UPDATE user_addresses SET is_default = false WHERE user_id = $1`,
        [userId]
      );
    }
    const rows = await q(
      `UPDATE user_addresses
       SET label        = COALESCE($1, label),
           address_line = COALESCE($2, address_line),
           city         = COALESCE($3, city),
           lat          = COALESCE($4, lat),
           lng          = COALESCE($5, lng),
           is_default   = COALESCE($6, is_default)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [label, addressLine, city, lat, lng, isDefault, addressId, userId]
    );
    return rows[0] || null;
  });
};

/** Delete an address */
const deleteUserAddress = async (addressId, userId) => {
  const rows = await query(
    `DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING id`,
    [addressId, userId]
  );
  return rows[0] || null;
};

module.exports = {
  getUserById,
  updateUserProfile,
  updateUserLocation,
  getUserAddresses,
  getAddressById,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
