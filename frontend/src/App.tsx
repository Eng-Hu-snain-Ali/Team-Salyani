import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { HomeView } from './features/home/HomeView';
import { ExploreView } from './features/explore/ExploreView';
import { CreateExperienceView } from './features/create/CreateExperienceView';
import { SavedView } from './features/saved/SavedView';
import { ProfileView } from './features/profile/ProfileView';
import { ExperienceDetailView } from './features/experiences/ExperienceDetailView';
import { VideoExperienceView } from './features/experiences/VideoExperienceView';
import { NotificationDrawer } from './features/notifications/NotificationDrawer';
import { AuthModal } from './features/auth/AuthModal';
import { OnboardingModal } from './features/auth/OnboardingModal';

const MainAppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'create':
        return <CreateExperienceView />;
      case 'saved':
        return <SavedView />;
      case 'profile':
        return <ProfileView />;
      case 'detail':
        return <ExperienceDetailView />;
      case 'video':
        return <VideoExperienceView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="lived-app-shell">
      {/* Universal Fixed Header */}
      <Header />

      {/* Main Responsive Viewport */}
      <main className="lived-main-viewport" id="main-content">
        <div className="lived-viewport-limiter">
          {renderCurrentScreen()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Global Drawers & Modals */}
      <NotificationDrawer />
      <AuthModal />
      <OnboardingModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
};

export default App;
