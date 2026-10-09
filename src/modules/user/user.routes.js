/**
 * User Routes — /api/v1/users
 */
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  updateLocation,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('./user.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');
const { uploadProfilePhoto } = require('../../middleware/upload');

// All user routes require authentication + customer role
router.use(authenticate, authorize('customer'));

// ─── Profile ─────────────────────────────────────────────
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/profile/photo', ...uploadProfilePhoto, updateProfilePhoto);
router.patch('/location', updateLocation);

// ─── Addresses ───────────────────────────────────────────
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

module.exports = router;
