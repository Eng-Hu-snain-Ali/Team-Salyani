import { apiClient } from './apiClient';
import type { Notification, ApiResponse } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/mockData';

class NotificationService {
  private localNotifications: Notification[] = [...INITIAL_NOTIFICATIONS];

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Notification[]>>('/notifications');
    }

    return {
      success: true,
      data: this.localNotifications,
    };
  }

  async markAsRead(id: string): Promise<ApiResponse<{ isRead: boolean }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.patch(`/notifications/${id}/read`);
    }

    const item = this.localNotifications.find((n) => n.id === id);
    if (item) item.isRead = true;

    return {
      success: true,
      data: { isRead: true },
    };
  }

  async markAllAsRead(): Promise<ApiResponse<{ allRead: boolean }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post('/notifications/read-all');
    }

    this.localNotifications.forEach((n) => {
      n.isRead = true;
    });

    return {
      success: true,
      data: { allRead: true },
    };
  }
}

export const notificationService = new NotificationService();
