import React from 'react';
import { useApp, type TabId } from '../../context/AppContext';
import { Home, Compass, Award, BarChart3, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home size={19} /> },
    { id: 'challenges', label: 'Challenges', icon: <Compass size={19} /> },
    { id: 'skills', label: 'Skills', icon: <Award size={19} /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 size={19} /> },
    { id: 'profile', label: 'Profile', icon: <User size={19} /> },
  ];

  return (
    <nav className="ustad-bottom-nav" aria-label="Main Navigation">
      <div className="ustad-bottom-nav-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`bottom-nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="tab-icon-wrapper">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
