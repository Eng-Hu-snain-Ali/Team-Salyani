import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { CATEGORIES } from '../../constants';
import type { ExperienceCategory } from '../../types';
import {
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  KeyRound,
  ChevronLeft,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    openAuthModal,
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword,
  } = useApp();

  // Registration form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<ExperienceCategory[]>([]);

  // Reset password form
  const [resetToken] = useState('demo-token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const toggleInterest = (cat: ExperienceCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    const success = await loginUser({ email, password });
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Invalid login credentials. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const success = await registerUser({
      name,
      email,
      username: username || email.split('@')[0],
      password,
      confirmPassword,
      interests: selectedInterests,
    });
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Registration failed. Please check details.');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Please enter your account email.');
      return;
    }
    setIsLoading(true);
    const success = await forgotPassword(email);
    setIsLoading(false);
    if (success) {
      openAuthModal('reset');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newPassword) {
      setErrorMsg('Please provide a new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    await resetPassword({
      email,
      token: resetToken,
      newPassword,
      confirmPassword: confirmNewPassword,
    });
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="sm"
    >
      <div className="auth-modal-content">
        {/* ================================================================== */}
        {/* 1. WELCOME SCREEN                                                 */}
        {/* ================================================================== */}
        {authModalMode === 'welcome' && (
          <div className="auth-splash-view">
            <div className="auth-splash-emblem">
              <span>L</span>
            </div>
            <h2 className="auth-title">Welcome to Lived</h2>
            <p className="auth-tagline">Real experiences. Real lessons.</p>
            <p className="auth-desc">
              A collaborative platform where people share what they have experienced,
              and others learn from it.
            </p>

            <div className="auth-button-stack">
              <button
                type="button"
                className="btn-primary auth-main-btn"
                onClick={() => openAuthModal('register')}
              >
                <span>Create an Account</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-secondary auth-sub-btn"
                onClick={() => openAuthModal('login')}
              >
                <span>Sign In to Existing Account</span>
              </button>

              <button
                type="button"
                className="btn-text auth-browse-btn"
                onClick={() => setIsAuthModalOpen(false)}
              >
                Continue browsing as guest
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 2. LOGIN SCREEN                                                    */}
        {/* ================================================================== */}
        {authModalMode === 'login' && (
          <div className="auth-form-view">
            <div className="auth-header-row">
              <button
                type="button"
                className="btn-text-back"
                onClick={() => openAuthModal('welcome')}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
              <h2 className="auth-form-title">Welcome Back</h2>
            </div>
            <p className="auth-form-subtitle">
              Sign in to publish experiences and access your saved vault.
            </p>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <form onSubmit={handleLogin} className="auth-inputs-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => openAuthModal('forgot')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer-switch">
              <span>Don't have an account yet?</span>
              <button
                type="button"
                className="btn-link-switch"
                onClick={() => openAuthModal('register')}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 3. REGISTER SCREEN                                                 */}
        {/* ================================================================== */}
        {authModalMode === 'register' && (
          <div className="auth-form-view">
            <div className="auth-header-row">
              <button
                type="button"
                className="btn-text-back"
                onClick={() => openAuthModal('welcome')}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
              <h2 className="auth-form-title">Join Lived</h2>
            </div>
            <p className="auth-form-subtitle">
              Create an account to share your journey and save high-yield lessons.
            </p>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <form onSubmit={handleRegister} className="auth-inputs-form">
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <div className="input-with-icon">
                  <UserIcon size={16} className="field-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-pass">Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="reg-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-pass">Confirm Password</label>
                <div className="input-with-icon">
                  <KeyRound size={16} className="field-icon" />
                  <input
                    id="reg-confirm-pass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              {/* Optional Fields Toggle */}
              <div className="optional-fields-accordion">
                <button
                  type="button"
                  className="optional-fields-toggle-btn"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                >
                  <span>{showOptionalFields ? '− Hide optional details' : '+ Add optional details (Username, Interests)'}</span>
                </button>

                {showOptionalFields && (
                  <div className="optional-fields-body">
                    <div className="form-group">
                      <label htmlFor="reg-username">Username (Optional)</label>
                      <input
                        id="reg-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="alex_builds"
                        className="text-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Topics you care about</label>
                      <div className="interests-checkbox-grid">
                        {CATEGORIES.slice(0, 8).map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            className={`interest-select-pill ${
                              selectedInterests.includes(cat.id) ? 'selected' : ''
                            }`}
                            onClick={() => toggleInterest(cat.id)}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="auth-footer-switch">
              <span>Already have an account?</span>
              <button
                type="button"
                className="btn-link-switch"
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 4. FORGOT PASSWORD SCREEN                                          */}
        {/* ================================================================== */}
        {authModalMode === 'forgot' && (
          <div className="auth-form-view">
            <div className="auth-header-row">
              <button
                type="button"
                className="btn-text-back"
                onClick={() => openAuthModal('login')}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
              <h2 className="auth-form-title">Reset Password</h2>
            </div>
            <p className="auth-form-subtitle">
              Enter the email associated with your account and we'll send reset instructions.
            </p>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <form onSubmit={handleForgot} className="auth-inputs-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Account Email</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="auth-footer-switch">
              <span>Remembered password?</span>
              <button
                type="button"
                className="btn-link-switch"
                onClick={() => openAuthModal('login')}
              >
                Return to Login
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 5. RESET PASSWORD SCREEN                                           */}
        {/* ================================================================== */}
        {authModalMode === 'reset' && (
          <div className="auth-form-view">
            <div className="auth-header-row">
              <button
                type="button"
                className="btn-text-back"
                onClick={() => openAuthModal('login')}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
              <h2 className="auth-form-title">Set New Password</h2>
            </div>
            <p className="auth-form-subtitle">
              Choose a secure new password for your account.
            </p>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <form onSubmit={handleReset} className="auth-inputs-form">
              <div className="form-group">
                <label htmlFor="reset-new-pass">New Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="reset-new-pass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reset-confirm-pass">Confirm New Password</label>
                <div className="input-with-icon">
                  <KeyRound size={16} className="field-icon" />
                  <input
                    id="reset-confirm-pass"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="text-input with-icon"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Update Password & Log In'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};
