import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  User,
  SkillData,
  Challenge,
  Achievement,
  NotificationItem,
  SkillCategory,
  OptionId,
  ChallengeAttemptResult,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types';
import {
  authService,
  challengeService,
  skillService,
  userService,
  notificationService,
} from '../services/api';
import {
  INITIAL_USER,
  INITIAL_SKILLS,
  INITIAL_CHALLENGES,
  INITIAL_ACHIEVEMENTS,
} from '../data/mockData';
import confetti from 'canvas-confetti';

export type TabId = 'home' | 'challenges' | 'skills' | 'progress' | 'profile';

export type AuthModalMode = 'welcome' | 'login' | 'register' | 'forgot' | 'reset';

export interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedSkillId: SkillCategory | null;
  setSelectedSkillId: (id: SkillCategory | null) => void;

  // User & Authentication
  user: User;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: (ageGroup: string, goals: string[], initialBoosts?: Partial<Record<SkillCategory, number>>) => Promise<void>;
  loginUser: (payload: LoginPayload) => Promise<boolean>;
  registerUser: (payload: RegisterPayload) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>;
  logoutUser: () => Promise<void>;

  // Modals & Overlays
  isSplashOpen: boolean;
  setIsSplashOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Challenge Flow / Player
  selectedChallenge: Challenge | null;
  openChallengePlayer: (challenge: Challenge) => void;
  closeChallengePlayer: () => void;
  submitChallengeDecision: (challengeId: string, optionId: OptionId, writtenResponse?: string) => Promise<ChallengeAttemptResult>;

  // Data Collections
  skills: SkillData[];
  challenges: Challenge[];
  dailyChallenge: Challenge | null;
  achievements: Achievement[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Global Toast Stack
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Quick Action
  launchDailyChallenge: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ustad_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ustad_theme', theme);
    } catch {
      // Safe fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Navigation
  const [activeTab, setActiveTabState] = useState<TabId>('home');
  const [selectedSkillId, setSelectedSkillId] = useState<SkillCategory | null>(null);

  const setActiveTab = (tab: TabId) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. User & Auth State
  const [user, setUser] = useState<User>({ ...INITIAL_USER });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // 4. Modals State
  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('welcome');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // 5. Active Challenge Player
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const openChallengePlayer = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const closeChallengePlayer = () => {
    setSelectedChallenge(null);
  };

  const openAuthModal = (mode: AuthModalMode = 'welcome') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // 6. Data Stores
  const [skills, setSkills] = useState<SkillData[]>([...INITIAL_SKILLS]);
  const [challenges, setChallenges] = useState<Challenge[]>([...INITIAL_CHALLENGES]);
  const [achievements, setAchievements] = useState<Achievement[]>([...INITIAL_ACHIEVEMENTS]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // 7. Toast Notifications
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Sync
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [userRes, skillRes, chalRes, notifRes] = await Promise.all([
          userService.getCurrentUser(),
          skillService.getSkills(),
          challengeService.getChallenges(),
          notificationService.getNotifications(),
        ]);
        if (userRes.data) setUser(userRes.data);
        if (skillRes.data) setSkills(skillRes.data);
        if (chalRes.data) setChallenges(chalRes.data);
        if (notifRes.data) setNotifications(notifRes.data);
      } catch {
        // Mock fallback active
      }
    };
    loadInitialData();
  }, []);

  // Daily Challenge Computed
  const dailyChallenge = challenges.find((c) => c.isDaily) || challenges[0] || null;

  const launchDailyChallenge = () => {
    if (dailyChallenge) {
      openChallengePlayer(dailyChallenge);
    }
  };

  // Challenge Decision Evaluation
  const submitChallengeDecision = async (
    challengeId: string,
    optionId: OptionId,
    writtenResponse?: string
  ): Promise<ChallengeAttemptResult> => {
    const targetChallenge = challenges.find((c) => c.id === challengeId);
    if (!targetChallenge) throw new Error('Challenge not found');

    const selectedOption = targetChallenge.options.find((o) => o.id === optionId);
    if (!selectedOption) throw new Error('Option not found');

    const skillId = selectedOption.skillImpact.skill;
    const delta = selectedOption.skillImpact.delta;
    const xpReward = targetChallenge.xpReward;

    // 1. Update skill score
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          const newScore = Math.min(100, Math.max(0, s.score + delta));
          return {
            ...s,
            score: newScore,
            history: [
              {
                date: 'Just now',
                delta,
                challengeTitle: targetChallenge.title,
              },
              ...s.history,
            ],
          };
        }
        return s;
      })
    );

    // 2. Update user XP and level
    const newTotalXp = user.xp + xpReward;
    let newLevel = user.currentLevel;
    let nextLevelXp = user.nextLevelXp;

    if (newTotalXp >= nextLevelXp) {
      newLevel += 1;
      nextLevelXp += 300;
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#2563EB', '#16A34A', '#F59E0B', '#7C3AED'],
      });
      showToast(`Level Up! You reached Level ${newLevel}! 🎉`, 'success');
    }

    const updatedUser: User = {
      ...user,
      xp: newTotalXp,
      currentLevel: newLevel,
      nextLevelXp: nextLevelXp,
    };
    setUser(updatedUser);

    // 3. Mark challenge completed
    const completedAt = new Date().toISOString();
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              completed: true,
              completedAt,
              userChoiceId: optionId,
              userWrittenResponse: writtenResponse,
            }
          : c
      )
    );

    // 4. Update achievements progress
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'ach_first_step' && !ach.unlocked) {
          return { ...ach, unlocked: true, progress: 1, unlockedAt: completedAt };
        }
        if (ach.id === 'ach_level_5') {
          return {
            ...ach,
            progress: newTotalXp,
            unlocked: newTotalXp >= ach.maxProgress,
          };
        }
        if (ach.category === skillId && !ach.unlocked && selectedOption.isOptimal) {
          const nextProg = Math.min(ach.maxProgress, ach.progress + 1);
          return {
            ...ach,
            progress: nextProg,
            unlocked: nextProg >= ach.maxProgress,
            unlockedAt: nextProg >= ach.maxProgress ? completedAt : undefined,
          };
        }
        return ach;
      })
    );

    // Confetti effect on optimal answer
    if (selectedOption.isOptimal) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#16A34A'],
      });
    }

    const result: ChallengeAttemptResult = {
      challengeId,
      selectedOption,
      writtenResponse,
      xpEarned: xpReward,
      skillDelta: selectedOption.skillImpact,
      newSkillScore: 70,
      newTotalXp,
      newLevel,
      completedAt,
    };

    return result;
  };

  // Auth operations
  const loginUser = async (payload: LoginPayload): Promise<boolean> => {
    try {
      const res = await authService.login(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return true;
      }
      showToast(res.message || 'Login failed', 'error');
      return false;
    } catch {
      showToast('Authentication error', 'error');
      return false;
    }
  };

  const registerUser = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      const res = await authService.register(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        setIsOnboardingModalOpen(true);
        showToast('Registration successful! Welcome to USTAD ONLINE.', 'success');
        return true;
      }
      showToast(res.message || 'Registration failed', 'error');
      return false;
    } catch {
      showToast('Registration service error', 'error');
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await authService.forgotPassword(email);
      showToast(res.message || 'Password reset link sent', 'success');
      return true;
    } catch {
      showToast('Could not send reset link', 'error');
      return false;
    }
  };

  const resetPassword = async (payload: ResetPasswordPayload): Promise<boolean> => {
    try {
      const res = await authService.resetPassword(payload);
      showToast(res.message || 'Password reset successfully', 'success');
      setAuthModalMode('login');
      return true;
    } catch {
      showToast('Could not reset password', 'error');
      return false;
    }
  };

  const logoutUser = async (): Promise<void> => {
    await authService.logout();
    setIsAuthenticated(false);
    showToast('Signed out of USTAD ONLINE.', 'info');
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const res = await userService.updateProfile(updates);
      setUser(res.data);
      showToast('Profile updated successfully', 'success');
    } catch {
      showToast('Could not update profile', 'error');
    }
  };

  const completeOnboarding = async (
    ageGroup: string,
    goals: string[],
    initialBoosts?: Partial<Record<SkillCategory, number>>
  ) => {
    try {
      const res = await userService.saveOnboarding(ageGroup, goals);
      setUser(res.data);

      if (initialBoosts) {
        setSkills((prev) =>
          prev.map((s) => {
            const boost = initialBoosts[s.id] || 0;
            return {
              ...s,
              score: Math.min(100, Math.max(20, s.score + boost)),
            };
          })
        );
      }

      setIsOnboardingModalOpen(false);
      showToast('Welcome aboard! Your personalized skill profile is ready.', 'success');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#16A34A', '#7C3AED'],
      });
    } catch {
      showToast('Could not finalize onboarding', 'error');
    }
  };

  const markNotificationRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedSkillId,
        setSelectedSkillId,
        user,
        isAuthenticated,
        updateUser,
        completeOnboarding,
        loginUser,
        registerUser,
        forgotPassword,
        resetPassword,
        logoutUser,
        isSplashOpen,
        setIsSplashOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        selectedChallenge,
        openChallengePlayer,
        closeChallengePlayer,
        submitChallengeDecision,
        skills,
        challenges,
        dailyChallenge,
        achievements,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        dismissToast,
        launchDailyChallenge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
