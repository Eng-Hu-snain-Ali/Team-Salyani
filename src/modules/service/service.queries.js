/**
 * Service Queries
 * Raw SQL for services, sub-services, and rate cards
 */
const { query } = require('../../config/database');

// ─── SERVICES ─────────────────────────────────────────────

/**
 * Get all active services with sub-service count
 */
const getAllServices = async () => {
  return query(`
    SELECT
      s.id, s.name, s.description, s.icon_url,
      s.is_active, s.sort_order, s.created_at, s.updated_at,
      COUNT(ss.id)::int AS sub_services_count
    FROM services s
    LEFT JOIN sub_services ss ON ss.service_id = s.id AND ss.is_active = true
    WHERE s.is_active = true
    GROUP BY s.id
    ORDER BY s.sort_order ASC, s.name ASC
  `);
};

/**
 * Get a single service by ID
 */
const getServiceById = async (serviceId) => {
  const rows = await query(
    `SELECT * FROM services WHERE id = $1 LIMIT 1`,
    [serviceId]
  );
  return rows[0] || null;
};

/**
 * Get service with all its sub-services (and rate cards per sub-service)
 */
const getServiceWithSubServices = async (serviceId) => {
  const serviceRows = await query(
    `SELECT * FROM services WHERE id = $1 LIMIT 1`,
    [serviceId]
  );
  if (!serviceRows[0]) return null;

  const subServices = await query(`
    SELECT
      ss.id, ss.name, ss.description, ss.is_active, ss.created_at,
      rc.id AS rate_card_id, rc.base_price, rc.price_unit
    FROM sub_services ss
    LEFT JOIN rate_cards rc ON rc.sub_service_id = ss.id AND rc.is_active = true
    WHERE ss.service_id = $1 AND ss.is_active = true
    ORDER BY ss.name ASC
  `, [serviceId]);

  return { ...serviceRows[0], sub_services: subServices };
};

/**
 * Create a new service
 */
const createService = async ({ name, description, iconUrl, sortOrder }) => {
  const rows = await query(
    `INSERT INTO services (name, description, icon_url, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description || null, iconUrl || null, sortOrder || 0]
  );
  return rows[0];
};

/**
 * Update a service
 */
const updateService = async (serviceId, { name, description, iconUrl, isActive, sortOrder }) => {
  const rows = await query(
    `UPDATE services
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         icon_url = COALESCE($3, icon_url),
         is_active = COALESCE($4, is_active),
         sort_order = COALESCE($5, sort_order),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [name, description, iconUrl, isActive, sortOrder, serviceId]
  );
  return rows[0] || null;
};

/**
 * Soft-delete a service (set is_active = false)
 */
const deactivateService = async (serviceId) => {
  const rows = await query(
    `UPDATE services SET is_active = false, updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [serviceId]
  );
  return rows[0] || null;
};

// ─── SUB-SERVICES ─────────────────────────────────────────

/**
 * Get sub-services for a given service
 */
const getSubServicesByServiceId = async (serviceId) => {
  return query(`
    SELECT
      ss.id, ss.service_id, ss.name, ss.description, ss.is_active, ss.created_at,
      rc.id AS rate_card_id, rc.base_price, rc.price_unit
    FROM sub_services ss
    LEFT JOIN rate_cards rc ON rc.sub_service_id = ss.id AND rc.is_active = true
    WHERE ss.service_id = $1 AND ss.is_active = true
    ORDER BY ss.name ASC
  `, [serviceId]);
};

/**
 * Get a single sub-service by ID
 */
const getSubServiceById = async (subServiceId) => {
  const rows = await query(
    `SELECT ss.*, s.name AS service_name
     FROM sub_services ss
     JOIN services s ON s.id = ss.service_id
     WHERE ss.id = $1 LIMIT 1`,
    [subServiceId]
  );
  return rows[0] || null;
};

/**
 * Create a new sub-service
 */
const createSubService = async ({ serviceId, name, description }) => {
  const rows = await query(
    `INSERT INTO sub_services (service_id, name, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [serviceId, name, description || null]
  );
  return rows[0];
};

/**
 * Update a sub-service
 */
const updateSubService = async (subServiceId, { name, description, isActive }) => {
  const rows = await query(
    `UPDATE sub_services
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         is_active = COALESCE($3, is_active)
     WHERE id = $4
     RETURNING *`,
    [name, description, isActive, subServiceId]
  );
  return rows[0] || null;
};

// ─── RATE CARDS ───────────────────────────────────────────

/**
 * Get rate card for a sub-service
 */
const getRateCardBySubServiceId = async (subServiceId) => {
  const rows = await query(
    `SELECT rc.*, ss.name AS sub_service_name, s.name AS service_name
     FROM rate_cards rc
     JOIN sub_services ss ON ss.id = rc.sub_service_id
     JOIN services s ON s.id = ss.service_id
     WHERE rc.sub_service_id = $1 AND rc.is_active = true
     LIMIT 1`,
    [subServiceId]
  );
  return rows[0] || null;
};

/**
 * Create a rate card
 */
const createRateCard = async ({ subServiceId, basePrice, priceUnit }) => {
  const rows = await query(
    `INSERT INTO rate_cards (sub_service_id, base_price, price_unit)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [subServiceId, basePrice, priceUnit || 'fixed']
  );
  return rows[0];
};

/**
 * Update a rate card
 */
const updateRateCard = async (rateCardId, { basePrice, priceUnit, isActive }) => {
  const rows = await query(
    `UPDATE rate_cards
     SET base_price = COALESCE($1, base_price),
         price_unit = COALESCE($2, price_unit),
         is_active = COALESCE($3, is_active),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [basePrice, priceUnit, isActive, rateCardId]
  );
  return rows[0] || null;
};

module.exports = {
  getAllServices,
  getServiceById,
  getServiceWithSubServices,
  createService,
  updateService,
  deactivateService,
  getSubServicesByServiceId,
  getSubServiceById,
  createSubService,
  updateSubService,
  getRateCardBySubServiceId,
  createRateCard,
  updateRateCard,
};
