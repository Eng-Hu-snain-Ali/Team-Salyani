import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { AGE_GROUPS, LEARNING_GOALS, SKILL_CATEGORIES } from '../../constants';
import { ONBOARDING_ASSESSMENT_QUESTIONS } from '../../data/mockData';
import type { SkillCategory } from '../../types';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    completeOnboarding,
    user,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Age Group
  const [selectedAge, setSelectedAge] = useState(user.ageGroup || '20-24');

  // Step 2: Learning Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Stop overspending & build an emergency reserve',
    'Make confident life decisions despite uncertainty',
  ]);

  // Step 3: Assessment Answers
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});

  // Computed starting score boosts based on answers
  const [computedBoosts, setComputedBoosts] = useState<Partial<Record<SkillCategory, number>>>({});

  const toggleGoal = (label: string) => {
    setSelectedGoals((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAssessmentAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleFinishAssessment = () => {
    // Calculate boosts from choices
    const boosts: Partial<Record<SkillCategory, number>> = {};

    ONBOARDING_ASSESSMENT_QUESTIONS.forEach((q) => {
      const chosenOptId = assessmentAnswers[q.id];
      const opt = q.options.find((o) => o.id === chosenOptId);
      if (opt) {
        Object.entries(opt.skillImpacts).forEach(([cat, delta]) => {
          const k = cat as SkillCategory;
          boosts[k] = (boosts[k] || 0) + (delta || 0);
        });
      }
    });

    setComputedBoosts(boosts);
    setStep(4);
  };

  const handleCompleteAll = async () => {
    await completeOnboarding(selectedAge, selectedGoals, computedBoosts);
  };

  return (
    <Modal
      isOpen={isOnboardingModalOpen}
      onClose={() => setIsOnboardingModalOpen(false)}
      title="Personalize Your Learning Journey"
      subtitle={`Step ${step} of 4 • Tailoring USTAD ONLINE to your life stage`}
      maxWidth="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Step Indicator Bar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '5px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: s <= step ? 'var(--color-primary)' : 'var(--bg-surface-elevated)',
                transition: 'background-color 0.2s ease',
              }}
            />
          ))}
        </div>

        {/* STEP 1: Age Group Selection */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                Select Your Life Stage & Age Bracket
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                This calibrates the financial scales, career dynamics, and social scenarios you encounter.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {AGE_GROUPS.map((group) => {
                const isSelected = selectedAge === group.id;
                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedAge(group.id)}
                    className="ustad-card"
                    style={{
                      cursor: 'pointer',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-card)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                        {group.label}
                      </span>
                      {isSelected && <CheckCircle2 size={18} color="var(--color-primary)" />}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {group.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(2)}
              >
                <span>Continue to Goals</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Learning Goals Selection */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                What are your top practical improvement goals?
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Pick 2 or more areas where you want to sharpen your decision-making and avoid mistakes.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {LEARNING_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal.label);
                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.label)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      color={isSelected ? 'var(--color-primary)' : 'var(--text-muted)'}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {goal.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={selectedGoals.length === 0}
                onClick={() => setStep(3)}
              >
                <span>Continue to Quick Diagnostic</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Scenario-Based Diagnostic Assessment */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                Quick Scenario Diagnostic (2 Questions)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Answer honestly based on what you would realistically do in everyday life.
              </p>
            </div>

            {ONBOARDING_ASSESSMENT_QUESTIONS.map((q, qIndex) => (
              <div key={q.id} className="player-context-box">
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Question {qIndex + 1}: {q.title}
                </div>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
                  {q.scenario}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt) => {
                    const isSelected = assessmentAnswers[q.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleAnswerSelect(q.id, opt.id)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                          backgroundColor: isSelected ? 'var(--bg-card)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {opt.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={
                  Object.keys(assessmentAnswers).length <
                  ONBOARDING_ASSESSMENT_QUESTIONS.length
                }
                onClick={handleFinishAssessment}
              >
                <span>Generate Skill Profile</span>
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Assessment Result & Personalized Starting Skill Profile */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-light)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <Sparkles size={28} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Your Starting Skill Profile is Ready!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Based on your {selectedAge} bracket and diagnostic choices, here is your initial baseline:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', textAlign: 'left' }}>
              {SKILL_CATEGORIES.map((cat) => {
                const bonus = computedBoosts[cat.id] || 0;
                return (
                  <div
                    key={cat.id}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {cat.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: cat.color }}>
                        {60 + bonus}%
                      </span>
                      {bonus > 0 && (
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                          +{bonus}% Boost
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', padding: '12px 20px', fontSize: '1rem' }}
                onClick={handleCompleteAll}
              >
                <span>Launch My USTAD ONLINE Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
