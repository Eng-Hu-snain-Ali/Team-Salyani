import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { isSplashOpen, setIsSplashOpen, openAuthModal } = useApp();

  if (!isSplashOpen) return null;

  return (
    <div className="splash-overlay" role="dialog" aria-modal="true" aria-label="Lived splash introduction">
      <div className="splash-card">
        {/* Lived Monogram */}
        <div className="splash-logo-symbol">
          <span>L</span>
        </div>

        <h1 className="splash-app-title">Lived</h1>
        <p className="splash-tagline">Real experiences. Real lessons.</p>

        <div className="splash-divider" />

        <p className="splash-description">
          A team-built collaborative platform where people share real experiences,
          practical lessons, and ideas to help others learn and grow.
        </p>

        <div className="splash-benefits-row">
          <div className="splash-benefit-item">
            <Sparkles size={16} />
            <span>Under 1-min sharing</span>
          </div>
          <div className="splash-benefit-item">
            <BookOpen size={16} />
            <span>Actionable takeaways</span>
          </div>
        </div>

        <div className="splash-cta-actions">
          <button
            type="button"
            className="btn-primary splash-enter-btn"
            onClick={() => setIsSplashOpen(false)}
          >
            <span>Explore Experiences</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            className="btn-secondary splash-login-btn"
            onClick={() => {
              setIsSplashOpen(false);
              openAuthModal('welcome');
            }}
          >
            <span>Sign In or Register</span>
          </button>
        </div>

        <span className="splash-team-badge">Lived — Team Project</span>
      </div>
    </div>
  );
};
