/**
 * User Controller — Customer profile & addresses
 */
const {
  getUserById,
  updateUserProfile,
  updateUserLocation,
  getUserAddresses,
  getAddressById,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
} = require('./user.queries');
const { sendSuccess } = require('../../utils/response');
const { NotFoundError, ValidationError, ForbiddenError } = require('../../utils/errors');

// ════════════════════════════════════════════════
//  PROFILE
// ════════════════════════════════════════════════

/**
 * GET /users/profile
 * Get own profile (customer only)
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) throw new NotFoundError('User profile not found');
    sendSuccess(res, user, 'Profile fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /users/profile
 * Update own profile: name, email, lat, lng
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, lat, lng } = req.body;

    // If photo was uploaded via middleware
    const profileImageUrl = req.uploadedFile ? req.uploadedFile.url : undefined;

    const updated = await updateUserProfile(req.user.id, {
      name,
      email,
      lat: lat !== undefined ? parseFloat(lat) : undefined,
      lng: lng !== undefined ? parseFloat(lng) : undefined,
      profileImageUrl,
    });
    if (!updated) throw new NotFoundError('User not found');
    sendSuccess(res, updated, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /users/profile/photo
 * Upload or replace profile photo (multipart/form-data field: photo)
 */
const updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.uploadedFile) throw new ValidationError('No photo file provided');

    const updated = await updateUserProfile(req.user.id, {
      profileImageUrl: req.uploadedFile.url,
    });
    if (!updated) throw new NotFoundError('User not found');
    sendSuccess(res, { profile_image_url: updated.profile_image_url }, 'Profile photo updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /users/location
 * Update GPS location (called frequently by mobile app)
 */
const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) throw new ValidationError('lat and lng are required');
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng)))
      throw new ValidationError('lat and lng must be valid numbers');

    const updated = await updateUserLocation(req.user.id, {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });
    if (!updated) throw new NotFoundError('User not found');
    sendSuccess(res, updated, 'Location updated successfully');
  } catch (err) {
    next(err);
  }
};

// ════════════════════════════════════════════════
//  ADDRESSES
// ════════════════════════════════════════════════

/**
 * GET /users/addresses
 * Get all saved addresses for the logged-in user
 */
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await getUserAddresses(req.user.id);
    sendSuccess(res, addresses, 'Addresses fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /users/addresses
 * Add a new saved address
 * Body: { label, address_line, city?, lat, lng, is_default? }
 */
const addAddress = async (req, res, next) => {
  try {
    const { label, address_line, city, lat, lng, is_default } = req.body;
    if (!address_line) throw new ValidationError('address_line is required');
    if (lat === undefined || lng === undefined) throw new ValidationError('lat and lng are required');

    const address = await addUserAddress(req.user.id, {
      label,
      addressLine: address_line,
      city,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      isDefault: is_default || false,
    });
    sendSuccess(res, address, 'Address added successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /users/addresses/:id
 * Update a saved address (must belong to user)
 */
const updateAddress = async (req, res, next) => {
  try {
    const { label, address_line, city, lat, lng, is_default } = req.body;

    // Ownership check
    const existing = await getAddressById(req.params.id, req.user.id);
    if (!existing) throw new NotFoundError('Address not found');

    const updated = await updateUserAddress(req.params.id, req.user.id, {
      label,
      addressLine: address_line,
      city,
      lat: lat !== undefined ? parseFloat(lat) : undefined,
      lng: lng !== undefined ? parseFloat(lng) : undefined,
      isDefault: is_default,
    });
    sendSuccess(res, updated, 'Address updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /users/addresses/:id
 * Delete a saved address (must belong to user)
 */
const deleteAddress = async (req, res, next) => {
  try {
    const deleted = await deleteUserAddress(req.params.id, req.user.id);
    if (!deleted) throw new NotFoundError('Address not found or not yours');
    sendSuccess(res, { id: deleted.id }, 'Address deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  updateLocation,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
