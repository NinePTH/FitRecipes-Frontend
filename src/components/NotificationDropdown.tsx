import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Loader2, Settings, X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

interface Props {
  onClose: () => void;
  isMobile?: boolean;
}

export function NotificationDropdown({ onClose, isMobile = false }: Props) {
  const { notifications, unreadCount, isLoading, markAllAsRead, clearAll } = useNotifications(1, {
    unread: false,
  });

  // Only show first 5 notifications in dropdown
  const displayNotifications = notifications.slice(0, 5);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile]);

  // Desktop dropdown style
  if (!isMobile) {
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
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No notifications</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            displayNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))
          )}
        </div>

        {/* Footer - Always show "View all" link */}
        <div className="border-t p-2">
          <Link
            to="/notifications"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      </div>
    );
  }

  // Mobile sidebar style
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="font-semibold text-gray-900 text-lg">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1.5 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
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
              className="text-sm text-gray-600 hover:text-gray-700 font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear all
            </button>
          )}
          <Link
            to="/notification-settings"
            className="ml-auto p-2 hover:bg-gray-200 rounded-lg transition-colors"
            onClick={onClose}
            aria-label="Notification settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        {/* Notifications List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="font-medium text-lg">No notifications</p>
              <p className="text-sm mt-2">You're all caught up!</p>
            </div>
          ) : (
            displayNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-3 bg-white">
          <Link
            to="/notifications"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 font-semibold py-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
}
