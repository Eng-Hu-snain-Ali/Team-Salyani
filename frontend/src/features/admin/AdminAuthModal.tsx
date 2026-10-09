import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    verifyAdminPasscode,
  } = useApp();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!passcode.trim()) {
      setErrorMsg('Please enter the administrative passcode.');
      return;
    }

    setIsSubmitting(true);
    const success = verifyAdminPasscode(passcode);
    setIsSubmitting(false);

    if (success) {
      setPasscode('');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect passcode. Authorized Saylani & Ustad Online admins only.');
    }
  };

  const handleQuickDemoPasscode = () => {
    setPasscode('admin123');
    setErrorMsg('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAdminAuthModalOpen(false)}>
      <div
        className="modal-surface admin-auth-gate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-gate-header">
          <div className="security-icon-emblem">
            <ShieldAlert size={28} className="text-warning" />
            <Lock size={16} className="lock-sub-icon" />
          </div>
          <div>
            <span className="gate-badge">AUTHENTICATION REQUIRED</span>
            <h2>Admin Portal Security Check</h2>
            <p>
              Administrative access is protected. Please enter your master passcode to manage Ustads, rate cards, and financial commissions.
            </p>
          </div>
          <button
            className="close-btn"
            onClick={() => setIsAdminAuthModalOpen(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-gate-form">
          <div className="form-group">
            <label className="form-label">Master Admin Passcode *</label>
            <div className="passcode-input-wrap">
              <KeyRound size={18} className="key-icon" />
              <input
                type={showPasscode ? 'text' : 'password'}
                className={`form-input passcode-input ${errorMsg ? 'error' : ''}`}
                placeholder="Enter admin passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                autoFocus
              />
              <button
                type="button"
                className="toggle-eye-btn"
                onClick={() => setShowPasscode(!showPasscode)}
                title={showPasscode ? 'Hide' : 'Show'}
              >
                {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errorMsg && (
              <div className="passcode-error-banner">
                <AlertTriangle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Demo Autocompletion Hint */}
          <div className="demo-passcode-hint-box">
            <div className="hint-info">
              <CheckCircle2 size={16} className="text-primary" />
              <div>
                <strong>Evaluator / Demo Credentials:</strong>
                <span>Master Passcode: <code>admin123</code></span>
              </div>
            </div>
            <button
              type="button"
              className="quick-fill-pass-btn"
              onClick={handleQuickDemoPasscode}
            >
              Auto-fill Passcode
            </button>
          </div>

          <div className="gate-actions-row">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsAdminAuthModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="confirm-btn-primary unlock-admin-btn"
              disabled={isSubmitting}
            >
              <Lock size={16} /> Unlock Management Console
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
