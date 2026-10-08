import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, X, Sparkles } from 'lucide-react';

export const UnlockModal: React.FC = () => {
  const { showUnlockToast, clearUnlockToast } = useApp();

  if (!showUnlockToast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 999,
      maxWidth: 380,
      background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.25)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.5)',
        flexShrink: 0,
      }}>
        <Trophy size={24} color="#FFFFFF" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <Sparkles size={14} color="#FBBF24" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase' }}>
            Achievement Unlocked!
          </span>
        </div>
        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
          {showUnlockToast.title}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          {showUnlockToast.description}
        </p>
      </div>

      <button
        onClick={clearUnlockToast}
        style={{
          color: 'var(--text-muted)',
          padding: 4,
          borderRadius: 6,
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};
