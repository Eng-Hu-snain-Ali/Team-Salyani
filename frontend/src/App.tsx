import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { UnlockModal } from './components/common/UnlockModal';
import { HomeDashboard } from './components/home/HomeDashboard';
import { ScenarioPlayer } from './components/scenario/ScenarioPlayer';
import { ChallengesExplorer } from './components/challenges/ChallengesExplorer';
import { SkillsAnalytics } from './components/skills/SkillsAnalytics';
import { ProgressView } from './components/progress/ProgressView';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ExperienceFeed } from './components/feed/ExperienceFeed';
import { IdeaVault } from './components/ideas/IdeaVault';

const MainAppLayout: React.FC = () => {
  const { user, activeTab } = useApp();

  // If user hasn't completed onboarding, show onboarding
  if (!user.onboardingCompleted) {
    return (
      <div className="app-viewport-wrapper">
        <Header />
        <main className="main-content-area">
          <OnboardingFlow />
        </main>
        <UnlockModal />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'feed':
        return <ExperienceFeed />;
      case 'ideas':
        return <IdeaVault />;
      case 'challenges':
        return <ChallengesExplorer />;
      case 'scenario':
        return <ScenarioPlayer />;
      case 'skills':
        return <SkillsAnalytics />;
      case 'progress':
        return <ProgressView />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="app-viewport-wrapper">
      <Header />
      <main className="main-content-area">
        {renderActiveScreen()}
      </main>
      <BottomNav />
      <UnlockModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}

export default App;
