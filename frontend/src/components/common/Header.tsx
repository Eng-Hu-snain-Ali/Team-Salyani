import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Zap, Bell, Sun, Moon, Compass } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    setActiveTab,
    unreadNotifsCount,
    setIsNotificationsOpen,
    user,
    isAuthenticated,
    openAuthModal,
  } = useApp();

  return (
    <header className="ustad-header">
      <div className="ustad-header-inner">
        {/* Brand: USTAD ONLINE */}
        <div
          className="header-brand"
          onClick={() => setActiveTab('home')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon-emblem">
            <Compass size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">USTAD ONLINE</span>
            <span className="brand-tagline">Learn. Decide. Improve.</span>
          </div>
        </div>

        {/* Right Navigation & Status Metrics */}
        <div className="header-actions">
          {/* Streak Indicator */}
          <button
            type="button"
            className="streak-pill-btn"
            onClick={() => setActiveTab('progress')}
            title="Current Streak"
          >
            <Flame size={16} fill="currentColor" />
            <span>{user.streakDays}d</span>
          </button>

          {/* XP Pill */}
          <div className="xp-pill-badge" title="Total Accumulated XP">
            <Zap size={15} fill="currentColor" />
            <span>{user.xp} XP</span>
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            className="icon-action-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications Drawer Toggle */}
          <button
            type="button"
            className="icon-action-btn"
            onClick={() => setIsNotificationsOpen(true)}
            title="Notifications & Alerts"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadNotifsCount > 0 && <span className="badge-unread-count" />}
          </button>

          {/* Profile / Auth Avatar */}
          {isAuthenticated ? (
            <button
              type="button"
              className="header-avatar-btn"
              onClick={() => setActiveTab('profile')}
              title={`Profile (${user.name})`}
              aria-label="Profile"
            >
              <img src={user.avatar} alt={user.name} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.84rem' }}
              onClick={() => openAuthModal('welcome')}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
