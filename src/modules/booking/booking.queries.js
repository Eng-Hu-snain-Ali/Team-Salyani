/**
 * Booking Queries — Raw SQL for all booking operations
 */
const { query, transaction } = require('../../config/database');

// ─── CREATE BOOKING ───────────────────────────────────────

/**
 * Create booking + initial status history entry (atomic)
 */
const createBooking = async ({ userId, subServiceId, description, problemImageUrl,
  customerLat, customerLng, customerAddress, estimatedPrice }) => {
  return transaction(async (q) => {
    const rows = await q(
      `INSERT INTO bookings
         (user_id, sub_service_id, description, problem_image_url,
          customer_lat, customer_lng, customer_address,
          status, estimated_price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8)
       RETURNING *`,
      [userId, subServiceId, description || null, problemImageUrl || null,
       customerLat, customerLng, customerAddress || null, estimatedPrice || null]
    );
    const booking = rows[0];

    // Record initial status in history
    await q(
      `INSERT INTO booking_status_history
         (booking_id, from_status, to_status, changed_by_role, changed_by_id, note)
       VALUES ($1, NULL, 'pending', 'customer', $2, 'Booking created')`,
      [booking.id, userId]
    );

    return booking;
  });
};

// ─── FETCH BOOKINGS ───────────────────────────────────────

/**
 * Get a single booking with full detail (sub-service, user, ustad info)
 */
const getBookingById = async (bookingId) => {
  const rows = await query(`
    SELECT
      b.*,
      ss.name          AS sub_service_name,
      s.name           AS service_name,
      u.name           AS customer_name,
      u.phone          AS customer_phone,
      u.profile_image_url AS customer_photo,
      st.name          AS ustad_name,
      st.phone         AS ustad_phone,
      st.profile_image_url AS ustad_photo,
      st.avg_rating    AS ustad_rating
    FROM bookings b
    JOIN sub_services ss ON ss.id = b.sub_service_id
    JOIN services s ON s.id = ss.service_id
    JOIN users u ON u.id = b.user_id
    LEFT JOIN ustads st ON st.id = b.ustad_id
    WHERE b.id = $1 LIMIT 1`, [bookingId]);
  return rows[0] || null;
};

/**
 * Get bookings for a customer (paginated)
 */
const getBookingsByUser = async (userId, { status, page, limit }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let where = 'b.user_id = $1';

  if (status) { params.push(status); where += ` AND b.status = $${params.length}`; }

  const countRows = await query(
    `SELECT COUNT(*)::int AS total FROM bookings b WHERE ${where}`, params);
  const total = countRows[0].total;

  params.push(limit, offset);
  const rows = await query(`
    SELECT b.id, b.status, b.estimated_price, b.final_price, b.created_at,
           ss.name AS sub_service_name, s.name AS service_name,
           st.name AS ustad_name, st.profile_image_url AS ustad_photo, st.avg_rating
    FROM bookings b
    JOIN sub_services ss ON ss.id = b.sub_service_id
    JOIN services s ON s.id = ss.service_id
    LEFT JOIN ustads st ON st.id = b.ustad_id
    WHERE ${where}
    ORDER BY b.created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}`, params);

  return { bookings: rows, total };
};

/**
 * Get bookings for an ustad (paginated)
 */
const getBookingsByUstad = async (ustadId, { status, page, limit }) => {
  const offset = (page - 1) * limit;
  const params = [ustadId];
  let where = 'b.ustad_id = $1';

  if (status) { params.push(status); where += ` AND b.status = $${params.length}`; }

  const countRows = await query(
    `SELECT COUNT(*)::int AS total FROM bookings b WHERE ${where}`, params);
  const total = countRows[0].total;

  params.push(limit, offset);
  const rows = await query(`
    SELECT b.id, b.status, b.estimated_price, b.final_price, b.created_at,
           b.customer_lat, b.customer_lng, b.customer_address,
           ss.name AS sub_service_name, s.name AS service_name,
           u.name AS customer_name, u.phone AS customer_phone,
           u.profile_image_url AS customer_photo
    FROM bookings b
    JOIN sub_services ss ON ss.id = b.sub_service_id
    JOIN services s ON s.id = ss.service_id
    JOIN users u ON u.id = b.user_id
    WHERE ${where}
    ORDER BY b.created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}`, params);

  return { bookings: rows, total };
};

/**
 * Get pending bookings for a given sub-service (for ustads to pick up)
 */
const getPendingBookingsForSubService = async (subServiceId) => {
  return query(`
    SELECT b.id, b.description, b.customer_lat, b.customer_lng,
           b.customer_address, b.estimated_price, b.created_at,
           u.name AS customer_name
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    WHERE b.sub_service_id = $1 AND b.status = 'pending'
    ORDER BY b.created_at ASC`, [subServiceId]);
};

// ─── STATUS TRANSITIONS ───────────────────────────────────

/**
 * Generic status update + history log (atomic)
 */
const updateBookingStatus = async (bookingId, { toStatus, changedByRole,
  changedById, note, extraFields = {} }) => {
  return transaction(async (q) => {
    // Build SET clause dynamically for extra fields
    const setFields = ['status = $1', 'updated_at = NOW()'];
    const params = [toStatus];

    const fieldMap = {
      ustad_id:     'ustad_id',
      accepted_at:  'accepted_at',
      started_at:   'started_at',
      completed_at: 'completed_at',
      cancelled_at: 'cancelled_at',
      final_price:  'final_price',
      commission_amount: 'commission_amount',
      cancellation_reason: 'cancellation_reason',
      cancelled_by: 'cancelled_by',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (extraFields[key] !== undefined) {
        params.push(extraFields[key]);
        setFields.push(`${col} = $${params.length}`);
      }
    }

    params.push(bookingId);
    const bookingRows = await q(
      `UPDATE bookings SET ${setFields.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    // Fetch previous status for history
    const prevStatus = bookingRows[0].status !== toStatus
      ? bookingRows[0].status : null;

    await q(
      `INSERT INTO booking_status_history
         (booking_id, from_status, to_status, changed_by_role, changed_by_id, note)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [bookingId, prevStatus, toStatus, changedByRole, changedById, note || null]
    );

    return bookingRows[0];
  });
};

/**
 * Accept booking — assigns ustad, creates chat room
 */
const acceptBooking = async (bookingId, ustadId) => {
  return transaction(async (q) => {
    // Get booking first
    const bRows = await q(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [bookingId]);
    const booking = bRows[0];

    // Update booking status
    const updatedRows = await q(
      `UPDATE bookings
       SET status = 'accepted', ustad_id = $1, accepted_at = NOW(), updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [ustadId, bookingId]
    );

    // Log status history
    await q(
      `INSERT INTO booking_status_history
         (booking_id, from_status, to_status, changed_by_role, changed_by_id, note)
       VALUES ($1, 'pending', 'accepted', 'ustad', $2, 'Booking accepted by ustad')`,
      [bookingId, ustadId]
    );

    // Create chat room between user and ustad
    const chatRows = await q(
      `INSERT INTO chat_rooms (booking_id, user_id, ustad_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (booking_id) DO UPDATE SET is_active = true
       RETURNING id`,
      [bookingId, booking.user_id, ustadId]
    );

    return { booking: updatedRows[0], chatRoomId: chatRows[0].id };
  });
};

/**
 * Complete booking — sets final price + commission
 */
const completeBooking = async (bookingId, ustadId, finalPrice) => {
  const commission = parseFloat((finalPrice * 0.10).toFixed(2));
  const ustadEarning = parseFloat((finalPrice - commission).toFixed(2));

  return transaction(async (q) => {
    const rows = await q(
      `UPDATE bookings
       SET status = 'completed', final_price = $1,
           commission_amount = $2, completed_at = NOW(), updated_at = NOW()
       WHERE id = $3 AND ustad_id = $4 RETURNING *`,
      [finalPrice, commission, bookingId, ustadId]
    );

    await q(
      `INSERT INTO booking_status_history
         (booking_id, from_status, to_status, changed_by_role, changed_by_id, note)
       VALUES ($1, 'in_progress', 'completed', 'ustad', $2, $3)`,
      [bookingId, ustadId, `Final price: PKR ${finalPrice}`]
    );

    // Close chat room
    await q(
      `UPDATE chat_rooms SET is_active = false, closed_at = NOW()
       WHERE booking_id = $1`, [bookingId]
    );

    // Update ustad total_jobs_completed
    await q(
      `UPDATE ustads SET total_jobs_completed = total_jobs_completed + 1,
       updated_at = NOW() WHERE id = $1`, [ustadId]
    );

    return { booking: rows[0], commission, ustadEarning };
  });
};

/**
 * Get status history for a booking
 */
const getBookingStatusHistory = async (bookingId) => {
  return query(
    `SELECT * FROM booking_status_history
     WHERE booking_id = $1 ORDER BY created_at ASC`,
    [bookingId]
  );
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingsByUser,
  getBookingsByUstad,
  getPendingBookingsForSubService,
  updateBookingStatus,
  acceptBooking,
  completeBooking,
  getBookingStatusHistory,
};
