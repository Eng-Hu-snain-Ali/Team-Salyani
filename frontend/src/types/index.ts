// ============================================================================
// USTAD ONLINE DOMAIN CONTRACTS
// Practical Life-Learning Platform — Learn. Decide. Improve.
// ============================================================================

export type SkillCategory =
  | 'decision-making'
  | 'money-management'
  | 'time-management'
  | 'communication'
  | 'problem-solving';

export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface SkillData {
  id: SkillCategory;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  score: number; // 0 - 100
  level: number;
  levelTitle: string;
  strengths: string[];
  areasToImprove: string[];
  history: Array<{
    date: string;
    delta: number;
    challengeTitle: string;
  }>;
}

export interface ChallengeOption {
  id: OptionId;
  label: string;
  description: string;
  consequence: string;
  feedback: string;
  skillImpact: {
    skill: SkillCategory;
    delta: number;
  };
  isOptimal: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  category: SkillCategory;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  summary: string;
  scenarioContext: string;
  dilemma: string;
  options: ChallengeOption[];
  allowWrittenResponse?: boolean;
  recommendedReason?: string;
  isDaily?: boolean;
  completed: boolean;
  completedAt?: string;
  userChoiceId?: OptionId;
  userWrittenResponse?: string;
  tags: string[];
}

export interface ChallengeAttemptResult {
  challengeId: string;
  selectedOption: ChallengeOption;
  writtenResponse?: string;
  xpEarned: number;
  skillDelta: {
    skill: SkillCategory;
    delta: number;
  };
  newSkillScore: number;
  newTotalXp: number;
  newLevel: number;
  completedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currentLevel: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  longestStreak: number;
  weeklyActivity: Array<{
    day: string;
    date: string;
    active: boolean;
  }>;
  ageGroup?: string;
  learningGoals: string[];
  onboardingCompleted: boolean;
  notificationPreferences: {
    dailyReminders: boolean;
    streakAlerts: boolean;
    weeklyReport: boolean;
  };
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: SkillCategory | 'general';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'daily' | 'streak' | 'achievement' | 'skill';
  targetChallengeId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface OnboardingAssessmentQuestion {
  id: string;
  category: SkillCategory;
  title: string;
  scenario: string;
  options: Array<{
    id: string;
    label: string;
    description: string;
    skillImpacts: Partial<Record<SkillCategory, number>>;
  }>;
}

export interface NavigationTab {
  id: 'home' | 'challenges' | 'skills' | 'progress' | 'profile';
  label: string;
}

// ----------------------------------------------------------------------------
// API & Generic Contracts
// ----------------------------------------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  ageGroup?: string;
  learningGoals?: string[];
}

export interface ResetPasswordPayload {
  email: string;
  token?: string;
  newPassword?: string;
}

export interface SubmitChallengePayload {
  challengeId: string;
  selectedOptionId: OptionId;
  writtenResponse?: string;
}
