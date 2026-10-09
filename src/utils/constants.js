/**
 * App-wide constants and enums
 * Single source of truth for all string values used across the backend
 */

// ─── User Roles ────────────────────────────────────────────────────────────────
const ROLES = {
  CUSTOMER: 'customer',
  USTAD: 'ustad',
  ADMIN: 'admin',
};

// ─── Ustad Verification Status ─────────────────────────────────────────────────
const VERIFICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// ─── Document Types (KYC) ──────────────────────────────────────────────────────
const DOCUMENT_TYPE = {
  CNIC_FRONT: 'cnic_front',
  CNIC_BACK: 'cnic_back',
  SKILL_CERTIFICATE: 'skill_certificate',
  EXPERIENCE_LETTER: 'experience_letter',
};

// ─── Document Status ───────────────────────────────────────────────────────────
const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// ─── Booking Status ────────────────────────────────────────────────────────────
const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

// Valid booking status transitions — prevents illegal status jumps
const BOOKING_STATUS_TRANSITIONS = {
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.CANCELLED, BOOKING_STATUS.EXPIRED],
  [BOOKING_STATUS.ACCEPTED]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.COMPLETED]: [BOOKING_STATUS.PAID],
  [BOOKING_STATUS.PAID]: [],
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.EXPIRED]: [],
};

// ─── Payment Method ─────────────────────────────────────────────────────────────
const PAYMENT_METHOD = {
  CASH: 'cash',
  EASYPAISA: 'easypaisa',
  JAZZCASH: 'jazzcash',
};

// ─── Payment Status ─────────────────────────────────────────────────────────────
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// ─── Wallet Transaction Types ───────────────────────────────────────────────────
const TRANSACTION_TYPE = {
  CREDIT: 'credit',
  DEBIT: 'debit',
  WITHDRAWAL: 'withdrawal',
  COMMISSION: 'commission',
};

// ─── Message Types ──────────────────────────────────────────────────────────────
const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  SYSTEM: 'system',
};

// ─── Notification Types ─────────────────────────────────────────────────────────
const NOTIFICATION_TYPE = {
  NEW_BOOKING_REQUEST: 'new_booking_request',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_COMPLETED: 'booking_completed',
  PAYMENT_RECEIVED: 'payment_received',
  REVIEW_RECEIVED: 'review_received',
  KYC_APPROVED: 'kyc_approved',
  KYC_REJECTED: 'kyc_rejected',
  NEW_MESSAGE: 'new_message',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
};

// ─── Price Unit ─────────────────────────────────────────────────────────────────
const PRICE_UNIT = {
  FIXED: 'fixed',
  PER_HOUR: 'per_hour',
  PER_VISIT: 'per_visit',
};

// ─── Admin Roles ────────────────────────────────────────────────────────────────
const ADMIN_ROLE = {
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
};

// ─── Cloudinary Folders ─────────────────────────────────────────────────────────
const CLOUDINARY_FOLDERS = {
  CNIC: 'ustad_online/cnic',
  CERTIFICATES: 'ustad_online/certificates',
  PROFILES: 'ustad_online/profiles',
  BOOKINGS: 'ustad_online/bookings',
  SERVICES: 'ustad_online/services',
};

// ─── HTTP Status Codes ──────────────────────────────────────────────────────────
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// ─── Pagination Defaults ────────────────────────────────────────────────────────
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// ─── Socket Events ──────────────────────────────────────────────────────────────
const SOCKET_EVENTS = {
  // Chat
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  TYPING: 'typing',
  USER_TYPING: 'user_typing',
  MESSAGE_READ: 'message_read',

  // Tracking
  START_TRACKING: 'start_tracking',
  STOP_TRACKING: 'stop_tracking',
  UPDATE_LOCATION: 'update_location',
  LOCATION_UPDATE: 'location_update',

  // Notifications
  NEW_NOTIFICATION: 'new_notification',

  // Booking real-time events (emitted by server to clients)
  BOOKING_REQUEST: 'booking_request',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
};

// ─── Socket Rooms ───────────────────────────────────────────────────────────────
const socketRoom = {
  user: (userId) => `user:${userId}`,
  booking: (bookingId) => `booking:${bookingId}`,
  tracking: (bookingId) => `tracking:${bookingId}`,
  availableUstads: 'ustads:available',
  admin: 'admin',
};

module.exports = {
  ROLES,
  VERIFICATION_STATUS,
  DOCUMENT_TYPE,
  DOCUMENT_STATUS,
  BOOKING_STATUS,
  BOOKING_STATUS_TRANSITIONS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  TRANSACTION_TYPE,
  MESSAGE_TYPE,
  NOTIFICATION_TYPE,
  PRICE_UNIT,
  ADMIN_ROLE,
  CLOUDINARY_FOLDERS,
  HTTP_STATUS,
  PAGINATION,
  SOCKET_EVENTS,
  socketRoom,
};
