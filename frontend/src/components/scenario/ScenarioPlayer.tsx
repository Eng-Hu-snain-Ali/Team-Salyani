import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  RotateCcw, 
  Sparkles, 
  Brain, 
  Target, 
  Award,
  Zap
} from 'lucide-react';
import { getRecommendedScenario } from '../../services/apiService';

export const ScenarioPlayer: React.FC = () => {
  const { 
    activeScenario, 
    setActiveTab, 
    startScenario, 
    scenarios, 
    skills, 
    attempts, 
    submitChoiceResponse, 
    submitTextResponse, 
    isEvaluating, 
    latestEvaluation, 
    latestAttempt 
  } = useApp();

  const [responseMode, setResponseMode] = useState<'choice' | 'text'>('choice');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [openText, setOpenText] = useState<string>('');

  if (!activeScenario) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No scenario selected.</p>
        <button onClick={() => setActiveTab('challenges')} className="btn-primary">
          Browse Challenges
        </button>
      </div>
    );
  }

  const handleChoiceSubmit = async () => {
    if (!selectedOptionId) return;
    await submitChoiceResponse(activeScenario, selectedOptionId);
  };

  const handleTextSubmit = async () => {
    if (!openText.trim() || openText.trim().length < 8) return;
    await submitTextResponse(activeScenario, openText);
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setOpenText('');
    startScenario(activeScenario.id);
  };

  const handleNextRecommended = () => {
    const nextScen = getRecommendedScenario(scenarios, skills, attempts, activeScenario.id);
    setSelectedOptionId(null);
    setOpenText('');
    startScenario(nextScen.id);
  };

  const isCompleted = !!latestAttempt;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Top Navigation & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.04)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge-pill badge-module-${activeScenario.moduleKey.split('_')[0]}`}>
            {activeScenario.moduleKey.replace('_', ' ')}
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
          }}>
            <Clock size={12} /> {activeScenario.estimatedMinutes} mins
          </span>
          <span style={{
            fontSize: '0.8rem',
            textTransform: 'capitalize',
            color: activeScenario.difficulty === 'beginner' ? '#34D399' : activeScenario.difficulty === 'intermediate' ? '#FBBF24' : '#F472B6',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}>
            {activeScenario.difficulty}
          </span>
        </div>
      </div>

      {/* Scenario Briefing Card */}
      <div 
        className="glass-card"
        style={{
          padding: '32px',
          borderLeft: '4px solid var(--brand-primary)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Life Dilemma Case #{activeScenario.id.replace('scen-', '').substring(0, 8)}
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          {activeScenario.title}
        </h1>

        <div style={{ 
          marginTop: 18, 
          fontSize: '1.05rem', 
          lineHeight: 1.7, 
          color: 'var(--text-primary)',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {activeScenario.context}
        </div>

        <div style={{
          marginTop: 16,
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <Target size={20} color="#818CF8" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#E0E7FF' }}>
            {activeScenario.dilemma}
          </span>
        </div>
      </div>

      {/* Decision Section (if not yet submitted) */}
      {!isCompleted && !isEvaluating && (
        <div className="glass-card" style={{ padding: '28px' }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid var(--glass-border)',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Make Your Decision</h3>

            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: 4,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
            }}>
              <button
                onClick={() => setResponseMode('choice')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: responseMode === 'choice' ? '#FFFFFF' : 'var(--text-muted)',
                  background: responseMode === 'choice' ? 'var(--brand-primary)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Multiple Choice
              </button>
              <button
                onClick={() => setResponseMode('text')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: responseMode === 'text' ? '#FFFFFF' : 'var(--text-muted)',
                  background: responseMode === 'text' ? 'var(--brand-primary)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Brain size={14} />
                <span>AI Open Response</span>
              </button>
            </div>
          </div>

          {/* Response Mode 1: Multiple Choice */}
          {responseMode === 'choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Select the course of action you believe best balances short-term pressures and long-term values:
              </p>

              {activeScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-lg)',
                      background: isSelected 
                        ? 'rgba(99, 102, 241, 0.16)' 
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected 
                        ? '2px solid #818CF8' 
                        : '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16,
                      boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isSelected ? 'var(--brand-gradient)' : 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}>
                      {opt.label}
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontSize: '0.98rem', 
                        lineHeight: 1.5, 
                        color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                        fontWeight: isSelected ? 600 : 400,
                      }}>
                        {opt.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={handleChoiceSubmit}
                  disabled={!selectedOptionId}
                  className="btn-primary"
                  style={{
                    opacity: selectedOptionId ? 1 : 0.4,
                    cursor: selectedOptionId ? 'pointer' : 'not-allowed',
                    padding: '12px 32px',
                  }}
                >
                  <span>Submit Decision</span>
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Response Mode 2: AI Open Text Response */}
          {responseMode === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '0.86rem',
                color: '#C7D2FE',
                lineHeight: 1.5,
              }}>
                <Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />
                <strong>LifeOS AI Evaluation Rubric:</strong> Type out your exact verbal response or strategic sequence. The AI engine evaluates your trade-off awareness, emotional tone, boundary preservation, and tactical recovery.
              </div>

              <textarea
                value={openText}
                onChange={(e) => setOpenText(e.target.value)}
                placeholder="Example: I would calmly call Omar and explain that my project is high-stakes for tomorrow morning, so I'll put in two hours of solid work right now. Once my submission draft is finalized at 9 PM, I'll drop by the celebration for 45 minutes to toast him in person..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--glass-border)',
                  color: '#FFFFFF',
                  fontSize: '0.96rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {openText.trim().split(/\s+/).filter(Boolean).length} words • Minimum 10 words recommended
                </span>

                <button
                  onClick={handleTextSubmit}
                  disabled={openText.trim().length < 8}
                  className="btn-primary"
                  style={{
                    opacity: openText.trim().length >= 8 ? 1 : 0.4,
                    cursor: openText.trim().length >= 8 ? 'pointer' : 'not-allowed',
                    padding: '12px 28px',
                  }}
                >
                  <Brain size={16} />
                  <span>Evaluate with AI</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evaluating Loading State */}
      {isEvaluating && (
        <div className="glass-card pulse-glow" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: 'var(--brand-glow)',
          }}>
            <Brain size={32} color="#FFFFFF" className="flame-animated" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>AI Evaluating Decision Dynamics...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 440, margin: '8px auto 0' }}>
            Simulating realistic human reactions, trade-off outcomes, and calculating skill score impacts.
          </p>
        </div>
      )}

      {/* Consequence & AI Feedback Stage (After Submission) */}
      {isCompleted && latestAttempt && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
          {/* STEP 1: Consequence Reveal (As prescribed by PRD: "Consequence first") */}
          <div 
            className="glass-card"
            style={{
              padding: '28px',
              borderLeft: latestAttempt.score >= 70 ? '4px solid #10B981' : '4px solid #F59E0B',
              background: latestAttempt.score >= 70 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(23, 30, 46, 0.8) 100%)' 
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(23, 30, 46, 0.8) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: latestAttempt.score >= 70 ? '#34D399' : '#FBBF24',
              }}>
                1. Realistic Consequence
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
              What happens next...
            </h3>

            <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
              {latestAttempt.consequenceSummary}
            </p>
          </div>

          {/* STEP 2: Feedback & Trade-off Analysis */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#818CF8', letterSpacing: '0.05em' }}>
                2. AI Feedback & Trade-off Breakdown
              </span>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: latestAttempt.score >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: latestAttempt.score >= 75 ? '#34D399' : '#FBBF24',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}>
                <Award size={14} />
                <span>Decision Score: {latestAttempt.score}%</span>
              </div>
            </div>

            {latestEvaluation ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Strengths */}
                {latestEvaluation.strengths.length > 0 && (
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}>
                    <strong style={{ color: '#34D399', fontSize: '0.88rem', display: 'block', marginBottom: 4 }}>
                      Key Strengths Identified:
                    </strong>
                    <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {latestEvaluation.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {latestEvaluation.improvements.length > 0 && (
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                  }}>
                    <strong style={{ color: '#FBBF24', fontSize: '0.88rem', display: 'block', marginBottom: 4 }}>
                      Nuance & Growth Opportunities:
                    </strong>
                    <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {latestEvaluation.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {latestAttempt.feedbackSummary}
              </p>
            )}
          </div>

          {/* STEP 3: Skill Impact & Rewards Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Zap size={24} color="#818CF8" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#A5B4FC' }}>
                  +{latestAttempt.xpEarned} XP
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total XP: {useApp().user.xp}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Target size={24} color="#FBBF24" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FBBF24' }}>
                  Skill Level Boosted
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Progression applied to {activeScenario.moduleKey.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Next Challenge Recommendation CTA */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(30, 39, 66, 0.8) 0%, rgba(18, 24, 38, 0.9) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}>
            <button
              onClick={handleRetry}
              className="btn-secondary"
            >
              <RotateCcw size={16} />
              <span>Retry With Different Choice</span>
            </button>

            <button
              onClick={handleNextRecommended}
              className="btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <span>Next Recommended Challenge</span>
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
