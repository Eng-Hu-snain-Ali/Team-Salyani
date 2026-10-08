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
    { id: 'home', label: 'Home', icon: <Home size={19} /> },
    { id: 'explore', label: 'Explore', icon: <Compass size={19} /> },
    {
      id: 'create',
      label: 'Share',
      icon: <Plus size={20} />,
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: <Bookmark size={19} />,
      badge: savedExperiences.length > 0 ? savedExperiences.length : undefined,
    },
    { id: 'profile', label: 'Profile', icon: <UserIcon size={19} /> },
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Main Navigation">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const isCreate = item.id === 'create';
          const isActive =
            activeTab === item.id ||
            (item.id === 'home' && (activeTab === 'detail' || activeTab === 'video'));

          if (isCreate) {
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item-share ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
                aria-label="Share Experience"
                title="Share Experience"
              >
                <div className="share-btn-circle">
                  {item.icon}
                </div>
                <span className="share-btn-text">Share</span>
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
