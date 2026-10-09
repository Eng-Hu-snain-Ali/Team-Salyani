import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  CalendarCheck,
  ShieldCheck,
  Radio,
  Clock,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openTrackingModal,
    bookings,
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div
      className="modal-backdrop notif-backdrop"
      onClick={() => setIsNotificationsOpen(false)}
    >
      <div
        className="notif-drawer-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="header-left">
            <Bell size={20} className="bell-icon" />
            <h3>Notifications</h3>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="unread-counter">
                {notifications.filter((n) => !n.isRead).length} new
              </span>
            )}
          </div>

          <div className="header-actions">
            <button
              className="mark-all-btn"
              onClick={markAllNotificationsRead}
              title="Mark all as read"
            >
              <CheckCheck size={16} /> Mark All
            </button>
            <button
              className="close-drawer-btn"
              onClick={() => setIsNotificationsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="drawer-list-scroll">
          {notifications.length === 0 ? (
            <div className="empty-notifs">
              <Bell size={36} className="text-muted" />
              <p>No notifications right now.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-card ${!notif.isRead ? 'unread' : ''}`}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.relatedBookingId) {
                    const match = bookings.find((b) => b.id === notif.relatedBookingId);
                    if (match) {
                      setIsNotificationsOpen(false);
                      openTrackingModal(match);
                    }
                  }
                }}
              >
                <div className="notif-type-icon">
                  {notif.type === 'booking' ? (
                    <CalendarCheck size={18} className="text-primary" />
                  ) : notif.type === 'verification' ? (
                    <ShieldCheck size={18} className="text-success" />
                  ) : (
                    <Radio size={18} className="text-warning" />
                  )}
                </div>

                <div className="notif-body">
                  <div className="notif-title-row">
                    <strong>{notif.title}</strong>
                    <span className="notif-time">
                      <Clock size={11} />{' '}
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="notif-message">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
