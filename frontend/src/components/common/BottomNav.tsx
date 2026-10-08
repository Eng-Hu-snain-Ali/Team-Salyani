import React from 'react';
import { useApp } from '../../context/AppContext';
import type { NavigationTab } from '../../types';
import { Compass, BookOpen, Lightbulb, Layers, BarChart3, User as UserIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'home', label: 'Home', icon: <Compass size={19} /> },
    { tab: 'feed', label: 'Stories', icon: <BookOpen size={19} /> },
    { tab: 'ideas', label: 'Ideas', icon: <Lightbulb size={19} /> },
    { tab: 'challenges', label: 'Cases', icon: <Layers size={19} /> },
    { tab: 'skills', label: 'Skills', icon: <BarChart3 size={19} /> },
    { tab: 'profile', label: 'Profile', icon: <UserIcon size={19} /> },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 13, 20, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--glass-border)',
      padding: '8px 16px 12px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 60,
    }} className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive = activeTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: isActive ? '#818CF8' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: isActive ? 700 : 500,
              padding: '4px 12px',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              transition: 'all var(--transition-fast)',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {isActive && (
              <span style={{
                position: 'absolute',
                top: -8,
                width: 24,
                height: 3,
                borderRadius: 2,
                background: 'var(--brand-gradient)',
                boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
