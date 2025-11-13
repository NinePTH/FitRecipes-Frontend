import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/services/notificationApi';
import { useToast } from './useToast';
import type { NotificationFilters } from '@/types/notification';

export function useNotifications(page = 1, filters?: NotificationFilters) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch notifications
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', page, filters],
    queryFn: async () => {
      try {
        const result = await notificationApi.getNotifications(page, 20, filters);
        return result;
      } catch (err) {
        console.error('❌ Failed to load notifications:', err);
        throw err;
      }
    },
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  // Get unread count
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      try {
        const count = await notificationApi.getUnreadCount();
        return count;
      } catch (err) {
        console.error('❌ Failed to load unread count:', err);
        return 0; // Return 0 on error instead of throwing
      }
    },
    refetchInterval: 60000, // Poll every minute
    retry: 1,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: count => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast('success', 'All notifications marked as read', `${count} notifications updated`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast('success', 'Notification deleted');
    },
  });

  // Clear all mutation
  const clearAllMutation = useMutation({
    mutationFn: notificationApi.clearAll,
    onSuccess: count => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast('success', 'All notifications cleared', `${count} notifications removed`);
    },
  });

  return {
    notifications: data?.notifications || [],
    pagination: data?.pagination,
    unreadCount: unreadCount || 0,
    isLoading,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    clearAll: clearAllMutation.mutate,
  };
}
