import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { AGE_GROUPS } from '../../constants';
import {
  Mail,
  Lock,
  User as UserIcon,
  Compass,
  ArrowRight,
  Sparkles,
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

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageGroup, setAgeGroup] = useState('20-24');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    const success = await loginUser({ email, password });
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Invalid login credentials. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    await loginUser({ email: 'ali.rehman@ustadonline.edu', password: 'password123' });
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    const success = await registerUser({ name, email, password, ageGroup });
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Registration failed. Please check your information.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Please provide your registered email address.');
      return;
    }
    setIsSubmitting(true);
    await forgotPassword(email);
    setIsSubmitting(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    await resetPassword({ email, newPassword });
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={
        authModalMode === 'welcome'
          ? 'Welcome to USTAD ONLINE'
          : authModalMode === 'login'
          ? 'Sign in to Your Account'
          : authModalMode === 'register'
          ? 'Create Learner Account'
          : authModalMode === 'forgot'
          ? 'Reset Password'
          : 'Set New Password'
      }
      subtitle="Learn. Decide. Improve."
      maxWidth="md"
    >
      <div>
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem',
              marginBottom: '14px',
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* 1. Welcome Mode */}
        {authModalMode === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Compass size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Practice Life-Altering Choices
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Interactive scenarios across Money, Time, Communication, Problem Solving and Decisions.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => openAuthModal('register')}
              >
                <span>Create New Account</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => openAuthModal('login')}
              >
                Sign In With Existing Account
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={handleDemoLogin}
                style={{ color: 'var(--color-primary)' }}
              >
                <Sparkles size={14} />
                <span>Instant Demo Access (Ali Rehman)</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Login Mode */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={() => openAuthModal('forgot')}
                  style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleDemoLogin}
            >
              <Sparkles size={14} />
              <span>Sign In with Demo Account</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                style={{ color: 'var(--color-primary)', fontWeight: 700 }}
              >
                Register here
              </button>
            </div>
          </form>
        )}

        {/* 3. Register Mode */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Your Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatima Tariq"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fatima@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-age">Age Bracket</label>
              <select
                id="reg-age"
                className="form-select"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
              >
                {AGE_GROUPS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label} ({a.sub})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account & Start Onboarding'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                style={{ color: 'var(--color-primary)', fontWeight: 700 }}
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* 4. Forgot Password Mode */}
        {authModalMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enter your email address and we'll send you simulated instructions to reset your password.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => openAuthModal('login')}
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* 5. Reset Password Mode */}
        {authModalMode === 'reset' && (
          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-pass">New Password</label>
              <input
                id="new-pass"
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
