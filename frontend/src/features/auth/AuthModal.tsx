import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Users,
  MapPin,
  Sparkles,
  Smartphone,
  Wrench,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  Award,
  Lock,
  Compass,
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
    isAdminAuthenticated,
    setIsAdminAuthModalOpen,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile' | 'account'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+92 300 8645123');
  const [otpCode, setOtpCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
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
        className="modal-surface auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="auth-dialog-header">
          <div className="auth-dialog-header-text">
            <span className="auth-header-tag">
              <ShieldCheck size={12} className="text-primary" />
              USTAD ONLINE • SECURE ACCOUNT
            </span>
            <h2 className="auth-header-title">
              {isAuthenticated ? 'My Profile & Active Persona' : 'Phone Number Verification'}
            </h2>
          </div>
          <button
            type="button"
            className="auth-close-btn"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {isAuthenticated ? (
          /* ================================================================
             AUTHENTICATED ACCOUNT & PERSONA PROFILE VIEW
             ================================================================ */
          <div className="auth-account-body">
            {/* Top Identity Card */}
            <div className="auth-profile-hero-card">
              <div className="auth-avatar-emblem-wrap">
                <div className="auth-avatar-emblem">
                  <Users size={28} className="text-white" />
                </div>
                <div className="auth-verified-badge" title="SMIT Accredited Team">
                  <Award size={12} className="text-white" />
                </div>
              </div>

              <div className="auth-profile-meta">
                <div className="auth-name-row">
                  <h3 className="auth-user-name">{user.name}</h3>
                  <span className="auth-verified-pill">
                    <CheckCircle2 size={11} /> SMIT Verified
                  </span>
                </div>
                <div className="auth-phone-row">
                  <Phone size={13} className="text-primary" />
                  <span className="auth-phone-number font-mono">{user.phone}</span>
                  <span className="auth-otp-badge">OTP Verified</span>
                </div>
                <div className="auth-role-indicator">
                  <span className="auth-role-label">Current Persona:</span>
                  <span className={`auth-current-role-badge role-${activeRole}`}>
                    {activeRole === 'customer'
                      ? '📱 Customer Mobile App'
                      : activeRole === 'ustad'
                      ? '🔧 Ustad Field Workstation'
                      : '🛡️ Admin Management Panel'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address & Service Sector Info */}
            <div className="auth-info-grid">
              <div className="auth-info-card">
                <div className="auth-info-icon blue">
                  <MapPin size={16} />
                </div>
                <div className="auth-info-text">
                  <span className="auth-info-lbl">Saved Primary Address</span>
                  <strong>{user.address}</strong>
                </div>
              </div>

              <div className="auth-info-card">
                <div className="auth-info-icon emerald">
                  <Compass size={16} />
                </div>
                <div className="auth-info-text">
                  <span className="auth-info-lbl">Active Service Sector</span>
                  <strong>{user.area}</strong>
                </div>
              </div>
            </div>

            {/* Interactive Persona Mode Switcher */}
            <div className="auth-persona-switcher-section">
              <div className="auth-section-title-row">
                <span className="auth-switcher-lbl">Switch Platform Experience</span>
                <span className="auth-switcher-hint">1-tap instant preview</span>
              </div>

              <div className="auth-persona-options-grid">
                {/* 1. Customer Mode */}
                <div
                  className={`auth-persona-card ${activeRole === 'customer' ? 'active-persona' : ''}`}
                  onClick={() => {
                    setActiveRole('customer');
                    showToast('Switched to Customer Mobile App', 'info');
                    setIsAuthModalOpen(false);
                  }}
                >
                  <div className="auth-persona-top">
                    <div className="auth-persona-icon-box blue">
                      <Smartphone size={18} />
                    </div>
                    {activeRole === 'customer' && (
                      <span className="auth-active-chip">Active</span>
                    )}
                  </div>
                  <strong className="auth-persona-name">Customer App</strong>
                  <p className="auth-persona-desc">
                    Book 6 trades, live radar tracking, voice note simulator.
                  </p>
                </div>

                {/* 2. Ustad Mode */}
                <div
                  className={`auth-persona-card ${activeRole === 'ustad' ? 'active-persona' : ''}`}
                  onClick={() => {
                    setActiveRole('ustad');
                    showToast('Switched to Ustad Field Portal', 'info');
                    setIsAuthModalOpen(false);
                  }}
                >
                  <div className="auth-persona-top">
                    <div className="auth-persona-icon-box amber">
                      <Wrench size={18} />
                    </div>
                    {activeRole === 'ustad' && (
                      <span className="auth-active-chip">Active</span>
                    )}
                  </div>
                  <strong className="auth-persona-name">Ustad Portal</strong>
                  <p className="auth-persona-desc">
                    Job radar, active stage stepper, 10% commission wallet.
                  </p>
                </div>

                {/* 3. Admin Mode */}
                <div
                  className={`auth-persona-card ${activeRole === 'admin' ? 'active-persona' : ''}`}
                  onClick={() => {
                    if (isAdminAuthenticated) {
                      setActiveRole('admin');
                      showToast('Switched to Admin Web Panel', 'info');
                      setIsAuthModalOpen(false);
                    } else {
                      setIsAuthModalOpen(false);
                      setIsAdminAuthModalOpen(true);
                    }
                  }}
                >
                  <div className="auth-persona-top">
                    <div className="auth-persona-icon-box red">
                      <LayoutDashboard size={18} />
                    </div>
                    {activeRole === 'admin' ? (
                      <span className="auth-active-chip">Active</span>
                    ) : (
                      <span className="auth-locked-chip">
                        <Lock size={10} /> Gate
                      </span>
                    )}
                  </div>
                  <strong className="auth-persona-name">Admin Panel</strong>
                  <p className="auth-persona-desc">
                    NADRA dossier audit, rate cards CRUD, complaints desk.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="auth-dialog-footer">
              <button
                type="button"
                className="auth-btn-logout"
                onClick={async () => {
                  await logoutUser();
                  setStep('phone');
                }}
              >
                <LogOut size={15} /> Sign Out Session
              </button>

              <button
                type="button"
                className="auth-btn-continue"
                onClick={() => setIsAuthModalOpen(false)}
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================
             LOGIN / OTP AUTHENTICATION FLOW
             ================================================================ */
          <div className="auth-flow-body">
            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="auth-phone-form">
                <p className="auth-form-intro">
                  Enter your mobile phone number. You will receive a 4-digit verification code.
                </p>

                {/* Persona choice */}
                <div className="auth-form-group">
                  <label className="auth-form-label">Sign In As:</label>
                  <div className="auth-role-select-row">
                    <button
                      type="button"
                      className={`auth-role-btn ${selectedRole === 'customer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('customer')}
                    >
                      <Smartphone size={15} />
                      <span>Customer</span>
                    </button>
                    <button
                      type="button"
                      className={`auth-role-btn ${selectedRole === 'ustad' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('ustad')}
                    >
                      <Wrench size={15} />
                      <span>Ustad</span>
                    </button>
                    <button
                      type="button"
                      className={`auth-role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('admin')}
                    >
                      <LayoutDashboard size={15} />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Pakistani Mobile Number *</label>
                  <div className="auth-input-wrapper">
                    <Phone size={18} className="auth-input-icon text-primary" />
                    <input
                      type="tel"
                      className="auth-input-field font-mono"
                      placeholder="+92 300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {errorMsg && <span className="auth-form-error">{errorMsg}</span>}
                </div>

                <div className="auth-demo-notice-box">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>
                    Demo OTP Mode Active: Instant verification code is <strong>1234</strong>.
                  </span>
                </div>

                <button type="submit" className="auth-submit-btn">
                  <span>Send 4-Digit Verification Code</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="auth-otp-form">
                <p className="auth-form-intro">
                  We sent a 4-digit verification code to <strong>{phoneNumber}</strong>.
                </p>

                <div className="auth-form-group">
                  <label className="auth-form-label">Enter 4-Digit Code (Demo: 1234)</label>
                  <div className="auth-input-wrapper">
                    <KeyRound size={18} className="auth-input-icon text-primary" />
                    <input
                      type="text"
                      maxLength={4}
                      className="auth-input-field font-mono otp-center"
                      placeholder="• • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                  </div>
                  {errorMsg && <span className="auth-form-error">{errorMsg}</span>}
                </div>

                <div className="auth-otp-actions-bar">
                  <button
                    type="button"
                    className="auth-autofill-btn"
                    onClick={handleAutoFillOtp}
                  >
                    <Sparkles size={14} /> Auto-Fill Demo OTP (1234)
                  </button>
                  <button
                    type="button"
                    className="auth-change-phone-btn"
                    onClick={() => setStep('phone')}
                  >
                    Change Phone
                  </button>
                </div>

                <button type="submit" className="auth-submit-btn">
                  <span>Verify Code & Sign In</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
