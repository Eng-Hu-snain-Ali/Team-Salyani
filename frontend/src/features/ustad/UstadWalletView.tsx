import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Percent,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Smartphone,
  CreditCard,
  X,
} from 'lucide-react';

export const UstadWalletView: React.FC = () => {
  const {
    currentUstad,
    transactions,
    withdrawals,
    requestUstadWithdrawal,
    commissionRate,
    showToast,
  } = useApp();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(3000);
  const [payoutMethod, setPayoutMethod] = useState<'jazzcash' | 'easypaisa' | 'bank'>('jazzcash');
  const [accountTitle, setAccountTitle] = useState(currentUstad?.name || '');
  const [accountNumber, setAccountNumber] = useState('0301-7712345');
  const [bankName, setBankName] = useState('Meezan Bank Faisalabad');

  if (!currentUstad) return null;

  // Filter withdrawals for this ustad
  const myWithdrawals = withdrawals.filter((w) => w.ustadId === currentUstad.id);
  // Filter transactions for this ustad
  const myTransactions = transactions.filter((t) => t.ustadId === currentUstad.id);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      showToast('Enter a valid amount to withdraw.', 'warning');
      return;
    }
    if (withdrawAmount > currentUstad.walletBalance) {
      showToast(`Cannot withdraw more than available balance (Rs. ${currentUstad.walletBalance}).`, 'error');
      return;
    }
    if (!accountNumber.trim()) {
      showToast('Enter valid account / phone number.', 'warning');
      return;
    }

    try {
      await requestUstadWithdrawal({
        amount: withdrawAmount,
        payoutMethod,
        accountTitle,
        accountNumber,
        bankName: payoutMethod === 'bank' ? bankName : undefined,
      });
      setIsWithdrawModalOpen(false);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="ustad-wallet-container">
      {/* Page Header */}
      <div className="wallet-header-box">
        <div>
          <h1 className="page-title">Technician Wallet & Payouts</h1>
          <p className="page-subheading">
            Track gross revenue, 10% platform commission, and daily payout requests
          </p>
        </div>

        <button
          className="request-payout-btn-hero"
          onClick={() => setIsWithdrawModalOpen(true)}
        >
          <ArrowUpRight size={18} /> Request Payout
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="wallet-cards-grid">
        {/* Available Withdrawable Balance */}
        <div className="wallet-balance-card highlight">
          <div className="card-top-row">
            <span className="card-label">Available Balance</span>
            <Wallet size={20} className="card-icon" />
          </div>
          <h1 className="balance-value">Rs. {currentUstad.walletBalance}</h1>
          <span className="balance-hint text-success">
            Available for immediate transfer via JazzCash / Easypaisa
          </span>
        </div>

        {/* Today's Net Earnings */}
        <div className="wallet-balance-card">
          <div className="card-top-row">
            <span className="card-label">Today's Net Earnings</span>
            <TrendingUp size={20} className="card-icon" />
          </div>
          <h1 className="balance-value">Rs. {currentUstad.todayEarnings}</h1>
          <span className="balance-hint">After 10% commission deductions</span>
        </div>

        {/* Lifetime Earnings */}
        <div className="wallet-balance-card">
          <div className="card-top-row">
            <span className="card-label">Lifetime Revenue</span>
            <Percent size={20} className="card-icon" />
          </div>
          <h1 className="balance-value">Rs. {currentUstad.totalEarnings}</h1>
          <span className="balance-hint">Across {currentUstad.completedJobsCount} completed jobs</span>
        </div>
      </div>

      {/* Commission Calculation Formula Explanation */}
      <div className="commission-formula-banner">
        <div className="formula-icon-col">
          <Percent size={22} className="text-primary" />
        </div>
        <div className="formula-text-col">
          <strong>Official Platform Commission: 10% Flat Rate</strong>
          <p>
            Example for a <strong>Rs. 1,000</strong> completed job:
            Gross customer amount: <strong>Rs. 1,000</strong> • Platform commission (10%): <strong>Rs. 100</strong> • Your net earnings: <strong>Rs. 900 (90%)</strong>.
          </p>
          <small className="notice">
            Note: Payout transfers are simulated in this prototype. No real banking credentials are processed without a production gateway.
          </small>
        </div>
      </div>

      {/* Withdrawal Requests History */}
      <div className="wallet-section-box">
        <div className="section-title-row">
          <h3 className="section-heading">Payout Requests</h3>
          <button
            className="mini-payout-btn"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            + New Request
          </button>
        </div>

        <div className="withdrawals-table-wrap">
          {myWithdrawals.length === 0 ? (
            <p className="empty-subtext">No withdrawal requests submitted yet.</p>
          ) : (
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Amount</th>
                  <th>Payout Mode</th>
                  <th>Account Detail</th>
                  <th>Requested Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myWithdrawals.map((w) => (
                  <tr key={w.id}>
                    <td><strong>{w.id}</strong></td>
                    <td><strong>Rs. {w.amount}</strong></td>
                    <td className="text-uppercase">{w.payoutMethod}</td>
                    <td>{w.accountTitle} ({w.accountNumber})</td>
                    <td>{new Date(w.requestedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge-cell ${w.status}`}>
                        {w.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Job Financial Ledger / Transactions */}
      <div className="wallet-section-box">
        <h3 className="section-heading">Completed Jobs Financial Ledger</h3>
        <div className="transactions-table-wrap">
          {myTransactions.length === 0 ? (
            <p className="empty-subtext">No transactions recorded yet.</p>
          ) : (
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Booking ID</th>
                  <th>Gross Amount</th>
                  <th>Commission (10%)</th>
                  <th>Net Earnings (90%)</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td><strong>{tx.bookingId}</strong></td>
                    <td>Rs. {tx.grossAmount}</td>
                    <td className="text-warning">- Rs. {tx.commissionAmount}</td>
                    <td className="text-success"><strong>+ Rs. {tx.netAmount}</strong></td>
                    <td className="text-uppercase">{tx.paymentMethod}</td>
                    <td>
                      <span className="status-badge-cell approved">
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* WITHDRAWAL REQUEST MODAL */}
      {isWithdrawModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsWithdrawModalOpen(false)}>
          <div
            className="modal-surface withdrawal-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <div>
                <span className="modal-step-tag">Disbursement Form</span>
                <h2>Request Payout to Wallet / Bank</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setIsWithdrawModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="withdrawal-form">
              <div className="form-group">
                <label className="form-label">
                  Withdrawal Amount (Rs.) • Available: Rs. {currentUstad.walletBalance}
                </label>
                <input
                  type="number"
                  min={500}
                  max={currentUstad.walletBalance}
                  className="form-input"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Disbursement Channel</label>
                <div className="channel-select-grid">
                  <button
                    type="button"
                    className={`channel-btn ${payoutMethod === 'jazzcash' ? 'active' : ''}`}
                    onClick={() => setPayoutMethod('jazzcash')}
                  >
                    <Smartphone size={16} />
                    <span>JazzCash</span>
                  </button>
                  <button
                    type="button"
                    className={`channel-btn ${payoutMethod === 'easypaisa' ? 'active' : ''}`}
                    onClick={() => setPayoutMethod('easypaisa')}
                  >
                    <Smartphone size={16} />
                    <span>Easypaisa</span>
                  </button>
                  <button
                    type="button"
                    className={`channel-btn ${payoutMethod === 'bank' ? 'active' : ''}`}
                    onClick={() => setPayoutMethod('bank')}
                  >
                    <Building size={16} />
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Title (Name) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {payoutMethod === 'bank' ? 'IBAN / Account Number *' : 'Mobile Account Number *'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                />
              </div>

              {payoutMethod === 'bank' && (
                <div className="form-group">
                  <label className="form-label">Bank Name & Branch</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Meezan Bank, D-Ground Branch"
                  />
                </div>
              )}

              <div className="disclaimer-alert">
                <AlertCircle size={15} />
                <span>
                  Demo Mode: Payout request will be submitted to the Admin Panel for review and simulated disbursement.
                </span>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsWithdrawModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn-primary">
                  Submit Payout Request (Rs. {withdrawAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
