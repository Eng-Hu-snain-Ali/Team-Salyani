import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  ThumbsUp,
  Heart,
  MessageSquare,
  CornerDownRight,
  UserPlus,
  CheckCheck,
  Bell,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationRead,
    markAllNotificationsRead,
    openExperience,
  } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'helpful':
        return <ThumbsUp size={14} className="notif-icon helpful" />;
      case 'like':
        return <Heart size={14} className="notif-icon like" />;
      case 'comment':
        return <MessageSquare size={14} className="notif-icon comment" />;
      case 'reply':
        return <CornerDownRight size={14} className="notif-icon reply" />;
      case 'follow':
        return <UserPlus size={14} className="notif-icon follow" />;
      default:
        return <Bell size={14} className="notif-icon default" />;
    }
  };

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.targetId && item.targetId.startsWith('exp_')) {
      setIsNotificationsOpen(false);
      openExperience(item.targetId);
    }
  };

  return (
    <Modal
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Notifications & Activity"
      subtitle="Interactions with your experiences and lessons"
      maxWidth="md"
    >
      <div className="notifications-modal-container">
        <div className="notifications-top-bar">
          <span className="notifs-count-text">
            {notifications.filter((n) => !n.isRead).length} unread updates
          </span>
          {notifications.some((n) => !n.isRead) && (
            <button
              type="button"
              className="mark-all-read-btn"
              onClick={markAllNotificationsRead}
            >
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="no-notifications-box">
              <Bell size={28} className="empty-bell-icon" />
              <p>No activity yet. Share an experience to start receiving feedback!</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`notification-item-card ${!item.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(item)}
                role="button"
                tabIndex={0}
              >
                <div className="notif-actor-col">
                  <img
                    src={item.actor.avatar}
                    alt={item.actor.name}
                    className="notif-actor-avatar"
                  />
                  <div className="notif-badge-bubble">{getNotifIcon(item.type)}</div>
                </div>

                <div className="notif-text-col">
                  <p className="notif-message-text">
                    <strong>{item.actor.name}</strong> {item.message}
                  </p>
                  {item.targetTitle && (
                    <span className="notif-target-title">"{item.targetTitle}"</span>
                  )}
                  <span className="notif-time-text">
                    {new Date(item.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {!item.isRead && <div className="unread-dot-indicator" />}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
