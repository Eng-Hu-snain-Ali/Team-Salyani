import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  User as UserIcon,
  MapPin,
  Sparkles,
  Smartphone,
  Wrench,
  LayoutDashboard,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';
import type { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    isAuthenticated,
    loginDemoUser,
    logoutUser,
    activeRole,
    setActiveRole,
    showToast,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile' | 'account'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+92 300 8645123');
  const [otpCode, setOtpCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [name, setName] = useState('Team Saylani User');
  const [area, setArea] = useState('D-Ground, Peoples Colony No. 1');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      setErrorMsg('Please enter a valid Pakistani phone number (+92 3XX XXXXXXX)');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode.length !== 4) {
      setErrorMsg('Invalid OTP. Use demo code 1234 to verify.');
      return;
    }
    setErrorMsg('');
    await loginDemoUser(phoneNumber, selectedRole);
    setStep('phone');
    setOtpCode('');
  };

  const handleAutoFillOtp = () => {
    setOtpCode('1234');
    setErrorMsg('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="modal-surface auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div>
            <span className="auth-tag">USTAD ONLINE AUTHENTICATION</span>
            <h2 className="auth-title">
              {isAuthenticated ? 'My Profile & Account' : 'Phone Number Verification'}
            </h2>
          </div>
          <button
            className="close-btn"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {isAuthenticated ? (
          /* LOGGED IN ACCOUNT VIEW */
          <div className="account-details-body">
            <div className="account-hero-row">
              <div className="account-avatar-frame">
                <img src={user.avatar} alt={user.name} />
              </div>
              <div>
                <h3>{user.name}</h3>
                <span className="phone-code">{user.phone}</span>
                <span className="current-role-badge">
                  Active Persona: <strong>{activeRole.toUpperCase()}</strong>
                </span>
              </div>
            </div>

            <div className="account-fields-grid">
              <div className="field-box">
                <span className="lbl">Saved Address:</span>
                <strong>{user.address}</strong>
              </div>
              <div className="field-box">
                <span className="lbl">Service Sector:</span>
                <strong>{user.area}</strong>
              </div>
            </div>

            {/* Quick Switch Persona Buttons */}
            <div className="role-switch-section">
              <span className="section-lbl">Switch Persona Mode:</span>
              <div className="role-buttons-grid">
                <button
                  type="button"
                  className={`role-select-btn ${activeRole === 'customer' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveRole('customer');
                    showToast('Switched to Customer App view', 'info');
                    setIsAuthModalOpen(false);
                  }}
                >
                  <Smartphone size={16} />
                  <span>Customer App</span>
                </button>
                <button
                  type="button"
                  className={`role-select-btn ${activeRole === 'ustad' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveRole('ustad');
                    showToast('Switched to Ustad Mechanic Portal', 'info');
                    setIsAuthModalOpen(false);
                  }}
                >
                  <Wrench size={16} />
                  <span>Ustad Portal</span>
                </button>
                <button
                  type="button"
                  className={`role-select-btn ${activeRole === 'admin' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveRole('admin');
                    showToast('Switched to Admin Web Panel', 'info');
                    setIsAuthModalOpen(false);
                  }}
                >
                  <LayoutDashboard size={16} />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>

            <div className="auth-footer-actions">
              <button
                className="logout-btn"
                onClick={async () => {
                  await logoutUser();
                  setStep('phone');
                }}
              >
                Log Out
              </button>
              <button
                className="close-modal-btn-primary"
                onClick={() => setIsAuthModalOpen(false)}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN FLOW: PHONE & DEMO OTP */
          <div className="auth-flow-body">
            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="phone-form">
                <p className="auth-intro-text">
                  Enter your mobile phone number. You will receive a 4-digit verification code.
                </p>

                {/* Role to login as */}
                <div className="form-group">
                  <label className="form-label">Sign In As:</label>
                  <div className="role-radio-group">
                    <button
                      type="button"
                      className={`role-choice-pill ${selectedRole === 'customer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('customer')}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      className={`role-choice-pill ${selectedRole === 'ustad' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('ustad')}
                    >
                      Ustad / Mechanic
                    </button>
                    <button
                      type="button"
                      className={`role-choice-pill ${selectedRole === 'admin' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('admin')}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div className="phone-input-wrap">
                    <Phone size={18} className="phone-icon" />
                    <input
                      type="tel"
                      className="phone-field"
                      placeholder="+92 300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {errorMsg && <span className="auth-error-msg">{errorMsg}</span>}
                </div>

                <div className="demo-otp-notice">
                  <CheckCircle2 size={15} className="text-success" />
                  <span>
                    Demo OTP Mode Active: Instant code delivery (Code: <strong>1234</strong>). Real SMS gateway integrates via Firebase Auth.
                  </span>
                </div>

                <button type="submit" className="submit-auth-btn">
                  Send 4-Digit Verification Code →
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="otp-form">
                <p className="auth-intro-text">
                  We sent a 4-digit verification code to <strong>{phoneNumber}</strong>.
                </p>

                <div className="form-group">
                  <label className="form-label">Enter Verification Code (Demo: 1234)</label>
                  <div className="otp-input-wrap">
                    <KeyRound size={18} className="otp-icon" />
                    <input
                      type="text"
                      maxLength={4}
                      className="otp-field"
                      placeholder="• • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                  </div>
                  {errorMsg && <span className="auth-error-msg">{errorMsg}</span>}
                </div>

                <div className="auto-fill-bar">
                  <button
                    type="button"
                    className="auto-fill-btn"
                    onClick={handleAutoFillOtp}
                  >
                    <Sparkles size={14} /> Auto-Fill Demo OTP (1234)
                  </button>
                  <button
                    type="button"
                    className="change-number-btn"
                    onClick={() => setStep('phone')}
                  >
                    Change Number
                  </button>
                </div>

                <button type="submit" className="submit-auth-btn">
                  Verify & Sign In →
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
