import { apiClient } from './apiClient';
import type { NotificationItem, ApiResponse } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/mockData';

class NotificationService {
  private localNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<NotificationItem[]>>('/notifications');
    }

    return {
      success: true,
      data: [...this.localNotifications],
    };
  }

  async markAsRead(id: string): Promise<ApiResponse<null>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.patch<ApiResponse<null>>(`/notifications/${id}/read`);
    }

    const item = this.localNotifications.find((n) => n.id === id);
    if (item) item.isRead = true;

    return { success: true, data: null };
  }

  async markAllAsRead(): Promise<ApiResponse<null>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<null>>('/notifications/read-all');
    }

    this.localNotifications.forEach((n) => (n.isRead = true));
    return { success: true, data: null };
  }
}

export const notificationService = new NotificationService();
