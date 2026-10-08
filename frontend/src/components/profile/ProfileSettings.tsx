import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User as UserIcon, 
  Server, 
  RotateCcw, 
  Check, 
  RefreshCw, 
  Users
} from 'lucide-react';
import type { AgeGroup } from '../../types';
import { SEED_GOALS } from '../../data/seedData';

export const ProfileSettings: React.FC = () => {
  const { 
    user, 
    updateUser, 
    resetProgress, 
    switchProfile, 
    backendStatus, 
    refreshBackendStatus 
  } = useApp();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(user.ageGroup);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(user.goals);
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('lifeos_api_url') || 'http://localhost:8000');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const handleSave = () => {
    updateUser({
      name,
      bio,
      ageGroup,
      goals: selectedGoals,
    });
    localStorage.setItem('lifeos_api_url', apiUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePing = async () => {
    setIsPinging(true);
    localStorage.setItem('lifeos_api_url', apiUrl);
    await refreshBackendStatus();
    setIsPinging(false);
  };

  const toggleGoal = (goalKey: string) => {
    if (selectedGoals.includes(goalKey)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goalKey));
    } else {
      setSelectedGoals([...selectedGoals, goalKey]);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Profile & System Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>
          Manage your personal learning parameters, profile persona, and backend API connections.
        </p>
      </div>

      {/* Preset Personas Switcher (Great for Testing & Presentations) */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Users size={18} color="#818CF8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick Persona Switcher</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          Switch between personas to test how scenario difficulty and recommendations personalize for different demographics:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          <button
            onClick={() => switchProfile('teen')}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: user.ageGroup === 'teen' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: user.ageGroup === 'teen' ? '1px solid #818CF8' : '1px solid var(--glass-border)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <strong style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>High Schooler (13-17)</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Focus on peer pressure & homework triage</span>
          </button>

          <button
            onClick={() => switchProfile('college')}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: user.ageGroup === 'young_adult' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: user.ageGroup === 'young_adult' ? '1px solid #818CF8' : '1px solid var(--glass-border)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <strong style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>College Student (18-24)</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Budgeting, teamwork & exams</span>
          </button>

          <button
            onClick={() => switchProfile('professional')}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: user.ageGroup === 'adult' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: user.ageGroup === 'adult' ? '1px solid #818CF8' : '1px solid var(--glass-border)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <strong style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>Young Professional (25+)</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Career decisions, boundaries & investments</span>
          </button>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserIcon size={18} color="#818CF8" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Personal Details</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--glass-border)',
                color: '#FFFFFF',
                fontSize: '0.92rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Age Demographic
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#171E2E',
                border: '1px solid var(--glass-border)',
                color: '#FFFFFF',
                fontSize: '0.92rem',
              }}
            >
              <option value="teen">Teens (13 - 17)</option>
              <option value="young_adult">Young Adults (18 - 24)</option>
              <option value="adult">Adults (25+)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Personal Bio & Intent
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--glass-border)',
              color: '#FFFFFF',
              fontSize: '0.92rem',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Selected Goals */}
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
            Core Growth Goals
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SEED_GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.key);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.key)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#A5B4FC' : 'var(--text-muted)',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--glass-border)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {goal.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ padding: '10px 24px' }}
          >
            {savedSuccess ? (
              <>
                <Check size={16} />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <span>Save Profile Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* Backend API & Integration Architecture */}
      <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Server size={18} color="#10B981" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Backend & API Service</h3>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: backendStatus.connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            color: backendStatus.connected ? '#34D399' : '#A5B4FC',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: backendStatus.connected ? '#10B981' : '#818CF8',
              display: 'inline-block',
            }} />
            <span>{backendStatus.connected ? 'Connected to FastAPI' : 'Offline / Standalone Simulator'}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          As specified in the PRD, the frontend communicates with FastAPI endpoints (<code style={{ color: '#818CF8' }}>/auth</code>, <code style={{ color: '#818CF8' }}>/scenarios</code>, <code style={{ color: '#818CF8' }}>/attempts</code>). When teammates launch the backend at <code style={{ color: '#818CF8' }}>localhost:8000</code>, LifeOS automatically routes calls to the server. If offline, the built-in AI heuristics engine smoothly handles everything locally!
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8000"
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--glass-border)',
              color: '#FFFFFF',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-mono)',
            }}
          />

          <button
            onClick={handlePing}
            disabled={isPinging}
            className="btn-secondary"
            style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} className={isPinging ? 'flame-animated' : ''} />
            <span>{isPinging ? 'Testing...' : 'Test Ping'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="glass-card" style={{
        padding: '24px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        background: 'rgba(239, 68, 68, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#EF4444' }}>
            Reset Learning Data
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Clears your local attempts, resets streaks, and restarts onboarding diagnostic.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all progress and restart onboarding?')) {
              resetProgress();
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#F87171',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <RotateCcw size={14} />
          <span>Reset All Progress</span>
        </button>
      </div>
    </div>
  );
};
