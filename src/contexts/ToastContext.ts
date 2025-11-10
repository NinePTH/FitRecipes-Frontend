import { createContext } from 'react';
import type { Toast, ToastType } from '@/components/ui/toast';

export interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string, duration?: number) => void;
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  notifications: Toast[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  unreadCount: number;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
