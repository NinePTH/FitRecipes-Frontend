import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/services/notificationApi';
import { useToast } from './useToast';
import type { NotificationPreferences } from '@/types/notification';

export function useNotificationPreferences() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch preferences
  const { data, isLoading, error } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      try {
        const prefs = await notificationApi.getPreferences();
        return prefs;
      } catch (err) {
        console.error('❌ Failed to load preferences:', err);
        throw err;
      }
    },
    retry: 1,
  });

  // Update preferences mutation
  const updateMutation = useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      notificationApi.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      showToast('success', 'Preferences updated', 'Your notification settings have been saved');
    },
    onError: (error: Error) => {
      showToast('error', 'Update failed', error.message);
    },
  });

  return {
    preferences: data,
    isLoading,
    error,
    updatePreferences: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
