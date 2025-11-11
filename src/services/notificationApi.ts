import { get, post, put, deleteRequest } from './api';
import type {
  NotificationPreferences,
  PaginatedNotifications,
  NotificationFilters,
} from '@/types/notification';

export const notificationApi = {
  // Get notifications
  async getNotifications(
    page = 1,
    limit = 20,
    filters?: NotificationFilters
  ): Promise<PaginatedNotifications> {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (filters?.unread !== undefined) {
      params.unread = filters.unread.toString();
    }
    if (filters?.priority) {
      params.priority = filters.priority;
    }
    if (filters?.type) {
      params.type = filters.type;
    }

    // API already extracts data field, so we get PaginatedNotifications directly
    return await get<PaginatedNotifications>('/api/v1/notifications', params);
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    // API returns the data field directly
    const result = await get<{ unreadCount: number }>('/api/v1/notifications/unread-count');
    return result.unreadCount;
  },

  // Mark as read
  async markAsRead(notificationId: string): Promise<void> {
    await put(`/api/v1/notifications/${notificationId}/read`);
  },

  // Mark all as read
  async markAllAsRead(): Promise<number> {
    const result = await put<{ updatedCount: number }>('/api/v1/notifications/mark-all-read');
    return result.updatedCount;
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await deleteRequest(`/api/v1/notifications/${notificationId}`);
  },

  // Clear all
  async clearAll(): Promise<number> {
    const result = await deleteRequest<{ deletedCount: number }>('/api/v1/notifications');
    return result.deletedCount;
  },

  // Get preferences
  async getPreferences(): Promise<NotificationPreferences> {
    // API returns the data field directly
    return await get<NotificationPreferences>('/api/v1/notifications/preferences');
  },

  // Update preferences
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    await put('/api/v1/notifications/preferences', preferences);
  },

  // Register FCM token
  async registerFcmToken(fcmToken: string, browser?: string, os?: string): Promise<string> {
    const result = await post<{ tokenId: string }>('/api/v1/notifications/fcm/register', {
      fcmToken,
      browser,
      os,
    });
    return result.tokenId;
  },

  // Unregister FCM token
  async unregisterFcmToken(fcmToken: string): Promise<void> {
    // For DELETE with body, we need to use a workaround since deleteRequest doesn't support body
    await post('/api/v1/notifications/fcm/unregister', { fcmToken });
  },
};
