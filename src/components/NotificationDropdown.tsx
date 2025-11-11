import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Loader2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: Props) {
  const { notifications, unreadCount, isLoading, markAllAsRead, clearAll } = useNotifications(1, {
    unread: false,
  });

  // Only show first 5 notifications in dropdown
  const displayNotifications = notifications.slice(0, 5);

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-900">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        <div className="flex gap-2 items-center">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all notifications?')) {
                  clearAll();
                }
              }}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear all
            </button>
          )}
          <Link
            to="/notification-settings"
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            onClick={onClose}
            aria-label="Notification settings"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        ) : displayNotifications.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p className="font-medium">No notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          displayNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="border-t p-2">
          <Link
            to="/notifications"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
