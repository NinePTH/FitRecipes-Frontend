// Notification Types for FitRecipes Frontend

export type NotificationType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  priority: NotificationPriority;
  recipe?: {
    id: string;
    title: string;
    imageUrls: string[];
  } | null;
  actor?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  actionType: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  webNotifications: {
    recipeApproved: boolean;
    recipeRejected: boolean;
    newComment: boolean;
    highRating: boolean;
    newSubmission: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    recipeApproved: boolean;
    recipeRejected: boolean;
    newComment: boolean;
    highRating: boolean;
    newSubmission: boolean;
  };
  emailNotifications: {
    enabled: boolean;
    recipeApproved: boolean;
    recipeRejected: boolean;
    newComment: boolean;
    digestFrequency: 'never' | 'daily' | 'weekly';
  };
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  unreadCount: number;
}

export interface NotificationFilters {
  unread?: boolean;
  priority?: NotificationPriority;
  type?: NotificationType;
}
