import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  Clock,
  Radio,
  X,
} from 'lucide-react';
import type { Complaint, ComplaintStatus } from '../../types';

export const AdminComplaintsView: React.FC = () => {
  const {
    complaints,
    notifications,
    updateComplaintStatus,
    broadcastNotification,
    showToast,
  } = useApp();

  // Complaint triage modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<ComplaintStatus>('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Notification Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'customer' | 'ustad'>('all');

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    await updateComplaintStatus(
      selectedComplaint.id,
      resolutionStatus,
      resolutionNotes || 'Resolved by Trust & Safety Desk.'
    );

    setSelectedComplaint(null);
    setResolutionNotes('');
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('Title and message are required for broadcast announcement.', 'warning');
      return;
    }

    await broadcastNotification(
      broadcastTitle,
      broadcastMessage,
      targetAudience
    );

    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="admin-complaints-container">
      {/* Header */}
      <div className="mgmt-header-box">
        <div>
          <h1 className="mgmt-title">Complaints Triage & System Announcements</h1>
          <p className="mgmt-sub">
            Investigate customer dispute tickets, record resolution notes, and broadcast announcements.
          </p>
        </div>
      </div>

      <div className="complaints-layout-grid">
        {/* Left Col: Complaints List */}
        <div className="complaints-col">
          <div className="panel-title-bar">
            <ShieldAlert size={18} className="text-danger" />
            <h3>Customer Complaints Inbox ({complaints.length})</h3>
          </div>

          <div className="complaints-stack">
            {complaints.map((c) => (
              <div key={c.id} className="complaint-card">
                <div className="complaint-card-top">
                  <div>
                    <span className="complaint-id-tag">{c.id}</span>
                    <h4 className="complaint-subject">{c.subject}</h4>
                  </div>
                  <span className={`status-pill ${c.status}`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>

                <p className="complaint-desc-body">"{c.description}"</p>

                <div className="complaint-meta-row">
                  <span>Customer: <strong>{c.userName}</strong> ({c.userPhone})</span>
                  <span>Booking ID: <strong>{c.bookingId}</strong></span>
                  <span>Date: {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>

                {c.resolutionNotes && (
                  <div className="resolution-notes-preview">
                    <strong>Admin Resolution Note:</strong>
                    <p>{c.resolutionNotes}</p>
                  </div>
                )}

                <div className="complaint-card-footer">
                  <button
                    className="triage-action-btn"
                    onClick={() => {
                      setSelectedComplaint(c);
                      setResolutionStatus(c.status);
                      setResolutionNotes(c.resolutionNotes || '');
                    }}
                  >
                    Triage & Update Resolution →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Notification Broadcast Composer */}
        <div className="broadcast-col">
          <div className="panel-title-bar">
            <Radio size={18} className="text-primary" />
            <h3>Broadcast System Announcement</h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="broadcast-composer-card">
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <div className="audience-select-row">
                <button
                  type="button"
                  className={`aud-btn ${targetAudience === 'all' ? 'active' : ''}`}
                  onClick={() => setTargetAudience('all')}
                >
                  All Users
                </button>
                <button
                  type="button"
                  className={`aud-btn ${targetAudience === 'customer' ? 'active' : ''}`}
                  onClick={() => setTargetAudience('customer')}
                >
                  Customers Only
                </button>
                <button
                  type="button"
                  className={`aud-btn ${targetAudience === 'ustad' ? 'active' : ''}`}
                  onClick={() => setTargetAudience('ustad')}
                >
                  Ustads Only
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Announcement Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Faisalabad Monsoon Maintenance Offer"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Broadcast Message *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Type message to broadcast to mobile notification trays..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
              />
            </div>

            <div className="fcm-notice">
              <AlertCircle size={14} />
              <span>
                Note: In production, this dispatches Firebase Cloud Messaging (FCM) push alerts. In demo mode, it delivers to in-app notification trays.
              </span>
            </div>

            <button type="submit" className="broadcast-submit-btn">
              <Send size={15} /> Send System Broadcast
            </button>
          </form>

          {/* Broadcast History */}
          <div className="broadcast-history-box">
            <h4>Recent Broadcast History</h4>
            <div className="broadcast-history-list">
              {notifications.map((n) => (
                <div key={n.id} className="history-item">
                  <div className="history-top">
                    <strong>{n.title}</strong>
                    <span className="target-pill">{n.targetRole.toUpperCase()}</span>
                  </div>
                  <p>{n.message}</p>
                  <small>{new Date(n.createdAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      {selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setSelectedComplaint(null)}>
          <div
            className="modal-surface triage-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <div>
                <span className="modal-step-tag">Dispute Resolution</span>
                <h2>Update Complaint #{selectedComplaint.id}</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setSelectedComplaint(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="triage-form">
              <div className="complaint-summary-box">
                <p><strong>Customer:</strong> {selectedComplaint.userName} ({selectedComplaint.userPhone})</p>
                <p><strong>Booking ID:</strong> {selectedComplaint.bookingId}</p>
                <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
                <p><strong>Description:</strong> "{selectedComplaint.description}"</p>
              </div>

              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  className="form-select"
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as ComplaintStatus)}
                >
                  <option value="open">Open (Unassigned)</option>
                  <option value="investigating">Under Investigation</option>
                  <option value="resolved">Resolved (Customer Satisfied / Refunded)</option>
                  <option value="dismissed">Dismissed (Unfounded / Ineligible)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Resolution Notes / Action Taken</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Record what was done (e.g. technician re-inspected free of charge, partial refund processed, technician warned)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setSelectedComplaint(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn-primary">
                  Save Resolution Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
