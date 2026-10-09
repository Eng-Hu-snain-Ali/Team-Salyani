import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UstadDashboardView } from './UstadDashboardView';
import { UstadRequestsView } from './UstadRequestsView';
import { UstadActiveJobsView } from './UstadActiveJobsView';
import { UstadWalletView } from './UstadWalletView';
import { RatingStars } from '../../components/common/RatingStars';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Lock,
  Award,
  Phone,
  Bike,
  Clock,
  Sparkles,
  BadgeCheck,
  Check,
  Fingerprint,
  UserCheck,
  Edit3,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';

export const UstadPortalView: React.FC = () => {
  const {
    ustadTab,
    currentUstad,
    setCurrentUstad,
    ustads,
    setIsUstadRegisterModalOpen,
    showToast,
  } = useApp();

  const [isEditingArea, setIsEditingArea] = useState(false);
  const [selectedArea, setSelectedArea] = useState(currentUstad?.serviceArea || 'D-Ground, Peoples Colony No. 1, Faisalabad');

  const handleSaveArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUstad) {
      setCurrentUstad({ ...currentUstad, serviceArea: selectedArea });
      setIsEditingArea(false);
      showToast('Service dispatch area updated successfully', 'success');
    }
  };

  const renderTab = () => {
    switch (ustadTab) {
      case 'dashboard':
        return <UstadDashboardView />;
      case 'requests':
        return <UstadRequestsView />;
      case 'active_jobs':
        return <UstadActiveJobsView />;
      case 'wallet':
        return <UstadWalletView />;
      case 'profile':
        return (
          <div className="ustad-profile-screen-container">
            {/* Header Hero */}
            <div className="profile-header-card ustad-pro-card">
              <div className="profile-avatar-frame">
                <img
                  src={currentUstad?.avatar}
                  alt={currentUstad?.name}
                  className="profile-avatar-lg"
                />
                {currentUstad?.isVerified && (
                  <BadgeCheck size={22} className="avatar-verified-badge" />
                )}
              </div>
              <div className="profile-hero-info">
                <div className="hero-name-row">
                  <h2>{currentUstad?.name}</h2>
                  <span className={`status-badge-inline ${currentUstad?.verificationStatus}`}>
                    <ShieldCheck size={14} /> {currentUstad?.verificationStatus.toUpperCase()}
                  </span>
                </div>
                <p className="hero-subtext">
                  {currentUstad?.skillCategories.map((s) => s.replace('-', ' ')).join(', ')} • {currentUstad?.experienceYears} Years Workshop Experience
                </p>
                <div className="hero-rating-row">
                  <RatingStars rating={currentUstad?.rating || 5} size={16} showNumeric />
                  <span>({currentUstad?.reviewCount} Verified Customer Reviews)</span>
                </div>
              </div>
            </div>

            {/* Switch Active Technician Tester (for Demo Evaluators) */}
            <div className="ustad-persona-switcher-pill profile-switcher">
              <span className="persona-label">Switch Active Technician (Demo Testing):</span>
              <select
                className="persona-select"
                value={currentUstad?.id}
                onChange={(e) => {
                  const found = ustads.find((u) => u.id === e.target.value);
                  if (found) setCurrentUstad(found);
                }}
              >
                {ustads.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.skillCategories[0]} ({u.verificationStatus.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Official Certification & Trust Seals */}
            <div className="profile-section-block trust-seals-box">
              <h3>Government & Trust Accreditations</h3>
              <div className="trust-seals-grid">
                <div className="seal-item">
                  <Award size={18} className="text-primary" />
                  <div>
                    <strong>Saylani Mass IT Training (SMIT)</strong>
                    <span>Vocational Trade Certified</span>
                  </div>
                </div>

                <div className="seal-item">
                  <Fingerprint size={18} className="text-success" />
                  <div>
                    <strong>NADRA Smart CNIC Verified</strong>
                    <span>Biometric Identity Match (Level 3)</span>
                  </div>
                </div>

                <div className="seal-item">
                  <ShieldCheck size={18} className="text-warning" />
                  <div>
                    <strong>Faisalabad Police Verification</strong>
                    <span>Character Clearance Recorded</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Credentials */}
            <div className="profile-credentials-grid">
              <div className="credential-card">
                <span className="card-lbl">Contact Phone:</span>
                <strong>{currentUstad?.phone}</strong>
              </div>
              <div className="credential-card">
                <span className="card-lbl">CNIC (Encrypted):</span>
                <strong>{currentUstad?.cnicMasked}</strong>
              </div>
              <div className="credential-card">
                <div className="cred-header-inline">
                  <span className="card-lbl">Service Coverage Area:</span>
                  <button
                    type="button"
                    className="edit-area-link"
                    onClick={() => setIsEditingArea(!isEditingArea)}
                  >
                    <Edit3 size={12} /> {isEditingArea ? 'Cancel' : 'Change'}
                  </button>
                </div>
                {isEditingArea ? (
                  <form onSubmit={handleSaveArea} className="edit-area-form">
                    <select
                      className="form-select"
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                    >
                      {FAISALABAD_AREAS.map((a) => (
                        <option key={a.id} value={`${a.name}, Faisalabad`}>
                          {a.name} ({a.urduName})
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="save-mini-btn">
                      Save Area
                    </button>
                  </form>
                ) : (
                  <strong>{currentUstad?.serviceArea}</strong>
                )}
              </div>
              <div className="credential-card">
                <span className="card-lbl">Total Completed Jobs:</span>
                <strong>{currentUstad?.completedJobsCount} Lifetime Jobs</strong>
              </div>
            </div>

            {/* Tool Kit & Equipment Inventory */}
            <div className="profile-section-block">
              <h3>Verified Tool Kit & Safety Equipment</h3>
              <div className="toolkit-items-grid">
                <div className="tool-chip">
                  <Check size={13} className="text-success" />
                  <span>Digital Clamp Multimeter</span>
                </div>
                <div className="tool-chip">
                  <Check size={13} className="text-success" />
                  <span>Heavy-Duty Pipe Wrench</span>
                </div>
                <div className="tool-chip">
                  <Check size={13} className="text-success" />
                  <span>Insulated Electric Screwdrivers</span>
                </div>
                <div className="tool-chip">
                  <Check size={13} className="text-success" />
                  <span>AC Pressure Gauges & Vacuum Pump</span>
                </div>
                <div className="tool-chip">
                  <Check size={13} className="text-success" />
                  <span>Impact Drill Machine</span>
                </div>
                <div className="tool-chip">
                  <Check size={13} className="text-success" />
                  <span>Safety Shoes & Insulated Gloves</span>
                </div>
              </div>
            </div>

            {/* Vehicle & Transit */}
            <div className="profile-section-block">
              <h3>Dispatch Vehicle & Workshop Details</h3>
              <div className="vehicle-details-card">
                <Bike size={20} className="text-primary" />
                <div>
                  <strong>Motorbike: Honda CD 70 / 125 (Faisalabad Registered)</strong>
                  <span>Equipped with weather-proof toolbox for fast 20-minute dispatch across Faisalabad</span>
                </div>
              </div>
            </div>

            {/* Secure Identity Protection Note */}
            <div className="security-notice-panel">
              <Lock size={18} className="lock-icon" />
              <div>
                <strong>Secure Identity Verification Record:</strong>
                <p>
                  Full CNIC documents, thumbprints, and police verification reports are securely handled under Faisalabad Municipal Artisan Database compliance. Public profiles only display masked CNIC badges.
                </p>
              </div>
            </div>

            {/* Bio & Skills */}
            <div className="profile-section-block">
              <h3>Workshop Bio & Statement</h3>
              <p className="bio-quote">"{currentUstad?.bio}"</p>
            </div>

            <div className="profile-section-block">
              <h3>Registered Trade Specializations</h3>
              <div className="skills-badge-list">
                {currentUstad?.skillCategories.map((skill) => (
                  <span key={skill} className="skill-pill">
                    <Wrench size={13} /> {skill.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="profile-actions-footer">
              <button
                className="btn-outline-primary"
                onClick={() => setIsUstadRegisterModalOpen(true)}
              >
                Submit New Verification Documents
              </button>
            </div>
          </div>
        );
      default:
        return <UstadDashboardView />;
    }
  };

  return (
    <div className="ustad-portal-layout">
      {renderTab()}
    </div>
  );
};
