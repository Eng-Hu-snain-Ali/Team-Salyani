const multer = require('multer');
const { uploadToCloudinary } = require('../config/cloudinary');
const { ValidationError } = require('../utils/errors');
const { CLOUDINARY_FOLDERS } = require('../utils/constants');

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Multer instance with memory storage
 * Files are stored in memory as buffers — then uploaded to Cloudinary
 */
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  },
});

/**
 * Higher-order middleware factory: upload single file → Cloudinary → attach URL to req
 *
 * @param {string} fieldName - Form field name for the file
 * @param {string} folder - Cloudinary folder (from CLOUDINARY_FOLDERS)
 * @param {string} reqKey - Key to attach the result to on req (default: 'uploadedFile')
 * @returns {Function[]} Array of middleware functions [multerMiddleware, cloudinaryUploader]
 *
 * @example
 * // In routes:
 * router.post('/profile/photo', authenticate, ...uploadSingle('photo', CLOUDINARY_FOLDERS.PROFILES), controller);
 * // In controller:
 * const { url, public_id } = req.uploadedFile;
 */
const uploadSingle = (fieldName, folder, reqKey = 'uploadedFile') => {
  const multerMiddleware = multerUpload.single(fieldName);

  const cloudinaryUploader = async (req, res, next) => {
    if (!req.file) return next(); // File is optional — let controller decide

    try {
      const result = await uploadToCloudinary(req.file.buffer, folder);
      req[reqKey] = result; // Attach { url, public_id } to request
      next();
    } catch (err) {
      next(err);
    }
  };

  return [multerMiddleware, cloudinaryUploader];
};

/**
 * Upload multiple files → Cloudinary
 *
 * @param {string} fieldName - Form field name
 * @param {string} folder - Cloudinary folder
 * @param {number} maxCount - Maximum number of files (default: 5)
 * @returns {Function[]}
 */
const uploadMultiple = (fieldName, folder, maxCount = 5) => {
  const multerMiddleware = multerUpload.array(fieldName, maxCount);

  const cloudinaryUploader = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    try {
      const uploads = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, folder))
      );
      req.uploadedFiles = uploads; // Array of { url, public_id }
      next();
    } catch (err) {
      next(err);
    }
  };

  return [multerMiddleware, cloudinaryUploader];
};

// Pre-configured upload middleware for common use cases
const uploadProfilePhoto = uploadSingle('photo', CLOUDINARY_FOLDERS.PROFILES);
const uploadCnicFront = uploadSingle('cnic_front', CLOUDINARY_FOLDERS.CNIC);
const uploadCnicBack = uploadSingle('cnic_back', CLOUDINARY_FOLDERS.CNIC);
const uploadCertificate = uploadSingle('certificate', CLOUDINARY_FOLDERS.CERTIFICATES);
const uploadBookingPhoto = uploadSingle('problem_image', CLOUDINARY_FOLDERS.BOOKINGS);

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadProfilePhoto,
  uploadCnicFront,
  uploadCnicBack,
  uploadCertificate,
  uploadBookingPhoto,
};
