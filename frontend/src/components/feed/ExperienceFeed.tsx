import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  PlusCircle, 
  BrainCircuit
} from 'lucide-react';
import { ShareExperienceModal } from './ShareExperienceModal';
import type { MentorExperience } from '../../types';

export const ExperienceFeed: React.FC = () => {
  const { experiences, likeExperience, startScenario } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const filteredExperiences = experiences.filter((exp) => {
    if (selectedCategory === 'all') return true;
    return exp.category === selectedCategory;
  });

  const getCategoryBadge = (cat: MentorExperience['category']) => {
    switch (cat) {
      case 'costly_mistake':
        return { label: 'Costly Mistake / Failure', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'sales_negotiation':
        return { label: 'Sales & Negotiation', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'business_launch':
        return { label: 'Business Launch', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' };
      case 'mindset_shift':
        return { label: 'Mindset & Focus', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
      default:
        return { label: 'Founder Insight', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Header & CTA */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mentor Experience Feed
            </span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Real Founder Breakdowns
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em' }}>
            Real Business Experiences & Lessons
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginTop: 4, maxWidth: 680 }}>
            Break mindless phone scrolling. Read verified stories from entrepreneurs who navigated real financial crises, sales dilemmas, and mistakes.
          </p>
        </div>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="btn-primary"
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <PlusCircle size={18} />
          <span>Share Your Experience</span>
        </button>
      </div>

      {/* Purpose Banner: Mindless Scrolling vs Real Wisdom */}
      <div 
        style={{
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BrainCircuit size={22} color="#FBBF24" />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
            Transform Screen Time into Business Acumen
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
            Most young people lose 6+ hours every day on passive algorithmic video feeds. LifeOS replaces dopamine scrolling with actionable real-world experiences from successful founders and operators.
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {[
          { key: 'all', label: 'All Stories' },
          { key: 'costly_mistake', label: '⚠️ Costly Mistakes' },
          { key: 'sales_negotiation', label: '💼 Sales & Clients' },
          { key: 'business_launch', label: '🚀 First Launch' },
          { key: 'mindset_shift', label: '🧠 Focus & Screen Habits' },
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

      {/* Experience Cards Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredExperiences.map((exp) => {
          const badge = getCategoryBadge(exp.category);
          const isExpanded = expandedId === exp.id;

          return (
            <div 
              key={exp.id}
              className="glass-card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                borderLeft: `4px solid ${badge.color}`,
              }}
            >
              {/* Author & Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={exp.authorAvatar}
                    alt={exp.authorName}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#FFFFFF' }}>
                        {exp.authorName}
                      </span>
                      {exp.verifiedMentor && (
                        <span title="Verified Business Mentor" style={{ color: '#34D399', display: 'flex' }}>
                          <CheckCircle size={15} />
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {exp.authorRole} • {exp.businessType}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: badge.color,
                    background: badge.bg,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {badge.label}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {exp.readMinutes}m read • {exp.date}
                  </span>
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.4 }}>
                  {exp.title}
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
                  {exp.summary}
                </p>
              </div>

              {/* Expandable Full Story */}
              {isExpanded && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }} className="animate-fade-in">
                  <div style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: '#E2E8F0',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}>
                    {exp.fullStory}
                  </div>

                  {/* Highlighted Lesson Learned Box */}
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}>
                    <strong style={{ fontSize: '0.9rem', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Sparkles size={16} /> #1 Core Entrepreneurial Lesson:
                    </strong>
                    <p style={{ fontSize: '0.92rem', color: '#FEF3C7', lineHeight: 1.5 }}>
                      "{exp.lessonLearned}"
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  {exp.keyTakeaways.length > 0 && (
                    <div style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}>
                      <strong style={{ fontSize: '0.9rem', color: '#34D399', display: 'block', marginBottom: 8 }}>
                        Actionable Takeaways For Your Next Venture:
                      </strong>
                      <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                        {exp.keyTakeaways.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Link to Interactive Scenario Simulator */}
                  {exp.relatedScenarioId && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}>
                      <span style={{ fontSize: '0.88rem', color: '#C7D2FE', fontWeight: 600 }}>
                        Step into this founder's shoes: Test how you would make this critical decision.
                      </span>
                      <button
                        onClick={() => startScenario(exp.relatedScenarioId!)}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                      >
                        <span>Simulate Dilemma</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Actions Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  style={{
                    fontSize: '0.88rem',
                    color: '#818CF8',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <BookOpen size={16} />
                  <span>{isExpanded ? 'Collapse Story' : 'Read Full Story & Lessons →'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button
                    onClick={() => likeExperience(exp.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--text-secondary)',
                      fontSize: '0.84rem',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Heart size={15} color="#EF4444" fill="#EF4444" />
                    <span>{exp.likes} Learned From This</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ShareExperienceModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
