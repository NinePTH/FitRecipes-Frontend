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
      const type = (data.type || 'info') as 'success' | 'error' | 'warning' | 'info';
      showToast(type, title || 'New Notification', body || '');

      // Invalidate notifications query to refresh list
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    });

    return () => unsubscribe();
  }, [showToast, queryClient]);
}
