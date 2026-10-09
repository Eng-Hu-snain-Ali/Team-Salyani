import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  LogOut,
  Wrench,
  LayoutDashboard,
  Code2,
  CheckCircle2,
  GitBranch,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    setActiveRole,
    logoutUser,
    bookings,
    showToast,
    isAdminAuthenticated,
    setIsAdminAuthModalOpen,
  } = useApp();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newStreetAddress, setNewStreetAddress] = useState(user.address);
  const [newArea, setNewArea] = useState(user.area);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      address: newStreetAddress,
      area: newArea,
    });
    setIsEditingAddress(false);
    showToast('Service address updated', 'success');
  };

  const completedJobsCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="customer-profile-container">
      {/* Team Project Hero Banner */}
      <div className="profile-hero-card team-hero-card">
        <div className="team-avatar-emblem">
          <Users size={36} className="text-white" />
        </div>

        <div className="profile-title-col">
          <div className="team-title-row">
            <h2 className="user-name">Team Saylani</h2>
            <span className="team-badge">Team Project</span>
          </div>
          <span className="user-phone-tag">
            USTAD ONLINE — Collaborative Platform
          </span>
          <div className="team-meta-pills">
            <span className="customer-verified-pill">
              <ShieldCheck size={13} className="text-success" /> 4–5 Developers Collaboration
            </span>
            <span className="customer-verified-pill">
              <Sparkles size={13} className="text-warning" /> Faisalabad Pilot Launch
            </span>
          </div>
        </div>
      </div>

      {/* Team Contributors & Project Credits Card */}
      <div className="profile-section-card team-credits-card">
        <div className="credits-header">
          <Code2 size={20} className="text-primary" />
          <div>
            <h3>Project Architecture & Contributors</h3>
            <p>Collaborative multi-role engineering team specifications</p>
          </div>
        </div>

        <div className="credits-grid">
          <div className="credit-pill-item">
            <GitBranch size={16} className="text-primary" />
            <div>
              <strong>Engineering Repository</strong>
              <span>Eng-Hu-snain-Ali / Team-Salyani</span>
            </div>
          </div>

          <div className="credit-pill-item">
            <Users size={16} className="text-success" />
            <div>
              <strong>Lead & Collaborators</strong>
              <span>Engr. Husnain Ali & 4–5 Team Members</span>
            </div>
          </div>

          <div className="credit-pill-item">
            <Layers size={16} className="text-warning" />
            <div>
              <strong>Platform Scope</strong>
              <span>Customer App • Ustad App • Admin Web Panel</span>
            </div>
          </div>

          <div className="credit-pill-item">
            <CheckCircle2 size={16} className="text-primary" />
            <div>
              <strong>Target Region</strong>
              <span>Faisalabad City (D-Ground, Kohinoor, Madina Town)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Address & Area Section */}
      <div className="profile-section-card">
        <div className="section-header-line">
          <div>
            <h3>Primary Test Service Address</h3>
            <p>Used for automatic 25-minute Ustad dispatch in Faisalabad</p>
          </div>
          <button
            className="edit-addr-btn"
            onClick={() => setIsEditingAddress(!isEditingAddress)}
          >
            {isEditingAddress ? 'Cancel' : 'Edit Address'}
          </button>
        </div>

        {isEditingAddress ? (
          <form onSubmit={handleSaveAddress} className="edit-address-form">
            <div className="form-group">
              <label className="form-label">Sector</label>
              <select
                className="form-select"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
              >
                {FAISALABAD_AREAS.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name} ({a.urduName})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address & House Number</label>
              <input
                type="text"
                className="form-input"
                value={newStreetAddress}
                onChange={(e) => setNewStreetAddress(e.target.value)}
              />
            </div>

            <button type="submit" className="save-addr-btn">
              Save Address
            </button>
          </form>
        ) : (
          <div className="address-display-box">
            <MapPin size={18} className="pin-icon" />
            <div>
              <strong>{user.address}</strong>
              <span>Sector: {user.area}</span>
            </div>
          </div>
        )}
      </div>

      {/* Saved Favorite Locations */}
      <div className="profile-section-card">
        <h3>Saved Places in Faisalabad</h3>
        <div className="saved-places-list">
          {user.savedAddresses?.map((addr) => (
            <div key={addr.id} className="place-item-card">
              <MapPin size={16} />
              <div>
                <strong>{addr.label}</strong>
                <span>{addr.address}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Activity Stats */}
      <div className="profile-stats-row">
        <div className="stat-card-pill">
          <CalendarCheck size={18} className="text-primary" />
          <div>
            <strong>{completedJobsCount} Jobs</strong>
            <span>Completed Repairs</span>
          </div>
        </div>

        <div className="stat-card-pill">
          <ShieldCheck size={18} className="text-success" />
          <div>
            <strong>100%</strong>
            <span>Verified Ustads</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Sandbox for Evaluator */}
      <div className="profile-section-card sandbox-role-box">
        <h3>Switch Application Mode (Demo Sandbox)</h3>
        <p>Preview the separate portals created for Ustads and Administrators:</p>

        <div className="role-switch-grid">
          <button
            className="sandbox-btn"
            onClick={() => {
              setActiveRole('ustad');
              showToast('Switched to Ustad / Mechanic view', 'info');
            }}
          >
            <Wrench size={18} />
            <div>
              <strong>Open Ustad Portal</strong>
              <small>Worker dashboard, incoming requests & wallet</small>
            </div>
          </button>

          <button
            className="sandbox-btn"
            onClick={() => {
              if (isAdminAuthenticated) {
                setActiveRole('admin');
                showToast('Switched to Admin Web Panel', 'info');
              } else {
                setIsAdminAuthModalOpen(true);
              }
            }}
          >
            <div className="sandbox-admin-btn-icon">
              <LayoutDashboard size={18} />
              {!isAdminAuthenticated && <Lock size={12} className="lock-sub-icon" />}
            </div>
            <div>
              <strong>Open Admin Web Panel {!isAdminAuthenticated && '(Password Required)'}</strong>
              <small>Document review, rates, bookings & 10% commission</small>
            </div>
          </button>
        </div>
      </div>

      {/* Logout & Account Actions */}
      <div className="profile-footer-buttons">
        <button
          className="logout-action-btn"
          onClick={logoutUser}
        >
          <LogOut size={16} /> Sign Out Demo Session
        </button>
      </div>
    </div>
  );
};
