import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
  Unlock,
  FileText,
  Lock,
  X,
  MapPin,
  Wrench,
  Check,
  ZoomIn,
  Award,
  AlertTriangle,
  UserCheck,
  Building2,
  Calendar,
  FileCheck,
  BadgeCheck,
  Fingerprint,
} from 'lucide-react';
import type { Ustad, VerificationStatus, ServiceCategoryType } from '../../types';

export const AdminUstadManagementView: React.FC = () => {
  const { ustads, updateUstadVerification, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategoryType | 'all'>('all');
  const [inspectModalUstad, setInspectModalUstad] = useState<Ustad | null>(null);

  // Inspector tab in modal
  const [activeDocTab, setActiveDocTab] = useState<'cnic_front' | 'cnic_back' | 'certificate'>('cnic_front');
  const [isZoomed, setIsZoomed] = useState(false);

  // Verification Checklist State
  const [auditChecklist, setAuditChecklist] = useState({
    photoMatch: true,
    cnicValid: true,
    experienceValid: true,
    faisalabadAreaValid: true,
    policeClearance: true,
  });

  // Rejection note / reason template
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectFormOpen, setIsRejectFormOpen] = useState(false);

  // Stats
  const totalUstads = ustads.length;
  const pendingCount = ustads.filter((u) => u.verificationStatus === 'pending').length;
  const approvedCount = ustads.filter((u) => u.verificationStatus === 'approved').length;
  const blockedCount = ustads.filter((u) => u.verificationStatus === 'blocked').length;

  const filteredUstads = ustads.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.cnicMasked.includes(searchQuery) ||
      u.serviceArea.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || u.verificationStatus === statusFilter;
    const matchesCat = categoryFilter === 'all' || u.skillCategories.includes(categoryFilter);

    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleAction = async (ustadId: string, status: VerificationStatus, note?: string) => {
    await updateUstadVerification(ustadId, status, note);
    showToast(`Ustad verification status updated to ${status.toUpperCase()}`, 'success');
    if (inspectModalUstad && inspectModalUstad.id === ustadId) {
      setInspectModalUstad((prev) =>
        prev ? { ...prev, verificationStatus: status, isVerified: status === 'approved' } : null
      );
    }
    setIsRejectFormOpen(false);
    setRejectionReason('');
  };

  const openDossier = (ustad: Ustad) => {
    setInspectModalUstad(ustad);
    setActiveDocTab('cnic_front');
    setIsZoomed(false);
    setIsRejectFormOpen(false);
    setRejectionReason('');
    setAuditChecklist({
      photoMatch: true,
      cnicValid: true,
      experienceValid: ustad.experienceYears >= 3,
      faisalabadAreaValid: true,
      policeClearance: true,
    });
  };

  return (
    <div className="admin-ustad-mgmt-container">
      {/* Header */}
      <div className="mgmt-header-box">
        <div>
          <h1 className="mgmt-title">NADRA Identity & Trade Verification Desk</h1>
          <p className="mgmt-sub">
            Government-grade verification console to inspect Smart CNIC documents, certify technical qualifications, and maintain 100% verified trust in Faisalabad.
          </p>
        </div>
      </div>

      {/* Compliance Overview KPI Cards */}
      <div className="verification-kpi-grid">
        <div className="v-kpi-card">
          <div className="v-kpi-icon amber">
            <Clock size={20} />
          </div>
          <div>
            <span className="v-kpi-label">Pending Verification</span>
            <strong className="v-kpi-value">{pendingCount}</strong>
            <small>Requires document inspection</small>
          </div>
        </div>

        <div className="v-kpi-card">
          <div className="v-kpi-icon green">
            <BadgeCheck size={20} />
          </div>
          <div>
            <span className="v-kpi-label">NADRA & Trade Verified</span>
            <strong className="v-kpi-value">{approvedCount}</strong>
            <small>Active dispatched Ustads</small>
          </div>
        </div>

        <div className="v-kpi-card">
          <div className="v-kpi-icon red">
            <Ban size={20} />
          </div>
          <div>
            <span className="v-kpi-label">Blocked / Suspended</span>
            <strong className="v-kpi-value">{blockedCount}</strong>
            <small>Safety standard infractions</small>
          </div>
        </div>

        <div className="v-kpi-card">
          <div className="v-kpi-icon blue">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="v-kpi-label">Total Technician Roster</span>
            <strong className="v-kpi-value">{totalUstads}</strong>
            <small>Faisalabad Pilot Network</small>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mgmt-filters-bar">
        <div className="search-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by technician name, phone, CNIC or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="status-pills-row">
          <button
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Ustads ({totalUstads})
          </button>
          <button
            className={`filter-pill warning ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            className={`filter-pill success ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Verified & Active ({approvedCount})
          </button>
          <button
            className={`filter-pill danger ${statusFilter === 'blocked' ? 'active' : ''}`}
            onClick={() => setStatusFilter('blocked')}
          >
            Blocked ({blockedCount})
          </button>
          <select
            className="filter-select-pill"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            aria-label="Filter by Trade Skill"
          >
            <option value="all">All Trade Skills</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="ac-technician">AC Technician</option>
            <option value="bike-mechanic">Bike Mechanic</option>
            <option value="car-mechanic">Car Mechanic</option>
            <option value="carpenter">Carpenter</option>
          </select>
        </div>
      </div>

      {/* Ustads Table Card */}
      <div className="mgmt-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Technician Dossier</th>
              <th>Trade & Experience</th>
              <th>CNIC (Masked)</th>
              <th>Service Area & Rating</th>
              <th>Verification State</th>
              <th>Compliance Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUstads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No Ustads found matching current filter query.
                </td>
              </tr>
            ) : (
              filteredUstads.map((ustad) => (
                <tr key={ustad.id} className={`ustad-row status-${ustad.verificationStatus}`}>
                  {/* Ustad Column */}
                  <td>
                    <div className="ustad-cell-col">
                      <div className="ustad-avatar-box">
                        <img src={ustad.avatar} alt={ustad.name} className="mini-avatar" />
                        {ustad.isVerified && (
                          <ShieldCheck size={14} className="verified-corner-badge" />
                        )}
                      </div>
                      <div>
                        <strong className="ustad-name-link" onClick={() => openDossier(ustad)}>
                          {ustad.name}
                        </strong>
                        <span className="phone-sub">{ustad.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td>
                    <div className="skills-tags-wrap">
                      {ustad.skillCategories.map((s) => (
                        <span key={s} className="mini-skill-pill">
                          {s.replace('-', ' ')}
                        </span>
                      ))}
                      <span className="exp-tag">{ustad.experienceYears}+ Years Practical</span>
                    </div>
                  </td>

                  {/* CNIC */}
                  <td>
                    <div className="cnic-cell-wrap">
                      <Fingerprint size={13} className="text-primary" />
                      <span className="cnic-code">{ustad.cnicMasked}</span>
                    </div>
                  </td>

                  {/* Area & Rating */}
                  <td>
                    <div>
                      <div className="area-label-row">
                        <MapPin size={12} className="text-danger" />
                        <span>{ustad.serviceArea.split(',')[0]}</span>
                      </div>
                      <div className="rating-mini">
                        <RatingStars rating={ustad.rating} size={12} showNumeric />
                        <small>({ustad.completedJobsCount} jobs)</small>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`status-tag-cell ${ustad.verificationStatus}`}>
                      {ustad.verificationStatus === 'approved' && <BadgeCheck size={13} />}
                      {ustad.verificationStatus === 'pending' && <Clock size={13} />}
                      {ustad.verificationStatus === 'blocked' && <Ban size={13} />}
                      {ustad.verificationStatus === 'rejected' && <XCircle size={13} />}
                      <span>{ustad.verificationStatus.toUpperCase()}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="table-actions-group">
                      <button
                        className="btn-inspect"
                        onClick={() => openDossier(ustad)}
                        title="Open complete identity & document audit dossier"
                      >
                        <Eye size={14} /> Audit Dossier
                      </button>

                      {ustad.verificationStatus === 'pending' && (
                        <button
                          className="btn-approve"
                          onClick={() => handleAction(ustad.id, 'approved', 'Verified and approved')}
                          title="Quick Approve"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                      )}

                      {ustad.verificationStatus === 'approved' && (
                        <button
                          className="btn-block"
                          onClick={() => handleAction(ustad.id, 'blocked', 'Suspended by admin')}
                          title="Suspend Ustad"
                        >
                          <Ban size={14} /> Suspend
                        </button>
                      )}

                      {ustad.verificationStatus === 'blocked' && (
                        <button
                          className="btn-unblock"
                          onClick={() => handleAction(ustad.id, 'approved', 'Reinstated after review')}
                          title="Unblock Ustad"
                        >
                          <Unlock size={14} /> Unblock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PROFESSIONAL VERIFICATION AUDIT DOSSIER MODAL */}
      {inspectModalUstad && (
        <div className="modal-backdrop" onClick={() => setInspectModalUstad(null)}>
          <div
            className="modal-surface admin-inspect-modal professional-dossier-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="inspect-header-row">
              <div className="dossier-title-group">
                <div className="dossier-icon-seal">
                  <ShieldCheck size={24} className="text-primary" />
                </div>
                <div>
                  <div className="dossier-meta-tags">
                    <span className="inspect-badge">GOVERNMENT & NADRA COMPLIANCE</span>
                    <span className="dossier-id-tag">REF #{inspectModalUstad.id.toUpperCase()}</span>
                  </div>
                  <h2>Verification Dossier: {inspectModalUstad.name}</h2>
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setInspectModalUstad(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="inspect-body">
              {/* Profile Card Header */}
              <div className="inspect-profile-hero">
                <div className="hero-avatar-wrap">
                  <img src={inspectModalUstad.avatar} alt={inspectModalUstad.name} />
                  {inspectModalUstad.isVerified && (
                    <BadgeCheck size={18} className="hero-verified-badge" />
                  )}
                </div>
                <div className="hero-info-col">
                  <div className="hero-name-row">
                    <h3>{inspectModalUstad.name}</h3>
                    <span className={`status-badge-hero ${inspectModalUstad.verificationStatus}`}>
                      {inspectModalUstad.verificationStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="hero-skills-row">
                    <strong>Specialization:</strong> {inspectModalUstad.skillCategories.join(', ')} • {inspectModalUstad.experienceYears} Years Workshop Experience
                  </p>
                  <div className="hero-meta-details">
                    <span><strong>Phone:</strong> {inspectModalUstad.phone}</span>
                    <span><strong>Area:</strong> {inspectModalUstad.serviceArea}</span>
                    <span><strong>Jobs Done:</strong> {inspectModalUstad.completedJobsCount}</span>
                  </div>
                </div>
              </div>

              {/* Document Inspector Tabs */}
              <div className="doc-inspector-container">
                <div className="doc-tab-buttons-bar">
                  <button
                    type="button"
                    className={`doc-tab-btn ${activeDocTab === 'cnic_front' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveDocTab('cnic_front');
                      setIsZoomed(false);
                    }}
                  >
                    <Fingerprint size={15} />
                    <span>CNIC Front (NADRA)</span>
                  </button>
                  <button
                    type="button"
                    className={`doc-tab-btn ${activeDocTab === 'cnic_back' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveDocTab('cnic_back');
                      setIsZoomed(false);
                    }}
                  >
                    <FileText size={15} />
                    <span>CNIC Back (Family)</span>
                  </button>
                  <button
                    type="button"
                    className={`doc-tab-btn ${activeDocTab === 'certificate' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveDocTab('certificate');
                      setIsZoomed(false);
                    }}
                  >
                    <Award size={15} />
                    <span>Vocational Certificate</span>
                  </button>
                </div>

                {/* Document Display Box */}
                <div className="active-doc-viewer-card">
                  <div className="doc-card-controls">
                    <span className="doc-type-label">
                      {activeDocTab === 'cnic_front' && 'NADRA Smart National Identity Card — Front Side'}
                      {activeDocTab === 'cnic_back' && 'NADRA Smart National Identity Card — Back Address Side'}
                      {activeDocTab === 'certificate' && 'Technical Vocational Training Institute Certification'}
                    </span>
                    <button
                      type="button"
                      className="zoom-toggle-btn"
                      onClick={() => setIsZoomed(!isZoomed)}
                    >
                      <ZoomIn size={14} />
                      <span>{isZoomed ? 'Reset View' : 'Inspect Zoom'}</span>
                    </button>
                  </div>

                  <div className={`doc-image-viewport ${isZoomed ? 'zoomed' : ''}`}>
                    {activeDocTab === 'cnic_front' && (
                      <img
                        src={inspectModalUstad.cnicFrontUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'}
                        alt="CNIC Front"
                        className="inspected-doc-img"
                      />
                    )}
                    {activeDocTab === 'cnic_back' && (
                      <img
                        src={inspectModalUstad.cnicBackUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'}
                        alt="CNIC Back"
                        className="inspected-doc-img"
                      />
                    )}
                    {activeDocTab === 'certificate' && (
                      <img
                        src={inspectModalUstad.certificateUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80'}
                        alt="Trade Certificate"
                        className="inspected-doc-img"
                      />
                    )}
                  </div>

                  <div className="doc-meta-footer">
                    <div className="meta-col">
                      <small>Recorded Identity ID:</small>
                      <strong>{inspectModalUstad.cnicFull || '33100-8472910-1'}</strong>
                    </div>
                    <div className="meta-col">
                      <small>Document Verification Status:</small>
                      <span className="text-success font-semibold">✓ Cryptographic Watermark Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Verification Checklist */}
              <div className="compliance-checklist-card">
                <h4>
                  <FileCheck size={16} className="text-primary" />
                  Compliance Officer Verification Criteria
                </h4>
                <div className="checklist-items-grid">
                  <label className="checklist-item-row">
                    <input
                      type="checkbox"
                      checked={auditChecklist.photoMatch}
                      onChange={(e) =>
                        setAuditChecklist({ ...auditChecklist, photoMatch: e.target.checked })
                      }
                    />
                    <span>CNIC biometric photo matches applicant portrait</span>
                  </label>

                  <label className="checklist-item-row">
                    <input
                      type="checkbox"
                      checked={auditChecklist.cnicValid}
                      onChange={(e) =>
                        setAuditChecklist({ ...auditChecklist, cnicValid: e.target.checked })
                      }
                    />
                    <span>NADRA 13-digit CNIC format valid & active</span>
                  </label>

                  <label className="checklist-item-row">
                    <input
                      type="checkbox"
                      checked={auditChecklist.experienceValid}
                      onChange={(e) =>
                        setAuditChecklist({ ...auditChecklist, experienceValid: e.target.checked })
                      }
                    />
                    <span>Minimum 3 years workshop trade experience authenticated</span>
                  </label>

                  <label className="checklist-item-row">
                    <input
                      type="checkbox"
                      checked={auditChecklist.faisalabadAreaValid}
                      onChange={(e) =>
                        setAuditChecklist({ ...auditChecklist, faisalabadAreaValid: e.target.checked })
                      }
                    />
                    <span>Workshop base operates within Faisalabad dispatch sector</span>
                  </label>

                  <label className="checklist-item-row">
                    <input
                      type="checkbox"
                      checked={auditChecklist.policeClearance}
                      onChange={(e) =>
                        setAuditChecklist({ ...auditChecklist, policeClearance: e.target.checked })
                      }
                    />
                    <span>Criminal history & background check clear</span>
                  </label>
                </div>
              </div>

              {/* Workshop Statement & Bio */}
              <div className="audit-notes-box">
                <h4>Applicant Statement & Workshop Details:</h4>
                <p>"{inspectModalUstad.bio}"</p>
              </div>

              {/* Structured Rejection Form if Opened */}
              {isRejectFormOpen && (
                <div className="rejection-panel-box">
                  <div className="rejection-header">
                    <AlertTriangle size={16} className="text-danger" />
                    <strong>Select or Record Rejection Reason:</strong>
                  </div>
                  <div className="rejection-presets-row">
                    <button
                      type="button"
                      className="reject-preset-btn"
                      onClick={() => setRejectionReason('CNIC document photo is blurry or unreadable. Please re-upload high resolution copy.')}
                    >
                      Blurry CNIC
                    </button>
                    <button
                      type="button"
                      className="reject-preset-btn"
                      onClick={() => setRejectionReason('Trade certificate unverifiable or expired. Please provide TEVTA or workshop reference.')}
                    >
                      Invalid Certificate
                    </button>
                    <button
                      type="button"
                      className="reject-preset-btn"
                      onClick={() => setRejectionReason('Workshop service address is outside supported Faisalabad pilot boundary.')}
                    >
                      Out of Service Area
                    </button>
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Enter formal rejection reason sent to applicant..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div className="rejection-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setIsRejectFormOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-danger-confirm"
                      onClick={() =>
                        handleAction(
                          inspectModalUstad.id,
                          'rejected',
                          rejectionReason || 'Application rejected by compliance reviewer'
                        )
                      }
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Sensitive Data Notice */}
              <div className="privacy-admin-warning">
                <Lock size={15} />
                <span>
                  Admin Security Protocol: Sensitive CNIC numbers and identity files are shielded by encryption. Full documents must not be disseminated outside authorized operations audits.
                </span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="inspect-actions-footer">
              <button
                className="cancel-btn"
                onClick={() => setInspectModalUstad(null)}
              >
                Close Dossier
              </button>

              <div className="decision-buttons-group">
                {!isRejectFormOpen && inspectModalUstad.verificationStatus !== 'rejected' && (
                  <button
                    type="button"
                    className="reject-btn-secondary"
                    onClick={() => setIsRejectFormOpen(true)}
                  >
                    <XCircle size={15} /> Reject Application
                  </button>
                )}

                {inspectModalUstad.verificationStatus !== 'approved' && (
                  <button
                    type="button"
                    className="approve-btn-primary"
                    onClick={() =>
                      handleAction(
                        inspectModalUstad.id,
                        'approved',
                        'Fully verified against NADRA & trade standards. Verified badge granted.'
                      )
                    }
                  >
                    <CheckCircle2 size={16} /> Approve & Grant Verified Ustad Badge
                  </button>
                )}

                {inspectModalUstad.verificationStatus === 'approved' && (
                  <button
                    type="button"
                    className="btn-block"
                    onClick={() =>
                      handleAction(inspectModalUstad.id, 'blocked', 'Suspended for safety review')
                    }
                  >
                    <Ban size={15} /> Suspend Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
