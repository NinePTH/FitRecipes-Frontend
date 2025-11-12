import { useEffect } from 'react';
import { onMessage, messaging } from '@/config/firebase';
import { useToast } from './useToast';
import { useQueryClient } from '@tanstack/react-query';

export function useFcmListener() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!messaging) {
      return;
    }

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, payload => {
      console.log('Received foreground FCM message:', payload);

      const { title, body } = payload.notification || {};
      const data = payload.data || {};

      // Show toast notification
      // Backend sends notification types in uppercase (SUCCESS, ERROR, WARNING, INFO)
      // Convert to lowercase for toast component
      const rawType = (data.type || 'INFO') as string;
      let type = rawType.toLowerCase() as 'success' | 'error' | 'warning' | 'info';

      // Validate type is one of the allowed values
      const validTypes: Array<'success' | 'error' | 'warning' | 'info'> = [
        'success',
        'error',
        'warning',
        'info',
      ];
      if (!validTypes.includes(type)) {
        console.warn(`Invalid notification type: ${rawType}, defaulting to 'info'`);
        type = 'info';
      }

      // Ensure we have at least a title
      const notificationTitle = title || 'New Notification';
      const notificationBody = body || '';

      console.log('Showing toast:', { type, title: notificationTitle, body: notificationBody });

      showToast(type, notificationTitle, notificationBody);

      // Invalidate notifications query to refresh list
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    });

    return () => unsubscribe();
  }, [showToast, queryClient]);
}
