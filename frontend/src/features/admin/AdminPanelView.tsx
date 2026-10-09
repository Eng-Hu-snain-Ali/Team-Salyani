import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminMetricsView } from './AdminMetricsView';
import { AdminUstadManagementView } from './AdminUstadManagementView';
import { AdminServiceManagementView } from './AdminServiceManagementView';
import { AdminBookingsView } from './AdminBookingsView';
import { AdminCommissionView } from './AdminCommissionView';
import { AdminComplaintsView } from './AdminComplaintsView';
import {
  LayoutDashboard,
  Users,
  Wrench,
  CalendarCheck,
  Percent,
  ShieldAlert,
} from 'lucide-react';
import type { AdminTabId } from '../../types';

export const AdminPanelView: React.FC = () => {
  const { adminTab, setAdminTab, complaints } = useApp();

  const openComplaintsCount = complaints.filter(
    (c) => c.status === 'open' || c.status === 'investigating'
  ).length;

  const renderActiveTab = () => {
    switch (adminTab) {
      case 'overview':
        return <AdminMetricsView />;
      case 'ustads':
        return <AdminUstadManagementView />;
      case 'services':
        return <AdminServiceManagementView />;
      case 'bookings':
        return <AdminBookingsView />;
      case 'commission':
        return <AdminCommissionView />;
      case 'complaints':
        return <AdminComplaintsView />;
      default:
        return <AdminMetricsView />;
    }
  };

  const navItems: Array<{ id: AdminTabId; label: string; icon: any; badge?: number }> = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'ustads', label: 'Ustads Verification', icon: Users },
    { id: 'services', label: 'Rate Card & Pricing', icon: Wrench },
    { id: 'bookings', label: 'Bookings Ledger', icon: CalendarCheck },
    { id: 'commission', label: 'Commission Engine (10%)', icon: Percent },
    {
      id: 'complaints',
      label: 'Complaints & Broadcasts',
      icon: ShieldAlert,
      badge: openComplaintsCount > 0 ? openComplaintsCount : undefined,
    },
  ];

  return (
    <div className="admin-panel-layout">
      {/* Desktop Admin Secondary Nav Bar */}
      <div className="admin-secondary-nav">
        <div className="admin-nav-inner">
          <div className="admin-nav-brand-title">
            <span className="brand-dot" />
            <span>Faisalabad Operations Console</span>
          </div>

          <div className="admin-nav-tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`admin-nav-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setAdminTab(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.badge && <span className="tab-badge">{item.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Admin View Container */}
      <div className="admin-viewport-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};
