import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ArrowRight } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../constants';

export const SplashScreen: React.FC = () => {
  const { isSplashOpen, setIsSplashOpen, openAuthModal } = useApp();

  if (!isSplashOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div
        className="modal-container modal-size-md"
        style={{
          textAlign: 'center',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        {/* Emblem */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--color-primary-glow)',
          }}
        >
          <Compass size={36} strokeWidth={2.4} />
        </div>

        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            USTAD ONLINE
          </h1>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
            Learn. Decide. Improve.
          </p>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: '440px' }}>
          Master life's critical decisions before you face them for real. Practice realistic dilemmas, experience true consequences, and develop antifragile instincts.
        </p>

        {/* Core Learning Cycle */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            letterSpacing: '0.04em',
          }}
        >
          SCENARIO ➔ DECISION ➔ CONSEQUENCE ➔ FEEDBACK ➔ PROGRESS
        </div>

        {/* 5 Categories Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
          {SKILL_CATEGORIES.map((cat) => (
            <span
              key={cat.id}
              className="badge"
              style={{ backgroundColor: cat.badgeBg, color: cat.color }}
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
            onClick={() => setIsSplashOpen(false)}
          >
            <span>Start Practicing Scenarios</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%' }}
            onClick={() => {
              setIsSplashOpen(false);
              openAuthModal('welcome');
            }}
          >
            Sign In or Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
