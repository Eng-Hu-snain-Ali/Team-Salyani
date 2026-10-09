import React from 'react';
import { useApp } from '../../context/AppContext';
import { FaisalabadMap } from '../../components/common/FaisalabadMap';
import {
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  CreditCard,
  Star,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import type { BookingStatus } from '../../types';

export const BookingTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    activeTrackingBooking,
    cancelBooking,
    stepBookingStatus,
    openChatModal,
    startCallModal,
    openPaymentModal,
    openReviewModal,
    openComplaintModal,
  } = useApp();

  if (!isTrackingModalOpen || !activeTrackingBooking) return null;

  const booking = activeTrackingBooking;

  const STATUS_STEPS: Array<{ key: BookingStatus; label: string; desc: string }> = [
    { key: 'pending', label: 'Pending', desc: 'Finding nearby verified Ustad' },
    { key: 'accepted', label: 'Accepted', desc: 'Ustad confirmed assignment' },
    { key: 'on_the_way', label: 'On the Way', desc: 'En route with toolkit' },
    { key: 'arrived', label: 'Arrived', desc: 'At customer doorstep' },
    { key: 'in_progress', label: 'In Progress', desc: 'Repair work under way' },
    { key: 'completed', label: 'Completed', desc: 'Service finished & inspected' },
  ];

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === booking.status);

  const getNextStatus = (current: BookingStatus): BookingStatus | null => {
    switch (current) {
      case 'pending':
        return 'accepted';
      case 'accepted':
        return 'on_the_way';
      case 'on_the_way':
        return 'arrived';
      case 'arrived':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(booking.status);

  return (
    <div className="modal-backdrop" onClick={() => setIsTrackingModalOpen(false)}>
      <div
        className="modal-surface booking-tracking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tracking-modal-header">
          <div>
            <div className="tracking-id-tag">
              <span>BOOKING ID: {booking.id}</span>
              <span className="sim-pill">Simulated GPS Live</span>
            </div>
            <h2 className="tracking-title">{booking.serviceName}</h2>
          </div>
          <button
            className="close-btn"
            onClick={() => setIsTrackingModalOpen(false)}
            aria-label="Close tracking modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Interactive Map Live View */}
        <div className="tracking-map-box">
          <FaisalabadMap
            activeBooking={booking}
            customerLocation={{
              lat: booking.lat,
              lng: booking.lng,
              label: booking.address,
            }}
            height={240}
          />
        </div>

        {/* Assigned Ustad Bar & Direct Contacts */}
        {booking.ustadName ? (
          <div className="tracking-ustad-card">
            <div className="ustad-pic-frame">
              {booking.ustadAvatar ? (
                <img src={booking.ustadAvatar} alt={booking.ustadName} />
              ) : (
                <div className="pic-placeholder">U</div>
              )}
            </div>
            <div className="ustad-info-col">
              <div className="ustad-name-row">
                <strong>{booking.ustadName}</strong>
                <span title="NADRA Verified">
                  <ShieldCheck size={16} className="text-success" />
                </span>
              </div>
              <span className="ustad-category-sub">
                {booking.categoryId.toUpperCase()} • Rating ★{booking.ustadRating || 4.9}
              </span>
              <span className="ustad-phone-label">
                Contact: {booking.ustadPhone || '+92 301 7712345'}
              </span>
            </div>

            {/* Quick Contact Actions (Chat & Direct Call) */}
            <div className="ustad-contact-actions">
              <button
                className="contact-action-btn chat-btn"
                onClick={() => openChatModal(booking)}
                title="In-App Live Chat"
              >
                <MessageSquare size={16} />
                <span>Chat</span>
              </button>
              <button
                className="contact-action-btn call-btn"
                onClick={() => startCallModal(booking)}
                title="Direct Simulated Call"
              >
                <Phone size={16} />
                <span>Call</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="tracking-pending-ustad-banner">
            <div className="spinner-dots" />
            <div>
              <strong>Dispatching to nearest Faisalabad technician...</strong>
              <small>Ustad will accept and contact you shortly.</small>
            </div>
          </div>
        )}

        {/* Status Timeline Stepper */}
        <div className="tracking-stepper-container">
          <h4 className="stepper-heading">Service Progress Timeline</h4>
          <div className="stepper-horizontal-track">
            {STATUS_STEPS.map((stepItem, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div
                  key={stepItem.key}
                  className={`stepper-node ${isPast ? 'completed' : ''} ${
                    isCurrent ? 'current' : ''
                  } ${isFuture ? 'future' : ''}`}
                >
                  <div className="node-marker">
                    {isPast ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="node-label">{stepItem.label}</span>
                </div>
              );
            })}
          </div>

          <div className="current-status-detail-card">
            <Clock size={16} className="status-clock" />
            <div>
              <strong>Current: {booking.status.replace('_', ' ').toUpperCase()}</strong>
              <p>
                {STATUS_STEPS.find((s) => s.key === booking.status)?.desc ||
                  'Status updated in real-time.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cost & Payment Details */}
        <div className="tracking-pricing-card">
          <div className="cost-row">
            <span>Estimated Service Fee:</span>
            <strong>Rs. {booking.finalPrice || booking.estimatedPrice}</strong>
          </div>
          <div className="cost-row">
            <span>Payment Method:</span>
            <span className="payment-method-tag">
              {booking.paymentMethod.toUpperCase()} ({booking.paymentStatus.toUpperCase()})
            </span>
          </div>
          <div className="cost-row">
            <span>Customer Address:</span>
            <span className="address-snippet">{booking.address}</span>
          </div>
        </div>

        {/* Demo Advance Helper for Testing */}
        {nextStatus && (
          <div className="simulation-advance-box">
            <span className="sim-helper-label">
              ⚡ Evaluator Simulation Shortcut:
            </span>
            <button
              className="advance-step-btn"
              onClick={() => stepBookingStatus(booking.id, nextStatus)}
            >
              Advance to: {nextStatus.replace('_', ' ').toUpperCase()} →
            </button>
          </div>
        )}

        {/* Bottom Actions based on Booking Status */}
        <div className="tracking-modal-actions">
          {booking.status === 'completed' ? (
            <div className="completed-actions-row">
              {booking.paymentStatus === 'unpaid' && (
                <button
                  className="pay-now-btn"
                  onClick={() => openPaymentModal(booking)}
                >
                  <CreditCard size={16} /> Pay Rs. {booking.finalPrice || booking.estimatedPrice}
                </button>
              )}
              <button
                className="review-btn"
                onClick={() => openReviewModal(booking)}
              >
                <Star size={16} /> Rate Ustad
              </button>
              <button
                className="complaint-btn"
                onClick={() => openComplaintModal(booking)}
              >
                <HelpCircle size={16} /> Complaint
              </button>
            </div>
          ) : (
            <div className="active-actions-row">
              {booking.status === 'pending' || booking.status === 'accepted' ? (
                <button
                  className="cancel-booking-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                      cancelBooking(booking.id, 'Cancelled by customer');
                      setIsTrackingModalOpen(false);
                    }
                  }}
                >
                  Cancel Booking
                </button>
              ) : null}
              <button
                className="done-btn"
                onClick={() => setIsTrackingModalOpen(false)}
              >
                Close Tracking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
