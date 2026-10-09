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
  Search,
  Phone,
  Wrench,
  DollarSign,
  User,
  Filter,
  Check,
  AlertTriangle,
  FileText,
  BadgeAlert,
  ArrowRight,
  ShieldCheck,
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

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Complaint triage modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<ComplaintStatus>('resolved');
  const [remedyAction, setRemedyAction] = useState<string>('Free Re-inspection by Senior Ustad');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Notification Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'customer' | 'ustad'>('all');

  // Quick stats
  const totalCount = complaints.length;
  const openCount = complaints.filter((c) => c.status === 'open').length;
  const investigatingCount = complaints.filter((c) => c.status === 'investigating').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bookingId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const finalNotes = resolutionNotes.trim()
      ? `[Action: ${remedyAction}] ${resolutionNotes}`
      : `Action taken: ${remedyAction}. Resolved by Trust & Safety Desk.`;

    await updateComplaintStatus(selectedComplaint.id, resolutionStatus, finalNotes);
    showToast(`Complaint #${selectedComplaint.id} updated to ${resolutionStatus.toUpperCase()}`, 'success');
    setSelectedComplaint(null);
    setResolutionNotes('');
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('Title and message are required for broadcast announcement.', 'warning');
      return;
    }

    await broadcastNotification(broadcastTitle, broadcastMessage, targetAudience);
    showToast(`Broadcast dispatched to ${targetAudience.toUpperCase()}`, 'success');
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  const applyQuickTemplate = (template: string) => {
    setResolutionNotes((prev) => (prev ? `${prev} • ${template}` : template));
  };

  return (
    <div className="admin-complaints-container">
      {/* Header */}
      <div className="mgmt-header-box">
        <div>
          <h1 className="mgmt-title">Dispute Resolution & Customer Trust Center</h1>
          <p className="mgmt-sub">
            Investigate customer complaints, mediate between Ustads & households, issue corrective remedies, and broadcast network advisories.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="complaint-stats-grid">
        <div className="c-stat-card">
          <div className="c-stat-icon red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <span className="c-stat-label">Action Required (Open)</span>
            <strong className="c-stat-num">{openCount}</strong>
          </div>
        </div>

        <div className="c-stat-card">
          <div className="c-stat-icon blue">
            <Clock size={20} />
          </div>
          <div>
            <span className="c-stat-label">Under Investigation</span>
            <strong className="c-stat-num">{investigatingCount}</strong>
          </div>
        </div>

        <div className="c-stat-card">
          <div className="c-stat-icon green">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="c-stat-label">Resolved Disputes</span>
            <strong className="c-stat-num">{resolvedCount}</strong>
          </div>
        </div>

        <div className="c-stat-card">
          <div className="c-stat-icon amber">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="c-stat-label">Total Escalated Tickets</span>
            <strong className="c-stat-num">{totalCount}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Complaints Desk, Right Broadcast Composer */}
      <div className="complaints-layout-grid">
        {/* Left Column: Complaints Desk */}
        <div className="complaints-col">
          {/* Filter Bar */}
          <div className="complaints-filter-bar">
            <div className="search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by ticket ID, customer, booking ID or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="status-pills-row">
              <button
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({totalCount})
              </button>
              <button
                className={`filter-pill danger ${statusFilter === 'open' ? 'active' : ''}`}
                onClick={() => setStatusFilter('open')}
              >
                Open ({openCount})
              </button>
              <button
                className={`filter-pill warning ${statusFilter === 'investigating' ? 'active' : ''}`}
                onClick={() => setStatusFilter('investigating')}
              >
                Investigating ({investigatingCount})
              </button>
              <button
                className={`filter-pill success ${statusFilter === 'resolved' ? 'active' : ''}`}
                onClick={() => setStatusFilter('resolved')}
              >
                Resolved ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Complaints Stack */}
          <div className="complaints-stack">
            {filteredComplaints.length === 0 ? (
              <div className="empty-complaints-box">
                <CheckCircle2 size={36} className="text-success" />
                <h3>No Complaints Found</h3>
                <p>All customer disputes in this filter view have been successfully addressed.</p>
              </div>
            ) : (
              filteredComplaints.map((c) => (
                <div key={c.id} className={`complaint-card status-border-${c.status}`}>
                  <div className="complaint-card-top">
                    <div className="complaint-header-left">
                      <span className="complaint-id-tag">TICKET #{c.id}</span>
                      <span className="booking-ref-tag">Booking: {c.bookingId}</span>
                      <h4 className="complaint-subject">{c.subject}</h4>
                    </div>
                    <div className="complaint-status-tags">
                      <span className={`status-pill ${c.status}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="complaint-quote-box">
                    <p className="complaint-desc-body">"{c.description}"</p>
                  </div>

                  {/* Customer & Linked Details Grid */}
                  <div className="complaint-entities-grid">
                    <div className="entity-item">
                      <User size={14} className="text-primary" />
                      <div>
                        <small>Customer</small>
                        <strong>{c.userName}</strong>
                        <span>{c.userPhone}</span>
                      </div>
                    </div>

                    <div className="entity-item">
                      <Clock size={14} className="text-warning" />
                      <div>
                        <small>Filing Date</small>
                        <strong>{new Date(c.createdAt).toLocaleDateString()}</strong>
                        <span>Faisalabad District</span>
                      </div>
                    </div>

                    <div className="entity-item">
                      <ShieldAlert size={14} className="text-danger" />
                      <div>
                        <small>Trust Level</small>
                        <strong>Priority Investigation</strong>
                        <span>Resolution SLA: 24h</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Resolution Note if already added */}
                  {c.resolutionNotes && (
                    <div className="resolution-notes-preview">
                      <div className="res-note-header">
                        <Check size={14} className="text-success" />
                        <strong>Operations Resolution Record:</strong>
                      </div>
                      <p>{c.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="complaint-card-footer">
                    <div className="quick-sim-buttons">
                      <button
                        className="sim-action-btn"
                        onClick={() => showToast(`Simulating customer call to ${c.userPhone}...`, 'info')}
                        title="Simulate direct customer call"
                      >
                        <Phone size={13} /> Call Customer
                      </button>
                      <button
                        className="sim-action-btn"
                        onClick={() => showToast('Simulated SMS advisory dispatched to technician', 'info')}
                        title="Issue warning to Ustad"
                      >
                        <AlertTriangle size={13} /> Warn Ustad
                      </button>
                    </div>

                    <button
                      className="triage-action-btn"
                      onClick={() => {
                        setSelectedComplaint(c);
                        setResolutionStatus(c.status);
                        setResolutionNotes(c.resolutionNotes || '');
                      }}
                    >
                      Triage & Apply Remedy →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Notification Broadcast Composer */}
        <div className="broadcast-col">
          <div className="panel-title-bar">
            <Radio size={18} className="text-primary" />
            <h3>Broadcast System Announcement</h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="broadcast-composer-card">
            <div className="form-group">
              <label className="form-label">Target Audience in Faisalabad</label>
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
                placeholder="e.g. Faisalabad Pre-Monsoon Electric Safety Advisory"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Broadcast Message *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Type advisory message to broadcast across mobile notification trays..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
              />
            </div>

            <div className="fcm-notice">
              <AlertCircle size={14} />
              <span>
                Note: In production, this dispatches via Firebase Cloud Messaging (FCM). In demo mode, it delivers instantly to in-app notification trays.
              </span>
            </div>

            <button type="submit" className="broadcast-submit-btn">
              <Send size={15} /> Send System Broadcast
            </button>
          </form>

          {/* Broadcast History */}
          <div className="broadcast-history-box">
            <h4>Recent Broadcast History ({notifications.length})</h4>
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

      {/* RESOLUTION & TRIAGE MODAL */}
      {selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setSelectedComplaint(null)}>
          <div
            className="modal-surface triage-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <div>
                <span className="modal-step-tag">DISPUTE MEDIATION & RESOLUTION</span>
                <h2>Triage Ticket #{selectedComplaint.id}</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setSelectedComplaint(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="triage-form">
              {/* Complaint Summary Box */}
              <div className="complaint-summary-box">
                <div className="summary-line">
                  <strong>Customer:</strong>
                  <span>{selectedComplaint.userName} ({selectedComplaint.userPhone})</span>
                </div>
                <div className="summary-line">
                  <strong>Booking Ref:</strong>
                  <span>#{selectedComplaint.bookingId}</span>
                </div>
                <div className="summary-line">
                  <strong>Subject:</strong>
                  <span>{selectedComplaint.subject}</span>
                </div>
                <div className="summary-desc-box">
                  <strong>Customer Statement:</strong>
                  <p>"{selectedComplaint.description}"</p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="form-group">
                <label className="form-label">Investigation & Resolution Status</label>
                <select
                  className="form-select"
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as ComplaintStatus)}
                >
                  <option value="open">Open (Awaiting Operations Action)</option>
                  <option value="investigating">Under Investigation (Technician Questioned)</option>
                  <option value="resolved">Resolved (Customer Satisfied / Remedy Provided)</option>
                  <option value="dismissed">Dismissed (Unfounded / Terms of Service Ineligible)</option>
                </select>
              </div>

              {/* Remedy Selector */}
              <div className="form-group">
                <label className="form-label">Selected Resolution Remedy</label>
                <select
                  className="form-select"
                  value={remedyAction}
                  onChange={(e) => setRemedyAction(e.target.value)}
                >
                  <option value="Free Re-inspection by Senior Ustad">Free Re-inspection by Senior Ustad</option>
                  <option value="50% Partial Goodwill Refund Processed">50% Partial Goodwill Refund Processed</option>
                  <option value="100% Full Refund to Customer Wallet">100% Full Refund to Customer Wallet</option>
                  <option value="Technician Issued Formal Strike & Retrained">Technician Issued Formal Strike & Retrained</option>
                  <option value="Mutual Settlement Reached via Mediation">Mutual Settlement Reached via Mediation</option>
                  <option value="Dismissed after Technical Review">Dismissed after Technical Review</option>
                </select>
              </div>

              {/* Quick Template Buttons */}
              <div className="form-group">
                <label className="form-label">Quick Resolution Notes Templates</label>
                <div className="template-pills-row">
                  <button
                    type="button"
                    className="tpl-pill"
                    onClick={() => applyQuickTemplate('Customer contacted via call. Explained rate card breakdown and satisfied.')}
                  >
                    + Customer Contacted
                  </button>
                  <button
                    type="button"
                    className="tpl-pill"
                    onClick={() => applyQuickTemplate('Dispatched senior technician to correct wiring free of charge.')}
                  >
                    + Free Re-dispatch
                  </button>
                  <button
                    type="button"
                    className="tpl-pill"
                    onClick={() => applyQuickTemplate('Refund of Rs. 400 processed back to customer Easypaisa.')}
                  >
                    + Refund Issued
                  </button>
                  <button
                    type="button"
                    className="tpl-pill"
                    onClick={() => applyQuickTemplate('Ustad penalized 1 strike on platform for unpunctual arrival.')}
                  >
                    + Ustad Penalty
                  </button>
                </div>
              </div>

              {/* Resolution Notes Textarea */}
              <div className="form-group">
                <label className="form-label">Detailed Resolution Notes & Audit Record *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Record formal findings and actions taken by trust & safety desk..."
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
                  <ShieldCheck size={16} /> Save Resolution & Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
