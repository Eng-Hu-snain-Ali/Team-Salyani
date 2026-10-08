import React from 'react';
import { useApp } from '../../context/AppContext';
import type { NavigationTab } from '../../types';
import { 
  Flame, 
  Award, 
  Sparkles,
  Layers,
  Compass,
  BarChart3,
  User as UserIcon,
  Server
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    backendStatus 
  } = useApp();

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'home', label: 'Home', icon: <Compass size={18} /> },
    { tab: 'challenges', label: 'Challenges', icon: <Layers size={18} /> },
    { tab: 'skills', label: 'Skills', icon: <BarChart3 size={18} /> },
    { tab: 'progress', label: 'Progress', icon: <Award size={18} /> },
    { tab: 'profile', label: 'Profile', icon: <UserIcon size={18} /> },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '12px 24px',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--brand-glow)',
          }}>
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                letterSpacing: '-0.03em',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                LifeOS
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818CF8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                letterSpacing: '0.05em',
              }}>
                MVP
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Learn by Living
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--glass-border)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isActive ? 'var(--brand-gradient)' : 'transparent',
                  boxShadow: isActive ? '0 2px 12px rgba(99, 102, 241, 0.4)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Badges & Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Backend Status indicator */}
          <div 
            title={backendStatus.connected ? 'Connected to FastAPI Backend (port 8000)' : 'Standalone Mode with Built-in AI Evaluation Engine'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              background: backendStatus.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
              border: `1px solid ${backendStatus.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              fontSize: '0.75rem',
              color: backendStatus.connected ? '#34D399' : '#A5B4FC',
            }}
            className="hide-mobile"
          >
            <Server size={14} />
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: backendStatus.connected ? '#10B981' : '#818CF8',
              display: 'inline-block',
            }} />
            <span>{backendStatus.connected ? 'API Ready' : 'AI Offline Eng.'}</span>
          </div>

          {/* Streak Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            color: '#FBBF24',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}>
            <Flame size={16} className="flame-animated" color="#F59E0B" fill="#F59E0B" />
            <span>{user.streak}d</span>
          </div>

          {/* XP Pill */}
          <div 
            onClick={() => setActiveTab('progress')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#FFFFFF',
            }}>
              {user.level}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C7D2FE' }}>
              {user.xp} <span style={{ fontSize: '0.7rem', color: '#818CF8' }}>XP</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
