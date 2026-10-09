/**
 * Service Routes
 * Base paths:
 *   /api/v1/services
 *   /api/v1/sub-services
 *   /api/v1/rate-cards
 */
const express = require('express');
const router = express.Router();
const {
  listServices,
  getService,
  listSubServicesForService,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
  createSubServiceHandler,
  updateSubServiceHandler,
  getRateCard,
  createRateCardHandler,
  updateRateCardHandler,
} = require('./service.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');
const { uploadSingle } = require('../../middleware/upload');

// ════════════════════════════════════════════════
//  /api/v1/services
// ════════════════════════════════════════════════

// GET /services — All active services (public)
router.get('/', listServices);

// GET /services/:id — Single service + sub-services (public)
router.get('/:id', getService);

// GET /services/:id/sub-services — Sub-services list (public)
router.get('/:id/sub-services', listSubServicesForService);

// POST /services — Create service (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  ...uploadSingle('icon', 'ustad_online/services'),
  createServiceHandler
);

// PUT /services/:id — Update service (admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  ...uploadSingle('icon', 'ustad_online/services'),
  updateServiceHandler
);

// DELETE /services/:id — Deactivate service (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteServiceHandler);

// ════════════════════════════════════════════════
//  /api/v1/sub-services
// ════════════════════════════════════════════════

const subRouter = express.Router();

// GET /sub-services/:id/rate-card — Rate card for a sub-service (public)
subRouter.get('/:id/rate-card', getRateCard);

// POST /sub-services — Create sub-service (admin only)
subRouter.post('/', authenticate, authorize('admin'), createSubServiceHandler);

// PUT /sub-services/:id — Update sub-service (admin only)
subRouter.put('/:id', authenticate, authorize('admin'), updateSubServiceHandler);

// ════════════════════════════════════════════════
//  /api/v1/rate-cards
// ════════════════════════════════════════════════

const rateCardRouter = express.Router();

// POST /rate-cards — Create rate card (admin only)
rateCardRouter.post('/', authenticate, authorize('admin'), createRateCardHandler);

// PUT /rate-cards/:id — Update rate card (admin only)
rateCardRouter.put('/:id', authenticate, authorize('admin'), updateRateCardHandler);

module.exports = { serviceRouter: router, subRouter, rateCardRouter };
