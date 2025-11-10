import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from '@/components/ui/toast';
import type { Toast, ToastType } from '@/components/ui/toast';
import { ToastContext } from './ToastContext.ts';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // DISABLED: Notification history - waiting for backend
  // const [notifications, setNotifications] = useState<Toast[]>([]);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        id,
        type,
        title,
        description,
        duration: duration || 5000,
        timestamp: new Date(),
        isRead: false,
      };

      setToasts(prev => [...prev, newToast]);
      // DISABLED: Not adding to notification history
      // setNotifications(prev => [newToast, ...prev]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast('success', title, description, duration);
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast('error', title, description, duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast('warning', title, description, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast('info', title, description, duration);
    },
    [showToast]
  );

  // DISABLED: Notification sidebar functions - waiting for backend
  const markAsRead = useCallback((id: string) => {
    // Disabled function - do nothing
    console.log('markAsRead disabled, id:', id);
  }, []);

  const markAllAsRead = useCallback(() => {
    // setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    // setNotifications([]);
  }, []);

  const toggleSidebar = useCallback(() => {
    // setIsSidebarOpen(prev => !prev);
  }, []);

  // const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadCount = 0; // DISABLED

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info,
        notifications: [], // DISABLED: Empty array
        markAsRead,
        markAllAsRead,
        clearNotifications,
        isSidebarOpen: false, // DISABLED: Always false
        toggleSidebar,
        unreadCount,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
