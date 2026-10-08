import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import type { OptionId, ChallengeAttemptResult } from '../../types';
import { SKILL_CATEGORIES } from '../../constants';
import {
  HelpCircle,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

export const ChallengePlayerModal: React.FC = () => {
  const {
    selectedChallenge,
    closeChallengePlayer,
    submitChallengeDecision,
    setActiveTab,
    challenges,
    openChallengePlayer,
  } = useApp();

  const [selectedOptionId, setSelectedOptionId] = useState<OptionId | null>(null);
  const [writtenNote, setWrittenNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<ChallengeAttemptResult | null>(null);

  // Sync state when selectedChallenge changes
  useEffect(() => {
    if (selectedChallenge) {
      if (selectedChallenge.completed && selectedChallenge.userChoiceId) {
        // Pre-populate if already completed
        setSelectedOptionId(selectedChallenge.userChoiceId);
        setWrittenNote(selectedChallenge.userWrittenResponse || '');
        const opt = selectedChallenge.options.find((o) => o.id === selectedChallenge.userChoiceId);
        if (opt) {
          setAttemptResult({
            challengeId: selectedChallenge.id,
            selectedOption: opt,
            writtenResponse: selectedChallenge.userWrittenResponse,
            xpEarned: selectedChallenge.xpReward,
            skillDelta: opt.skillImpact,
            newSkillScore: 70,
            newTotalXp: 470,
            newLevel: 3,
            completedAt: selectedChallenge.completedAt || new Date().toISOString(),
          });
        }
      } else {
        setSelectedOptionId(null);
        setWrittenNote('');
        setAttemptResult(null);
      }
    }
  }, [selectedChallenge]);

  if (!selectedChallenge) return null;

  const categoryMeta = SKILL_CATEGORIES.find((c) => c.id === selectedChallenge.category) || SKILL_CATEGORIES[0];

  const handleSubmitDecision = async () => {
    if (!selectedOptionId) return;
    try {
      setIsSubmitting(true);
      const result = await submitChallengeDecision(
        selectedChallenge.id,
        selectedOptionId,
        writtenNote.trim() || undefined
      );
      setAttemptResult(result);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextChallenge = () => {
    const uncompleted = challenges.filter(
      (c) => !c.completed && c.id !== selectedChallenge.id
    );
    if (uncompleted.length > 0) {
      openChallengePlayer(uncompleted[0]);
    } else {
      closeChallengePlayer();
      setActiveTab('challenges');
    }
  };

  const handleResetForPractice = () => {
    setAttemptResult(null);
    setSelectedOptionId(null);
    setWrittenNote('');
  };

  return (
    <Modal
      isOpen={Boolean(selectedChallenge)}
      onClose={closeChallengePlayer}
      title={selectedChallenge.title}
      subtitle={`${categoryMeta.name} • ${selectedChallenge.difficulty} • ~${selectedChallenge.estimatedMinutes} mins`}
      maxWidth="lg"
    >
      <div className="scenario-player-container">
        {/* Top Badges & Reward */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              className="badge"
              style={{ backgroundColor: categoryMeta.badgeBg, color: categoryMeta.color }}
            >
              {categoryMeta.name}
            </span>
            <span className="badge badge-orange">{selectedChallenge.difficulty}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              {selectedChallenge.estimatedMinutes} mins
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 700 }}>
              <Zap size={14} />
              +{selectedChallenge.xpReward} XP
            </span>
          </div>
        </div>

        {/* Step 1: Scenario Context */}
        <div className="player-context-box">
          <h4>Real-Life Scenario</h4>
          <p>{selectedChallenge.scenarioContext}</p>
        </div>

        {/* Step 2: Core Dilemma */}
        <div className="player-dilemma-box">
          <HelpCircle size={20} color="var(--color-warning)" style={{ flexShrink: 0 }} />
          <div className="player-dilemma-text">
            <strong>The Dilemma:</strong> {selectedChallenge.dilemma}
          </div>
        </div>

        {/* If Not Submitted Yet: Decision Selection Mode */}
        {!attemptResult ? (
          <>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                Choose Your Course of Action:
              </h4>

              <div className="decision-options-list">
                {selectedChallenge.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={`decision-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedOptionId(opt.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="option-letter-badge">{opt.id}</div>
                      <div className="option-text-group">
                        <h5>{opt.label}</h5>
                        <p>{opt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Written Reasoning */}
            {selectedChallenge.allowWrittenResponse && (
              <div className="form-group" style={{ marginTop: '6px' }}>
                <label className="form-label" htmlFor="written-note-input">
                  Your Reasoning or Custom Action Step (Optional):
                </label>
                <textarea
                  id="written-note-input"
                  className="form-textarea"
                  rows={2}
                  value={writtenNote}
                  onChange={(e) => setWrittenNote(e.target.value)}
                  placeholder="Explain why you chose this path or note an additional nuance..."
                />
              </div>
            )}

            {/* Submission CTA */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={closeChallengePlayer}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!selectedOptionId || isSubmitting}
                onClick={handleSubmitDecision}
                style={{ opacity: !selectedOptionId ? 0.6 : 1 }}
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm Decision & Reveal Consequence'}
              </button>
            </div>
          </>
        ) : (
          /* Step 3: Consequence, Feedback & Skill Impact Revealed */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease' }}>
            {/* Consequence Reveal Card */}
            <div
              className={`consequence-reveal-card ${
                attemptResult.selectedOption.isOptimal ? 'optimal' : 'suboptimal'
              }`}
            >
              <div className="consequence-title">
                {attemptResult.selectedOption.isOptimal ? (
                  <>
                    <CheckCircle2 size={20} color="var(--color-success)" />
                    <span>Optimal Strategic Outcome</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={20} color="var(--color-warning)" />
                    <span>Suboptimal Consequence</span>
                  </>
                )}
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
                {attemptResult.selectedOption.consequence}
              </p>
            </div>

            {/* Detailed Feedback & Mental Framework */}
            <div className="feedback-explanation-box">
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Pedagogical Feedback & Framework:
              </h5>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
                {attemptResult.selectedOption.feedback}
              </p>
            </div>

            {/* Skill Impact & XP Summary */}
            <div className="skill-impact-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--color-primary)" />
                <span>
                  {categoryMeta.name}:{' '}
                  <strong
                    style={{
                      color:
                        attemptResult.selectedOption.skillImpact.delta >= 0
                          ? 'var(--color-success)'
                          : 'var(--color-danger)',
                    }}
                  >
                    {attemptResult.selectedOption.skillImpact.delta >= 0 ? '+' : ''}
                    {attemptResult.selectedOption.skillImpact.delta} pts
                  </strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)' }}>
                <Zap size={16} fill="currentColor" />
                <span>+{attemptResult.xpEarned} XP Earned</span>
              </div>
            </div>

            {/* Display User Written Response if provided */}
            {attemptResult.writtenResponse && (
              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.86rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Your Reflection: </span>
                <span style={{ color: 'var(--text-main)' }}>"{attemptResult.writtenResponse}"</span>
              </div>
            )}

            {/* Post-Resolution Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={handleResetForPractice}
                title="Practice alternative choice"
              >
                <RotateCcw size={14} />
                <span>Try Another Choice</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeChallengePlayer}
                >
                  Done
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextChallenge}
                >
                  <span>Next Challenge</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
