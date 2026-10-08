import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Sun, Moon, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    unreadNotifsCount,
    setIsNotificationsOpen,
    user,
  } = useApp();

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo & Tagline */}
        <div
          className="brand-block"
          onClick={() => setActiveTab('home')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-emblem">
            <Sparkles size={18} className="emblem-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">LifeLore</span>
            <span className="brand-tagline">Real Stories. Real Lessons.</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Search Trigger */}
          {activeTab !== 'explore' && (
            <button
              type="button"
              className="header-icon-btn search-trigger"
              onClick={() => setActiveTab('explore')}
              title="Search experiences"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          )}

          {/* Theme Switcher */}
          <button
            type="button"
            className="header-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Trigger with Unread Badge */}
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

          {/* User Avatar */}
          <button
            type="button"
            className="header-avatar-btn"
            onClick={() => setActiveTab('profile')}
            title="My Profile"
            aria-label="Profile"
          >
            <img src={user.avatar} alt={user.name} className="header-avatar-img" />
          </button>
        </div>
      </div>
    </header>
  );
};
