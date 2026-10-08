import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { CATEGORIES } from '../../constants';
import type { ExperienceCategory } from '../../types';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    completeOnboarding,
    user,
  } = useApp();

  const [selectedInterests, setSelectedInterests] = useState<ExperienceCategory[]>(
    user.interests.length > 0 ? user.interests : ['Career', 'Business', 'Money']
  );
  const [currentGoal, setCurrentGoal] = useState(
    user.currentGoal || 'Landing my first high-paying role and investing without burnout.'
  );

  const toggleInterest = (category: ExperienceCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleFinish = async () => {
    await completeOnboarding(selectedInterests, currentGoal);
  };

  return (
    <Modal
      isOpen={isOnboardingModalOpen}
      onClose={() => setIsOnboardingModalOpen(false)}
      title="Personalize Your Experience Feed"
      subtitle="LifeLore customizes your feed based on real situations you face today."
      maxWidth="md"
    >
      <div className="onboarding-flow-container">
        {/* Step 1: Categories */}
        <div className="onboarding-section">
          <label className="onboarding-label">
            1. What do you want to learn about?
          </label>
          <p className="onboarding-subtext">
            Select the topics you want to see firsthand lessons and breakdown stories for:
          </p>

          <div className="onboarding-categories-grid">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedInterests.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`onboarding-category-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleInterest(cat.id)}
                >
                  <div className="card-top-indicator">
                    <span className="cat-name">{cat.label}</span>
                    <div className="cat-check-circle">
                      {isSelected && <Check size={12} />}
                    </div>
                  </div>
                  <span className="cat-desc">{cat.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Current Improvement Goal */}
        <div className="onboarding-section">
          <label className="onboarding-label">
            2. What are you currently trying to improve?
          </label>
          <p className="onboarding-subtext">
            Tell us about a dilemma, career transition, or skill challenge on your mind:
          </p>

          <textarea
            rows={2}
            className="form-textarea-input onboarding-goal-input"
            value={currentGoal}
            onChange={(e) => setCurrentGoal(e.target.value)}
            placeholder="e.g. Escaping tutorial hell, negotiating salary, or overcoming financial anxiety..."
          />
        </div>

        {/* Finish CTA */}
        <div className="onboarding-footer-row">
          <button
            type="button"
            className="btn-primary onboarding-submit-btn"
            onClick={handleFinish}
            disabled={selectedInterests.length === 0}
          >
            <Sparkles size={16} />
            <span>Start Learning from Real Lives</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
