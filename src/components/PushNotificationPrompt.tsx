import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { requestPushPermission } from '@/services/pushNotifications';

export function PushNotificationPrompt() {
  const [show, setShow] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check if we should show the prompt
    const checkPermission = () => {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return;
      }

      const permission = Notification.permission;
      const dismissed = localStorage.getItem('push_prompt_dismissed');
      const hasToken = localStorage.getItem('fcm_token_registered');

      // Show if permission is default (not asked) and user hasn't dismissed it
      if (permission === 'default' && !dismissed && !hasToken) {
        // Small delay so it doesn't feel jarring
        setTimeout(() => setShow(true), 2000);
      }
    };

    checkPermission();
  }, []);

  const handleEnable = async () => {
    setIsRequesting(true);
    try {
      console.log('🔔 User clicked to enable push notifications');
      const token = await requestPushPermission();
      if (token) {
        console.log('✅ Push notifications enabled successfully');
        localStorage.setItem('fcm_token_registered', 'true');
        setShow(false);
      } else {
        console.log('❌ User denied push notifications');
        // Don't hide on denial - let them try again
      }
    } catch (error) {
      console.error('Failed to enable push notifications:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_prompt_dismissed', 'true');
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Bell className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  Stay updated with recipe notifications
                </p>
                <p className="text-xs text-blue-100 mt-0.5">
                  Get notified when your recipes are approved, receive comments, and more
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEnable}
                disabled={isRequesting}
                className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isRequesting ? 'Enabling...' : 'Enable Notifications'}
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
