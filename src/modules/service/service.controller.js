/**
 * Service Controller
 * Handles HTTP requests for services, sub-services, and rate cards
 */
const {
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
} = require('./service.queries');
const { sendSuccess } = require('../../utils/response');
const { NotFoundError, ValidationError, ConflictError } = require('../../utils/errors');

// ════════════════════════════════════════════════
//  SERVICES
// ════════════════════════════════════════════════

/**
 * GET /services
 * Public — Get all active services with sub-service count
 */
const listServices = async (req, res, next) => {
  try {
    const services = await getAllServices();
    sendSuccess(res, services, 'Services fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /services/:id
 * Public — Get single service with all its sub-services + rate cards
 */
const getService = async (req, res, next) => {
  try {
    const service = await getServiceWithSubServices(req.params.id);
    if (!service) throw new NotFoundError('Service not found');
    sendSuccess(res, service, 'Service fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /services/:id/sub-services
 * Public — Get all sub-services of a service
 */
const listSubServicesForService = async (req, res, next) => {
  try {
    const service = await getServiceById(req.params.id);
    if (!service) throw new NotFoundError('Service not found');

    const subServices = await getSubServicesByServiceId(req.params.id);
    sendSuccess(res, subServices, 'Sub-services fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /services
 * Admin Only — Create a new service category
 * Body: { name, description?, sort_order? }
 */
const createServiceHandler = async (req, res, next) => {
  try {
    const { name, description, sort_order } = req.body;
    if (!name) throw new ValidationError('Service name is required');

    // Check icon if uploaded via multer
    const iconUrl = req.file ? req.file.path : null;

    const service = await createService({ name, description, iconUrl, sortOrder: sort_order });
    sendSuccess(res, service, 'Service created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /services/:id
 * Admin Only — Update service details
 * Body: { name?, description?, is_active?, sort_order? }
 */
const updateServiceHandler = async (req, res, next) => {
  try {
    const { name, description, is_active, sort_order } = req.body;
    const iconUrl = req.file ? req.file.path : undefined;

    const service = await updateService(req.params.id, {
      name,
      description,
      iconUrl,
      isActive: is_active,
      sortOrder: sort_order,
    });
    if (!service) throw new NotFoundError('Service not found');

    sendSuccess(res, service, 'Service updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /services/:id
 * Admin Only — Soft-delete (deactivate) a service
 */
const deleteServiceHandler = async (req, res, next) => {
  try {
    const service = await deactivateService(req.params.id);
    if (!service) throw new NotFoundError('Service not found');
    sendSuccess(res, service, 'Service deactivated successfully');
  } catch (err) {
    next(err);
  }
};

// ════════════════════════════════════════════════
//  SUB-SERVICES
// ════════════════════════════════════════════════

/**
 * POST /sub-services
 * Admin Only — Create a new sub-service
 * Body: { service_id, name, description? }
 */
const createSubServiceHandler = async (req, res, next) => {
  try {
    const { service_id, name, description } = req.body;
    if (!service_id) throw new ValidationError('service_id is required');
    if (!name) throw new ValidationError('Sub-service name is required');

    // Verify parent service exists
    const parent = await getServiceById(service_id);
    if (!parent) throw new NotFoundError('Parent service not found');

    const subService = await createSubService({ serviceId: service_id, name, description });
    sendSuccess(res, subService, 'Sub-service created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /sub-services/:id
 * Admin Only — Update a sub-service
 * Body: { name?, description?, is_active? }
 */
const updateSubServiceHandler = async (req, res, next) => {
  try {
    const { name, description, is_active } = req.body;
    const subService = await updateSubService(req.params.id, {
      name,
      description,
      isActive: is_active,
    });
    if (!subService) throw new NotFoundError('Sub-service not found');
    sendSuccess(res, subService, 'Sub-service updated successfully');
  } catch (err) {
    next(err);
  }
};

// ════════════════════════════════════════════════
//  RATE CARDS
// ════════════════════════════════════════════════

/**
 * GET /sub-services/:id/rate-card
 * Public — Get rate card for a sub-service
 */
const getRateCard = async (req, res, next) => {
  try {
    const subService = await getSubServiceById(req.params.id);
    if (!subService) throw new NotFoundError('Sub-service not found');

    const rateCard = await getRateCardBySubServiceId(req.params.id);
    if (!rateCard) throw new NotFoundError('Rate card not found for this sub-service');

    sendSuccess(res, rateCard, 'Rate card fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /rate-cards
 * Admin Only — Create a rate card for a sub-service
 * Body: { sub_service_id, base_price, price_unit }
 */
const createRateCardHandler = async (req, res, next) => {
  try {
    const { sub_service_id, base_price, price_unit } = req.body;
    if (!sub_service_id) throw new ValidationError('sub_service_id is required');
    if (base_price === undefined || base_price === null) throw new ValidationError('base_price is required');
    if (isNaN(parseFloat(base_price)) || parseFloat(base_price) < 0)
      throw new ValidationError('base_price must be a positive number');

    const validUnits = ['fixed', 'per_hour', 'per_visit'];
    if (price_unit && !validUnits.includes(price_unit))
      throw new ValidationError(`price_unit must be one of: ${validUnits.join(', ')}`);

    // Verify sub-service exists
    const subService = await getSubServiceById(sub_service_id);
    if (!subService) throw new NotFoundError('Sub-service not found');

    const rateCard = await createRateCard({ subServiceId: sub_service_id, basePrice: base_price, priceUnit: price_unit });
    sendSuccess(res, rateCard, 'Rate card created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /rate-cards/:id
 * Admin Only — Update a rate card
 * Body: { base_price?, price_unit?, is_active? }
 */
const updateRateCardHandler = async (req, res, next) => {
  try {
    const { base_price, price_unit, is_active } = req.body;

    if (base_price !== undefined && (isNaN(parseFloat(base_price)) || parseFloat(base_price) < 0))
      throw new ValidationError('base_price must be a positive number');

    const validUnits = ['fixed', 'per_hour', 'per_visit'];
    if (price_unit && !validUnits.includes(price_unit))
      throw new ValidationError(`price_unit must be one of: ${validUnits.join(', ')}`);

    const rateCard = await updateRateCard(req.params.id, {
      basePrice: base_price,
      priceUnit: price_unit,
      isActive: is_active,
    });
    if (!rateCard) throw new NotFoundError('Rate card not found');
    sendSuccess(res, rateCard, 'Rate card updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
