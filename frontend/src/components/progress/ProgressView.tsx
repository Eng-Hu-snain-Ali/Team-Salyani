import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Zap, 
  CheckCircle2, 
  Trophy,
  History,
  Lock
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { user, achievements, attempts, startScenario } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Milestones & Activity Journal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>
          Track your decision streaks, unlocked achievements, and complete scenario history.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {/* Streak Stats */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Flame size={26} color="#F59E0B" fill="#F59E0B" className="flame-animated" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FBBF24' }}>
              {user.streak} Days
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Current Streak (Best: {user.longestStreak}d)
            </div>
          </div>
        </div>

        {/* Total XP Earned */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--brand-glow)',
          }}>
            <Zap size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
              {user.xp} XP
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Total Experience Points
            </div>
          </div>
        </div>

        {/* Completed Scenarios Count */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle2 size={26} color="#34D399" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34D399' }}>
              {attempts.length} Decisions
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Scenarios Evaluated
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Gallery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Trophies & Badges</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Unlock practical recognition for consistent good judgement
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {achievements.filter(a => a.isUnlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '20px',
                opacity: ach.isUnlocked ? 1 : 0.65,
                border: ach.isUnlocked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--glass-border)',
                background: ach.isUnlocked 
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(23, 30, 46, 0.7) 100%)' 
                  : 'var(--bg-card)',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: ach.isUnlocked ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' : 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: ach.isUnlocked ? '0 0 14px rgba(245, 158, 11, 0.4)' : 'none',
              }}>
                {ach.isUnlocked ? (
                  <Trophy size={22} color="#FFFFFF" />
                ) : (
                  <Lock size={18} color="var(--text-muted)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: ach.isUnlocked ? '#FFFFFF' : 'var(--text-secondary)' }}>
                    {ach.title}
                  </h4>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FBBF24' }}>
                    +{ach.xpReward} XP
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  {ach.description}
                </p>

                {/* Progress bar */}
                <div style={{ marginTop: 10 }}>
                  <div style={{
                    width: '100%',
                    height: 5,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${(ach.progress / ach.maxProgress) * 100}%`,
                      height: '100%',
                      background: ach.isUnlocked ? '#F59E0B' : '#818CF8',
                      borderRadius: 3,
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {ach.progress} / {ach.maxProgress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Journal / History Log */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={20} color="#818CF8" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Decision Journal</h2>
        </div>

        {attempts.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't completed any dilemmas yet.</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
              Head over to Home or Challenges to tackle your first scenario!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {attempts.map((att) => (
              <div 
                key={att.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(att.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} • {att.moduleKey.replace('_', ' ')}
                    </span>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>
                      {att.scenarioTitle}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#A5B4FC',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}>
                      +{att.xpEarned} XP
                    </span>

                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: att.score >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: att.score >= 75 ? '#34D399' : '#FBBF24',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}>
                      Score: {att.score}%
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)',
                }}>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: 2 }}>Consequence Outcome:</strong>
                  {att.consequenceSummary}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => startScenario(att.scenarioId)}
                    style={{
                      fontSize: '0.8rem',
                      color: '#818CF8',
                      fontWeight: 600,
                    }}
                  >
                    Replay Dilemma →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
