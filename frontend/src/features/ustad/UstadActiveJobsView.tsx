import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import type { BookingStatus, Booking } from '../../types';

export const UstadActiveJobsView: React.FC = () => {
  const {
    bookings,
    currentUstad,
    stepBookingStatus,
    openChatModal,
    startCallModal,
    commissionRate,
    setUstadTab,
  } = useApp();

  const [editingPriceBookingId, setEditingPriceBookingId] = useState<string | null>(null);
  const [adjustedFinalPrice, setAdjustedFinalPrice] = useState<number>(0);

  // Active jobs for this Ustad
  const activeJobs = bookings.filter(
    (b) =>
      (b.ustadId === currentUstad?.id || !b.ustadId) &&
      (b.status === 'accepted' ||
        b.status === 'on_the_way' ||
        b.status === 'arrived' ||
        b.status === 'in_progress')
  );

  const handleCompleteJob = async (booking: Booking) => {
    const finalAmount = adjustedFinalPrice > 0 ? adjustedFinalPrice : booking.estimatedPrice;
    await stepBookingStatus(
      booking.id,
      'completed',
      'Work verified and completed by Ustad',
      finalAmount
    );
    setEditingPriceBookingId(null);
  };

  return (
    <div className="ustad-active-jobs-container">
      <div className="active-jobs-header">
        <h1 className="page-title">Active Service Dispatches</h1>
        <p className="page-subheading">
          Manage job state transitions, navigation, and final price adjustments
        </p>
      </div>

      <div className="active-jobs-stack">
        {activeJobs.length === 0 ? (
          <div className="empty-active-jobs-box">
            <Activity size={44} className="empty-icon" />
            <h3>No active jobs at the moment</h3>
            <p>Check the Requests tab to accept incoming service bookings in your area.</p>
            <button
              className="view-requests-btn"
              onClick={() => setUstadTab('requests')}
            >
              View Incoming Requests
            </button>
          </div>
        ) : (
          activeJobs.map((job) => {
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              `${job.address}, Faisalabad, Pakistan`
            )}`;

            return (
              <div key={job.id} className="active-job-card">
                {/* Header Row */}
                <div className="job-card-top-row">
                  <div>
                    <span className="job-status-pill current">
                      STATUS: {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <h3 className="job-service-heading">{job.serviceName}</h3>
                    <span className="job-id-text">Booking #{job.id}</span>
                  </div>

                  <div className="job-amount-box">
                    <span className="label">Amount</span>
                    <strong>Rs. {job.finalPrice || job.estimatedPrice}</strong>
                  </div>
                </div>

                {/* Customer Details & Contact Actions */}
                <div className="customer-contact-bar">
                  <div className="customer-info-col">
                    <strong>Customer: {job.userName}</strong>
                    <span className="customer-phone">{job.userPhone}</span>
                  </div>

                  <div className="contact-buttons-col">
                    <button
                      className="contact-btn chat"
                      onClick={() => openChatModal(job)}
                      title="Chat in-app"
                    >
                      <MessageSquare size={16} /> Chat
                    </button>
                    <button
                      className="contact-btn call"
                      onClick={() => startCallModal(job)}
                      title="Direct call"
                    >
                      <Phone size={16} /> Call
                    </button>
                  </div>
                </div>

                {/* Address & Navigation */}
                <div className="job-address-box">
                  <div className="address-text">
                    <MapPin size={16} className="pin-icon" />
                    <div>
                      <strong>{job.address}</strong>
                      <span>Sector: {job.area}</span>
                    </div>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="navigation-link-btn"
                  >
                    <Navigation size={14} />
                    <span>Navigate (Google Maps)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Problem Description */}
                <div className="job-problem-desc">
                  <span className="desc-title">Customer Problem:</span>
                  <p>"{job.problemDescription}"</p>
                </div>

                {/* State Transition Action Stepper */}
                <div className="job-stepper-actions-bar">
                  <span className="stepper-title">Update Service Lifecycle:</span>

                  <div className="lifecycle-buttons-row">
                    {/* 1. Accepted -> On the Way */}
                    {job.status === 'accepted' && (
                      <button
                        className="lifecycle-btn on-the-way"
                        onClick={() =>
                          stepBookingStatus(job.id, 'on_the_way', 'Ustad departed on bike with tools')
                        }
                      >
                        1. Mark "On the Way" (Departed Workshop) →
                      </button>
                    )}

                    {/* 2. On the Way -> Arrived */}
                    {job.status === 'on_the_way' && (
                      <button
                        className="lifecycle-btn arrived"
                        onClick={() =>
                          stepBookingStatus(job.id, 'arrived', 'Ustad reached customer doorstep')
                        }
                      >
                        2. Mark "Arrived" (At Doorstep) →
                      </button>
                    )}

                    {/* 3. Arrived -> In Progress */}
                    {job.status === 'arrived' && (
                      <button
                        className="lifecycle-btn in-progress"
                        onClick={() =>
                          stepBookingStatus(job.id, 'in_progress', 'Started diagnostic & repair work')
                        }
                      >
                        3. Mark "Work Started" (In Progress) →
                      </button>
                    )}

                    {/* 4. In Progress -> Completed */}
                    {job.status === 'in_progress' && (
                      <div className="complete-action-wrapper">
                        {editingPriceBookingId === job.id ? (
                          <div className="price-adjust-box">
                            <label className="adjust-label">
                              Final Job Amount (Rs.): Include extra parts if purchased:
                            </label>
                            <div className="adjust-input-row">
                              <input
                                type="number"
                                className="price-adjust-input"
                                value={adjustedFinalPrice || job.estimatedPrice}
                                onChange={(e) =>
                                  setAdjustedFinalPrice(parseInt(e.target.value) || job.estimatedPrice)
                                }
                              />
                              <button
                                className="confirm-complete-btn"
                                onClick={() => handleCompleteJob(job)}
                              >
                                Finish & Complete Job
                              </button>
                            </div>
                            <small className="commission-hint">
                              10% Platform fee (Rs. {Math.round((adjustedFinalPrice || job.estimatedPrice) * commissionRate)}) will be auto-calculated.
                            </small>
                          </div>
                        ) : (
                          <button
                            className="lifecycle-btn completed"
                            onClick={() => {
                              setEditingPriceBookingId(job.id);
                              setAdjustedFinalPrice(job.estimatedPrice);
                            }}
                          >
                            4. Mark "Work Completed" (Record Final Fee) →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment info */}
                <div className="job-payment-status-footer">
                  <span>
                    Payment Method: <strong className="text-uppercase">{job.paymentMethod}</strong>
                  </span>
                  <span>
                    Collection Status:{' '}
                    <strong className={job.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}>
                      {job.paymentStatus.toUpperCase()}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
