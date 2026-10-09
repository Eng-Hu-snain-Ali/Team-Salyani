/**
 * Payment Controller
 */
const {
  getPaymentById,
  getPaymentByBookingId,
  processPaymentTransaction,
  getWalletByUstadId,
  getWalletTransactionsByUstadId,
} = require('./payment.queries');
const { getBookingById } = require('../booking/booking.queries');
const { sendNotification } = require('../notification/notification.service');
const { sendSuccess } = require('../../utils/response');
const { buildPaginationMeta } = require('../../utils/response');
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} = require('../../utils/errors');
const {
  BOOKING_STATUS,
  PAYMENT_METHOD,
  NOTIFICATION_TYPE,
  ROLES,
  PAGINATION,
} = require('../../utils/constants');

/**
 * POST /payments
 * Ustad records payment received from customer
 */
const recordPaymentHandler = async (req, res, next) => {
  try {
    const { booking_id, payment_method = PAYMENT_METHOD.CASH, total_amount } = req.body;

    if (!booking_id) throw new ValidationError('booking_id is required');
    if (!total_amount || isNaN(total_amount) || parseFloat(total_amount) <= 0) {
      throw new ValidationError('total_amount must be a positive number');
    }

    const validMethods = Object.values(PAYMENT_METHOD);
    if (!validMethods.includes(payment_method)) {
      throw new ValidationError(`Invalid payment_method. Allowed: ${validMethods.join(', ')}`);
    }

    // Verify booking
    const booking = await getBookingById(booking_id);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.ustad_id !== req.user.id) {
      throw new ForbiddenError('You can only record payments for your own assigned bookings');
    }

    if (booking.status === BOOKING_STATUS.PAID) {
      throw new ConflictError('Payment has already been recorded for this booking');
    }

    if (booking.status !== BOOKING_STATUS.COMPLETED) {
      throw new ValidationError(
        `Cannot record payment for booking in '${booking.status}' status. Job must be completed first.`
      );
    }

    const numericTotal = parseFloat(total_amount);
    // 10% platform commission
    const commissionAmount = Math.round(numericTotal * 0.10 * 100) / 100;
    const ustadEarning = Math.round((numericTotal - commissionAmount) * 100) / 100;

    const { payment, wallet } = await processPaymentTransaction({
      bookingId: booking_id,
      userId: booking.user_id,
      ustadId: req.user.id,
      totalAmount: numericTotal,
      commissionAmount,
      ustadEarning,
      paymentMethod: payment_method,
      paymentStatus: 'completed',
    });

    // Notify customer
    const io = req.app.get('io');
    await sendNotification({
      recipientId: booking.user_id,
      recipientRole: ROLES.CUSTOMER,
      type: NOTIFICATION_TYPE.PAYMENT_RECEIVED,
      title: 'Payment Confirmed 💰',
      message: `Payment of PKR ${numericTotal} recorded for booking #${booking_id.substring(0, 8)}.`,
      data: { booking_id, payment_id: payment.id, total_amount: numericTotal },
      io,
    });

    sendSuccess(
      res,
      {
        id: payment.id,
        booking_id: payment.booking_id,
        total_amount: parseFloat(payment.total_amount),
        commission_amount: parseFloat(payment.commission_amount),
        ustad_earning: parseFloat(payment.ustad_earning),
        payment_method: payment.payment_method,
        payment_status: payment.payment_status,
        wallet_balance: parseFloat(wallet.balance),
      },
      'Payment recorded successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /payments/:id
 */
const getPaymentHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await getPaymentById(id);
    if (!payment) throw new NotFoundError('Payment not found');

    // Access control
    if (
      req.user.role !== ROLES.ADMIN &&
      payment.user_id !== req.user.id &&
      payment.ustad_id !== req.user.id
    ) {
      throw new ForbiddenError('Access denied to this payment record');
    }

    sendSuccess(res, {
      ...payment,
      total_amount: parseFloat(payment.total_amount),
      commission_amount: parseFloat(payment.commission_amount),
      ustad_earning: parseFloat(payment.ustad_earning),
    }, 'Payment details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /payments/booking/:bookingId
 */
const getBookingPaymentHandler = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const payment = await getPaymentByBookingId(bookingId);
    if (!payment) throw new NotFoundError('Payment not found for this booking');

    // Access control
    if (
      req.user.role !== ROLES.ADMIN &&
      payment.user_id !== req.user.id &&
      payment.ustad_id !== req.user.id
    ) {
      throw new ForbiddenError('Access denied to this payment record');
    }

    sendSuccess(res, {
      ...payment,
      total_amount: parseFloat(payment.total_amount),
      commission_amount: parseFloat(payment.commission_amount),
      ustad_earning: parseFloat(payment.ustad_earning),
    }, 'Booking payment retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /wallets/me
 * Ustad gets own wallet balance and recent transactions
 */
const getMyWalletHandler = async (req, res, next) => {
  try {
    const wallet = await getWalletByUstadId(req.user.id);
    sendSuccess(res, wallet, 'Wallet summary retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /wallets/transactions
 * Ustad gets wallet transactions history
 */
const getWalletTransactionsHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;

    const { transactions, total } = await getWalletTransactionsByUstadId(req.user.id, {
      page,
      limit,
    });
    const meta = buildPaginationMeta(page, limit, total);

    sendSuccess(res, transactions, 'Wallet transactions retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  recordPaymentHandler,
  getPaymentHandler,
  getBookingPaymentHandler,
  getMyWalletHandler,
  getWalletTransactionsHandler,
};
