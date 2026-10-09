import React from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import {
  Wallet,
  CheckCircle2,
  Inbox,
  Star,
  Power,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Percent,
  AlertTriangle,
} from 'lucide-react';
import type { Ustad } from '../../types';

export const UstadDashboardView: React.FC = () => {
  const {
    currentUstad,
    setCurrentUstad,
    ustads,
    bookings,
    setUstadTab,
    toggleUstadAvailability,
    openTrackingModal,
    commissionRate,
    setIsUstadRegisterModalOpen,
  } = useApp();

  if (!currentUstad) {
    return (
      <div className="ustad-no-profile-box">
        <h3>No Ustad profile selected</h3>
        <p>Select an existing Ustad or register a new technician account.</p>
        <button
          className="btn-primary"
          onClick={() => setIsUstadRegisterModalOpen(true)}
        >
          Register Ustad Account
        </button>
      </div>
    );
  }

  // Pending job requests for this ustad or unassigned
  const pendingRequests = bookings.filter((b) => b.status === 'pending');

  // Active accepted jobs for this ustad
  const activeJobs = bookings.filter(
    (b) =>
      (b.ustadId === currentUstad.id || !b.ustadId) &&
      (b.status === 'accepted' ||
        b.status === 'on_the_way' ||
        b.status === 'arrived' ||
        b.status === 'in_progress')
  );

  return (
    <div className="ustad-dashboard-container">
      {/* 1. TOP PROFILE & AVAILABILITY BANNER */}
      <div className="ustad-profile-bar">
        <div className="ustad-info-left">
          <div className="ustad-avatar-lg-wrap">
            <img src={currentUstad.avatar} alt={currentUstad.name} className="ustad-avatar-lg" />
            <span
              className={`status-dot-lg ${currentUstad.isAvailable ? 'online' : 'offline'}`}
            />
          </div>
          <div>
            <div className="name-verify-row">
              <h2 className="ustad-title">{currentUstad.name}</h2>
              <span className={`verify-chip ${currentUstad.verificationStatus}`}>
                <ShieldCheck size={14} />
                <span>{currentUstad.verificationStatus.toUpperCase()}</span>
              </span>
            </div>
            <p className="ustad-subtitle">
              {currentUstad.skillCategories.map((s) => s.replace('-', ' ')).join(', ')} • {currentUstad.experienceYears} Years Exp
            </p>
            <span className="ustad-area-text">
              <MapPin size={13} /> {currentUstad.serviceArea}
            </span>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="ustad-availability-box">
          <div className="avail-status-labels">
            <span className="label">Status:</span>
            <strong className={currentUstad.isAvailable ? 'text-success' : 'text-muted'}>
              {currentUstad.isAvailable ? 'ONLINE (Accepting Jobs)' : 'OFFLINE'}
            </strong>
          </div>
          <button
            className={`toggle-online-btn ${currentUstad.isAvailable ? 'online' : 'offline'}`}
            onClick={() => toggleUstadAvailability(currentUstad.id, !currentUstad.isAvailable)}
            title="Toggle online availability"
          >
            <Power size={18} />
            <span>{currentUstad.isAvailable ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Switch Ustad Profile Tester (for demo evaluation) */}
      <div className="ustad-persona-switcher-pill">
        <span className="persona-label">Switch Persona / Test Technician:</span>
        <select
          className="persona-select"
          value={currentUstad.id}
          onChange={(e) => {
            const found = ustads.find((u) => u.id === e.target.value);
            if (found) setCurrentUstad(found);
          }}
        >
          {ustads.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.skillCategories[0]} - {u.verificationStatus})
            </option>
          ))}
        </select>
      </div>

      {/* Verification Warning if Pending or Blocked */}
      {currentUstad.verificationStatus === 'pending' && (
        <div className="verification-warning-banner">
          <AlertTriangle size={20} className="warning-icon" />
          <div>
            <strong>Application Pending Document Verification:</strong>
            <p>
              Your CNIC and background documents are currently being checked by the Faisalabad verification desk. Once approved, you can accept customer jobs.
            </p>
          </div>
        </div>
      )}

      {currentUstad.verificationStatus === 'blocked' && (
        <div className="verification-danger-banner">
          <AlertTriangle size={20} className="danger-icon" />
          <div>
            <strong>Account Suspended:</strong>
            <p>
              This account has been flagged by the trust & safety team and cannot accept jobs.
            </p>
          </div>
        </div>
      )}

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="ustad-stats-grid">
        {/* Today's Net Earnings */}
        <div className="stat-metric-card highlight">
          <div className="stat-header">
            <span className="stat-title">Today's Earnings</span>
            <Wallet size={18} className="stat-icon" />
          </div>
          <h2 className="stat-value">Rs. {currentUstad.todayEarnings}</h2>
          <span className="stat-footer text-success">
            <TrendingUp size={13} /> 90% Net take-home after 10% platform fee
          </span>
        </div>

        {/* Total Completed Jobs */}
        <div className="stat-metric-card">
          <div className="stat-header">
            <span className="stat-title">Completed Jobs</span>
            <CheckCircle2 size={18} className="stat-icon" />
          </div>
          <h2 className="stat-value">{currentUstad.completedJobsCount}</h2>
          <span className="stat-footer">Total lifetime customer repairs</span>
        </div>

        {/* Pending Requests */}
        <div
          className="stat-metric-card clickable"
          onClick={() => setUstadTab('requests')}
        >
          <div className="stat-header">
            <span className="stat-title">Pending Requests</span>
            <Inbox size={18} className="stat-icon text-warning" />
          </div>
          <h2 className="stat-value text-warning">{pendingRequests.length}</h2>
          <span className="stat-footer">Tap to review incoming jobs →</span>
        </div>

        {/* Professional Rating */}
        <div className="stat-metric-card">
          <div className="stat-header">
            <span className="stat-title">Rating Score</span>
            <Star size={18} className="stat-icon text-warning" />
          </div>
          <div className="stat-rating-row">
            <h2 className="stat-value">{currentUstad.rating.toFixed(1)}</h2>
            <RatingStars rating={currentUstad.rating} size={15} />
          </div>
          <span className="stat-footer">{currentUstad.reviewCount} verified reviews</span>
        </div>
      </div>

      {/* 3. ACTIVE JOBS ACTION BANNER */}
      {activeJobs.length > 0 && (
        <div className="ustad-active-job-alert">
          <div className="alert-content">
            <span className="badge-alert">DISPATCH IN PROGRESS</span>
            <h3>You have {activeJobs.length} active job(s) assigned!</h3>
            <p>
              Latest: <strong>{activeJobs[0].serviceName}</strong> at {activeJobs[0].address}
            </p>
          </div>
          <button
            className="go-active-jobs-btn"
            onClick={() => setUstadTab('active_jobs')}
          >
            Manage Active Job Stepper →
          </button>
        </div>
      )}

      {/* 4. EARNINGS & 10% COMMISSION BREAKDOWN */}
      <div className="ustad-commission-info-card">
        <div className="commission-header">
          <Percent size={18} className="text-primary" />
          <div>
            <strong>Transparent 10% Platform Commission Engine</strong>
            <p>
              For every eligible job, you keep 90% of the labor fee. Example: For a Rs. 1,000 job, you receive <strong>Rs. 900</strong> and platform fee is <strong>Rs. 100</strong>.
            </p>
          </div>
        </div>

        <div className="wallet-quick-row">
          <div>
            <span>Available Wallet Balance:</span>
            <h3>Rs. {currentUstad.walletBalance}</h3>
          </div>
          <button
            className="withdraw-cta-btn"
            onClick={() => setUstadTab('wallet')}
          >
            Request Payout →
          </button>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY FEED */}
      <div className="ustad-recent-activity-section">
        <div className="section-title-row">
          <h3 className="section-heading">Recent Service Activity</h3>
          <button
            className="link-btn"
            onClick={() => setUstadTab('active_jobs')}
          >
            View All Jobs →
          </button>
        </div>

        <div className="activity-items-list">
          {bookings.slice(0, 4).map((b) => (
            <div key={b.id} className="activity-item-tile">
              <div className="tile-icon-box">
                <Clock size={16} />
              </div>
              <div className="tile-text-col">
                <strong>{b.serviceName} • #{b.id}</strong>
                <span>{b.address} • Customer: {b.userName}</span>
              </div>
              <div className="tile-status-col">
                <span className={`status-chip ${b.status}`}>
                  {b.status.replace('_', ' ').toUpperCase()}
                </span>
                <strong>Rs. {b.finalPrice || b.estimatedPrice}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
