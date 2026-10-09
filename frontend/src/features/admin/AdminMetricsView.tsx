import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Wrench,
  ShieldCheck,
  Clock,
  Activity,
  CheckCircle2,
  DollarSign,
  Percent,
  ShieldAlert,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';

export const AdminMetricsView: React.FC = () => {
  const {
    ustads,
    bookings,
    complaints,
    commissionRate,
    setAdminTab,
  } = useApp();

  // Metrics Calculations
  const totalRegisteredUstads = ustads.length;
  const verifiedUstads = ustads.filter((u) => u.verificationStatus === 'approved').length;
  const pendingVerifications = ustads.filter((u) => u.verificationStatus === 'pending').length;

  const totalCustomers = 428; // Faisalabad pilot registered users

  const activeBookings = bookings.filter(
    (b) =>
      b.status === 'pending' ||
      b.status === 'accepted' ||
      b.status === 'on_the_way' ||
      b.status === 'arrived' ||
      b.status === 'in_progress'
  ).length;

  const completedBookings = bookings.filter((b) => b.status === 'completed');

  // Total booking value and platform commission from eligible completed bookings only
  const grossCompletedValue = completedBookings.reduce(
    (acc, b) => acc + (b.finalPrice || b.estimatedPrice),
    0
  );

  const platformCommissionEarned = Math.round(grossCompletedValue * commissionRate);
  const ustadNetPayouts = grossCompletedValue - platformCommissionEarned;

  const openComplaints = complaints.filter(
    (c) => c.status === 'open' || c.status === 'investigating'
  ).length;

  return (
    <div className="admin-metrics-container">
      {/* Top Welcome Bar */}
      <div className="admin-welcome-bar">
        <div>
          <span className="pilot-city-badge">
            <MapPin size={13} /> FAISALABAD METROPOLITAN OPERATIONS
          </span>
          <h1 className="admin-page-title">Executive Control Dashboard</h1>
          <p className="admin-page-sub">
            Real-time telemetry for customers, verified Ustads, active dispatches, and commission ledger.
          </p>
        </div>
        <div className="admin-date-badge">
          <Calendar size={14} />
          <span>Pilot Phase 1 Active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        {/* Total Customers */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Customers</span>
            <Users size={18} className="kpi-icon text-primary" />
          </div>
          <h2 className="kpi-number">{totalCustomers}</h2>
          <span className="kpi-subtext text-success">
            <TrendingUp size={12} /> Faisalabad pilot signups
          </span>
        </div>

        {/* Total Ustads */}
        <div
          className="kpi-card clickable"
          onClick={() => setAdminTab('ustads')}
        >
          <div className="kpi-header">
            <span className="kpi-label">Registered Ustads</span>
            <Wrench size={18} className="kpi-icon" />
          </div>
          <h2 className="kpi-number">{totalRegisteredUstads}</h2>
          <span className="kpi-subtext">Across 6 core categories</span>
        </div>

        {/* Pending Verifications */}
        <div
          className="kpi-card highlight-warning clickable"
          onClick={() => setAdminTab('ustads')}
        >
          <div className="kpi-header">
            <span className="kpi-label">Pending Verification</span>
            <Clock size={18} className="kpi-icon text-warning" />
          </div>
          <h2 className="kpi-number text-warning">{pendingVerifications}</h2>
          <span className="kpi-subtext">Requires CNIC document review →</span>
        </div>

        {/* Verified Ustads */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Verified Active Ustads</span>
            <ShieldCheck size={18} className="kpi-icon text-success" />
          </div>
          <h2 className="kpi-number text-success">{verifiedUstads}</h2>
          <span className="kpi-subtext">Police & NADRA approved</span>
        </div>

        {/* Active Dispatches */}
        <div
          className="kpi-card clickable"
          onClick={() => setAdminTab('bookings')}
        >
          <div className="kpi-header">
            <span className="kpi-label">Active Bookings</span>
            <Activity size={18} className="kpi-icon text-primary" />
          </div>
          <h2 className="kpi-number text-primary">{activeBookings}</h2>
          <span className="kpi-subtext">Dispatches underway right now</span>
        </div>

        {/* Completed Bookings */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Completed Jobs</span>
            <CheckCircle2 size={18} className="kpi-icon text-success" />
          </div>
          <h2 className="kpi-number">{completedBookings.length}</h2>
          <span className="kpi-subtext">Verified job completions</span>
        </div>

        {/* Gross Booking Volume */}
        <div className="kpi-card highlight-primary">
          <div className="kpi-header">
            <span className="kpi-label">Completed Gross Value</span>
            <DollarSign size={18} className="kpi-icon" />
          </div>
          <h2 className="kpi-number">Rs. {grossCompletedValue.toLocaleString()}</h2>
          <span className="kpi-subtext">Eligible revenue transacted</span>
        </div>

        {/* Platform Commission (10%) */}
        <div
          className="kpi-card highlight-success clickable"
          onClick={() => setAdminTab('commission')}
        >
          <div className="kpi-header">
            <span className="kpi-label">Platform Commission ({(commissionRate * 100).toFixed(0)}%)</span>
            <Percent size={18} className="kpi-icon text-success" />
          </div>
          <h2 className="kpi-number text-success">Rs. {platformCommissionEarned.toLocaleString()}</h2>
          <span className="kpi-subtext">Net platform collected revenue</span>
        </div>

        {/* Ustad Net Payouts */}
        <div
          className="kpi-card clickable"
          onClick={() => setAdminTab('commission')}
        >
          <div className="kpi-header">
            <span className="kpi-label">Ustad Net Payouts</span>
            <DollarSign size={18} className="kpi-icon text-primary" />
          </div>
          <h2 className="kpi-number text-primary">Rs. {ustadNetPayouts.toLocaleString()}</h2>
          <span className="kpi-subtext">Total technician disbursements</span>
        </div>

        {/* Open Complaints */}
        <div
          className="kpi-card highlight-danger clickable"
          onClick={() => setAdminTab('complaints')}
        >
          <div className="kpi-header">
            <span className="kpi-label">Open Complaints</span>
            <ShieldAlert size={18} className="kpi-icon text-danger" />
          </div>
          <h2 className="kpi-number text-danger">{openComplaints}</h2>
          <span className="kpi-subtext">Requires admin resolution →</span>
        </div>
      </div>

      {/* Operations Quick Triage Banner */}
      <div className="admin-operations-triage-card">
        <div className="triage-header">
          <ShieldCheck size={20} className="text-primary" />
          <div>
            <h3>Faisalabad Pilot Operational Status</h3>
            <p>
              Simulated database active with {totalRegisteredUstads} mechanics in D-Ground, Peoples Colony, Kohinoor City, and Madina Town. All 10% platform commission cuts and document verifications update in real time.
            </p>
          </div>
        </div>

        <div className="triage-actions-row">
          <button
            className="triage-btn primary"
            onClick={() => setAdminTab('ustads')}
          >
            Review Pending Ustads ({pendingVerifications})
          </button>
          <button
            className="triage-btn secondary"
            onClick={() => setAdminTab('services')}
          >
            Manage Rate Card Prices
          </button>
          <button
            className="triage-btn danger"
            onClick={() => setAdminTab('complaints')}
          >
            Resolve Open Complaints ({openComplaints})
          </button>
        </div>
      </div>
    </div>
  );
};
