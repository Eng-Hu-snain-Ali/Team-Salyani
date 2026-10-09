/**
 * Ustad Controller — Profile, documents, skills, nearby search
 */
const {
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
} = require('./ustad.queries');
const { getServiceById } = require('../service/service.queries');
const { sendSuccess } = require('../../utils/response');
const { NotFoundError, ValidationError } = require('../../utils/errors');

const VALID_DOC_TYPES = ['cnic_front', 'cnic_back', 'skill_certificate', 'experience_letter'];

// ════════════════════════════════════════════════
//  PROFILE
// ════════════════════════════════════════════════

/**
 * GET /ustads/profile — Get own profile
 */
const getProfile = async (req, res, next) => {
  try {
    const ustad = await getUstadById(req.user.id);
    if (!ustad) throw new NotFoundError('Ustad profile not found');
    sendSuccess(res, ustad, 'Profile fetched successfully');
  } catch (err) { next(err); }
};

/**
 * PUT /ustads/profile — Update own profile
 * Body: { name?, email?, cnic_number?, bio?, lat?, lng? }
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, cnic_number, bio, lat, lng } = req.body;
    const profileImageUrl = req.uploadedFile ? req.uploadedFile.url : undefined;

    const updated = await updateUstadProfile(req.user.id, {
      name,
      email,
      cnicNumber: cnic_number,
      bio,
      lat: lat !== undefined ? parseFloat(lat) : undefined,
      lng: lng !== undefined ? parseFloat(lng) : undefined,
      profileImageUrl,
    });
    if (!updated) throw new NotFoundError('Ustad not found');
    sendSuccess(res, updated, 'Profile updated successfully');
  } catch (err) { next(err); }
};

/**
 * PATCH /ustads/profile/photo — Upload profile photo
 */
const updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.uploadedFile) throw new ValidationError('No photo file provided');
    const updated = await updateUstadProfile(req.user.id, {
      profileImageUrl: req.uploadedFile.url,
    });
    if (!updated) throw new NotFoundError('Ustad not found');
    sendSuccess(res, { profile_image_url: updated.profile_image_url }, 'Photo updated successfully');
  } catch (err) { next(err); }
};

/**
 * PATCH /ustads/availability — Toggle online/offline
 * Body: { is_available: true | false }
 */
const updateAvailability = async (req, res, next) => {
  try {
    const { is_available } = req.body;
    if (is_available === undefined) throw new ValidationError('is_available (boolean) is required');

    const updated = await toggleAvailability(req.user.id, Boolean(is_available));
    if (!updated) throw new NotFoundError('Ustad not found');

    const status = updated.is_available ? 'online' : 'offline';
    sendSuccess(res, updated, `You are now ${status}`);
  } catch (err) { next(err); }
};

/**
 * PATCH /ustads/location — Update GPS location
 * Body: { lat, lng }
 */
const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) throw new ValidationError('lat and lng are required');
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng)))
      throw new ValidationError('lat and lng must be valid numbers');

    const updated = await updateUstadLocation(req.user.id, {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });
    if (!updated) throw new NotFoundError('Ustad not found');
    sendSuccess(res, updated, 'Location updated successfully');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════
//  DOCUMENTS (KYC)
// ════════════════════════════════════════════════

/**
 * GET /ustads/documents — Get own uploaded documents
 */
const getDocuments = async (req, res, next) => {
  try {
    const docs = await getUstadDocuments(req.user.id);
    sendSuccess(res, docs, 'Documents fetched successfully');
  } catch (err) { next(err); }
};

/**
 * POST /ustads/documents — Upload a KYC document
 * multipart/form-data: { document_type, file }
 */
const uploadDocument = async (req, res, next) => {
  try {
    const { document_type } = req.body;

    if (!document_type) throw new ValidationError('document_type is required');
    if (!VALID_DOC_TYPES.includes(document_type))
      throw new ValidationError(`document_type must be one of: ${VALID_DOC_TYPES.join(', ')}`);
    if (!req.uploadedFile) throw new ValidationError('Document file is required');

    const doc = await createUstadDocument(req.user.id, {
      documentType: document_type,
      documentUrl: req.uploadedFile.url,
    });
    sendSuccess(res, doc, 'Document uploaded successfully', 201);
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════
//  SKILLS
// ════════════════════════════════════════════════

/**
 * GET /ustads/skills — Get own skills
 */
const getSkills = async (req, res, next) => {
  try {
    const skills = await getUstadSkills(req.user.id);
    sendSuccess(res, skills, 'Skills fetched successfully');
  } catch (err) { next(err); }
};

/**
 * POST /ustads/skills — Add a skill
 * Body: { service_id, experience_years? }
 */
const addSkill = async (req, res, next) => {
  try {
    const { service_id, experience_years } = req.body;
    if (!service_id) throw new ValidationError('service_id is required');

    // Verify service exists
    const service = await getServiceById(service_id);
    if (!service) throw new NotFoundError('Service not found');

    const skill = await addUstadSkill(req.user.id, {
      serviceId: service_id,
      experienceYears: experience_years ? parseInt(experience_years) : 0,
    });
    sendSuccess(res, skill, 'Skill added successfully', 201);
  } catch (err) { next(err); }
};

/**
 * DELETE /ustads/skills/:id — Remove a skill
 */
const removeSkill = async (req, res, next) => {
  try {
    const deleted = await removeUstadSkill(req.params.id, req.user.id);
    if (!deleted) throw new NotFoundError('Skill not found');
    sendSuccess(res, { id: deleted.id }, 'Skill removed successfully');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════
//  PUBLIC ENDPOINTS
// ════════════════════════════════════════════════

/**
 * GET /ustads/:id/public — Public profile (for customers)
 */
const getPublicProfile = async (req, res, next) => {
  try {
    const ustad = await getUstadPublicProfile(req.params.id);
    if (!ustad) throw new NotFoundError('Ustad not found');
    sendSuccess(res, ustad, 'Ustad profile fetched successfully');
  } catch (err) { next(err); }
};

/**
 * GET /ustads/nearby — Find nearby available ustads
 * Query: { lat, lng, service_id?, radius_km? }
 * Auth: Customer
 */
const getNearbyUstads = async (req, res, next) => {
  try {
    const { lat, lng, service_id, radius_km } = req.query;

    if (!lat || !lng) throw new ValidationError('lat and lng query params are required');
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng)))
      throw new ValidationError('lat and lng must be valid numbers');

    const ustads = await findNearbyUstads({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      serviceId: service_id || null,
      radiusKm: radius_km ? parseFloat(radius_km) : null,
    });

    sendSuccess(res, ustads, `Found ${ustads.length} ustad(s) nearby`);
  } catch (err) { next(err); }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  updateAvailability,
  updateLocation,
  getDocuments,
  uploadDocument,
  getSkills,
  addSkill,
  removeSkill,
  getPublicProfile,
  getNearbyUstads,
};
