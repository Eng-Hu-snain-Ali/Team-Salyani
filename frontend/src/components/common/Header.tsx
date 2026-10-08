import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    unreadNotifsCount,
    setIsNotificationsOpen,
    user,
    isAuthenticated,
    openAuthModal,
  } = useApp();

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo: Lived */}
        <div
          className="brand-block"
          onClick={() => setActiveTab('home')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-dot-logo" />
          <div className="brand-text">
            <span className="brand-title">Lived</span>
            <span className="brand-tagline">Real experiences. Real lessons.</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {activeTab !== 'explore' && (
            <button
              type="button"
              className="header-icon-btn"
              onClick={() => setActiveTab('explore')}
              title="Search experiences"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          )}

          <button
            type="button"
            className="header-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className="header-icon-btn notif-btn"
            onClick={() => setIsNotificationsOpen(true)}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && (
              <span className="notif-badge">{unreadNotifsCount}</span>
            )}
          </button>

          {!isAuthenticated ? (
            <button
              type="button"
              className="header-auth-btn"
              onClick={() => openAuthModal('welcome')}
            >
              Sign In
            </button>
          ) : (
            <button
              type="button"
              className="header-avatar-btn"
              onClick={() => setActiveTab('profile')}
              title="Profile"
              aria-label="Profile"
            >
              <img src={user.avatar} alt={user.name} className="header-avatar-img" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
