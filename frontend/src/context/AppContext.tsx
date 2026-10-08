import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  User,
  Skill,
  Scenario,
  Achievement,
  Attempt,
  AgeGroup,
  NavigationTab,
  AIEvaluationResult,
  ModuleInfo,
} from '../types';
import {
  SEED_MODULES,
  SEED_SKILLS,
  SEED_SCENARIOS,
  SEED_ACHIEVEMENTS,
} from '../data/seedData';
import {
  evaluateOpenTextResponse,
  getRecommendedScenario,
  checkBackendConnection,
} from '../services/apiService';
import type { BackendStatus } from '../services/apiService';
import confetti from 'canvas-confetti';

interface AppContextType {
  user: User;
  skills: Skill[];
  scenarios: Scenario[];
  modules: ModuleInfo[];
  achievements: Achievement[];
  attempts: Attempt[];
  activeScenario: Scenario | null;
  activeTab: NavigationTab;
  deviceViewMode: 'desktop' | 'mobile';
  backendStatus: BackendStatus;
  isEvaluating: boolean;
  latestEvaluation: AIEvaluationResult | null;
  latestAttempt: Attempt | null;
  showUnlockToast: Achievement | null;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setDeviceViewMode: (mode: 'desktop' | 'mobile') => void;
  startScenario: (scenarioId: string) => void;
  submitChoiceResponse: (scenario: Scenario, optionId: string) => Promise<Attempt>;
  submitTextResponse: (scenario: Scenario, responseText: string) => Promise<Attempt>;
  completeOnboarding: (ageGroup: AgeGroup, goals: string[]) => void;
  resetProgress: () => void;
  switchProfile: (profileType: 'teen' | 'college' | 'professional') => void;
  updateUser: (updates: Partial<User>) => void;
  clearUnlockToast: () => void;
  refreshBackendStatus: () => Promise<void>;
}

const STORAGE_KEY_PREFIX = 'lifeos_app_data_v2_';

const DEFAULT_USER: User = {
  id: 'user-demo-1',
  name: 'Husnain Ali',
  email: 'husnain@lifeos.app',
  ageGroup: 'young_adult',
  goals: ['financial_independence', 'stress_free_time', 'clear_decision_making'],
  onboardingCompleted: true,
  xp: 420,
  level: 3,
  streak: 4,
  longestStreak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Learning to balance high-stakes deadlines, personal finance, and team leadership.',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}skills`);
    return saved ? JSON.parse(saved) : SEED_SKILLS;
  });

  const [scenarios] = useState<Scenario[]>(SEED_SCENARIOS);
  const [modules] = useState<ModuleInfo[]>(SEED_MODULES);

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}achievements`);
    return saved ? JSON.parse(saved) : SEED_ACHIEVEMENTS;
  });

  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}attempts`);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [deviceViewMode, setDeviceViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    connected: false,
    message: 'Testing connection...',
  });
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [latestEvaluation, setLatestEvaluation] = useState<AIEvaluationResult | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<Attempt | null>(null);
  const [showUnlockToast, setShowUnlockToast] = useState<Achievement | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}skills`, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}achievements`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}attempts`, JSON.stringify(attempts));
  }, [attempts]);

  // Initial backend health check
  useEffect(() => {
    refreshBackendStatus();
  }, []);

  const refreshBackendStatus = async () => {
    const status = await checkBackendConnection();
    setBackendStatus(status);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'],
      });
    } catch {
      // Fallback
    }
  };

  const checkAchievementProgress = (newAttempts: Attempt[], updatedUser: User) => {
    const newAchievements = achievements.map((ach) => {
      if (ach.isUnlocked) return ach;

      let isNowUnlocked = false;
      let newProgress = ach.progress;

      if (ach.key === 'first_decision' && newAttempts.length >= 1) {
        isNowUnlocked = true;
        newProgress = 1;
      } else if (ach.key === 'streak_3_days' && updatedUser.streak >= 3) {
        isNowUnlocked = true;
        newProgress = 3;
      } else if (ach.key === 'streak_7_days') {
        newProgress = Math.min(7, updatedUser.streak);
        if (newProgress >= 7) isNowUnlocked = true;
      } else if (ach.key === 'open_thinker' && newAttempts.some(a => a.responseType === 'text')) {
        isNowUnlocked = true;
        newProgress = 1;
      }

      if (isNowUnlocked && !ach.isUnlocked) {
        setShowUnlockToast({ ...ach, isUnlocked: true });
        triggerCelebration();
        return {
          ...ach,
          isUnlocked: true,
          progress: ach.maxProgress,
          unlockedAt: new Date().toISOString(),
        };
      }

      return { ...ach, progress: newProgress };
    });

    setAchievements(newAchievements);
  };

  const startScenario = (scenarioId: string) => {
    const scen = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
    setActiveScenario(scen);
    setLatestEvaluation(null);
    setLatestAttempt(null);
    setActiveTab('scenario');
  };

  const submitChoiceResponse = async (scenario: Scenario, optionId: string): Promise<Attempt> => {
    setIsEvaluating(true);
    const chosenOption = scenario.options.find((o) => o.id === optionId) || scenario.options[0];

    // Artificial tiny pause for UX feel
    await new Promise((r) => setTimeout(r, 600));

    // Update Skill scores
    const updatedSkills = skills.map((skill) => {
      const delta = chosenOption.skillScores[skill.id] || 0;
      if (delta !== 0) {
        const newScore = Math.min(100, Math.max(10, skill.currentScore + delta));
        const newLevel = Math.max(1, Math.floor(newScore / 10));
        return { ...skill, currentScore: newScore, level: newLevel };
      }
      return skill;
    });
    setSkills(updatedSkills);

    // XP & Streak Calculation
    const xpGained = chosenOption.xpAward;
    const newXP = user.xp + xpGained;
    const newLevel = Math.floor(newXP / 200) + 1;
    const updatedUser: User = {
      ...user,
      xp: newXP,
      level: newLevel,
      streak: user.streak + 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setUser(updatedUser);

    const attempt: Attempt = {
      id: `att-${Date.now()}`,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      moduleKey: scenario.moduleKey,
      userId: user.id,
      timestamp: new Date().toISOString(),
      responseType: 'choice',
      selectedOptionId: optionId,
      score: chosenOption.isOptimal ? 95 : 60,
      xpEarned: xpGained,
      consequenceSummary: chosenOption.consequence,
      feedbackSummary: chosenOption.feedback,
      status: 'completed',
    };

    const newAttempts = [attempt, ...attempts];
    setAttempts(newAttempts);
    setLatestAttempt(attempt);
    setIsEvaluating(false);

    if (chosenOption.isOptimal) {
      triggerCelebration();
    }

    checkAchievementProgress(newAttempts, updatedUser);
    return attempt;
  };

  const submitTextResponse = async (scenario: Scenario, responseText: string): Promise<Attempt> => {
    setIsEvaluating(true);
    const evaluation = await evaluateOpenTextResponse(scenario, responseText, skills);
    setLatestEvaluation(evaluation);

    // Apply skill deltas
    const updatedSkills = skills.map((skill) => {
      const delta = evaluation.skillScores[skill.id] || 0;
      if (delta !== 0) {
        const newScore = Math.min(100, Math.max(10, skill.currentScore + delta));
        const newLevel = Math.max(1, Math.floor(newScore / 10));
        return { ...skill, currentScore: newScore, level: newLevel };
      }
      return skill;
    });
    setSkills(updatedSkills);

    // Update User XP
    const xpGained = evaluation.xpAwarded;
    const newXP = user.xp + xpGained;
    const newLevel = Math.floor(newXP / 200) + 1;
    const updatedUser: User = {
      ...user,
      xp: newXP,
      level: newLevel,
      streak: user.streak + 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setUser(updatedUser);

    const attempt: Attempt = {
      id: `att-${Date.now()}`,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      moduleKey: scenario.moduleKey,
      userId: user.id,
      timestamp: new Date().toISOString(),
      responseType: 'text',
      openTextResponse: responseText,
      score: evaluation.overallScore,
      xpEarned: xpGained,
      consequenceSummary: evaluation.consequenceExplanation,
      feedbackSummary: evaluation.strengths.join(' ') + ' ' + evaluation.improvements.join(' '),
      status: 'completed',
    };

    const newAttempts = [attempt, ...attempts];
    setAttempts(newAttempts);
    setLatestAttempt(attempt);
    setIsEvaluating(false);

    if (evaluation.overallScore >= 70) {
      triggerCelebration();
    }

    checkAchievementProgress(newAttempts, updatedUser);
    return attempt;
  };

  const completeOnboarding = (ageGroup: AgeGroup, goals: string[]) => {
    const updatedUser: User = {
      ...user,
      ageGroup,
      goals,
      onboardingCompleted: true,
      xp: user.xp + 50,
    };
    setUser(updatedUser);
    triggerCelebration();

    // Start recommended first scenario
    const firstScenario = getRecommendedScenario(scenarios, skills, attempts);
    startScenario(firstScenario.id);
  };

  const resetProgress = () => {
    localStorage.clear();
    setUser({ ...DEFAULT_USER, onboardingCompleted: false, xp: 0, streak: 1, level: 1 });
    setSkills(SEED_SKILLS);
    setAttempts([]);
    setAchievements(SEED_ACHIEVEMENTS.map(a => ({ ...a, isUnlocked: false, progress: 0 })));
    setActiveScenario(null);
    setActiveTab('home');
  };

  const switchProfile = (profileType: 'teen' | 'college' | 'professional') => {
    if (profileType === 'teen') {
      setUser({
        ...DEFAULT_USER,
        name: 'Zayn (High Schooler)',
        ageGroup: 'teen',
        goals: ['stress_free_time', 'clear_decision_making'],
        level: 2,
        xp: 180,
        streak: 2,
      });
    } else if (profileType === 'college') {
      setUser({
        ...DEFAULT_USER,
        name: 'Husnain Ali (Student Leader)',
        ageGroup: 'young_adult',
        goals: ['financial_independence', 'stress_free_time', 'clear_decision_making'],
        level: 3,
        xp: 420,
        streak: 4,
      });
    } else {
      setUser({
        ...DEFAULT_USER,
        name: 'Elena (Associate Manager)',
        ageGroup: 'adult',
        goals: ['confident_communication', 'creative_problem_solving'],
        level: 5,
        xp: 980,
        streak: 12,
      });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const clearUnlockToast = () => {
    setShowUnlockToast(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        skills,
        scenarios,
        modules,
        achievements,
        attempts,
        activeScenario,
        activeTab,
        deviceViewMode,
        backendStatus,
        isEvaluating,
        latestEvaluation,
        latestAttempt,
        showUnlockToast,
        setActiveTab,
        setDeviceViewMode,
        startScenario,
        submitChoiceResponse,
        submitTextResponse,
        completeOnboarding,
        resetProgress,
        switchProfile,
        updateUser,
        clearUnlockToast,
        refreshBackendStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
