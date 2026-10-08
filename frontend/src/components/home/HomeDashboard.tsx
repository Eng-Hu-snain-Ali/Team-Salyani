import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Compass,
  Wallet,
  MessageSquare,
  Wrench,
  Target
} from 'lucide-react';
import type { ModuleKey } from '../../types';

export const HomeDashboard: React.FC = () => {
  const { 
    user, 
    scenarios, 
    modules, 
    skills, 
    attempts, 
    startScenario, 
    setActiveTab 
  } = useApp();

  // Find daily challenge or default to first
  const dailyChallenge = scenarios.find((s) => s.isDailyChallenge) || scenarios[0];

  // Get module icon helper
  const getModuleIcon = (key: ModuleKey) => {
    switch (key) {
      case 'decision_making': return <Compass size={20} color="#818CF8" />;
      case 'money_management': return <Wallet size={20} color="#34D399" />;
      case 'time_management': return <Clock size={20} color="#FBBF24" />;
      case 'communication': return <MessageSquare size={20} color="#38BDF8" />;
      case 'problem_solving': return <Wrench size={20} color="#F472B6" />;
    }
  };

  // 7-day streak mock snapshot
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = 3; // Thursday

  // XP level calculation
  const currentLevelFloor = (user.level - 1) * 200;
  const nextLevelCeil = user.level * 200;
  const xpInCurrentLevel = user.xp - currentLevelFloor;
  const levelProgressPct = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / 200) * 100)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">
      {/* Greeting Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              LifeOS Daily Loop
            </span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Age Group: {user.ageGroup === 'teen' ? '13-17' : user.ageGroup === 'young_adult' ? '18-24' : '25+'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: 4, letterSpacing: '-0.03em' }}>
            Welcome back, {user.name} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>
            Practice today's scenario to build real decision muscle and extend your streak.
          </p>
        </div>

        {/* Quick Streak Snapshot Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 18px',
          background: 'rgba(23, 30, 46, 0.6)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Flame size={24} color="#F59E0B" fill="#F59E0B" className="flame-animated" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>
              {user.streak} Day Streak
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Best: {user.longestStreak} days • Active today
            </div>
          </div>
        </div>
      </div>

      {/* Featured Daily Challenge Card */}
      <div 
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(30, 39, 66, 0.85) 0%, rgba(18, 24, 38, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), 0 0 24px rgba(99, 102, 241, 0.15)',
          padding: '30px',
        }}
      >
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tag row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <span className="badge-pill badge-daily">
              <Sparkles size={12} /> Today's Challenge
            </span>
            <span className={`badge-pill badge-module-${dailyChallenge.moduleKey.split('_')[0]}`}>
              {dailyChallenge.moduleKey.replace('_', ' ')}
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
            }}>
              <Clock size={12} /> {dailyChallenge.estimatedMinutes} mins
            </span>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#34D399',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
            }}>
              +65 XP
            </span>
          </div>

          {/* Title & Context */}
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {dailyChallenge.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginTop: 8, lineHeight: 1.6 }}>
              {dailyChallenge.summary}
            </p>
          </div>

          {/* AI Recommendation Reason */}
          {dailyChallenge.recommendationReason && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: '0.84rem',
              color: '#C7D2FE',
            }}>
              <Target size={16} color="#818CF8" style={{ flexShrink: 0 }} />
              <span>{dailyChallenge.recommendationReason}</span>
            </div>
          )}

          {/* Action Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginTop: 8,
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>Safe practice environment • AI evaluation enabled</span>
            </div>

            <button
              onClick={() => startScenario(dailyChallenge.id)}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              <span>Start Challenge</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Weekly Snapshot & XP Level Progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20,
      }}>
        {/* Weekly Habit Matrix */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={18} color="#F59E0B" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Weekly Snapshot</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Current Streak: {user.streak} days
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
            {daysOfWeek.map((day, idx) => {
              const isPastActive = idx < todayIndex;
              const isToday = idx === todayIndex;
              return (
                <div 
                  key={day}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 4px',
                    borderRadius: 'var(--radius-md)',
                    background: isToday 
                      ? 'rgba(245, 158, 11, 0.15)' 
                      : isPastActive 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isToday 
                      ? '1px solid rgba(245, 158, 11, 0.4)' 
                      : isPastActive 
                      ? '1px solid rgba(16, 185, 129, 0.2)' 
                      : '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: isToday ? '#FBBF24' : 'var(--text-muted)', fontWeight: 600 }}>
                    {day}
                  </span>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isToday ? '#F59E0B' : isPastActive ? '#10B981' : 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                  }}>
                    {isToday ? (
                      <Flame size={16} fill="#FFFFFF" />
                    ) : isPastActive ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 16 }}>
            💡 You need <strong>1 more daily challenge</strong> to hit the 5-day milestone and claim +100 bonus XP!
          </p>
        </div>

        {/* Level & XP Progression */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="#818CF8" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>XP & Growth Tier</h3>
            </div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#818CF8',
              padding: '2px 8px',
              borderRadius: 6,
              background: 'rgba(99, 102, 241, 0.15)',
            }}>
              Tier {user.level}: Practical Strategist
            </span>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Level {user.level} Progress</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{user.xp} / {nextLevelCeil} XP</span>
            </div>

            {/* Progress track */}
            <div style={{
              width: '100%',
              height: 10,
              borderRadius: 5,
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                width: `${levelProgressPct}%`,
                height: '100%',
                background: 'var(--brand-gradient)',
                borderRadius: 5,
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.8)',
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 18,
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            fontSize: '0.82rem',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Next Rank Reward:</span>
            <span style={{ color: '#FBBF24', fontWeight: 600 }}>Unlocks "Executive Triage" badge</span>
          </div>
        </div>
      </div>

      {/* 5 Core LifeOS Modules */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Explore Core Life Modules</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Master the five foundational domains of everyday adulthood
            </p>
          </div>
          <button
            onClick={() => setActiveTab('challenges')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.85rem',
              color: '#818CF8',
              fontWeight: 600,
            }}
          >
            <span>All Scenarios</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {modules.map((mod) => {
            const count = scenarios.filter((s) => s.moduleKey === mod.key).length;
            const relatedSkill = skills.find((s) => s.moduleKey === mod.key);
            const score = relatedSkill ? relatedSkill.currentScore : 60;

            return (
              <div
                key={mod.id}
                onClick={() => setActiveTab('challenges')}
                className="glass-card"
                style={{
                  padding: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: mod.bgGradient,
                    border: `1px solid ${mod.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {getModuleIcon(mod.key)}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: mod.color }}>
                    {score}%
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {mod.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                    {mod.tagline}
                  </p>
                </div>

                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 8,
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}>
                  <span>{count} Scenarios</span>
                  <span style={{ color: mod.color, fontWeight: 600 }}>Practice →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Decisions History Ticker */}
      {attempts.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Decision Journal</h3>
            <button
              onClick={() => setActiveTab('progress')}
              style={{ fontSize: '0.8rem', color: '#818CF8', fontWeight: 600 }}
            >
              View Full History
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {attempts.slice(0, 3).map((att) => (
              <div 
                key={att.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {att.moduleKey.replace('_', ' ')}
                    </span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 600 }}>
                      +{att.xpEarned} XP
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>
                    {att.scenarioTitle}
                  </div>
                </div>

                <div style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: att.score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: att.score >= 80 ? '#34D399' : '#FBBF24',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}>
                  {att.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
