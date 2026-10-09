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
} from 'lucide-react';
import type { Ustad, VerificationStatus, ServiceCategoryType } from '../../types';

export const AdminUstadManagementView: React.FC = () => {
  const { ustads, updateUstadVerification, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategoryType | 'all'>('all');
  const [inspectModalUstad, setInspectModalUstad] = useState<Ustad | null>(null);

  const filteredUstads = ustads.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.cnicMasked.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || u.verificationStatus === statusFilter;
    const matchesCat = categoryFilter === 'all' || u.skillCategories.includes(categoryFilter);

    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleAction = async (ustadId: string, status: VerificationStatus, note?: string) => {
    await updateUstadVerification(ustadId, status, note);
    if (inspectModalUstad && inspectModalUstad.id === ustadId) {
      setInspectModalUstad((prev) => (prev ? { ...prev, verificationStatus: status, isVerified: status === 'approved' } : null));
    }
  };

  return (
    <div className="admin-ustad-mgmt-container">
      {/* Header */}
      <div className="mgmt-header-box">
        <div>
          <h1 className="mgmt-title">Ustad & Mechanic Verification Desk</h1>
          <p className="mgmt-sub">
            Review identity documents, approve verification applications, and maintain trust standards.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mgmt-filters-bar">
        <div className="search-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, phone or CNIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="status-pills-row">
          <button
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({ustads.length})
          </button>
          <button
            className={`filter-pill warning ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({ustads.filter((u) => u.verificationStatus === 'pending').length})
          </button>
          <button
            className={`filter-pill success ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({ustads.filter((u) => u.verificationStatus === 'approved').length})
          </button>
          <button
            className={`filter-pill danger ${statusFilter === 'blocked' ? 'active' : ''}`}
            onClick={() => setStatusFilter('blocked')}
          >
            Blocked ({ustads.filter((u) => u.verificationStatus === 'blocked').length})
          </button>
        </div>
      </div>

      {/* Ustads Table */}
      <div className="mgmt-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Technician</th>
              <th>Skills & Experience</th>
              <th>CNIC (Masked)</th>
              <th>Area / Rating</th>
              <th>Status</th>
              <th>Verification Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUstads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No Ustads found matching current filters.
                </td>
              </tr>
            ) : (
              filteredUstads.map((ustad) => (
                <tr key={ustad.id}>
                  {/* Ustad Column */}
                  <td>
                    <div className="ustad-cell-col">
                      <img src={ustad.avatar} alt={ustad.name} className="mini-avatar" />
                      <div>
                        <strong>{ustad.name}</strong>
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
                      <small>{ustad.experienceYears} Years Exp</small>
                    </div>
                  </td>

                  {/* CNIC */}
                  <td>
                    <span className="cnic-code">{ustad.cnicMasked}</span>
                  </td>

                  {/* Area & Rating */}
                  <td>
                    <div>
                      <span>{ustad.serviceArea.split(',')[0]}</span>
                      <div className="rating-mini">
                        <RatingStars rating={ustad.rating} size={12} showNumeric />
                        <small>({ustad.completedJobsCount} jobs)</small>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`status-tag-cell ${ustad.verificationStatus}`}>
                      {ustad.verificationStatus.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="table-actions-group">
                      <button
                        className="btn-inspect"
                        onClick={() => setInspectModalUstad(ustad)}
                        title="Inspect submitted documents"
                      >
                        <Eye size={14} /> Inspect
                      </button>

                      {ustad.verificationStatus === 'pending' && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleAction(ustad.id, 'approved', 'Approved by Admin')}
                            title="Approve Ustad"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleAction(ustad.id, 'rejected', 'Incomplete documents')}
                            title="Reject Ustad"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}

                      {ustad.verificationStatus === 'approved' && (
                        <button
                          className="btn-block"
                          onClick={() => handleAction(ustad.id, 'blocked', 'Suspended by Trust & Safety')}
                          title="Block Ustad"
                        >
                          <Ban size={14} /> Block
                        </button>
                      )}

                      {ustad.verificationStatus === 'blocked' && (
                        <button
                          className="btn-unblock"
                          onClick={() => handleAction(ustad.id, 'approved', 'Unblocked after review')}
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

      {/* DOCUMENT INSPECTION MODAL */}
      {inspectModalUstad && (
        <div className="modal-backdrop" onClick={() => setInspectModalUstad(null)}>
          <div
            className="modal-surface admin-inspect-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inspect-header-row">
              <div>
                <span className="inspect-badge">ADMIN AUDIT DOSSIER</span>
                <h2>Verification Audit: {inspectModalUstad.name}</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setInspectModalUstad(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="inspect-body">
              {/* Profile Bar */}
              <div className="inspect-profile-hero">
                <img src={inspectModalUstad.avatar} alt={inspectModalUstad.name} />
                <div>
                  <h3>{inspectModalUstad.name}</h3>
                  <p>
                    {inspectModalUstad.skillCategories.join(', ')} • {inspectModalUstad.experienceYears} Years Workshop Experience
                  </p>
                  <span>Phone: {inspectModalUstad.phone} • Area: {inspectModalUstad.serviceArea}</span>
                </div>
                <div className="status-side">
                  <span className={`status-badge-hero ${inspectModalUstad.verificationStatus}`}>
                    {inspectModalUstad.verificationStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Secure Document Preview Grid */}
              <div className="inspect-docs-section">
                <h4>Submitted Identity Documents (Encrypted Preview)</h4>
                <div className="docs-preview-grid">
                  <div className="doc-preview-card">
                    <span className="doc-title">CNIC Front Copy</span>
                    <img
                      src={inspectModalUstad.cnicFrontUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'}
                      alt="CNIC Front"
                      className="doc-img"
                    />
                    <small>Official NADRA Smart Card</small>
                  </div>

                  <div className="doc-preview-card">
                    <span className="doc-title">CNIC Back Copy</span>
                    <img
                      src={inspectModalUstad.cnicBackUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'}
                      alt="CNIC Back"
                      className="doc-img"
                    />
                    <small>Family Tree & Address Proof</small>
                  </div>

                  <div className="doc-preview-card">
                    <span className="doc-title">Skill Certificate / Trade Proof</span>
                    <img
                      src={inspectModalUstad.certificateUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80'}
                      alt="Certificate"
                      className="doc-img"
                    />
                    <small>Technical Trade Certification</small>
                  </div>
                </div>
              </div>

              {/* Bio & Audit Notes */}
              <div className="audit-notes-box">
                <h4>Applicant Statement & Workshop Bio:</h4>
                <p>"{inspectModalUstad.bio}"</p>
              </div>

              {/* Sensitive Data Notice */}
              <div className="privacy-admin-warning">
                <Lock size={16} />
                <span>
                  Admin Privacy Protocol: Full identity records must never be exported or forwarded outside the secure management console.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="inspect-actions-footer">
              <button
                className="cancel-btn"
                onClick={() => setInspectModalUstad(null)}
              >
                Close Audit
              </button>

              {inspectModalUstad.verificationStatus !== 'approved' && (
                <button
                  className="approve-btn-primary"
                  onClick={() => handleAction(inspectModalUstad.id, 'approved', 'Verified and approved')}
                >
                  <CheckCircle2 size={16} /> Approve & Grant Verified Badge
                </button>
              )}

              {inspectModalUstad.verificationStatus !== 'rejected' && (
                <button
                  className="reject-btn-secondary"
                  onClick={() => handleAction(inspectModalUstad.id, 'rejected', 'Documents rejected by reviewer')}
                >
                  <XCircle size={16} /> Reject Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
