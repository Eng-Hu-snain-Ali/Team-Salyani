import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';
import type { BusinessIdea } from '../../types';

export const IdeaVault: React.FC = () => {
  const { businessIdeas, setActiveTab } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIdeaId, setExpandedIdeaId] = useState<string | null>(null);

  const filteredIdeas = businessIdeas.filter((idea) => {
    if (selectedCategory === 'all') return true;
    return idea.category === selectedCategory;
  });

  const getCategoryColor = (cat: BusinessIdea['category']) => {
    switch (cat) {
      case 'zero_capital': return '#10B981';
      case 'digital_service': return '#6366F1';
      case 'local_arbitrage': return '#F59E0B';
      default: return '#06B6D4';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Youth Entrepreneurship Hub
          </span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real Startup Blueprints
          </span>
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em' }}>
          Actionable Business & Life Ideas
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginTop: 4, maxWidth: 680 }}>
          Stop mindlessly consuming short videos. Explore proven, low-capital business ideas designed to stimulate practical creativity and generate real cashflow.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {[
          { key: 'all', label: 'All Ideas' },
          { key: 'zero_capital', label: '🌱 $0 Capital Businesses' },
          { key: 'digital_service', label: '💻 Digital Services' },
          { key: 'local_arbitrage', label: '🔄 Local Arbitrage' },
        ].map((item) => {
          const isSelected = selectedCategory === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setSelectedCategory(item.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'var(--brand-gradient)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: isSelected ? '1px solid #818CF8' : '1px solid var(--glass-border)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Ideas Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20,
      }}>
        {filteredIdeas.map((idea) => {
          const accentColor = getCategoryColor(idea.category);
          const isExpanded = expandedIdeaId === idea.id;

          return (
            <div
              key={idea.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: '26px',
                borderTop: `3px solid ${accentColor}`,
              }}
            >
              {/* Category & Budget Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: accentColor,
                  background: `${accentColor}18`,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                }}>
                  {idea.category.replace('_', ' ')}
                </span>

                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  Budget: {idea.startingBudget}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.35 }}>
                  {idea.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: 6, fontStyle: 'italic' }}>
                  "{idea.tagline}"
                </p>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {idea.description}
              </p>

              {/* Revenue & Difficulty Box */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Monthly Potential</span>
                  <strong style={{ fontSize: '0.88rem', color: '#34D399' }}>{idea.potentialRevenue}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Difficulty</span>
                  <strong style={{ fontSize: '0.88rem', color: '#FFFFFF', textTransform: 'capitalize' }}>{idea.difficulty}</strong>
                </div>
              </div>

              {/* Execution Steps */}
              {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }} className="animate-fade-in">
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={16} color="#34D399" />
                      First 3 Steps to Launch This:
                    </h4>
                    <ol style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.6 }}>
                      {idea.executionSteps.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: 4 }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Mentor Advice */}
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    fontSize: '0.85rem',
                    color: '#FEF3C7',
                    lineHeight: 1.5,
                  }}>
                    <strong style={{ color: '#FBBF24', display: 'block', marginBottom: 2 }}>Mentor Wisdom:</strong>
                    "{idea.mentorAdvice}"
                  </div>

                  {/* Skills needed */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {idea.skillsNeeded.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          color: '#A5B4FC',
                          background: 'rgba(99, 102, 241, 0.12)',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div style={{
                marginTop: 'auto',
                paddingTop: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <button
                  onClick={() => setExpandedIdeaId(isExpanded ? null : idea.id)}
                  style={{
                    fontSize: '0.84rem',
                    color: '#818CF8',
                    fontWeight: 700,
                  }}
                >
                  {isExpanded ? 'Hide Playbook' : 'View Execution Playbook →'}
                </button>

                <button
                  onClick={() => setActiveTab('feed')}
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Founder Stories
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
