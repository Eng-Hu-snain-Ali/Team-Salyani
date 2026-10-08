import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  User,
  Experience,
  Notification,
  ExperienceCategory,
  CreateExperiencePayload,
} from '../types';
import {
  authService,
  experienceService,
  notificationService,
  userService,
} from '../services/api';
import confetti from 'canvas-confetti';

export type NavigationTab = 'home' | 'explore' | 'create' | 'saved' | 'profile' | 'detail' | 'video';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedExperienceId: string | null;
  openExperience: (id: string) => void;
  goBack: () => void;

  // Exploration filters passed from Home
  exploreSearchQuery: string;
  setExploreSearchQuery: (q: string) => void;
  exploreSelectedCategory: ExperienceCategory | 'All';
  setExploreSelectedCategory: (cat: ExperienceCategory | 'All') => void;

  // User State
  user: User;
  updateUser: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: (interests: ExperienceCategory[], goal?: string) => Promise<void>;

  // Experiences & Engagement
  experiences: Experience[];
  savedExperiences: Experience[];
  isLoadingExperiences: boolean;
  refreshExperiences: () => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  toggleSave: (id: string) => Promise<void>;
  markHelpful: (id: string, vote: 'yes' | 'no') => Promise<void>;
  publishExperience: (payload: CreateExperiencePayload) => Promise<Experience>;

  // Notifications
  notifications: Notification[];
  unreadNotifsCount: number;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;

  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme State (defaults to dark or saved preference)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('lived_theme');
      return (saved as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('lived_theme', theme);
    } catch {
      // safe fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. User State
  const [user, setUser] = useState<User>({
    id: 'usr_me_01',
    name: 'Alex Chen',
    username: 'alexchen_dev',
    email: 'alex.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Software engineer & curious learner. Sharing what university never taught me about career transitions and saving money.',
    location: 'San Francisco, CA',
    role: 'Frontend Engineer',
    interests: ['Career', 'Technology', 'Money', 'Personal Growth'],
    currentGoal: 'Land my first senior engineering role & invest consistently without burnout.',
    followersCount: 342,
    followingCount: 189,
    experiencesCount: 4,
    helpfulCount: 890,
    onboardingCompleted: true,
    createdAt: '2026-01-15T08:00:00Z',
  });

  // 3. Navigation State
  const [activeTab, setActiveTabState] = useState<NavigationTab>('home');
  const [historyStack, setHistoryStack] = useState<NavigationTab[]>(['home']);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);

  const setActiveTab = (tab: NavigationTab) => {
    setHistoryStack((prev) => [...prev, tab]);
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop(); // Remove current
      const previous = newStack[newStack.length - 1] || 'home';
      setHistoryStack(newStack);
      setActiveTabState(previous);
    } else {
      setActiveTabState('home');
    }
  };

  const openExperience = (id: string) => {
    const target = experiences.find((e) => e.id === id);
    setSelectedExperienceId(id);
    if (target?.contentType === 'video') {
      setActiveTab('video');
    } else {
      setActiveTab('detail');
    }
  };

  // 4. Explore Filters passing
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');
  const [exploreSelectedCategory, setExploreSelectedCategory] = useState<ExperienceCategory | 'All'>('All');

  // 5. Experiences State
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [savedExperiences, setSavedExperiences] = useState<Experience[]>([]);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);

  // 6. Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // 7. Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // 8. Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize data from API services
  const refreshExperiences = useCallback(async () => {
    try {
      setIsLoadingExperiences(true);
      const [expRes, savedRes, notifRes, userRes] = await Promise.all([
        experienceService.getExperiences({}),
        experienceService.getSavedExperiences(),
        notificationService.getNotifications(),
        authService.getMe(),
      ]);

      if (expRes.data) setExperiences(expRes.data);
      if (savedRes.data) setSavedExperiences(savedRes.data);
      if (notifRes.data) setNotifications(notifRes.data);
      if (userRes.data) setUser(userRes.data);
    } catch {
      showToast('Error syncing with data service', 'error');
    } finally {
      setIsLoadingExperiences(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshExperiences();
  }, [refreshExperiences]);

  // Engagement Actions
  const toggleLike = async (id: string) => {
    try {
      const res = await experienceService.toggleLike(id);
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, isLiked: res.data.isLiked, likesCount: res.data.likesCount } : e
        )
      );
      showToast(res.data.isLiked ? 'Added to liked experiences' : 'Removed from likes', 'info');
    } catch {
      showToast('Could not update like', 'error');
    }
  };

  const toggleSave = async (id: string) => {
    try {
      const res = await experienceService.toggleSave(id);
      setExperiences((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isSaved: res.data.isSaved } : e))
      );
      const savedRes = await experienceService.getSavedExperiences();
      if (savedRes.data) setSavedExperiences(savedRes.data);

      showToast(
        res.data.isSaved ? 'Saved to your reading vault' : 'Removed from saved experiences',
        'success'
      );
    } catch {
      showToast('Could not save experience', 'error');
    }
  };

  const markHelpful = async (id: string, vote: 'yes' | 'no') => {
    try {
      const res = await experienceService.markHelpful(id, vote);
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                helpfulCount: res.data.helpfulCount,
                notHelpfulCount: res.data.notHelpfulCount,
                userHelpfulVote: e.userHelpfulVote === vote ? null : vote,
              }
            : e
        )
      );
      if (vote === 'yes') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366F1', '#10B981', '#F59E0B'],
        });
        showToast('Thank you! Your feedback helps others find proven lessons.', 'success');
      } else {
        showToast('Feedback noted. We will adjust recommendations.', 'info');
      }
    } catch {
      showToast('Could not submit feedback', 'error');
    }
  };

  const publishExperience = async (payload: CreateExperiencePayload): Promise<Experience> => {
    const res = await experienceService.createExperience(payload);
    await refreshExperiences();

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#A855F7', '#EC4899', '#10B981'],
    });

    showToast('Your experience is live! Thank you for sharing real wisdom.', 'success');
    return res.data;
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const res = await userService.updateProfile(user.id, updates);
      setUser(res.data);
      showToast('Profile updated successfully', 'success');
    } catch {
      showToast('Could not update profile', 'error');
    }
  };

  const completeOnboarding = async (interests: ExperienceCategory[], goal?: string) => {
    try {
      const res = await userService.saveOnboarding(interests, goal);
      setUser(res.data);
      setIsOnboardingModalOpen(false);
      showToast('Welcome to Lived! Your personalized experience feed is ready.', 'success');
    } catch {
      showToast('Could not save onboarding preferences', 'error');
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
        selectedExperienceId,
        openExperience,
        goBack,
        exploreSearchQuery,
        setExploreSearchQuery,
        exploreSelectedCategory,
        setExploreSelectedCategory,
        user,
        updateUser,
        completeOnboarding,
        experiences,
        savedExperiences,
        isLoadingExperiences,
        refreshExperiences,
        toggleLike,
        toggleSave,
        markHelpful,
        publishExperience,
        notifications,
        unreadNotifsCount,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationRead,
        markAllNotificationsRead,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        toasts,
        showToast,
        dismissToast,
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
