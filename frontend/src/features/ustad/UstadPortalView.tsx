import React from 'react';
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
} from 'lucide-react';

export const UstadPortalView: React.FC = () => {
  const { ustadTab, currentUstad, setIsUstadRegisterModalOpen } = useApp();

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
            <div className="profile-header-card">
              <div className="profile-avatar-frame">
                <img
                  src={currentUstad?.avatar}
                  alt={currentUstad?.name}
                  className="profile-avatar-lg"
                />
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
                  <span>({currentUstad?.reviewCount} Customer Reviews)</span>
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
                <span className="card-lbl">Service Coverage Area:</span>
                <strong>{currentUstad?.serviceArea}</strong>
              </div>
              <div className="credential-card">
                <span className="card-lbl">Total Completed Jobs:</span>
                <strong>{currentUstad?.completedJobsCount} Jobs</strong>
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
              <h3>Workshop Bio</h3>
              <p>{currentUstad?.bio}</p>
            </div>

            <div className="profile-section-block">
              <h3>Service Categories</h3>
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
