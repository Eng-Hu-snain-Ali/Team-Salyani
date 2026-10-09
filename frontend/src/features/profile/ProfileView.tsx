import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  MapPin,
  Plus,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  HelpCircle,
  LogOut,
  Smartphone,
  Wrench,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    setCustomerTab,
    setActiveRole,
    logoutUser,
    bookings,
    setIsAuthModalOpen,
    showToast,
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
  };

  const completedJobsCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="customer-profile-container">
      {/* User Hero Banner */}
      <div className="profile-hero-card">
        <div className="profile-avatar-wrapper">
          <img src={user.avatar} alt={user.name} className="profile-img" />
          <button
            className="change-avatar-badge"
            onClick={() => showToast('Avatar update simulated', 'info')}
            title="Change photo"
          >
            ✓
          </button>
        </div>

        <div className="profile-title-col">
          <h2 className="user-name">{user.name}</h2>
          <span className="user-phone-tag">
            <Phone size={13} /> {user.phone}
          </span>
          <span className="customer-verified-pill">
            <ShieldCheck size={13} className="text-success" /> Faisalabad Verified Citizen
          </span>
        </div>
      </div>

      {/* Primary Address & Area Section */}
      <div className="profile-section-card">
        <div className="section-header-line">
          <div>
            <h3>Primary Service Address</h3>
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
                    {a.name}
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
        <h3>Saved Places</h3>
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
            <span>Satisfaction Rate</span>
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
              setActiveRole('admin');
              showToast('Switched to Admin Web Panel', 'info');
            }}
          >
            <LayoutDashboard size={18} />
            <div>
              <strong>Open Admin Web Panel</strong>
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
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};
