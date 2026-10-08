import React from 'react';
import { useApp, type NavigationTab } from '../../context/AppContext';
import { Home, Compass, Plus, Bookmark, User as UserIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, savedExperiences } = useApp();

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'explore', label: 'Explore', icon: <Compass size={20} /> },
    {
      id: 'create',
      label: 'Share',
      icon: <Plus size={24} className="create-plus-icon" />,
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: <Bookmark size={20} />,
      badge: savedExperiences.length > 0 ? savedExperiences.length : undefined,
    },
    { id: 'profile', label: 'Profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Main Navigation">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const isCreate = item.id === 'create';
          const isActive =
            activeTab === item.id ||
            (item.id === 'home' && activeTab === 'detail') ||
            (item.id === 'home' && activeTab === 'video');

          if (isCreate) {
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item-create ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
                aria-label="Share Your Experience"
                title="Share your experience"
              >
                <div className="create-btn-inner">
                  {item.icon}
                </div>
                <span className="create-btn-label">Share</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="nav-icon-wrapper">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="nav-badge-pill">{item.badge}</span>
                )}
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
