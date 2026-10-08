import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  Compass,
  Wallet,
  Clock,
  MessageSquare,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  History,
} from 'lucide-react';
import type { SkillCategory } from '../../types';

export const SkillsView: React.FC = () => {
  const { skills, challenges, openChallengePlayer, selectedSkillId, setSelectedSkillId } = useApp();

  const getSkillIcon = (id: SkillCategory) => {
    switch (id) {
      case 'decision-making':
        return <Compass size={24} color="#2563EB" />;
      case 'money-management':
        return <Wallet size={24} color="#16A34A" />;
      case 'time-management':
        return <Clock size={24} color="#F59E0B" />;
      case 'communication':
        return <MessageSquare size={24} color="#7C3AED" />;
      case 'problem-solving':
        return <Cpu size={24} color="#0891B2" />;
    }
  };

  const getRecommendedForSkill = (skillId: SkillCategory) => {
    return challenges.find((c) => c.category === skillId && !c.completed) ||
      challenges.find((c) => c.category === skillId);
  };

  return (
    <div className="skills-view-container">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          Core Life Skills Diagnostics
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Detailed breakdown of your practical instincts across our 5 foundational decision dimensions.
        </p>
      </div>

      {/* Filter by Skill if user tapped from home */}
      {selectedSkillId && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-primary-light)', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            Viewing focused skill: <strong>{skills.find((s) => s.id === selectedSkillId)?.name}</strong>
          </span>
          <button
            type="button"
            className="btn-ghost"
            style={{ fontSize: '0.78rem', padding: '2px 8px', color: 'var(--color-primary)' }}
            onClick={() => setSelectedSkillId(null)}
          >
            Show All 5 Skills
          </button>
        </div>
      )}

      {/* Skills Detail Cards Grid */}
      <div className="skills-detail-grid">
        {skills
          .filter((s) => (selectedSkillId ? s.id === selectedSkillId : true))
          .map((skill) => {
            const recommended = getRecommendedForSkill(skill.id);
            return (
              <section key={skill.id} className="skill-detailed-card">
                {/* Header Row */}
                <div className="skill-detail-header">
                  <div className="skill-title-block">
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `${skill.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getSkillIcon(skill.id)}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {skill.name}
                      </h2>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        Level {skill.level} • {skill.levelTitle}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: skill.color }}>
                        {skill.score}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}> / 100</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {skill.description}
                </p>

                {/* Progress Bar */}
                <ProgressBar progress={skill.score} color={skill.color} height={10} showLabel />

                {/* Strengths & Areas to Improve Columns */}
                <div className="strengths-weakness-row">
                  <div className="analysis-col">
                    <h5 style={{ color: 'var(--color-success)' }}>
                      <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      Demonstrated Strengths
                    </h5>
                    <ul className="analysis-bullet-list">
                      {skill.strengths.map((st, i) => (
                        <li key={i} className="analysis-bullet-item">
                          <span>•</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="analysis-col">
                    <h5 style={{ color: 'var(--color-warning)' }}>
                      <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      Growth Opportunities
                    </h5>
                    <ul className="analysis-bullet-list">
                      {skill.areasToImprove.map((ar, i) => (
                        <li key={i} className="analysis-bullet-item">
                          <span>•</span>
                          <span>{ar}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* History Log */}
                {skill.history.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>
                      <History size={14} />
                      <span>Recent Scenario Progression</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {skill.history.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.84rem',
                            padding: '6px 10px',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <span style={{ color: 'var(--text-main)' }}>{item.challengeTitle}</span>
                          <span style={{ color: item.delta >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>
                            {item.delta >= 0 ? `+${item.delta}` : item.delta} pts ({item.date})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Next Challenge in this Skill */}
                {recommended && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Targeted Practice Scenario
                      </span>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {recommended.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      onClick={() => openChallengePlayer(recommended)}
                    >
                      <span>{recommended.completed ? 'Review Solution' : 'Practice Scenario'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
};
