/**
 * Payment & Wallet Queries — Raw SQL queries
 */
const { query, transaction } = require('../../config/database');

/**
 * Get payment by ID
 */
const getPaymentById = async (id) => {
  const sql = `
    SELECT
      p.*,
      b.description AS booking_description,
      u.name AS customer_name,
      ust.name AS ustad_name
    FROM payments p
    JOIN bookings b ON b.id = p.booking_id
    JOIN users u ON u.id = p.user_id
    JOIN ustads ust ON ust.id = p.ustad_id
    WHERE p.id = $1;
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
};

/**
 * Get payment by booking ID
 */
const getPaymentByBookingId = async (bookingId) => {
  const sql = `
    SELECT
      p.*,
      b.description AS booking_description,
      u.name AS customer_name,
      ust.name AS ustad_name
    FROM payments p
    JOIN bookings b ON b.id = p.booking_id
    JOIN users u ON u.id = p.user_id
    JOIN ustads ust ON ust.id = p.ustad_id
    WHERE p.booking_id = $1;
  `;
  const rows = await query(sql, [bookingId]);
  return rows[0] || null;
};

/**
 * Get or create wallet for ustad
 */
const getOrCreateWallet = async (ustadId, client = null) => {
  const run = client || query;
  let rows = await run('SELECT * FROM wallets WHERE ustad_id = $1;', [ustadId]);
  if (rows.length === 0) {
    rows = await run(
      `INSERT INTO wallets (ustad_id, balance, total_earned, total_withdrawn, total_commission_paid)
       VALUES ($1, 0.00, 0.00, 0.00, 0.00)
       RETURNING *;`,
      [ustadId]
    );
  }
  return rows[0];
};

/**
 * Record a payment, update booking, and update wallet atomically
 */
const processPaymentTransaction = async ({
  bookingId,
  userId,
  ustadId,
  totalAmount,
  commissionAmount,
  ustadEarning,
  paymentMethod,
  paymentStatus = 'completed',
  transactionRef = null,
}) => {
  return await transaction(async (q) => {
    // 1. Insert payment record
    const paymentSql = `
      INSERT INTO payments (
        booking_id,
        user_id,
        ustad_id,
        total_amount,
        commission_amount,
        ustad_earning,
        payment_method,
        payment_status,
        transaction_ref,
        paid_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *;
    `;
    const paymentRows = await q(paymentSql, [
      bookingId,
      userId,
      ustadId,
      totalAmount,
      commissionAmount,
      ustadEarning,
      paymentMethod,
      paymentStatus,
      transactionRef,
    ]);
    const payment = paymentRows[0];

    // 2. Update booking status to 'paid', final_price, commission_amount
    const updateBookingSql = `
      UPDATE bookings
      SET
        status = 'paid',
        final_price = $1,
        commission_amount = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    await q(updateBookingSql, [totalAmount, commissionAmount, bookingId]);

    // 3. Insert into booking_status_history
    const historySql = `
      INSERT INTO booking_status_history (
        booking_id,
        from_status,
        to_status,
        changed_by_role,
        changed_by_id,
        note
      )
      VALUES ($1, 'completed', 'paid', 'ustad', $2, $3);
    `;
    await q(historySql, [
      bookingId,
      ustadId,
      `Payment recorded via ${paymentMethod}: PKR ${totalAmount}`,
    ]);

    // 4. Ensure wallet exists & update balances
    let walletRows = await q('SELECT * FROM wallets WHERE ustad_id = $1 FOR UPDATE;', [ustadId]);
    if (walletRows.length === 0) {
      walletRows = await q(
        `INSERT INTO wallets (ustad_id, balance, total_earned, total_withdrawn, total_commission_paid)
         VALUES ($1, 0.00, 0.00, 0.00, 0.00)
         RETURNING *;`,
        [ustadId]
      );
    }
    const currentWallet = walletRows[0];

    const currentBalance = parseFloat(currentWallet.balance || 0);
    const newBalance = Math.round((currentBalance + ustadEarning) * 100) / 100;

    const updateWalletSql = `
      UPDATE wallets
      SET
        balance = balance + $1,
        total_earned = total_earned + $2,
        total_commission_paid = total_commission_paid + $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    const updatedWalletRows = await q(updateWalletSql, [
      ustadEarning,
      totalAmount,
      commissionAmount,
      currentWallet.id,
    ]);
    const updatedWallet = updatedWalletRows[0];

    // 5. Insert wallet transaction
    const walletTxSql = `
      INSERT INTO wallet_transactions (
        wallet_id,
        payment_id,
        transaction_type,
        amount,
        balance_after,
        description
      )
      VALUES ($1, $2, 'credit', $3, $4, $5)
      RETURNING *;
    `;
    await q(walletTxSql, [
      currentWallet.id,
      payment.id,
      ustadEarning,
      newBalance,
      `Earning from booking #${bookingId.substring(0, 8)}`,
    ]);

    return {
      payment,
      wallet: updatedWallet,
    };
  });
};

/**
 * Get wallet summary by ustad ID with recent transactions
 */
const getWalletByUstadId = async (ustadId) => {
  const wallet = await getOrCreateWallet(ustadId);

  const txSql = `
    SELECT
      id,
      transaction_type AS type,
      amount,
      balance_after,
      description,
      created_at
    FROM wallet_transactions
    WHERE wallet_id = $1
    ORDER BY created_at DESC
    LIMIT 5;
  `;
  const recentTransactions = await query(txSql, [wallet.id]);

  return {
    ...wallet,
    balance: parseFloat(wallet.balance),
    total_earned: parseFloat(wallet.total_earned),
    total_withdrawn: parseFloat(wallet.total_withdrawn),
    total_commission_paid: parseFloat(wallet.total_commission_paid),
    recent_transactions: recentTransactions.map((tx) => ({
      ...tx,
      amount: parseFloat(tx.amount),
      balance_after: parseFloat(tx.balance_after),
    })),
  };
};

/**
 * Get paginated wallet transactions
 */
const getWalletTransactionsByUstadId = async (ustadId, { page = 1, limit = 20 } = {}) => {
  const wallet = await getOrCreateWallet(ustadId);
  const offset = (page - 1) * limit;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM wallet_transactions
    WHERE wallet_id = $1;
  `;
  const countRows = await query(countSql, [wallet.id]);
  const total = parseInt(countRows[0].total, 10);

  const dataSql = `
    SELECT
      id,
      transaction_type AS type,
      amount,
      balance_after,
      description,
      created_at
    FROM wallet_transactions
    WHERE wallet_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const rows = await query(dataSql, [wallet.id, limit, offset]);

  return {
    transactions: rows.map((tx) => ({
      ...tx,
      amount: parseFloat(tx.amount),
      balance_after: parseFloat(tx.balance_after),
    })),
    total,
  };
};

module.exports = {
  getPaymentById,
  getPaymentByBookingId,
  getOrCreateWallet,
  processPaymentTransaction,
  getWalletByUstadId,
  getWalletTransactionsByUstadId,
};
