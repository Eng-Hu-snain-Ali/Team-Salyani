import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Wrench,
  Users,
  CalendarCheck,
  User,
  LayoutDashboard,
  Inbox,
  Activity,
  Wallet,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import type { CustomerTabId, UstadTabId, AdminTabId } from '../../types';

export const BottomNav: React.FC = () => {
  const {
    activeRole,
    customerTab,
    setCustomerTab,
    ustadTab,
    setUstadTab,
    adminTab,
    setAdminTab,
    bookings,
    complaints,
  } = useApp();

  // Active bookings count for customer
  const activeCustomerBookings = bookings.filter(
    (b) => b.status === 'on_the_way' || b.status === 'in_progress' || b.status === 'accepted'
  ).length;

  // Pending requests count for Ustad
  const pendingUstadRequests = bookings.filter((b) => b.status === 'pending').length;

  // Open complaints for admin
  const openComplaintsCount = complaints.filter(
    (c) => c.status === 'open' || c.status === 'investigating'
  ).length;

  if (activeRole === 'customer') {
    const items: Array<{ id: CustomerTabId; label: string; icon: any; badge?: number }> = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'services', label: 'Rate Card', icon: Wrench },
      { id: 'ustads', label: 'Nearby Ustads', icon: Users },
      {
        id: 'bookings',
        label: 'Bookings',
        icon: CalendarCheck,
        badge: activeCustomerBookings > 0 ? activeCustomerBookings : undefined,
      },
      { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
      <nav className="ustad-bottom-nav">
        <div className="bottom-nav-inner">
          {items.map((tab) => {
            const Icon = tab.icon;
            const isActive = customerTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-button ${isActive ? 'active' : ''}`}
                onClick={() => setCustomerTab(tab.id)}
              >
                <div className="nav-icon-wrapper">
                  <Icon size={20} />
                  {tab.badge && <span className="nav-count-badge">{tab.badge}</span>}
                </div>
                <span className="nav-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  if (activeRole === 'ustad') {
    const items: Array<{ id: UstadTabId; label: string; icon: any; badge?: number }> = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      {
        id: 'requests',
        label: 'Requests',
        icon: Inbox,
        badge: pendingUstadRequests > 0 ? pendingUstadRequests : undefined,
      },
      { id: 'active_jobs', label: 'Active Jobs', icon: Activity },
      { id: 'wallet', label: 'Earnings', icon: Wallet },
      { id: 'profile', label: 'My Profile', icon: User },
    ];

    return (
      <nav className="ustad-bottom-nav ustad-mechanic-nav">
        <div className="bottom-nav-inner">
          {items.map((tab) => {
            const Icon = tab.icon;
            const isActive = ustadTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-button ${isActive ? 'active' : ''}`}
                onClick={() => setUstadTab(tab.id)}
              >
                <div className="nav-icon-wrapper">
                  <Icon size={20} />
                  {tab.badge && <span className="nav-count-badge ustad-badge">{tab.badge}</span>}
                </div>
                <span className="nav-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Admin Bottom Nav (for mobile / tablet view)
  const adminItems: Array<{ id: AdminTabId; label: string; icon: any; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'ustads', label: 'Ustads', icon: Users },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'commission', label: 'Commission', icon: Percent },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: ShieldAlert,
      badge: openComplaintsCount > 0 ? openComplaintsCount : undefined,
    },
  ];

  return (
    <nav className="ustad-bottom-nav admin-bottom-nav">
      <div className="bottom-nav-inner">
        {adminItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setAdminTab(tab.id)}
            >
              <div className="nav-icon-wrapper">
                <Icon size={20} />
                {tab.badge && <span className="nav-count-badge admin-badge">{tab.badge}</span>}
              </div>
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
