import { apiClient } from './api';

// Audit Log Types
export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action:
    | 'user_banned'
    | 'user_unbanned'
    | 'user_role_changed'
    | 'recipe_deleted'
    | 'comment_deleted'
    | 'comments_bulk_deleted'
    | 'recipes_bulk_deleted';
  targetType: 'user' | 'recipe' | 'comment';
  targetId: string;
  targetName?: string;
  details: Record<string, unknown>;
  reason?: string;
  timestamp: string;
}

export interface AuditLogListParams {
  page?: number;
  limit?: number;
  action?: AuditLog['action'];
  adminId?: string;
  targetType?: 'user' | 'recipe' | 'comment';
  targetId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'timestamp';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogListResponse {
  logs: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Get paginated list of audit logs with filtering
 * @admin Only
 */
export const getAuditLogs = async (params?: AuditLogListParams): Promise<AuditLogListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.action) queryParams.append('action', params.action);
  if (params?.adminId) queryParams.append('adminId', params.adminId);
  if (params?.targetType) queryParams.append('targetType', params.targetType);
  if (params?.targetId) queryParams.append('targetId', params.targetId);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  return await apiClient.get<AuditLogListResponse>(
    `/api/v1/admin/audit-logs${queryParams.toString() ? `?${queryParams}` : ''}`
  );
};

/**
 * Format action name for display
 */
export const formatActionName = (action: AuditLog['action']): string => {
  const actionMap: Record<AuditLog['action'], string> = {
    user_banned: 'User Banned',
    user_unbanned: 'User Unbanned',
    user_role_changed: 'Role Changed',
    recipe_deleted: 'Recipe Deleted',
    comment_deleted: 'Comment Deleted',
    comments_bulk_deleted: 'Bulk Comments Deleted',
    recipes_bulk_deleted: 'Bulk Recipes Deleted',
  };
  return actionMap[action] || action;
};

/**
 * Get action color for UI display
 */
export const getActionColor = (
  action: AuditLog['action']
): 'red' | 'green' | 'blue' | 'yellow' | 'gray' => {
  if (action.includes('deleted') || action === 'user_banned') return 'red';
  if (action === 'user_unbanned') return 'green';
  if (action === 'user_role_changed') return 'blue';
  return 'gray';
};
