import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';

// Customer Views
import { CustomerHomeView } from './features/customer/CustomerHomeView';
import { ServicesRateCardView } from './features/customer/ServicesRateCardView';
import { NearbyUstadsView } from './features/customer/NearbyUstadsView';
import { BookingsListView } from './features/customer/BookingsListView';
import { ProfileView } from './features/profile/ProfileView';

// Customer & Global Modals
import { CreateBookingModal } from './features/customer/CreateBookingModal';
import { BookingTrackingModal } from './features/customer/BookingTrackingModal';
import { CommunicationModal } from './features/customer/CommunicationModal';
import { PaymentModal } from './features/customer/PaymentModal';
import { ReviewComplaintModal } from './features/customer/ReviewComplaintModal';

// Ustad Views & Modals
import { UstadPortalView } from './features/ustad/UstadPortalView';
import { UstadRegistrationModal } from './features/ustad/UstadRegistrationModal';

// Admin Views
import { AdminPanelView } from './features/admin/AdminPanelView';

// Auth & Shared Overlays
import { AuthModal } from './features/auth/AuthModal';
import { SplashScreen } from './features/auth/SplashScreen';
import { NotificationDrawer } from './features/notifications/NotificationDrawer';

const MainAppLayout: React.FC = () => {
  const { activeRole, customerTab } = useApp();

  const renderActiveScreen = () => {
    // 1. USTAD MECHANIC PORTAL
    if (activeRole === 'ustad') {
      return <UstadPortalView />;
    }

    // 2. ADMIN WEB PANEL
    if (activeRole === 'admin') {
      return <AdminPanelView />;
    }

    // 3. CUSTOMER APPLICATION
    switch (customerTab) {
      case 'home':
        return <CustomerHomeView />;
      case 'services':
        return <ServicesRateCardView />;
      case 'ustads':
        return <NearbyUstadsView />;
      case 'bookings':
        return <BookingsListView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <CustomerHomeView />;
    }
  };

  return (
    <div className={`ustad-app-shell mode-${activeRole}`}>
      {/* Top Universal Header with Role Switcher & Faisalabad Area Selector */}
      <Header />

      {/* Main Responsive Viewport */}
      <main className="ustad-main-viewport" id="main-content">
        <div className={`ustad-viewport-limiter ${activeRole === 'admin' ? 'admin-wide' : ''}`}>
          {renderActiveScreen()}
        </div>
      </main>

      {/* Responsive Bottom Navigation */}
      <BottomNav />

      {/* Global Interactive Modals & Simulation Overlays */}
      <SplashScreen />
      <NotificationDrawer />
      <AuthModal />
      <CreateBookingModal />
      <BookingTrackingModal />
      <CommunicationModal />
      <PaymentModal />
      <ReviewComplaintModal />
      <UstadRegistrationModal />
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
