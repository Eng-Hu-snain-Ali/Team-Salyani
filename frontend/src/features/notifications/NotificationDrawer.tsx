import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  Bell,
  Sparkles,
  Flame,
  Award,
  CheckCheck,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationRead,
    markAllNotificationsRead,
    openChallengePlayer,
    challenges,
  } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Sparkles size={16} color="var(--color-primary)" />;
      case 'streak':
        return <Flame size={16} color="var(--color-warning)" fill="currentColor" />;
      case 'achievement':
        return <Award size={16} color="var(--color-success)" />;
      default:
        return <TrendingUp size={16} color="var(--color-purple)" />;
    }
  };

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.targetChallengeId) {
      const target = challenges.find((c) => c.id === item.targetChallengeId);
      if (target) {
        setIsNotificationsOpen(false);
        openChallengePlayer(target);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Modal
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Notifications & Activity"
      subtitle={`${unreadCount} unread learning updates`}
      maxWidth="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Daily scenarios, streak alerts & achievements
          </span>
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: '0.78rem', color: 'var(--color-primary)' }}
              onClick={markAllNotificationsRead}
            >
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: !item.isRead ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: !item.isRead ? '1px solid var(--color-primary)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {getNotifIcon(item.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.createdAt}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                    {item.message}
                  </p>
                </div>

                <ChevronRight size={16} color="var(--text-muted)" style={{ marginTop: '8px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
            <Bell size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: '0.88rem' }}>No notifications right now. Check back tomorrow for today's challenge!</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
