import { apiClient } from './api';

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'CHEF' | 'ADMIN';
  isOAuthUser: boolean;
  termsAccepted: boolean;
  emailVerified: boolean;
  isBanned: boolean;
  bannedAt?: string;
  bannedBy?: string;
  banReason?: string;
  createdAt: string;
  lastLoginAt?: string;
  recipeCount?: number;
  commentCount?: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'USER' | 'CHEF' | 'ADMIN';
  status?: 'active' | 'banned';
  sortBy?: 'createdAt' | 'email' | 'firstName' | 'lastName';
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserActivity {
  type: 'recipe_submitted' | 'comment_posted' | 'rating_given';
  timestamp: string;
  details: string;
}

export interface UserStatistics {
  recipesSubmitted: number;
  recipesApproved: number;
  recipesPending: number;
  recipesRejected: number;
  commentsPosted: number;
  ratingsGiven: number;
  averageRecipeRating?: number;
  totalRecipeViews?: number;
}

export interface UserDetails {
  user: User;
  statistics: UserStatistics;
  recentActivity: UserActivity[];
}

export interface BanUserRequest {
  reason: string;
}

export interface BanUserResponse {
  userId: string;
  isBanned: boolean;
  bannedAt: string;
  bannedBy: string;
  banReason: string;
}

export interface UnbanUserResponse {
  userId: string;
  isBanned: boolean;
  unbannedAt: string;
  unbannedBy: string;
}

export interface ChangeRoleRequest {
  newRole: 'USER' | 'CHEF' | 'ADMIN';
  reason?: string;
}

export interface ChangeRoleResponse {
  userId: string;
  oldRole: string;
  newRole: string;
  changedAt: string;
  changedBy: string;
}

// ============================================================================
// User Management API
// ============================================================================

/**
 * Get paginated list of all users with filtering
 * @admin Only
 */
export const getAllUsers = async (params?: UserListParams): Promise<UserListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.role) queryParams.append('role', params.role);
  if (params?.status === 'banned') queryParams.append('isBanned', 'true');
  if (params?.status === 'active') queryParams.append('isBanned', 'false');
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  return await apiClient.get<UserListResponse>(
    `/api/v1/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`
  );
};

/**
 * Get detailed information about a specific user
 * @admin Only
 */
export const getUserDetails = async (userId: string): Promise<UserDetails> => {
  return await apiClient.get<UserDetails>(`/api/v1/admin/users/${userId}`);
};

/**
 * Ban a user from the platform
 * @admin Only
 */
export const banUser = async (
  userId: string,
  request: BanUserRequest
): Promise<BanUserResponse> => {
  return await apiClient.put<BanUserResponse>(`/api/v1/admin/users/${userId}/ban`, request);
};

/**
 * Unban a user, restoring their access
 * @admin Only
 */
export const unbanUser = async (userId: string): Promise<UnbanUserResponse> => {
  return await apiClient.put<UnbanUserResponse>(`/api/v1/admin/users/${userId}/unban`);
};

/**
 * Change a user's role
 * @admin Only
 */
export const changeUserRole = async (
  userId: string,
  request: ChangeRoleRequest
): Promise<ChangeRoleResponse> => {
  return await apiClient.put<ChangeRoleResponse>(`/api/v1/admin/users/${userId}/role`, request);
};
