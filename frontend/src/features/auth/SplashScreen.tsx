import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const SplashScreen: React.FC = () => {
  const { isSplashOpen, setIsSplashOpen } = useApp();

  if (!isSplashOpen) return null;

  return (
    <div className="ustad-splash-overlay">
      <div className="splash-card">
        <div className="splash-logo-box">
          <Wrench className="splash-icon" size={40} />
        </div>

        <div className="splash-title-row">
          <span className="brand-ustad">USTAD</span>
          <span className="brand-online">ONLINE</span>
        </div>

        <p className="splash-tagline">"Reliable Ustads. Transparent Prices."</p>

        <div className="splash-badge-box">
          <MapPin size={14} />
          <span>Faisalabad Pilot Launch • 100% Verified Mechanics</span>
        </div>

        <div className="splash-pillars">
          <div className="pillar-item">
            <ShieldCheck size={16} className="text-success" />
            <span>NADRA Verified</span>
          </div>
          <div className="pillar-item">
            <span className="dot">•</span>
            <span>Fixed Rate Cards</span>
          </div>
          <div className="pillar-item">
            <span className="dot">•</span>
            <span>25-Min Dispatch</span>
          </div>
        </div>

        <button
          className="splash-get-started-btn"
          onClick={() => setIsSplashOpen(false)}
        >
          <span>Find an Ustad in Faisalabad</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
