/**
 * Ustad Routes — /api/v1/ustads
 */
const express = require('express');
const router = express.Router();
const {
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
} = require('./ustad.controller');
const { authenticate, authorize } = require('../../middleware/authenticate');
const { uploadProfilePhoto, uploadSingle } = require('../../middleware/upload');
const { CLOUDINARY_FOLDERS } = require('../../utils/constants');

// ─── Public routes (no auth needed) ──────────────────────
// NOTE: must be declared BEFORE router.use(authenticate)

// GET /ustads/nearby — Customer finds available ustads
router.get('/nearby', authenticate, authorize('customer'), getNearbyUstads);

// GET /ustads/:id/public — Anyone can view ustad public profile
router.get('/:id/public', getPublicProfile);

// ─── Protected routes (ustad only) ───────────────────────
router.use(authenticate, authorize('ustad'));

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/profile/photo', ...uploadProfilePhoto, updateProfilePhoto);
router.patch('/availability', updateAvailability);
router.patch('/location', updateLocation);

// Documents (KYC)
router.get('/documents', getDocuments);
router.post(
  '/documents',
  ...uploadSingle('file', CLOUDINARY_FOLDERS ? 'ustad_online/cnic' : 'ustad_online/cnic', 'uploadedFile'),
  uploadDocument
);

// Skills
router.get('/skills', getSkills);
router.post('/skills', addSkill);
router.delete('/skills/:id', removeSkill);

module.exports = router;
