const { neon } = require('@neondatabase/serverless');

/**
 * Neon Serverless PostgreSQL Connection
 *
 * Uses Neon's updated serverless driver API:
 * - Tagged template literals:  sql`SELECT * FROM users WHERE id = ${id}`
 * - Conventional query:        sql.query('SELECT * FROM users WHERE id = $1', [id])
 */

let sql;

const getDb = () => {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
};

/**
 * Execute a raw SQL query with parameterized values
 * Uses sql.query() for conventional $1, $2 placeholder style
 *
 * @param {string} queryText - SQL with $1, $2... placeholders
 * @param {Array}  params    - Parameter values array
 * @returns {Promise<Array>} Query result rows
 *
 * @example
 * const rows = await query('SELECT * FROM users WHERE id = $1', [userId]);
 */
const query = async (queryText, params = []) => {
  const db = getDb();
  try {
    const result = await db.query(queryText, params);
    // Neon returns { rows, rowCount, ... } — return rows array
    return result.rows ?? result;
  } catch (err) {
    console.error('Database query error:', err.message);
    throw err;
  }
};

/**
 * Execute multiple queries as an atomic transaction
 * Wraps operations in BEGIN / COMMIT / ROLLBACK
 *
 * @param {Function} callback - async (query) => { ... }
 * @returns {Promise<any>}
 *
 * @example
 * await transaction(async (q) => {
 *   await q('UPDATE wallets SET balance = balance + $1 WHERE ustad_id = $2', [amount, ustadId]);
 *   await q('INSERT INTO wallet_transactions (...) VALUES (...)', [...]);
 * });
 */
const transaction = async (callback) => {
  const db = getDb();
  try {
    await db.query('BEGIN');
    const result = await callback(async (text, params) => {
      const r = await db.query(text, params);
      return r.rows ?? r;
    });
    await db.query('COMMIT');
    return result;
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
};

/**
 * Test database connectivity — called on server startup
 * @returns {Promise<boolean>}
 */
const testConnection = async () => {
  try {
    const rows = await query('SELECT NOW() AS current_time');
    console.log(`✅ Database connected — Server time: ${rows[0].current_time}`);
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

module.exports = { query, transaction, testConnection };
