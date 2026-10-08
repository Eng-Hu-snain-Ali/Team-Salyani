import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { HomeView } from './features/home/HomeView';
import { ChallengesView } from './features/challenges/ChallengesView';
import { SkillsView } from './features/skills/SkillsView';
import { ProgressView } from './features/progress/ProgressView';
import { ProfileView } from './features/profile/ProfileView';
import { AuthModal } from './features/auth/AuthModal';
import { OnboardingModal } from './features/auth/OnboardingModal';
import { SplashScreen } from './features/auth/SplashScreen';
import { NotificationDrawer } from './features/notifications/NotificationDrawer';
import { ChallengePlayerModal } from './features/challenges/ChallengePlayerModal';

const MainAppLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'challenges':
        return <ChallengesView />;
      case 'skills':
        return <SkillsView />;
      case 'progress':
        return <ProgressView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="ustad-app-shell">
      {/* Top Universal Header */}
      <Header />

      {/* Main Responsive Viewport */}
      <main className="ustad-main-viewport" id="main-content">
        <div className="ustad-viewport-limiter">
          {renderActiveScreen()}
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />

      {/* Global Interactive Modals & Overlays */}
      <SplashScreen />
      <NotificationDrawer />
      <AuthModal />
      <OnboardingModal />
      <ChallengePlayerModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
};

export default App;
