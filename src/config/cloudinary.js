const cloudinary = require('cloudinary').v2;

/**
 * Cloudinary Configuration
 * Initialized once on first import using env variables
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS URLs
});

/**
 * Upload a file buffer to Cloudinary
 *
 * @param {Buffer} fileBuffer - File buffer from multer memoryStorage
 * @param {string} folder - Cloudinary folder path (from CLOUDINARY_FOLDERS)
 * @param {object} options - Additional Cloudinary upload options
 * @returns {Promise<{ url: string, public_id: string }>}
 *
 * @example
 * const { url, public_id } = await uploadToCloudinary(req.file.buffer, CLOUDINARY_FOLDERS.CNIC);
 */
const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }], // Auto optimize
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return reject(new Error('Image upload failed'));
      }
      resolve({
        url: result.secure_url,
        public_id: result.public_id,
      });
    });

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by public_id
 *
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Non-critical — log and continue (don't crash the request)
    console.error('Cloudinary delete error:', err.message);
  }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
