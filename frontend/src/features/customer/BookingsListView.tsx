import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Star,
  CreditCard,
  HelpCircle,
  Wrench,
  Search,
} from 'lucide-react';
import type { BookingStatus, Booking } from '../../types';

export const BookingsListView: React.FC = () => {
  const {
    bookings,
    openTrackingModal,
    openPaymentModal,
    openReviewModal,
    openComplaintModal,
    openCreateBooking,
    services,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const isAct = b.status === 'pending' || b.status === 'accepted' || b.status === 'on_the_way' || b.status === 'arrived' || b.status === 'in_progress';
    const isComp = b.status === 'completed';
    const isCanc = b.status === 'cancelled' || b.status === 'rejected';

    let matchesTab = true;
    if (statusFilter === 'active') matchesTab = isAct;
    if (statusFilter === 'completed') matchesTab = isComp;
    if (statusFilter === 'cancelled') matchesTab = isCanc;

    const matchesSearch =
      b.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (b.ustadName && b.ustadName.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in_progress':
      case 'on_the_way':
      case 'arrived':
        return 'badge-primary';
      case 'pending':
      case 'accepted':
        return 'badge-warning';
      case 'cancelled':
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="bookings-page-container">
      {/* Page Header */}
      <div className="bookings-header-row">
        <div>
          <h1 className="page-title">My Service Bookings</h1>
          <p className="page-subheading">Track live Ustads, view receipts, and rate completed work</p>
        </div>

        {/* Search */}
        <div className="bookings-search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by ID or service..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bookings-filter-tabs">
        <button
          className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All ({bookings.length})
        </button>
        <button
          className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => setStatusFilter('active')}
        >
          Active / Dispatched ({bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled' && b.status !== 'rejected').length})
        </button>
        <button
          className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setStatusFilter('completed')}
        >
          Completed ({bookings.filter((b) => b.status === 'completed').length})
        </button>
        <button
          className={`filter-tab ${statusFilter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setStatusFilter('cancelled')}
        >
          Cancelled ({bookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-cards-list">
        {filteredBookings.length === 0 ? (
          <div className="empty-bookings-box">
            <CalendarCheck size={44} className="empty-icon" />
            <h3>No bookings found in this filter</h3>
            <p>Ready to book an electrician, plumber or mechanic in Faisalabad?</p>
            <button
              className="book-now-cta-btn"
              onClick={() => openCreateBooking()}
            >
              Book an Ustad Now
            </button>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isCompleted = b.status === 'completed';
            const isActive =
              b.status === 'pending' ||
              b.status === 'accepted' ||
              b.status === 'on_the_way' ||
              b.status === 'arrived' ||
              b.status === 'in_progress';

            return (
              <div key={b.id} className="booking-history-card">
                <div className="card-header-line">
                  <div className="id-date-col">
                    <span className="booking-id-tag">{b.id}</span>
                    <span className="booking-date">
                      {new Date(b.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`status-pill ${getStatusBadgeClass(b.status)}`}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="card-service-title-row">
                  <h3 className="service-title">{b.serviceName}</h3>
                  <span className="price-tag">Rs. {b.finalPrice || b.estimatedPrice}</span>
                </div>

                <p className="problem-snippet">{b.problemDescription}</p>

                <div className="booking-meta-grid">
                  <div className="meta-item">
                    <MapPin size={13} />
                    <span>{b.address.split(',')[0]} ({b.area.split(',')[0]})</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={13} />
                    <span>
                      {b.scheduleType === 'now' ? 'Immediate Dispatch' : b.scheduledTime || 'Scheduled'}
                    </span>
                  </div>
                  {b.ustadName && (
                    <div className="meta-item ustad-item">
                      <ShieldCheck size={13} className="text-success" />
                      <span>Assigned: <strong>{b.ustadName}</strong></span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span>Payment: <strong className="text-uppercase">{b.paymentMethod}</strong> ({b.paymentStatus.toUpperCase()})</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions-row">
                  {isActive && (
                    <button
                      className="track-live-btn"
                      onClick={() => openTrackingModal(b)}
                    >
                      Track Ustad Live →
                    </button>
                  )}

                  {isCompleted && (
                    <>
                      {b.paymentStatus === 'unpaid' && (
                        <button
                          className="action-btn pay"
                          onClick={() => openPaymentModal(b)}
                        >
                          <CreditCard size={14} /> Pay Fee
                        </button>
                      )}
                      <button
                        className="action-btn receipt"
                        onClick={() => openPaymentModal(b)}
                      >
                        Receipt
                      </button>
                      <button
                        className="action-btn review"
                        onClick={() => openReviewModal(b)}
                      >
                        <Star size={14} /> Review
                      </button>
                      <button
                        className="action-btn complaint"
                        onClick={() => openComplaintModal(b)}
                      >
                        <HelpCircle size={14} /> Complaint
                      </button>
                    </>
                  )}

                  <button
                    className="action-btn rebook"
                    onClick={() => {
                      const matching = services.find((s) => s.id === b.serviceId);
                      openCreateBooking(matching);
                    }}
                  >
                    <RotateCcw size={14} /> Rebook
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
