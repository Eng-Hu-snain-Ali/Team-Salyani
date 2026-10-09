import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  MapPin,
  Clock,
  ShieldCheck,
  DollarSign,
  X,
  CreditCard,
  User,
} from 'lucide-react';
import type { Booking, BookingStatus } from '../../types';

export const AdminBookingsView: React.FC = () => {
  const { bookings, openTrackingModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [selectedAuditBooking, setSelectedAuditBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.ustadName && b.ustadName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-bookings-container">
      {/* Header */}
      <div className="mgmt-header-box">
        <div>
          <h1 className="mgmt-title">Comprehensive Bookings Ledger</h1>
          <p className="mgmt-sub">
            Monitor real-time customer dispatches, assigned Ustads, payment states, and status transitions.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mgmt-filters-bar">
        <div className="search-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search booking ID, customer or technician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="status-pills-row">
          <button
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button
            className={`filter-pill warning ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({bookings.filter((b) => b.status === 'pending').length})
          </button>
          <button
            className={`filter-pill primary ${statusFilter === 'on_the_way' ? 'active' : ''}`}
            onClick={() => setStatusFilter('on_the_way')}
          >
            Dispatched ({bookings.filter((b) => b.status === 'on_the_way').length})
          </button>
          <button
            className={`filter-pill success ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({bookings.filter((b) => b.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="mgmt-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Assigned Ustad</th>
              <th>Service</th>
              <th>Address / Area</th>
              <th>Price</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No bookings found matching filters.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.id}</strong></td>
                  <td>
                    <div>
                      <strong>{b.userName}</strong>
                      <span className="sub-text">{b.userPhone}</span>
                    </div>
                  </td>
                  <td>
                    {b.ustadName ? (
                      <div className="ustad-cell">
                        <ShieldCheck size={14} className="text-success" />
                        <strong>{b.ustadName}</strong>
                      </div>
                    ) : (
                      <span className="unassigned-pill">Unassigned</span>
                    )}
                  </td>
                  <td>{b.serviceName}</td>
                  <td>
                    <div>
                      <span>{b.area.split(',')[0]}</span>
                      <small className="address-tooltip">{b.address.substring(0, 22)}...</small>
                    </div>
                  </td>
                  <td>
                    <strong>Rs. {b.finalPrice || b.estimatedPrice}</strong>
                  </td>
                  <td>
                    <span className={`status-tag-cell ${b.status}`}>
                      {b.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-pill ${b.paymentStatus}`}>
                      {b.paymentMethod.toUpperCase()} ({b.paymentStatus.toUpperCase()})
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-inspect"
                      onClick={() => setSelectedAuditBooking(b)}
                    >
                      <Eye size={14} /> Audit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BOOKING AUDIT MODAL */}
      {selectedAuditBooking && (
        <div className="modal-backdrop" onClick={() => setSelectedAuditBooking(null)}>
          <div
            className="modal-surface booking-audit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inspect-header-row">
              <div>
                <span className="inspect-badge">ADMIN AUDIT TRAIL</span>
                <h2>Booking Record: #{selectedAuditBooking.id}</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setSelectedAuditBooking(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="audit-body">
              <div className="audit-two-col">
                <div className="audit-col-box">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedAuditBooking.userName}</p>
                  <p><strong>Contact:</strong> {selectedAuditBooking.userPhone}</p>
                  <p><strong>Address:</strong> {selectedAuditBooking.address}</p>
                  <p><strong>Area:</strong> {selectedAuditBooking.area}</p>
                </div>

                <div className="audit-col-box">
                  <h4>Assigned Ustad</h4>
                  <p><strong>Technician:</strong> {selectedAuditBooking.ustadName || 'Not Assigned'}</p>
                  <p><strong>Phone:</strong> {selectedAuditBooking.ustadPhone || 'N/A'}</p>
                  <p><strong>Rating:</strong> ★ {selectedAuditBooking.ustadRating || '5.0'}</p>
                  <p><strong>Service:</strong> {selectedAuditBooking.serviceName}</p>
                </div>
              </div>

              {/* Status Timeline History */}
              <div className="audit-timeline-section">
                <h4>Status Transition Audit Log</h4>
                <div className="audit-timeline-list">
                  {selectedAuditBooking.statusTimeline.map((item, idx) => (
                    <div key={idx} className="timeline-event-tile">
                      <div className="event-bullet" />
                      <div className="event-detail">
                        <strong>{item.status.replace('_', ' ').toUpperCase()}</strong>
                        <p>{item.note || 'State transitioned'}</p>
                        <small>{new Date(item.timestamp).toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financials */}
              <div className="audit-finance-card">
                <div className="row">
                  <span>Gross Job Fee:</span>
                  <strong>Rs. {selectedAuditBooking.finalPrice || selectedAuditBooking.estimatedPrice}</strong>
                </div>
                <div className="row">
                  <span>Platform Commission (10%):</span>
                  <strong className="text-success">
                    Rs. {Math.round((selectedAuditBooking.finalPrice || selectedAuditBooking.estimatedPrice) * 0.1)}
                  </strong>
                </div>
                <div className="row">
                  <span>Ustad Net Payout (90%):</span>
                  <strong>
                    Rs. {Math.round((selectedAuditBooking.finalPrice || selectedAuditBooking.estimatedPrice) * 0.9)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="audit-footer">
              <button
                className="cancel-btn"
                onClick={() => setSelectedAuditBooking(null)}
              >
                Close Audit
              </button>
              <button
                className="btn-view-map"
                onClick={() => {
                  const target = selectedAuditBooking;
                  setSelectedAuditBooking(null);
                  openTrackingModal(target);
                }}
              >
                Open Live Tracking Map →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
