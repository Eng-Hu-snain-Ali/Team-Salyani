/**
 * Payment & Wallet Routes — /api/v1/payments & /api/v1/wallets
 */
const express = require('express');
const {
  recordPaymentHandler,
  getPaymentHandler,
  getBookingPaymentHandler,
  getMyWalletHandler,
  getWalletTransactionsHandler,
} = require('./payment.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');

// ─── Payment Router (/api/v1/payments) ─────────────────────────
const paymentRouter = express.Router();
paymentRouter.use(authenticate);

// POST /payments — Ustad records payment
paymentRouter.post('/', authorize('ustad'), recordPaymentHandler);

// GET /payments/booking/:bookingId — Get payment for a booking
paymentRouter.get('/booking/:bookingId', getBookingPaymentHandler);

// GET /payments/:id — Get payment details
paymentRouter.get('/:id', getPaymentHandler);

// ─── Wallet Router (/api/v1/wallets) ───────────────────────────
const walletRouter = express.Router();
walletRouter.use(authenticate);
walletRouter.use(authorize('ustad'));

// GET /wallets/me — Ustad gets wallet balance & summary
walletRouter.get('/me', getMyWalletHandler);

// GET /wallets/transactions — Ustad gets transaction history
walletRouter.get('/transactions', getWalletTransactionsHandler);

module.exports = { paymentRouter, walletRouter };
