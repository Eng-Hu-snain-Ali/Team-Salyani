import type { NotificationItem } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/mockData';

const NOTIFICATIONS_KEY = 'ustad_online_notifications_v1';

class NotificationService {
  private getStoredNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  }

  private saveNotifications(items: NotificationItem[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
    } catch {
      // Storage error
    }
  }

  public async getNotifications(role?: 'customer' | 'ustad' | 'admin'): Promise<NotificationItem[]> {
    const list = this.getStoredNotifications();
    if (!role || role === 'admin') return list;
    return list.filter((n) => n.targetRole === 'all' || n.targetRole === role);
  }

  public async markAsRead(id: string): Promise<void> {
    const list = this.getStoredNotifications();
    const updated = list.map((item) => (item.id === id ? { ...item, isRead: true } : item));
    this.saveNotifications(updated);
  }

  public async markAllAsRead(): Promise<void> {
    const list = this.getStoredNotifications();
    const updated = list.map((item) => ({ ...item, isRead: true }));
    this.saveNotifications(updated);
  }

  public async createNotification(payload: {
    title: string;
    message: string;
    type: 'booking' | 'system' | 'payment' | 'verification';
    targetRole: 'customer' | 'ustad' | 'all';
    relatedBookingId?: string;
  }): Promise<NotificationItem> {
    const list = this.getStoredNotifications();
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      targetRole: payload.targetRole,
      isRead: false,
      relatedBookingId: payload.relatedBookingId,
      createdAt: new Date().toISOString(),
    };

    list.unshift(newNotif);
    this.saveNotifications(list);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
