import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  Flame,
  Zap,
  CheckCircle2,
  Award,
  TrendingUp,
  Clock,
  Lock,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Cpu,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { user, skills, challenges, achievements, openChallengePlayer } = useApp();

  const completedChallenges = challenges.filter((c) => c.completed);
  const avgSkillScore = Math.round(
    skills.reduce((acc, s) => acc + s.score, 0) / skills.length
  );

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame size={20} fill="currentColor" />;
      case 'Zap':
        return <Zap size={20} fill="currentColor" />;
      case 'Clock':
        return <Clock size={20} />;
      case 'ShieldCheck':
        return <ShieldCheck size={20} />;
      case 'MessageSquare':
        return <MessageSquare size={20} />;
      case 'Cpu':
        return <Cpu size={20} />;
      default:
        return <Award size={20} />;
    }
  };

  return (
    <div className="progress-view-wrap">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          Learning Progress & Milestones
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Track your decision milestones, streak discipline, and practical growth trajectory.
        </p>
      </div>

      {/* 1. Stat Cards Row */}
      <div className="stats-grid-row">
        <StatCard
          label="Scenarios Solved"
          value={`${completedChallenges.length} / ${challenges.length}`}
          icon={<CheckCircle2 size={18} />}
          color="var(--color-success)"
          subtitle={`${Math.round((completedChallenges.length / challenges.length) * 100)}% completed`}
        />
        <StatCard
          label="Total Experience (XP)"
          value={`${user.xp} XP`}
          icon={<Zap size={18} />}
          color="var(--color-primary)"
          subtitle={`Level ${user.currentLevel} • Next at ${user.nextLevelXp} XP`}
        />
        <StatCard
          label="Consistency Streak"
          value={`${user.streakDays} Days`}
          icon={<Flame size={18} />}
          color="var(--color-warning)"
          subtitle={`Longest: ${user.longestStreak} days record`}
        />
        <StatCard
          label="Average Mastery"
          value={`${avgSkillScore}%`}
          icon={<TrendingUp size={18} />}
          color="var(--color-purple)"
          subtitle="Across 5 core skills"
        />
      </div>

      {/* 2. Skill Growth Comparative Bar Breakdown */}
      <section className="ustad-card">
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Skill Mastery Distribution
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Real-time score comparison across the 5 practical life-learning pillars
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {skills.map((skill) => (
            <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-main)' }}>{skill.name}</span>
                <span style={{ color: skill.color }}>
                  {skill.score}% • {skill.levelTitle}
                </span>
              </div>
              <ProgressBar progress={skill.score} color={skill.color} height={8} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Achievements Showcase */}
      <section>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Unlocked Badges & Achievements
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Earn badges by proving decision consistency and navigating high-stakes dilemmas
          </p>
        </div>

        <div className="achievements-grid">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`achievement-card ${!ach.unlocked ? 'locked' : ''}`}
            >
              <div className="achievement-icon-circle">
                {ach.unlocked ? (
                  getAchievementIcon(ach.icon)
                ) : (
                  <Lock size={18} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {ach.title}
                  </h3>
                  {ach.unlocked && (
                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                      Unlocked
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
                  {ach.description}
                </p>

                <div style={{ marginTop: '8px' }}>
                  <ProgressBar
                    progress={(ach.progress / ach.maxProgress) * 100}
                    height={5}
                    color={ach.unlocked ? 'var(--color-warning)' : 'var(--border-strong)'}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span>{ach.progress} / {ach.maxProgress}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Decision History Journal */}
      <section className="ustad-card">
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Decision Journal
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Your history of decisions, consequences faced, and insights logged
          </p>
        </div>

        {completedChallenges.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completedChallenges.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
                onClick={() => openChallengePlayer(c)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--color-success)" />
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {c.title}
                    </h4>
                  </div>
                  {c.userWrittenResponse && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: '24px', marginTop: '2px' }}>
                      "{c.userWrittenResponse}"
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-blue">+{c.xpReward} XP</span>
                  <ChevronRight size={15} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            No scenarios solved yet. Solve today's daily scenario to start your decision journal!
          </p>
        )}
      </section>
    </div>
  );
};
