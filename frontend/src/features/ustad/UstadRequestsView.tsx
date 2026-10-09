import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export const UstadRequestsView: React.FC = () => {
  const {
    bookings,
    currentUstad,
    acceptJobRequest,
    rejectJobRequest,
    setUstadTab,
  } = useApp();

  const pendingRequests = bookings.filter((b) => b.status === 'pending');

  const isApproved = currentUstad?.verificationStatus === 'approved';

  return (
    <div className="ustad-requests-container">
      <div className="requests-header-box">
        <h1 className="page-title">Incoming Job Requests</h1>
        <p className="page-subheading">
          Real-time repair requests near your service area in Faisalabad
        </p>
      </div>

      {!isApproved && (
        <div className="not-approved-banner">
          <ShieldAlert size={20} className="text-warning" />
          <div>
            <strong>Verification Required to Accept Jobs:</strong>
            <p>
              Your status is currently{' '}
              <strong className="text-uppercase">{currentUstad?.verificationStatus || 'PENDING'}</strong>.
              Only verified and approved Ustads are authorized to accept customer bookings.
            </p>
          </div>
        </div>
      )}

      <div className="requests-cards-stack">
        {pendingRequests.length === 0 ? (
          <div className="empty-requests-box">
            <Inbox size={44} className="empty-icon" />
            <h3>No pending job requests right now</h3>
            <p>Make sure your availability toggle is ON to receive incoming jobs from Faisalabad residents.</p>
            <button
              className="dashboard-return-btn"
              onClick={() => setUstadTab('dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          pendingRequests.map((req) => (
            <div key={req.id} className="job-request-card">
              <div className="request-card-top">
                <div>
                  <span className="request-id-pill">JOB ID: {req.id}</span>
                  <h3 className="request-service-title">{req.serviceName}</h3>
                </div>
                <div className="request-price-tag">
                  <small>Estimated Payout</small>
                  <strong>Rs. {req.estimatedPrice}</strong>
                </div>
              </div>

              {/* Customer & Problem */}
              <div className="request-problem-box">
                <span className="problem-label">Customer Dilemma:</span>
                <p className="problem-text">"{req.problemDescription}"</p>

                {req.problemImageUrl && (
                  <div className="request-photo-thumb">
                    <img src={req.problemImageUrl} alt="Fault snapshot" />
                    <span>Attached Problem Photo</span>
                  </div>
                )}
              </div>

              {/* Location & Time Meta */}
              <div className="request-meta-grid">
                <div className="meta-col">
                  <span className="meta-label">
                    <MapPin size={13} /> Location
                  </span>
                  <span className="meta-val">{req.address} ({req.area.split(',')[0]})</span>
                </div>
                <div className="meta-col">
                  <span className="meta-label">
                    <Clock size={13} /> Timing
                  </span>
                  <span className="meta-val">
                    {req.scheduleType === 'now' ? 'Immediate Dispatch' : req.scheduledTime || 'Scheduled'}
                  </span>
                </div>
                <div className="meta-col">
                  <span className="meta-label">Customer</span>
                  <span className="meta-val">{req.userName}</span>
                </div>
                <div className="meta-col">
                  <span className="meta-label">Payment Mode</span>
                  <span className="meta-val text-uppercase">{req.paymentMethod}</span>
                </div>
              </div>

              {/* Net Payout Calculation Explanation */}
              <div className="request-payout-calc">
                <span>
                  Gross: Rs. {req.estimatedPrice} • 10% Platform Commission: Rs.{' '}
                  {Math.round(req.estimatedPrice * 0.1)} • Your Net: <strong>Rs. {Math.round(req.estimatedPrice * 0.9)}</strong>
                </span>
              </div>

              {/* Accept & Reject Buttons */}
              <div className="request-actions-row">
                <button
                  className="reject-job-btn"
                  onClick={() => rejectJobRequest(req.id)}
                >
                  <XCircle size={16} /> Decline
                </button>
                <button
                  className="accept-job-btn"
                  disabled={!isApproved}
                  onClick={() => acceptJobRequest(req.id)}
                >
                  <CheckCircle2 size={16} /> Accept & Start Navigation
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
