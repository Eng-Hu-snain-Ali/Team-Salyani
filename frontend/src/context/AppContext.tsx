import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  User,
  Experience,
  Notification,
  ExperienceCategory,
  CreateExperiencePayload,
  ExploreVideo,
  ExploreIdea,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types';
import {
  authService,
  experienceService,
  notificationService,
  userService,
} from '../services/api';
import { TEAM_PROFILE } from '../data/mockData';
import confetti from 'canvas-confetti';

export type NavigationTab = 'home' | 'explore' | 'create' | 'saved' | 'profile' | 'detail' | 'video';

export type AuthModalMode = 'welcome' | 'login' | 'register' | 'forgot' | 'reset';

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

  // Exploration filters passed from Home & Explore
  exploreSearchQuery: string;
  setExploreSearchQuery: (q: string) => void;
  exploreSelectedCategory: ExperienceCategory | 'All';
  setExploreSelectedCategory: (cat: ExperienceCategory | 'All') => void;

  // User & Authentication State
  user: User;
  isAuthenticated: boolean;
  profileViewMode: 'team' | 'user';
  setProfileViewMode: (mode: 'team' | 'user') => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: (interests: ExperienceCategory[], goal?: string) => Promise<void>;
  loginUser: (payload: LoginPayload) => Promise<boolean>;
  registerUser: (payload: RegisterPayload) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>;
  logoutUser: () => Promise<void>;

  // Splash Screen State
  isSplashOpen: boolean;
  setIsSplashOpen: (open: boolean) => void;

  // Modals & Auth Mode
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;

  // Video & Idea Detail Modals
  selectedVideo: ExploreVideo | null;
  openVideoDetail: (video: ExploreVideo) => void;
  closeVideoDetail: () => void;
  selectedIdea: ExploreIdea | null;
  openIdeaDetail: (idea: ExploreIdea) => void;
  closeIdeaDetail: () => void;

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

  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme State
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

  // 2. User & Auth State (The default/demo profile is The Team)
  const [user, setUser] = useState<User>({ ...TEAM_PROFILE });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profileViewMode, setProfileViewMode] = useState<'team' | 'user'>('team');

  // 3. Splash Screen state
  const [isSplashOpen, setIsSplashOpen] = useState(false);

  // 4. Navigation State
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
      newStack.pop();
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

  // 5. Explore Filters
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');
  const [exploreSelectedCategory, setExploreSelectedCategory] = useState<ExperienceCategory | 'All'>('All');

  // 6. Experiences State
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [savedExperiences, setSavedExperiences] = useState<Experience[]>([]);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);

  // 7. Curated Video & Idea Details
  const [selectedVideo, setSelectedVideo] = useState<ExploreVideo | null>(null);
  const openVideoDetail = (video: ExploreVideo) => setSelectedVideo(video);
  const closeVideoDetail = () => setSelectedVideo(null);

  const [selectedIdea, setSelectedIdea] = useState<ExploreIdea | null>(null);
  const openIdeaDetail = (idea: ExploreIdea) => setSelectedIdea(idea);
  const closeIdeaDetail = () => setSelectedIdea(null);

  // 8. Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // 9. Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('welcome');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const openAuthModal = (mode: AuthModalMode = 'welcome') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // 10. Toasts
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

  // Sync initial data from services
  const refreshExperiences = useCallback(async () => {
    try {
      setIsLoadingExperiences(true);
      const [expRes, savedRes, notifRes] = await Promise.all([
        experienceService.getExperiences({}),
        experienceService.getSavedExperiences(),
        notificationService.getNotifications(),
      ]);

      if (expRes.data) setExperiences(expRes.data);
      if (savedRes.data) setSavedExperiences(savedRes.data);
      if (notifRes.data) setNotifications(notifRes.data);
    } catch {
      showToast('Error syncing with experience service', 'error');
    } finally {
      setIsLoadingExperiences(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshExperiences();
  }, [refreshExperiences]);

  // Auth Operations
  const loginUser = async (payload: LoginPayload): Promise<boolean> => {
    try {
      const res = await authService.login(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setProfileViewMode('user');
        setIsAuthModalOpen(false);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return true;
      }
      showToast(res.message || 'Login failed. Please check credentials.', 'error');
      return false;
    } catch {
      showToast('Authentication service error.', 'error');
      return false;
    }
  };

  const registerUser = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      const res = await authService.register(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setProfileViewMode('user');
        setIsAuthModalOpen(false);
        setIsOnboardingModalOpen(true);
        showToast('Registration successful! Customize your learning interests.', 'success');
        return true;
      }
      showToast(res.message || 'Registration failed.', 'error');
      return false;
    } catch {
      showToast('Registration service error.', 'error');
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await authService.forgotPassword(email);
      showToast(res.message || 'Reset link sent.', 'success');
      return true;
    } catch {
      showToast('Could not process password reset.', 'error');
      return false;
    }
  };

  const resetPassword = async (payload: ResetPasswordPayload): Promise<boolean> => {
    try {
      const res = await authService.resetPassword(payload);
      showToast(res.message || 'Password reset successfully.', 'success');
      setAuthModalMode('login');
      return true;
    } catch {
      showToast('Could not reset password.', 'error');
      return false;
    }
  };

  const logoutUser = async (): Promise<void> => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser({ ...TEAM_PROFILE });
    setProfileViewMode('team');
    showToast('Logged out. Viewing The Team profile.', 'info');
  };

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
        res.data.isSaved ? 'Saved to reading vault' : 'Removed from saved experiences',
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
    const authorData = isAuthenticated
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          role: user.role || 'Community Contributor',
        }
      : {
          id: TEAM_PROFILE.id,
          name: TEAM_PROFILE.name,
          username: TEAM_PROFILE.username,
          avatar: TEAM_PROFILE.avatar,
          role: TEAM_PROFILE.role,
        };

    const res = await experienceService.createExperience(payload, authorData);
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
        isAuthenticated,
        profileViewMode,
        setProfileViewMode,
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
        selectedVideo,
        openVideoDetail,
        closeVideoDetail,
        selectedIdea,
        openIdeaDetail,
        closeIdeaDetail,
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
