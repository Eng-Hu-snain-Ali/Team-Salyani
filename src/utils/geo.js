/**
 * Geographic utility functions
 * Uses the Haversine formula to calculate distances between coordinates
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number}
 */
const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 *
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers (rounded to 2 decimal places)
 *
 * @example
 * const dist = haversineDistance(31.4504, 73.1350, 31.4187, 73.0791);
 * // Returns distance in km between two points in Faisalabad
 */
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
};

/**
 * Build the Haversine SQL expression for use in raw SQL queries
 * Returns the distance in km as a computed column
 *
 * @param {string} latCol - Column name for latitude (e.g. 'u.lat')
 * @param {string} lngCol - Column name for longitude (e.g. 'u.lng')
 * @param {number} paramLat - SQL param index for customer lat (e.g. 1)
 * @param {number} paramLng - SQL param index for customer lng (e.g. 2)
 * @returns {string} SQL snippet
 *
 * @example
 * const sql = `
 *   SELECT *, ${geoDistanceSql('lat', 'lng', 1, 2)} AS distance_km
 *   FROM ustads
 *   WHERE is_available = true
 *   HAVING distance_km <= $3
 *   ORDER BY distance_km ASC
 * `;
 */
const geoDistanceSql = (latCol, lngCol, paramLat, paramLng) => {
  return `(
    6371 * acos(
      LEAST(1.0, 
        cos(radians($${paramLat})) * cos(radians(${latCol})) *
        cos(radians(${lngCol}) - radians($${paramLng}})) +
        sin(radians($${paramLat})) * sin(radians(${latCol}))
      )
    )
  )`;
};

/**
 * Check if a coordinate pair is within a valid range
 * Pakistan bounds: lat [23, 37], lng [60, 78]
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {boolean}
 */
const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

/**
 * Check if coordinate is within Pakistan bounds (loose check)
 * @param {number} lat
 * @param {number} lng
 * @returns {boolean}
 */
const isInPakistan = (lat, lng) => {
  return lat >= 23 && lat <= 37 && lng >= 60 && lng <= 78;
};

module.exports = {
  haversineDistance,
  geoDistanceSql,
  isValidCoordinate,
  isInPakistan,
};
