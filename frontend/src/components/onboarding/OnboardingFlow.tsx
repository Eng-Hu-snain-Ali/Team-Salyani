import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AgeGroup } from '../../types';
import { SEED_GOALS } from '../../data/seedData';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Award
} from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('young_adult');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['financial_independence', 'stress_free_time']);
  const [assessmentChoice, setAssessmentChoice] = useState<number | null>(null);

  const toggleGoal = (goalKey: string) => {
    if (selectedGoals.includes(goalKey)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter(g => g !== goalKey));
      }
    } else {
      setSelectedGoals([...selectedGoals, goalKey]);
    }
  };

  const handleFinish = () => {
    completeOnboarding(selectedAge, selectedGoals);
  };

  return (
    <div style={{
      maxWidth: 720,
      margin: '40px auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
    }} className="animate-fade-in">
      {/* Progress tracker dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            style={{
              width: s === step ? 28 : 10,
              height: 10,
              borderRadius: 'var(--radius-full)',
              background: s <= step ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.1)',
              transition: 'all var(--transition-fast)',
            }}
          />
        ))}
      </div>

      {/* STEP 1: Welcome & Vision */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 68,
            height: 68,
            borderRadius: '20px',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--brand-glow)',
          }}>
            <Sparkles size={36} color="#FFFFFF" />
          </div>

          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Welcome to LifeOS
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>
              The AI-powered practical life-learning platform. Practice realistic everyday situations, make decisions, see consequences, and build genuine resilience.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            width: '100%',
            marginTop: 10,
            textAlign: 'left',
          }}>
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)',
            }}>
              <strong style={{ color: '#818CF8', fontSize: '0.9rem', display: 'block' }}>Zero Shaming</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Safe space to test risky or stressful choices</span>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)',
            }}>
              <strong style={{ color: '#34D399', fontSize: '0.9rem', display: 'block' }}>Realistic Fallout</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Experience immediate cause and effect</span>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)',
            }}>
              <strong style={{ color: '#FBBF24', fontSize: '0.9rem', display: 'block' }}>AI Feedback</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Actionable trade-off analysis every time</span>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="btn-primary"
            style={{ marginTop: 12, padding: '14px 36px', fontSize: '1.05rem' }}
          >
            <span>Begin Setup</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: Age Group Selection */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase' }}>
              Step 1 of 4 • Personalization
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 4 }}>
              What is your current life stage?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
              LifeOS tailors dilemma complexity, financial stakes, and social dynamics to your demographic.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                id: 'teen' as AgeGroup,
                title: 'High School & Teens (13 - 17)',
                desc: 'Focus on navigating peer pressure, school deadlines, initial money habits, and balancing family expectations.',
              },
              {
                id: 'young_adult' as AgeGroup,
                title: 'College & Young Adults (18 - 24)',
                desc: 'Focus on independent living, roommates, budget emergencies, career dilemmas, and assertive communication.',
              },
              {
                id: 'adult' as AgeGroup,
                title: 'Working Adults (25+)',
                desc: 'Focus on workplace politics, major financial trade-offs, work-life boundaries, and long-term strategic decisions.',
              },
            ].map((option) => {
              const isSelected = selectedAge === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedAge(option.id)}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '2px solid #818CF8' : '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {option.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {option.desc}
                    </p>
                  </div>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: isSelected ? 'none' : '2px solid var(--text-muted)',
                    background: isSelected ? 'var(--brand-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: 16,
                  }}>
                    {isSelected && <Check size={14} color="#FFFFFF" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <button onClick={() => setStep(1)} className="btn-secondary">
              Back
            </button>
            <button onClick={() => setStep(3)} className="btn-primary">
              <span>Next: Set Goals</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Goals Selection */}
      {step === 3 && (
        <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase' }}>
              Step 2 of 4 • Target Areas
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 4 }}>
              What do you want to master most?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
              Pick at least 2 focus areas. LifeOS prioritizes daily challenges aligned with your selected goals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SEED_GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.key);
              return (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.key)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid #818CF8' : '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {goal.label}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {goal.description}
                    </p>
                  </div>

                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: isSelected ? 'none' : '2px solid var(--text-muted)',
                    background: isSelected ? 'var(--brand-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: 16,
                  }}>
                    {isSelected && <Check size={14} color="#FFFFFF" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <button onClick={() => setStep(2)} className="btn-secondary">
              Back
            </button>
            <button 
              onClick={() => setStep(4)} 
              className="btn-primary"
              disabled={selectedGoals.length === 0}
              style={{ opacity: selectedGoals.length === 0 ? 0.5 : 1 }}
            >
              <span>Next: Quick Baseline Diagnostic</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Baseline Diagnostic Scenario */}
      {step === 4 && (
        <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase' }}>
              Step 3 of 4 • Diagnostic Scenario
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4 }}>
              Baseline Assessment: The Surprise Expense
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
              Make an instinctive decision so LifeOS can calibrate your initial skill baseline.
            </p>
          </div>

          <div style={{
            padding: '18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            fontSize: '0.96rem',
            lineHeight: 1.6,
          }}>
            You have $120 left in your checking account until your next paycheck in 6 days. Your laptop charger dies completely, and you need it for work/study. A certified OEM replacement costs $80, while a dubious knockoff online is $22 with 3-day shipping.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { id: 1, text: 'Buy the $80 certified replacement immediately and cook basic groceries with the remaining $40 to protect your computer from electrical damage.' },
              { id: 2, text: 'Borrow a friend’s spare charger for 4 days and wait to order with your next paycheck.' },
              { id: 3, text: 'Buy the $22 cheap knockoff and spend the rest going to movies with friends.' },
            ].map((choice) => (
              <div
                key={choice.id}
                onClick={() => setAssessmentChoice(choice.id)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: assessmentChoice === choice.id ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.02)',
                  border: assessmentChoice === choice.id ? '2px solid #818CF8' : '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  color: assessmentChoice === choice.id ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                {choice.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <button onClick={() => setStep(3)} className="btn-secondary">
              Back
            </button>
            <button 
              onClick={() => setStep(5)} 
              className="btn-primary"
              disabled={assessmentChoice === null}
              style={{ opacity: assessmentChoice === null ? 0.5 : 1 }}
            >
              <span>View Calibration Result</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Assessment Result & Personalized Launch */}
      {step === 5 && (
        <div className="glass-card" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
          }}>
            <Award size={34} color="#FFFFFF" />
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Calibration Complete!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginTop: 6, maxWidth: 500 }}>
              Your LifeOS skill matrix has been initialized. We’ve configured your daily learning engine and unlocked your first recommended challenge.
            </p>
          </div>

          {/* Calibrated stats */}
          <div style={{
            width: '100%',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>+50 XP</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Onboarding Bonus</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24' }}>Level 1</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Initial Rank</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818CF8' }}>5 Modules</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked</div>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="btn-primary"
            style={{ padding: '14px 40px', fontSize: '1.05rem', marginTop: 10 }}
          >
            <span>Launch LifeOS & Start First Scenario</span>
            <Sparkles size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
