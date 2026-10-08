import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { authService } from '../../services/api';
import { Sparkles, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setIsOnboardingModalOpen,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'welcome' | 'login' | 'register' | 'forgot'>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await authService.login({ email, password });
      setIsAuthModalOpen(false);
      showToast('Logged in successfully!', 'success');
    } catch {
      showToast('Login failed. Please check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await authService.register({ name, email, password });
      setIsAuthModalOpen(false);
      setIsOnboardingModalOpen(true);
      showToast('Account created! Tell us what you want to learn.', 'success');
    } catch {
      showToast('Registration failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      showToast('Reset instructions sent to your email.', 'info');
      setMode('login');
    } catch {
      showToast('Could not send reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="sm"
    >
      <div className="auth-modal-content">
        {/* Welcome / Splash Screen */}
        {mode === 'welcome' && (
          <div className="auth-splash-view">
            <div className="auth-splash-emblem">
              <Sparkles size={32} />
            </div>
            <h2 className="auth-title">Welcome to Lived</h2>
            <p className="auth-tagline">Real experiences. Real lessons.</p>
            <p className="auth-desc">
              Discover real-life experiences, learn actionable principles, and avoid costly mistakes.
            </p>

            <div className="auth-button-stack">
              <button
                type="button"
                className="btn-primary auth-main-btn"
                onClick={() => setMode('register')}
              >
                <span>Create an Account</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-secondary auth-sub-btn"
                onClick={() => setMode('login')}
              >
                <span>Sign In to Existing Account</span>
              </button>

              <button
                type="button"
                className="btn-ghost auth-demo-btn"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  showToast('Exploring as guest learner', 'info');
                }}
              >
                Continue exploring as Guest
              </button>
            </div>
          </div>
        )}

        {/* Login Screen */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form-view">
            <h2 className="auth-title">Sign In to Lived</h2>
            <p className="auth-subtext">Access your saved experiences and reading history.</p>

            <div className="form-group">
              <label className="input-field-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-text-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-field-label">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  className="form-text-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="forgot-password-row">
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setMode('forgot')}
              >
                Forgot your password?
              </button>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary auth-submit-btn">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="auth-switch-row">
              <span>Don't have an account?</span>
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => setMode('register')}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* Register Screen */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="auth-form-view">
            <h2 className="auth-title">Join Lived</h2>
            <p className="auth-subtext">Start learning from real human experiences.</p>

            <div className="form-group">
              <label className="input-field-label">Full Name</label>
              <div className="input-with-icon">
                <UserIcon size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-text-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-field-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-text-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-field-label">Create Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  className="form-text-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary auth-submit-btn">
              {isLoading ? 'Creating account...' : 'Create Account & Continue'}
            </button>

            <div className="auth-switch-row">
              <span>Already have an account?</span>
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Screen */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="auth-form-view">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtext">
              Enter your email address and we'll send a link to reset your password.
            </p>

            <div className="form-group">
              <label className="input-field-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-text-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary auth-submit-btn">
              {isLoading ? 'Sending link...' : 'Send Reset Link'}
            </button>

            <div className="auth-switch-row">
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => setMode('login')}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
