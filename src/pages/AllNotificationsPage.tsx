import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/NotificationItem';
import { Loader2, Filter, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NotificationType, NotificationPriority } from '@/types/notification';

export function AllNotificationsPage() {
  const [page, setPage] = useState(1);
  const [filterUnread, setFilterUnread] = useState(false);
  const [filterType, setFilterType] = useState<NotificationType | undefined>();
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | undefined>();

  const filters = {
    ...(filterUnread && { unread: true }),
    ...(filterType && { type: filterType }),
    ...(filterPriority && { priority: filterPriority }),
  };

  const { notifications, pagination, unreadCount, isLoading, markAllAsRead, clearAll } =
    useNotifications(page, filters);

  const handleLoadMore = () => {
    if (pagination?.hasNext) {
      setPage(prev => prev + 1);
    }
  };

  const handleClearFilters = () => {
    setFilterUnread(false);
    setFilterType(undefined);
    setFilterPriority(undefined);
    setPage(1);
  };

  const hasActiveFilters = filterUnread || filterType || filterPriority;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : "You're all caught up!"}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Filters:</span>

              <select
                value={filterType || ''}
                onChange={e => {
                  setFilterType(e.target.value as NotificationType | undefined);
                  setPage(1);
                }}
                className="appearance-none pr-8 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="SUCCESS">Success</option>
                <option value="ERROR">Error</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>

              <select
                value={filterPriority || ''}
                onChange={e => {
                  setFilterPriority(e.target.value as NotificationPriority | undefined);
                  setPage(1);
                }}
                className="appearance-none pr-8 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterUnread}
                  onChange={e => {
                    setFilterUnread(e.target.checked);
                    setPage(1);
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Unread only</span>
              </label>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all notifications?')) {
                      clearAll();
                    }
                  }}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {isLoading && page === 1 ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-12">
              <p className="text-gray-600 font-medium mb-1">No notifications</p>
              <p className="text-sm text-gray-500">
                {hasActiveFilters ? 'Try adjusting your filters' : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <>
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => {
                    // No-op for full page view
                  }}
                />
              ))}

              {/* Load More */}
              {pagination && pagination.hasNext && (
                <div className="p-4 border-t text-center">
                  <Button onClick={handleLoadMore} disabled={isLoading} variant="outline">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      `Load More (${pagination.totalItems - notifications.length} remaining)`
                    )}
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              {pagination && (
                <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-600">
                  Showing {notifications.length} of {pagination.totalItems} notifications
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
