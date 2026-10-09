import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Percent,
  DollarSign,
  TrendingUp,
  Settings,
  CheckCircle2,
  Calendar,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

export const AdminCommissionView: React.FC = () => {
  const {
    bookings,
    transactions,
    commissionRate,
    updateCommissionRate,
    showToast,
  } = useApp();

  const [inputRate, setInputRate] = useState<number>(commissionRate * 100);

  // Eligible completed bookings only (avoid counting pending or cancelled bookings)
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const grossCompletedRevenue = completedBookings.reduce(
    (acc, b) => acc + (b.finalPrice || b.estimatedPrice),
    0
  );

  const platformTotalCommission = Math.round(grossCompletedRevenue * commissionRate);
  const ustadNetDisbursements = grossCompletedRevenue - platformTotalCommission;

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rateDecimal = inputRate / 100;
    if (rateDecimal < 0 || rateDecimal > 0.5) {
      showToast('Commission rate must be between 0% and 50%', 'warning');
      return;
    }
    updateCommissionRate(rateDecimal);
  };

  return (
    <div className="admin-commission-container">
      {/* Header */}
      <div className="mgmt-header-box">
        <div>
          <h1 className="mgmt-title">Platform Commission & Financial Engine</h1>
          <p className="mgmt-sub">
            Configure platform commission rules, audit eligible completed jobs revenue, and track technician payouts.
          </p>
        </div>
      </div>

      {/* Financial Breakdown Cards */}
      <div className="commission-kpis-grid">
        <div className="comm-card">
          <span className="comm-label">Total Completed Gross Value</span>
          <h2 className="comm-val">Rs. {grossCompletedRevenue.toLocaleString()}</h2>
          <span className="comm-hint">From {completedBookings.length} completed customer jobs</span>
        </div>

        <div className="comm-card highlight-success">
          <span className="comm-label">Platform Commission ({(commissionRate * 100).toFixed(0)}%)</span>
          <h2 className="comm-val text-success">Rs. {platformTotalCommission.toLocaleString()}</h2>
          <span className="comm-hint">Retained platform net margin</span>
        </div>

        <div className="comm-card highlight-primary">
          <span className="comm-label">Ustad Net Earnings (90%)</span>
          <h2 className="comm-val text-primary">Rs. {ustadNetDisbursements.toLocaleString()}</h2>
          <span className="comm-hint">Disbursable to technicians</span>
        </div>
      </div>

      {/* Commission Configuration Form */}
      <div className="commission-config-panel">
        <div className="config-header">
          <Settings size={20} className="text-primary" />
          <div>
            <h3>Platform Commission Rate Configuration</h3>
            <p>
              Standard pilot rate is 10%. Modifying this percentage applies dynamically to newly eligible completed bookings.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveRate} className="config-form-row">
          <div className="rate-input-group">
            <label className="rate-label">Active Commission Rate (%):</label>
            <div className="rate-field-wrap">
              <input
                type="number"
                min={0}
                max={40}
                step={1}
                className="rate-number-input"
                value={inputRate}
                onChange={(e) => setInputRate(parseFloat(e.target.value) || 0)}
              />
              <span className="percent-symbol">%</span>
            </div>
          </div>

          <button type="submit" className="save-rate-btn">
            Update Commission Rate
          </button>
        </form>

        <div className="example-calc-card">
          <strong>Live Calculation Verification:</strong>
          <span>
            For a standard <strong>Rs. 1,000</strong> completed job: Platform retains <strong>Rs. {Math.round(1000 * (inputRate / 100))}</strong> ({inputRate}%), and the Ustad receives <strong>Rs. {Math.round(1000 * (1 - inputRate / 100))}</strong>.
          </span>
        </div>
      </div>

      {/* Commission Audit History Table */}
      <div className="mgmt-table-card">
        <div className="card-table-title">
          <h3>Transaction & Commission Audit Trail</h3>
          <small>Strictly excludes pending or cancelled bookings</small>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Booking ID</th>
              <th>Ustad Name</th>
              <th>Gross Amount</th>
              <th>Platform Cut (10%)</th>
              <th>Ustad Net (90%)</th>
              <th>Payment Mode</th>
              <th>Processed Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td><strong>{tx.id}</strong></td>
                <td>{tx.bookingId}</td>
                <td>{tx.ustadName}</td>
                <td>Rs. {tx.grossAmount}</td>
                <td className="text-warning">Rs. {tx.commissionAmount}</td>
                <td className="text-success"><strong>Rs. {tx.netAmount}</strong></td>
                <td className="text-uppercase">{tx.paymentMethod}</td>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
