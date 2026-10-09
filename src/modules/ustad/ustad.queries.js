/**
 * Ustad Queries — Raw SQL for ustad profile, documents, skills, nearby search
 */
const { query, transaction } = require('../../config/database');

// ─── PROFILE ──────────────────────────────────────────────

/** Get ustad profile by ID (sanitized — no auth_user_id) */
const getUstadById = async (ustadId) => {
  const rows = await query(
    `SELECT id, name, phone, email, cnic_number, profile_image_url, bio,
            lat, lng, avg_rating, total_reviews, total_jobs_completed,
            verification_status, is_available, is_active, created_at, updated_at
     FROM ustads WHERE id = $1 LIMIT 1`,
    [ustadId]
  );
  return rows[0] || null;
};

/** Get ustad public profile — includes skills */
const getUstadPublicProfile = async (ustadId) => {
  const ustadRows = await query(
    `SELECT id, name, profile_image_url, bio, avg_rating, total_reviews,
            total_jobs_completed, verification_status, is_available, created_at
     FROM ustads WHERE id = $1 AND is_active = true LIMIT 1`,
    [ustadId]
  );
  if (!ustadRows[0]) return null;

  const skills = await query(
    `SELECT us.id, s.id AS service_id, s.name AS service_name, s.icon_url,
            us.experience_years
     FROM ustad_skills us
     JOIN services s ON s.id = us.service_id
     WHERE us.ustad_id = $1`,
    [ustadId]
  );

  return { ...ustadRows[0], skills };
};

/** Update ustad profile */
const updateUstadProfile = async (ustadId, { name, email, cnicNumber, bio, lat, lng, profileImageUrl }) => {
  const rows = await query(
    `UPDATE ustads
     SET name              = COALESCE($1, name),
         email             = COALESCE($2, email),
         cnic_number       = COALESCE($3, cnic_number),
         bio               = COALESCE($4, bio),
         lat               = COALESCE($5, lat),
         lng               = COALESCE($6, lng),
         profile_image_url = COALESCE($7, profile_image_url),
         updated_at        = NOW()
     WHERE id = $8
     RETURNING id, name, phone, email, cnic_number, profile_image_url, bio,
               lat, lng, avg_rating, verification_status, is_available, updated_at`,
    [name, email, cnicNumber, bio, lat, lng, profileImageUrl, ustadId]
  );
  return rows[0] || null;
};

/** Toggle ustad availability (online/offline) */
const toggleAvailability = async (ustadId, isAvailable) => {
  const rows = await query(
    `UPDATE ustads SET is_available = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, is_available, updated_at`,
    [isAvailable, ustadId]
  );
  return rows[0] || null;
};

/** Update ustad location */
const updateUstadLocation = async (ustadId, { lat, lng }) => {
  const rows = await query(
    `UPDATE ustads SET lat = $1, lng = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING id, lat, lng, updated_at`,
    [lat, lng, ustadId]
  );
  return rows[0] || null;
};

// ─── DOCUMENTS ────────────────────────────────────────────

/** Get all documents for an ustad */
const getUstadDocuments = async (ustadId) => {
  return query(
    `SELECT id, document_type, document_url, status, rejection_reason,
            reviewed_at, created_at
     FROM ustad_documents WHERE ustad_id = $1 ORDER BY created_at DESC`,
    [ustadId]
  );
};

/** Upload/create a document record */
const createUstadDocument = async (ustadId, { documentType, documentUrl }) => {
  const rows = await query(
    `INSERT INTO ustad_documents (ustad_id, document_type, document_url, status)
     VALUES ($1, $2, $3, 'pending')
     RETURNING *`,
    [ustadId, documentType, documentUrl]
  );
  return rows[0];
};

// ─── SKILLS ───────────────────────────────────────────────

/** Get all skills for an ustad */
const getUstadSkills = async (ustadId) => {
  return query(
    `SELECT us.id, s.id AS service_id, s.name AS service_name, s.icon_url,
            us.experience_years, us.created_at
     FROM ustad_skills us
     JOIN services s ON s.id = us.service_id
     WHERE us.ustad_id = $1
     ORDER BY s.name ASC`,
    [ustadId]
  );
};

/** Add a skill for an ustad */
const addUstadSkill = async (ustadId, { serviceId, experienceYears }) => {
  const rows = await query(
    `INSERT INTO ustad_skills (ustad_id, service_id, experience_years)
     VALUES ($1, $2, $3)
     ON CONFLICT (ustad_id, service_id) DO UPDATE
       SET experience_years = EXCLUDED.experience_years
     RETURNING *`,
    [ustadId, serviceId, experienceYears || 0]
  );
  return rows[0];
};

/** Remove a skill */
const removeUstadSkill = async (skillId, ustadId) => {
  const rows = await query(
    `DELETE FROM ustad_skills WHERE id = $1 AND ustad_id = $2 RETURNING id`,
    [skillId, ustadId]
  );
  return rows[0] || null;
};

// ─── NEARBY SEARCH ────────────────────────────────────────

/**
 * Find nearby available ustads using Haversine formula in SQL
 * Filters by: verified, active, available, optionally by service_id
 */
const findNearbyUstads = async ({ lat, lng, serviceId, radiusKm }) => {
  const radius = radiusKm || parseFloat(process.env.NEARBY_USTAD_RADIUS_KM) || 10;

  // Haversine formula directly in SQL for efficiency
  const baseQuery = `
    SELECT
      u.id, u.name, u.profile_image_url, u.bio,
      u.avg_rating, u.total_reviews, u.total_jobs_completed,
      u.lat, u.lng, u.is_available,
      ROUND(
        6371 * acos(
          cos(radians($1)) * cos(radians(u.lat)) *
          cos(radians(u.lng) - radians($2)) +
          sin(radians($1)) * sin(radians(u.lat))
        )::numeric, 2
      ) AS distance_km,
      ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) AS skills
    FROM ustads u
    LEFT JOIN ustad_skills us ON us.ustad_id = u.id
    LEFT JOIN services s ON s.id = us.service_id
    WHERE
      u.is_available = true
      AND u.is_active = true
      AND u.verification_status = 'verified'
      AND u.lat IS NOT NULL
      AND u.lng IS NOT NULL
  `;

  let finalQuery, params;

  if (serviceId) {
    finalQuery = `
      ${baseQuery}
      AND u.id IN (
        SELECT ustad_id FROM ustad_skills WHERE service_id = $4
      )
      GROUP BY u.id
      HAVING
        6371 * acos(
          cos(radians($1)) * cos(radians(u.lat)) *
          cos(radians(u.lng) - radians($2)) +
          sin(radians($1)) * sin(radians(u.lat))
        ) <= $3
      ORDER BY distance_km ASC
      LIMIT 20
    `;
    params = [lat, lng, radius, serviceId];
  } else {
    finalQuery = `
      ${baseQuery}
      GROUP BY u.id
      HAVING
        6371 * acos(
          cos(radians($1)) * cos(radians(u.lat)) *
          cos(radians(u.lng) - radians($2)) +
          sin(radians($1)) * sin(radians(u.lat))
        ) <= $3
      ORDER BY distance_km ASC
      LIMIT 20
    `;
    params = [lat, lng, radius];
  }

  return query(finalQuery, params);
};

/** Update ustad avg_rating after new review */
const refreshUstadRating = async (ustadId) => {
  await query(
    `UPDATE ustads
     SET avg_rating    = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE ustad_id = $1), 0),
         total_reviews = (SELECT COUNT(*) FROM reviews WHERE ustad_id = $1),
         updated_at    = NOW()
     WHERE id = $1`,
    [ustadId]
  );
};

module.exports = {
  getUstadById,
  getUstadPublicProfile,
  updateUstadProfile,
  toggleAvailability,
  updateUstadLocation,
  getUstadDocuments,
  createUstadDocument,
  getUstadSkills,
  addUstadSkill,
  removeUstadSkill,
  findNearbyUstads,
  refreshUstadRating,
};
