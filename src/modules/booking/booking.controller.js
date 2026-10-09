/**
 * Booking Controller
 * Handles all booking lifecycle: create, list, status transitions
 * Emits real-time Socket.io events on every status change
 */
const {
  createBooking,
  getBookingById,
  getBookingsByUser,
  getBookingsByUstad,
  updateBookingStatus,
  acceptBooking,
  completeBooking,
  getBookingStatusHistory,
} = require('./booking.queries');
const { getRateCardBySubServiceId, getSubServiceById } = require('../service/service.queries');
const { findNearbyUstads } = require('../ustad/ustad.queries');
const { sendSuccess } = require('../../utils/response');
const { buildPaginationMeta } = require('../../utils/response');
const {
  NotFoundError, ValidationError, ForbiddenError,
} = require('../../utils/errors');
const {
  BOOKING_STATUS, BOOKING_STATUS_TRANSITIONS,
  SOCKET_EVENTS, socketRoom, ROLES, PAGINATION,
} = require('../../utils/constants');

// ─── Helper: emit socket event ────────────────────────────
const emitBookingEvent = (io, event, room, data) => {
  if (io) io.to(room).emit(event, data);
};

// ════════════════════════════════════════════════
//  CREATE BOOKING
// ════════════════════════════════════════════════

/**
 * POST /bookings
 * Customer creates a booking (posts a job)
 * Body: { sub_service_id, description?, customer_lat, customer_lng, customer_address? }
 * Optional: multipart file for problem_image
 */
const createBookingHandler = async (req, res, next) => {
  try {
    const { sub_service_id, description, customer_lat, customer_lng, customer_address } = req.body;

    if (!sub_service_id) throw new ValidationError('sub_service_id is required');
    if (!customer_lat || !customer_lng)
      throw new ValidationError('customer_lat and customer_lng are required');

    // Validate sub-service exists
    const subService = await getSubServiceById(sub_service_id);
    if (!subService) throw new NotFoundError('Sub-service not found');

    // Get rate card for estimated price
    const rateCard = await getRateCardBySubServiceId(sub_service_id);
    const estimatedPrice = rateCard ? rateCard.base_price : null;

    // Optional problem image
    const problemImageUrl = req.uploadedFile ? req.uploadedFile.url : null;

    const booking = await createBooking({
      userId: req.user.id,
      subServiceId: sub_service_id,
      description,
      problemImageUrl,
      customerLat: parseFloat(customer_lat),
      customerLng: parseFloat(customer_lng),
      customerAddress: customer_address,
      estimatedPrice,
    });

    // Find nearby verified ustads for this service & notify them via Socket.io
    const io = req.app.get('io');
    const nearbyUstads = await findNearbyUstads({
      lat: parseFloat(customer_lat),
      lng: parseFloat(customer_lng),
      serviceId: subService.service_id,
      radiusKm: null,
    });

    // Emit new booking request to each nearby ustad's room
    nearbyUstads.forEach((ustad) => {
      emitBookingEvent(io, SOCKET_EVENTS.BOOKING_REQUEST,
        socketRoom.user(ustad.id), {
          bookingId: booking.id,
          subServiceName: subService.name,
          serviceName: subService.service_name,
          description,
          estimatedPrice,
          customerLat: parseFloat(customer_lat),
          customerLng: parseFloat(customer_lng),
          customerAddress: customer_address,
        });
    });

    sendSuccess(res, {
      ...booking,
      sub_service_name: subService.name,
      service_name: subService.service_name,
      matched_ustads_count: nearbyUstads.length,
    }, 'Booking created — finding nearby Ustads', 201);
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════
//  LIST BOOKINGS
// ════════════════════════════════════════════════

/**
 * GET /bookings
 * Customer sees own bookings; Ustad sees assigned bookings
 * Query: ?status=&page=&limit=
 */
const listBookings = async (req, res, next) => {
  try {
    const { status, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);

    let result;
    if (req.user.role === ROLES.CUSTOMER) {
      result = await getBookingsByUser(req.user.id, { status, page: p, limit: l });
    } else if (req.user.role === ROLES.USTAD) {
      result = await getBookingsByUstad(req.user.id, { status, page: p, limit: l });
    } else {
      throw new ForbiddenError('Only customers and ustads can list bookings');
    }

    const meta = buildPaginationMeta(p, l, result.total);
    sendSuccess(res, result.bookings, 'Bookings fetched successfully', 200, meta);
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════
//  GET SINGLE BOOKING
// ════════════════════════════════════════════════

/**
 * GET /bookings/:id
 * Customer sees own; Ustad sees assigned; Admin sees all
 */
const getBooking = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');

    // Authorization: customer can only see own, ustad can only see assigned
    if (req.user.role === ROLES.CUSTOMER && booking.user_id !== req.user.id)
      throw new ForbiddenError('Access denied');
    if (req.user.role === ROLES.USTAD && booking.ustad_id !== req.user.id)
      throw new ForbiddenError('Access denied');

    sendSuccess(res, booking, 'Booking fetched successfully');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════
//  STATUS TRANSITIONS
// ════════════════════════════════════════════════

/**
 * PATCH /bookings/:id/accept — Ustad accepts a pending booking
 */
const acceptBookingHandler = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.status !== BOOKING_STATUS.PENDING)
      throw new ValidationError(`Cannot accept a booking with status: ${booking.status}`);

    const { booking: updated, chatRoomId } = await acceptBooking(req.params.id, req.user.id);

    const io = req.app.get('io');
    // Notify customer
    emitBookingEvent(io, SOCKET_EVENTS.BOOKING_ACCEPTED, socketRoom.user(booking.user_id), {
      bookingId: updated.id,
      ustadId: req.user.id,
      chatRoomId,
      status: 'accepted',
    });

    sendSuccess(res, { ...updated, chat_room_id: chatRoomId }, 'Booking accepted');
  } catch (err) { next(err); }
};

/**
 * PATCH /bookings/:id/reject — Ustad rejects a booking (sets back to pending)
 */
const rejectBookingHandler = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.status !== BOOKING_STATUS.PENDING)
      throw new ValidationError(`Cannot reject a booking with status: ${booking.status}`);

    // Rejection just leaves it pending for another ustad — no status change needed
    // But we log it for audit
    const updated = await updateBookingStatus(req.params.id, {
      toStatus: BOOKING_STATUS.PENDING,
      changedByRole: ROLES.USTAD,
      changedById: req.user.id,
      note: `Rejected by ustad ${req.user.id}`,
    });

    sendSuccess(res, { booking_id: req.params.id }, 'Booking rejected — still available for other ustads');
  } catch (err) { next(err); }
};

/**
 * PATCH /bookings/:id/start — Ustad starts the job (pending → in_progress)
 */
const startBookingHandler = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.ustad_id !== req.user.id) throw new ForbiddenError('Not your booking');
    if (booking.status !== BOOKING_STATUS.ACCEPTED)
      throw new ValidationError(`Cannot start a booking with status: ${booking.status}`);

    const updated = await updateBookingStatus(req.params.id, {
      toStatus: BOOKING_STATUS.IN_PROGRESS,
      changedByRole: ROLES.USTAD,
      changedById: req.user.id,
      note: 'Job started',
      extraFields: { started_at: new Date().toISOString() },
    });

    const io = req.app.get('io');
    emitBookingEvent(io, SOCKET_EVENTS.BOOKING_STARTED, socketRoom.user(booking.user_id), {
      bookingId: updated.id, status: 'in_progress',
    });

    sendSuccess(res, updated, 'Job started successfully');
  } catch (err) { next(err); }
};

/**
 * PATCH /bookings/:id/complete — Ustad marks job as completed
 * Body: { final_price }
 */
const completeBookingHandler = async (req, res, next) => {
  try {
    const { final_price } = req.body;
    if (!final_price) throw new ValidationError('final_price is required');
    if (isNaN(parseFloat(final_price)) || parseFloat(final_price) <= 0)
      throw new ValidationError('final_price must be a positive number');

    const booking = await getBookingById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.ustad_id !== req.user.id) throw new ForbiddenError('Not your booking');
    if (booking.status !== BOOKING_STATUS.IN_PROGRESS)
      throw new ValidationError(`Cannot complete a booking with status: ${booking.status}`);

    const { booking: updated, commission, ustadEarning } = await completeBooking(
      req.params.id, req.user.id, parseFloat(final_price)
    );

    const io = req.app.get('io');
    emitBookingEvent(io, SOCKET_EVENTS.BOOKING_COMPLETED, socketRoom.user(booking.user_id), {
      bookingId: updated.id,
      finalPrice: parseFloat(final_price),
      commission,
      ustadEarning,
      status: 'completed',
    });

    sendSuccess(res, {
      booking_id: updated.id,
      status: updated.status,
      final_price: parseFloat(final_price),
      commission_amount: commission,
      ustad_earning: ustadEarning,
      completed_at: updated.completed_at,
    }, 'Booking completed successfully');
  } catch (err) { next(err); }
};

/**
 * PATCH /bookings/:id/cancel — Customer or Ustad cancels booking
 * Body: { reason? }
 */
const cancelBookingHandler = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await getBookingById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');

    // Authorization: only the customer or assigned ustad can cancel
    const isCustomer = req.user.role === ROLES.CUSTOMER && booking.user_id === req.user.id;
    const isUstad = req.user.role === ROLES.USTAD && booking.ustad_id === req.user.id;
    if (!isCustomer && !isUstad) throw new ForbiddenError('Not authorized to cancel this booking');

    // Check if cancellable
    const allowed = BOOKING_STATUS_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(BOOKING_STATUS.CANCELLED))
      throw new ValidationError(`Cannot cancel a booking with status: ${booking.status}`);

    const updated = await updateBookingStatus(req.params.id, {
      toStatus: BOOKING_STATUS.CANCELLED,
      changedByRole: req.user.role,
      changedById: req.user.id,
      note: reason || 'Cancelled',
      extraFields: {
        cancelled_at: new Date().toISOString(),
        cancelled_by: req.user.id,
        cancellation_reason: reason || null,
      },
    });

    const io = req.app.get('io');
    // Notify the other party
    const notifyId = isCustomer ? booking.ustad_id : booking.user_id;
    if (notifyId) {
      emitBookingEvent(io, SOCKET_EVENTS.BOOKING_CANCELLED, socketRoom.user(notifyId), {
        bookingId: updated.id,
        cancelledBy: req.user.role,
        reason: reason || null,
      });
    }

    sendSuccess(res, updated, 'Booking cancelled');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════
//  STATUS HISTORY
// ════════════════════════════════════════════════

/**
 * GET /bookings/:id/status-history
 */
const getStatusHistory = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');

    // Auth check
    if (req.user.role === ROLES.CUSTOMER && booking.user_id !== req.user.id)
      throw new ForbiddenError('Access denied');
    if (req.user.role === ROLES.USTAD && booking.ustad_id !== req.user.id)
      throw new ForbiddenError('Access denied');

    const history = await getBookingStatusHistory(req.params.id);
    sendSuccess(res, history, 'Status history fetched successfully');
  } catch (err) { next(err); }
};

module.exports = {
  createBookingHandler,
  listBookings,
  getBooking,
  acceptBookingHandler,
  rejectBookingHandler,
  startBookingHandler,
  completeBookingHandler,
  cancelBookingHandler,
  getStatusHistory,
};
