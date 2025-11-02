import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from '@/components/ui/toast';
import type { Toast, ToastType } from '@/components/ui/toast';
import { ToastContext } from './ToastContext.ts';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<Toast[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      setNotifications(prev => [newToast, ...prev]); // Add to history (newest first)
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

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info,
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        isSidebarOpen,
        toggleSidebar,
        unreadCount,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
