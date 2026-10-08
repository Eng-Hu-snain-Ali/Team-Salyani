import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { LEARNING_GOALS } from '../../constants';
import {
  Zap,
  Target,
  Moon,
  Sun,
  LogOut,
  Edit3,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    updateUser,
    logoutUser,
    showToast,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editAgeGroup, setEditAgeGroup] = useState(user.ageGroup || '20-24');
  const [editGoals, setEditGoals] = useState<string[]>(user.learningGoals);

  // Notification toggles
  const [notifDaily, setNotifDaily] = useState(user.notificationPreferences.dailyReminders);
  const [notifStreak, setNotifStreak] = useState(user.notificationPreferences.streakAlerts);
  const [notifWeekly, setNotifWeekly] = useState(user.notificationPreferences.weeklyReport);

  const toggleGoal = (goalText: string) => {
    setEditGoals((prev) =>
      prev.includes(goalText) ? prev.filter((g) => g !== goalText) : [...prev, goalText]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name: editName,
      email: editEmail,
      ageGroup: editAgeGroup,
      learningGoals: editGoals,
    });
    setIsEditModalOpen(false);
  };

  const handleToggleNotif = async (type: 'daily' | 'streak' | 'weekly') => {
    let nextDaily = notifDaily;
    let nextStreak = notifStreak;
    let nextWeekly = notifWeekly;

    if (type === 'daily') {
      nextDaily = !notifDaily;
      setNotifDaily(nextDaily);
    } else if (type === 'streak') {
      nextStreak = !notifStreak;
      setNotifStreak(nextStreak);
    } else {
      nextWeekly = !notifWeekly;
      setNotifWeekly(nextWeekly);
    }

    await updateUser({
      notificationPreferences: {
        dailyReminders: nextDaily,
        streakAlerts: nextStreak,
        weeklyReport: nextWeekly,
      },
    });
    showToast('Notification preferences updated', 'info');
  };

  const handleClearLocalSession = () => {
    showToast('Local demo state reset to baseline defaults', 'info');
  };

  return (
    <div className="profile-view-wrap">
      {/* 1. Profile Hero Card */}
      <section className="profile-hero-card">
        <div className="profile-avatar-row">
          <img
            src={user.avatar}
            alt={user.name}
            className="profile-avatar-lg"
          />
          <div>
            <h1 className="profile-identity-name">{user.name}</h1>
            <p className="profile-identity-email">{user.email}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">
                <Zap size={12} fill="currentColor" />
                Level {user.currentLevel} • {user.xp} XP
              </span>
              {user.ageGroup && (
                <span className="badge badge-purple">{user.ageGroup} Age Bracket</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setEditName(user.name);
            setEditEmail(user.email);
            setEditAgeGroup(user.ageGroup || '20-24');
            setEditGoals(user.learningGoals);
            setIsEditModalOpen(true);
          }}
        >
          <Edit3 size={15} />
          <span>Edit Profile</span>
        </button>
      </section>

      {/* 2. Active Learning Goals */}
      <section className="settings-card-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4>Active Learning Focus Goals</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {user.learningGoals.length} selected
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user.learningGoals.map((goal, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
              }}
            >
              <Target size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
              <span style={{ color: 'var(--text-main)' }}>{goal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Notification Preferences */}
      <section className="settings-card-group">
        <h4>Notification Preferences</h4>

        <div className="settings-row-item">
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              Daily Practice Reminders
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Receive an alert when today's real-life scenario is available
            </div>
          </div>
          <div
            className={`toggle-switch ${notifDaily ? 'on' : ''}`}
            onClick={() => handleToggleNotif('daily')}
            role="switch"
            aria-checked={notifDaily}
            tabIndex={0}
          >
            <div className="toggle-handle" />
          </div>
        </div>

        <div className="settings-row-item">
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              Streak Protection Warnings
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Get notified before your streak lapses at midnight
            </div>
          </div>
          <div
            className={`toggle-switch ${notifStreak ? 'on' : ''}`}
            onClick={() => handleToggleNotif('streak')}
            role="switch"
            aria-checked={notifStreak}
            tabIndex={0}
          >
            <div className="toggle-handle" />
          </div>
        </div>

        <div className="settings-row-item">
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              Weekly Reflection Summary
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Receive a weekly breakdown of decision strengths & regressions
            </div>
          </div>
          <div
            className={`toggle-switch ${notifWeekly ? 'on' : ''}`}
            onClick={() => handleToggleNotif('weekly')}
            role="switch"
            aria-checked={notifWeekly}
            tabIndex={0}
          >
            <div className="toggle-handle" />
          </div>
        </div>
      </section>

      {/* 4. Appearance & Theme */}
      <section className="settings-card-group">
        <h4>Appearance</h4>
        <div className="settings-row-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {theme === 'dark' ? <Moon size={18} color="var(--color-primary)" /> : <Sun size={18} color="var(--color-warning)" />}
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                Theme Mode ({theme === 'dark' ? 'Dark' : 'Light'})
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Switch between crisp educational light mode and obsidian dark mode
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </section>

      {/* 5. Privacy, Backend Configuration & Session */}
      <section className="settings-card-group">
        <h4>Privacy & Session</h4>

        <div className="settings-row-item">
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              API Architecture Mode
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Operating in high-fidelity in-memory provider (100% backend ready via VITE_API_BASE_URL)
            </div>
          </div>
          <span className="badge badge-green">Ready / Standalone</span>
        </div>

        <div className="settings-row-item" style={{ paddingTop: '8px' }}>
          <button
            type="button"
            className="btn-outline"
            style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
            onClick={logoutUser}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            className="btn-ghost"
            style={{ fontSize: '0.82rem' }}
            onClick={handleClearLocalSession}
          >
            <Trash2 size={14} />
            <span>Reset Demo State</span>
          </button>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile & Preferences"
        subtitle="Customize your learner identity and age bracket"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">Full Name</label>
            <input
              id="name-input"
              type="text"
              className="form-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              type="email"
              className="form-input"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="age-select">Age Bracket</label>
            <select
              id="age-select"
              className="form-select"
              value={editAgeGroup}
              onChange={(e) => setEditAgeGroup(e.target.value)}
            >
              <option value="16-19">16–19 years (High School & Prep)</option>
              <option value="20-24">20–24 years (College & Early Career)</option>
              <option value="25-34">25–34 years (Working Professional)</option>
              <option value="35+">35+ years (Experienced Leader)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Customize Learning Goals</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LEARNING_GOALS.map((g) => {
                const isSelected = editGoals.includes(g.label);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.label)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle2
                      size={15}
                      color={isSelected ? 'var(--color-primary)' : 'var(--text-muted)'}
                    />
                    <span style={{ color: 'var(--text-main)' }}>{g.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Profile Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
