import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Wallet, 
  Clock, 
  MessageSquare, 
  Wrench,
  ArrowRight
} from 'lucide-react';
import type { ModuleKey } from '../../types';

export const SkillsAnalytics: React.FC = () => {
  const { skills, scenarios, startScenario } = useApp();

  const getModuleIcon = (key: ModuleKey) => {
    switch (key) {
      case 'decision_making': return <Compass size={20} color="#818CF8" />;
      case 'money_management': return <Wallet size={20} color="#34D399" />;
      case 'time_management': return <Clock size={20} color="#FBBF24" />;
      case 'communication': return <MessageSquare size={20} color="#38BDF8" />;
      case 'problem_solving': return <Wrench size={20} color="#F472B6" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#34D399';
    if (score >= 60) return '#FBBF24';
    return '#F87171';
  };

  // Compute average skill score
  const avgScore = Math.round(skills.reduce((acc, s) => acc + s.currentScore, 0) / skills.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Real-World Skill Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>
          Granular scoring across the five core pillars of everyday adulthood and decision resilience.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
      }}>
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
            <BarChart3 size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
              {avgScore}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Overall Life Mastery Index
            </div>
          </div>
        </div>

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
            <ShieldCheck size={26} color="#34D399" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34D399' }}>
              Top: Diplomatic Clarity
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Highest evaluated ability (76%)
            </div>
          </div>
        </div>

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
            <TrendingUp size={26} color="#FBBF24" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FBBF24' }}>
              Focus: Cashflow Resilience
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Needs practice (54%)
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Skill Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Competency Breakdown</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}>
          {skills.map((skill) => {
            const scoreColor = getScoreColor(skill.currentScore);
            const relatedScenario = scenarios.find(s => s.moduleKey === skill.moduleKey);

            return (
              <div 
                key={skill.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: '24px',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {getModuleIcon(skill.moduleKey)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {skill.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {skill.moduleKey.replace('_', ' ')} • Level {skill.level}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: scoreColor,
                  }}>
                    {skill.currentScore}%
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {skill.description}
                </p>

                {/* Progress bar */}
                <div>
                  <div style={{
                    width: '100%',
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${skill.currentScore}%`,
                      height: '100%',
                      background: scoreColor,
                      borderRadius: 4,
                      boxShadow: `0 0 10px ${scoreColor}88`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>

                {/* Practice suggestion CTA */}
                {relatedScenario && (
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: 12,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Suggested Drill: {relatedScenario.title.substring(0, 24)}...
                    </span>
                    <button
                      onClick={() => startScenario(relatedScenario.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#818CF8',
                      }}
                    >
                      <span>Drill</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Philosophy Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(23, 30, 46, 0.8) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Sparkles size={24} color="#818CF8" />
        </div>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
            LifeOS Skill Philosophy: "Learn by Living"
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
            Unlike trivia apps, LifeOS tests how you navigate ambiguous trade-offs under realistic pressure. There is rarely one "pure" right answer—mastery means owning your consequences and adapting.
          </p>
        </div>
      </div>
    </div>
  );
};
