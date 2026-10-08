import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChallengeCard } from '../challenges/ChallengeCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  Flame,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass,
  Wallet,
  Clock,
  MessageSquare,
  Cpu,
} from 'lucide-react';
import type { SkillCategory } from '../../types';

export const HomeView: React.FC = () => {
  const {
    user,
    skills,
    challenges,
    dailyChallenge,
    launchDailyChallenge,
    setActiveTab,
    setSelectedSkillId,
    openChallengePlayer,
  } = useApp();

  const greeting = (() => {
    const hour = typeof window !== 'undefined' ? new Date().getHours() : 12;
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  // Find recommended next challenge (first uncompleted)
  const recommendedChallenge = challenges.find((c) => !c.completed) || challenges[0];

  const getSkillIcon = (id: SkillCategory) => {
    switch (id) {
      case 'decision-making':
        return <Compass size={17} color="#2563EB" />;
      case 'money-management':
        return <Wallet size={17} color="#16A34A" />;
      case 'time-management':
        return <Clock size={17} color="#F59E0B" />;
      case 'communication':
        return <MessageSquare size={17} color="#7C3AED" />;
      case 'problem-solving':
        return <Cpu size={17} color="#0891B2" />;
    }
  };

  const handleSkillClick = (skillId: SkillCategory) => {
    setSelectedSkillId(skillId);
    setActiveTab('skills');
  };

  return (
    <div className="home-container">
      {/* 1. Hero Welcome & Core Status Card */}
      <section className="hero-welcome-card">
        <div>
          <h1 className="hero-welcome-title">
            {greeting}, {user.name} 👋
          </h1>
          <p className="hero-welcome-sub">
            Master real-life choices through actionable simulations. Test consequences, avoid costly mistakes, and build grounded life wisdom.
          </p>

          <div className="hero-stats-row">
            <div className="stat-micro-pill">
              <Flame size={16} color="var(--color-warning)" fill="currentColor" />
              <span>{user.streakDays} Day Streak</span>
            </div>
            <div className="stat-micro-pill">
              <Zap size={16} color="var(--color-primary)" fill="currentColor" />
              <span>Level {user.currentLevel} • {user.xp} XP</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ whiteSpace: 'nowrap' }}
          onClick={launchDailyChallenge}
        >
          <Sparkles size={16} />
          <span>{dailyChallenge?.completed ? 'Review Today’s Scenario' : 'Start Daily Scenario'}</span>
        </button>
      </section>

      {/* 2. Daily Challenge Card */}
      {dailyChallenge && (
        <section className="daily-challenge-hero">
          <div className="daily-header-tag">
            <span className="badge badge-blue">
              <Sparkles size={12} />
              <span>Today's Daily Scenario</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              +{dailyChallenge.xpReward} XP Reward
            </span>
          </div>

          <div>
            <h2 className="daily-title">{dailyChallenge.title}</h2>
            <p className="daily-summary">{dailyChallenge.summary}</p>
          </div>

          <div className="daily-meta-bar">
            <div className="meta-badges-group">
              <span className="badge badge-orange">{dailyChallenge.difficulty}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                ~{dailyChallenge.estimatedMinutes} mins
              </span>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => openChallengePlayer(dailyChallenge)}
            >
              {dailyChallenge.completed ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Completed (Review Solution)</span>
                </>
              ) : (
                <span>Solve This Dilemma</span>
              )}
            </button>
          </div>
        </section>
      )}

      {/* 3. The 5 Core Life Skills Overview */}
      <section>
        <div className="section-headline-row">
          <div>
            <h2 className="section-title">Core Life Skills</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Your current practical mastery across foundational decision dimensions
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setActiveTab('skills')}
          >
            <span>View detailed analytics</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="skills-overview-grid">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="skill-card-compact"
              onClick={() => handleSkillClick(skill.id)}
              role="button"
              tabIndex={0}
            >
              <div className="skill-card-top">
                <div
                  className="skill-icon-bubble"
                  style={{ backgroundColor: `${skill.color}18` }}
                >
                  {getSkillIcon(skill.id)}
                </div>
                <span className="skill-score-num" style={{ color: skill.color }}>
                  {skill.score}%
                </span>
              </div>

              <div>
                <div className="skill-name-label">{skill.name}</div>
                <div className="skill-level-title">{skill.levelTitle}</div>
              </div>

              <ProgressBar progress={skill.score} color={skill.color} height={6} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Weekly Consistency Activity Tracker */}
      <section className="weekly-activity-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Calendar size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Weekly Consistency Tracker
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Consistent daily practice cements cognitive instincts faster than weekend cramming.
          </p>
        </div>

        <div className="weekly-days-row">
          {user.weeklyActivity.map((dayItem) => (
            <div key={dayItem.day} className="day-bubble-col">
              <div className={`day-circle ${dayItem.active ? 'active' : ''}`}>
                {dayItem.active ? <CheckCircle2 size={16} /> : dayItem.day.slice(0, 1)}
              </div>
              <span className="day-name-sub">{dayItem.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Recommended Next Challenge with Why Explanation */}
      {recommendedChallenge && (
        <section>
          <div className="section-headline-row">
            <div>
              <h2 className="section-title">Recommended Challenge For You</h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {recommendedChallenge.recommendedReason ||
                  'Selected based on your recent skill diagnostics and learning goals.'}
              </p>
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setActiveTab('challenges')}
            >
              <span>Explore all challenges</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ maxWidth: '680px' }}>
            <ChallengeCard challenge={recommendedChallenge} />
          </div>
        </section>
      )}
    </div>
  );
};
