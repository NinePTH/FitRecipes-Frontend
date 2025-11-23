import { apiClient } from './api';

// ============================================================================
// Types
// ============================================================================

// Admin Analytics Types
export interface AdminDashboardOverview {
  users: {
    total: number;
    active: number;
    banned: number;
    newInPeriod: number;
    byRole: {
      USER: number;
      CHEF: number;
      ADMIN: number;
    };
  };
  recipes: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    newInPeriod: number;
  };
  engagement: {
    totalComments: number;
    totalRatings: number;
    averageRating: number;
    commentsInPeriod: number;
    ratingsInPeriod: number;
  };
  topChefs: Array<{
    userId: string;
    name: string;
    recipeCount: number;
    averageRating: number;
    totalViews: number;
  }>;
  recentActivity: Array<{
    type: 'user_registered' | 'recipe_submitted' | 'recipe_approved' | 'user_banned';
    timestamp: string;
    details: string;
  }>;
}

export interface RecipeTrendData {
  date: string;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface RecipeTrends {
  trends: RecipeTrendData[];
  summary: {
    totalSubmitted: number;
    totalApproved: number;
    totalRejected: number;
    approvalRate: number;
  };
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  newChefs: number;
  newAdmins: number;
  total: number;
}

export interface UserGrowthTrends {
  trends: UserGrowthData[];
  summary: {
    totalNewUsers: number;
    growthRate: number;
  };
}

// Chef Analytics Types
export interface ChefAnalyticsOverview {
  myRecipes: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    newInPeriod: number;
  };
  performance: {
    totalViews: number;
    viewsInPeriod: number;
    totalRatings: number;
    averageRating: number;
    totalComments: number;
    commentsInPeriod: number; // Added to match backend
  };
  topRecipes: Array<{
    id: string;
    name: string;
    views: number;
    rating: number;
    ratingCount: number;
    commentCount: number;
  }>;
  rankings: {
    viewRank: number;
    ratingRank: number;
    totalChefs: number;
  };
  recentActivity: Array<{
    type: 'recipe_approved' | 'recipe_rejected' | 'comment_received' | 'rating_received';
    timestamp: string;
    details: string;
  }>;
}

export interface RecipeAnalytics {
  recipe: {
    id: string;
    name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    approvedAt?: string;
  };
  views: {
    total: number;
    viewsInPeriod: number;
    viewTrends: Array<{
      date: string;
      views: number;
    }>;
  };
  ratings: {
    total: number;
    average: number;
    distribution: {
      '5': number;
      '4': number;
      '3': number;
      '2': number;
      '1': number;
    };
    ratingsInPeriod: number;
  };
  comments: {
    total: number;
    commentsInPeriod: number;
    recentComments: Array<{
      id: string;
      userName: string;
      content: string; // Changed from 'text' to match backend
      createdAt: string;
    }>;
  };
  engagement: {
    viewToRatingRate: number;
    viewToCommentRate: number;
  };
}

export interface Comment {
  id: string;
  recipeId: string;
  recipeName: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string; // Changed from 'text' to match backend
  createdAt: string;
  updatedAt: string;
}

export interface CommentListParams {
  page?: number;
  limit?: number;
  recipeId?: string;
  userId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CommentListResponse {
  comments: Comment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BulkDeleteRequest {
  ids: string[];
  reason: string;
}

export interface BulkDeleteResponse {
  deletedCount: number;
  failedCount: number;
  results: Array<{
    id: string;
    success: boolean;
    error?: string;
  }>;
}

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
export type GroupBy = 'day' | 'week' | 'month';

// ============================================================================
// Admin Analytics API
// ============================================================================

/**
 * Get high-level statistics for admin dashboard
 * @admin Only
 */
export const getAdminDashboardOverview = async (
  timeRange: '7d' | '30d' | '90d' | 'all' = '30d'
): Promise<AdminDashboardOverview> => {
  return await apiClient.get<AdminDashboardOverview>(
    `/api/v1/admin/analytics/overview?timeRange=${timeRange}`
  );
};

/**
 * Get time-series data for recipe submissions
 * @admin Only
 */
export const getRecipeTrends = async (
  timeRange: '7d' | '30d' | '90d' | '1y' = '30d',
  groupBy?: 'day' | 'week' | 'month'
): Promise<RecipeTrends> => {
  const params = new URLSearchParams({ timeRange });
  if (groupBy) params.append('groupBy', groupBy);

  return await apiClient.get<RecipeTrends>(`/api/v1/admin/analytics/recipe-trends?${params}`);
};

/**
 * Get time-series data for user registrations
 * @admin Only
 */
export const getUserGrowthTrends = async (
  timeRange: '7d' | '30d' | '90d' | '1y' = '30d',
  groupBy?: 'day' | 'week' | 'month'
): Promise<UserGrowthTrends> => {
  const params = new URLSearchParams({ timeRange });
  if (groupBy) params.append('groupBy', groupBy);

  return await apiClient.get<UserGrowthTrends>(`/api/v1/admin/analytics/user-growth?${params}`);
};

// ============================================================================
// Chef Analytics API
// ============================================================================

/**
 * Get personalized analytics for the logged-in chef
 * @chef @admin Only
 */
export const getChefAnalyticsOverview = async (
  timeRange: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<ChefAnalyticsOverview> => {
  return await apiClient.get<ChefAnalyticsOverview>(
    `/api/v1/chef/analytics/overview?timeRange=${timeRange}`
  );
};

/**
 * Get detailed analytics for a specific recipe
 * @chef @admin Only (chef can only access own recipes)
 */
export const getRecipeAnalytics = async (
  recipeId: string,
  timeRange: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<RecipeAnalytics> => {
  return await apiClient.get<RecipeAnalytics>(
    `/api/v1/chef/recipes/${recipeId}/analytics?timeRange=${timeRange}`
  );
};

/**
 * Track a recipe view (called when user views recipe detail page)
 * @public Accessible to all users (authenticated or not)
 */
export const trackRecipeView = async (recipeId: string): Promise<void> => {
  await apiClient.post(`/recipes/${recipeId}/view`);
};

// ============================================================================
// Content Moderation API
// ============================================================================

/**
 * Get paginated list of all comments across all recipes
 * @admin Only
 */
export const getAllComments = async (params?: CommentListParams): Promise<CommentListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.recipeId) queryParams.append('recipeId', params.recipeId);
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  return await apiClient.get<CommentListResponse>(
    `/api/v1/admin/comments${queryParams.toString() ? `?${queryParams}` : ''}`
  );
};

/**
 * Bulk delete multiple comments
 * @admin Only
 */
export const bulkDeleteComments = async (
  request: BulkDeleteRequest
): Promise<BulkDeleteResponse> => {
  return await apiClient.post<BulkDeleteResponse>('/api/v1/admin/comments/bulk-delete', {
    commentIds: request.ids,
    reason: request.reason,
  });
};

/**
 * Admin override delete for any recipe
 * @admin Only
 */
export const adminDeleteRecipe = async (recipeId: string, reason: string): Promise<void> => {
  await apiClient.delete(`/api/v1/admin/recipes/${recipeId}`, {
    data: { reason },
  });
};

/**
 * Bulk delete multiple recipes
 * @admin Only
 */
export const bulkDeleteRecipes = async (
  request: BulkDeleteRequest
): Promise<BulkDeleteResponse> => {
  return await apiClient.post<BulkDeleteResponse>('/api/v1/admin/recipes/bulk-delete', {
    recipeIds: request.ids,
    reason: request.reason,
  });
};
