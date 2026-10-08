export type AgeGroup = 'teen' | 'young_adult' | 'adult';

export interface UserGoal {
  id: string;
  key: string;
  label: string;
  description: string;
  icon: string;
  priority: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  ageGroup: AgeGroup;
  goals: string[]; // goal keys
  onboardingCompleted: boolean;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  avatarUrl?: string;
  bio?: string;
}

export type ModuleKey = 
  | 'decision_making' 
  | 'money_management' 
  | 'time_management' 
  | 'communication' 
  | 'problem_solving';

export interface ModuleInfo {
  id: string;
  key: ModuleKey;
  name: string;
  tagline: string;
  description: string;
  color: string;
  secondaryColor: string;
  bgGradient: string;
  icon: string;
  active: boolean;
}

export interface Skill {
  id: string;
  key: string;
  moduleId: string;
  moduleKey: ModuleKey;
  name: string;
  description: string;
  currentScore: number; // 0-100
  level: number; // 1-10
}

export interface ScenarioOption {
  id: string;
  label: string; // A, B, C, D
  text: string;
  consequence: string;
  feedback: string;
  skillScores: Record<string, number>; // skill_id -> score delta (-10 to +25)
  xpAward: number;
  isOptimal?: boolean;
}

export interface Scenario {
  id: string;
  moduleId: string;
  moduleKey: ModuleKey;
  title: string;
  summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageMin: number;
  ageMax: number;
  estimatedMinutes: number;
  context: string;
  dilemma: string;
  options: ScenarioOption[];
  tags: string[];
  isDailyChallenge?: boolean;
  recommendationReason?: string;
}

export interface AIEvaluationResult {
  overallScore: number; // 0-100
  skillScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  consequenceExplanation: string;
  nextAction: string;
  retryAvailable: boolean;
  xpAwarded: number;
}

export interface Attempt {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  moduleKey: ModuleKey;
  userId: string;
  timestamp: string;
  responseType: 'choice' | 'text';
  selectedOptionId?: string;
  openTextResponse?: string;
  score: number;
  xpEarned: number;
  consequenceSummary: string;
  feedbackSummary: string;
  status: 'completed' | 'in_progress';
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  moduleKey?: ModuleKey;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export interface MentorExperience {
  id: string;
  authorName: string;
  authorRole: string; // e.g. "Founder, Logistics Co ($500k ARR)"
  authorAvatar: string;
  businessType: string;
  title: string;
  category: 'business_launch' | 'costly_mistake' | 'sales_negotiation' | 'mindset_shift' | 'growth_hack';
  summary: string;
  fullStory: string;
  lessonLearned: string;
  keyTakeaways: string[];
  relatedScenarioId?: string;
  likes: number;
  readMinutes: number;
  date: string;
  verifiedMentor: boolean;
}

export interface BusinessIdea {
  id: string;
  title: string;
  category: 'zero_capital' | 'digital_service' | 'local_arbitrage' | 'high_margin';
  tagline: string;
  description: string;
  targetAudience: string;
  startingBudget: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  potentialRevenue: string;
  executionSteps: string[];
  mentorAdvice: string;
  skillsNeeded: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'streak' | 'achievement' | 'challenge' | 'system';
}

export type NavigationTab = 
  | 'home' 
  | 'feed'
  | 'ideas'
  | 'challenges' 
  | 'scenario' 
  | 'skills' 
  | 'progress' 
  | 'profile';
