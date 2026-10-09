import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
  Wrench,
  Smartphone,
  LayoutDashboard,
  Lock,
  Users,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';
import type { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    isAdminAuthenticated,
    lockAdminSession,
    selectedArea,
    setSelectedArea,
    theme,
    toggleTheme,
    unreadNotifsCount,
    setIsNotificationsOpen,
    setIsAuthModalOpen,
    user,
    currentUstad,
  } = useApp();

  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);

  return (
    <header className="ustad-header">
      {/* Top Banner Notice */}
      <div className="ustad-top-announcement">
        <div className="announcement-content">
          <span className="announcement-pill">FAISALABAD PILOT</span>
          <span className="announcement-text">
            ⚡ 100% NADRA & Police Verified Ustads now live in D-Ground, Kohinoor & Madina Town.
          </span>
          <span className="announcement-hotline">
            Helpline: <strong>041-8782300</strong>
          </span>
        </div>
      </div>

      <div className="header-main-bar">
        {/* Left: Brand & Tagline */}
        <div className="brand-section">
          <div className="brand-logo-container" onClick={() => setActiveRole('customer')}>
            <div className="brand-icon-box">
              <Wrench className="brand-icon" size={20} />
            </div>
            <div className="brand-text-group">
              <div className="brand-title-row">
                <span className="brand-name">USTAD</span>
                <span className="brand-name-accent">ONLINE</span>
                <span className="brand-badge-pk">PK</span>
              </div>
              <span className="brand-tagline">Reliable Ustads. Transparent Prices.</span>
            </div>
          </div>

          {/* Faisalabad Location Selector */}
          <div className="location-selector-wrap">
            <button
              className="location-pill-btn"
              onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
              title="Change Faisalabad service sector"
              aria-label="Select Faisalabad service area"
            >
              <MapPin size={15} className="location-pin-icon" />
              <div className="location-info">
                <span className="location-label">Service Area:</span>
                <span className="location-value">{selectedArea.name.split(',')[0]}</span>
              </div>
              <ChevronDown size={14} className="location-arrow" />
            </button>

            {isAreaDropdownOpen && (
              <div className="area-dropdown-menu">
                <div className="dropdown-header">
                  <span>Select Faisalabad Sector</span>
                  <small>Ustads nearby are filtered by sector</small>
                </div>
                <div className="area-list-scroll">
                  {FAISALABAD_AREAS.map((area) => (
                    <button
                      key={area.id}
                      className={`area-option-btn ${area.id === selectedArea.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedArea(area);
                        setIsAreaDropdownOpen(false);
                      }}
                    >
                      <div className="area-text">
                        <strong>{area.name}</strong>
                        <span>{area.urduName} • {area.popularFor}</span>
                      </div>
                      {area.id === selectedArea.id && (
                        <ShieldCheck size={16} className="area-active-check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Persona / Role Switcher Tabs */}
        <div className="role-switcher-container">
          <div className="role-switcher-track">
            <button
              className={`role-tab-btn ${activeRole === 'customer' ? 'active' : ''}`}
              onClick={() => setActiveRole('customer')}
              title="Customer Booking App"
            >
              <Smartphone size={15} />
              <span>Customer App</span>
            </button>
            <button
              className={`role-tab-btn ${activeRole === 'ustad' ? 'active' : ''}`}
              onClick={() => setActiveRole('ustad')}
              title="Ustad Mechanic Portal"
            >
              <Wrench size={15} />
              <span>Ustad Portal</span>
              {currentUstad?.isAvailable && <span className="online-dot" title="Online" />}
            </button>
            <button
              className={`role-tab-btn ${activeRole === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveRole('admin')}
              title={isAdminAuthenticated ? 'Admin Web Panel' : 'Admin Web Panel (Password Required)'}
            >
              <LayoutDashboard size={15} />
              <span>Admin Panel</span>
              {!isAdminAuthenticated && <Lock size={12} className="role-lock-badge" />}
            </button>
          </div>
        </div>

        {/* Right: Actions (Theme, Notification, Profile) */}
        <div className="header-actions">
          {/* Admin Lock Session Quick Action */}
          {activeRole === 'admin' && (
            <button
              className="action-icon-btn lock-session-btn"
              onClick={lockAdminSession}
              title="Lock Admin Session"
              aria-label="Lock Admin Session"
            >
              <Lock size={17} className="text-warning" />
            </button>
          )}

          {/* Notification Button */}
          <button
            className="action-icon-btn notification-btn"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && (
              <span className="notif-badge">{unreadNotifsCount}</span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            className="action-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User Account / Auth Modal Trigger */}
          <button
            className="user-profile-btn"
            onClick={() => setIsAuthModalOpen(true)}
            title="Account & Demo Login"
          >
            <div className="user-avatar-mini">
              {activeRole === 'ustad' && currentUstad?.avatar ? (
                <img src={currentUstad.avatar} alt={currentUstad.name} />
              ) : activeRole === 'admin' ? (
                <ShieldCheck size={16} className="text-danger" />
              ) : (
                <Users size={15} className="text-primary" />
              )}
            </div>
            <div className="user-meta-label">
              <span className="user-display-name">
                {activeRole === 'ustad'
                  ? currentUstad?.name?.split(' ')[0] || 'Ustad'
                  : activeRole === 'admin'
                  ? 'Faisalabad Admin'
                  : user?.name || 'Team Saylani'}
              </span>
              <span className="role-tag">{activeRole.toUpperCase()}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
