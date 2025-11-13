import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import type { Notification } from '@/types/notification';

interface Props {
  notification: Notification;
  onClose: () => void;
}

export function NotificationItem({ notification, onClose }: Props) {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'INFO':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div
      className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
          <button
            onClick={e => {
              e.stopPropagation();
              deleteNotification(notification.id);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Delete notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-1">{notification.description}</p>

        {notification.recipe && (
          <div className="flex items-center gap-2 mt-2">
            {notification.recipe.imageUrls && notification.recipe.imageUrls.length > 0 && (
              <img
                src={notification.recipe.imageUrls[0]}
                alt={notification.recipe.title}
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <span className="text-xs text-gray-500">{notification.recipe.title}</span>
          </div>
        )}

        {notification.actor && (
          <p className="text-xs text-gray-500 mt-1">
            by {notification.actor.firstName} {notification.actor.lastName}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-2">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </div>
  );
}
