import type { BackendResponse, Recipe } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiError {
  name: string;
  message: string;
  statusCode?: number;
  errors?: Array<{ code: string; message: string; path?: string[] }>;
}

function createApiError(
  message: string,
  statusCode?: number,
  errors?: Array<{ code: string; message: string; path?: string[] }>
): ApiError {
  return {
    name: 'ApiError',
    message,
    statusCode,
    errors,
  };
}

// Global config
const config: ApiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

export function setAuthToken(token: string): void {
  config.headers['Authorization'] = `Bearer ${token}`;
}

export function removeAuthToken(): void {
  delete config.headers['Authorization'];
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${config.baseURL}${endpoint}`;

  const fetchConfig: RequestInit = {
    ...options,
    headers: {
      ...config.headers,
      ...options.headers,
    },
  };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  fetchConfig.signal = controller.signal;

  try {
    const response = await fetch(url, fetchConfig);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data: BackendResponse<T>;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If response is not JSON, handle as error
      throw createApiError(`Unexpected response type: ${contentType}`, response.status);
    }

    // Handle backend error response
    if (data.status === 'error' || !response.ok) {
      throw createApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status,
        data.errors
      );
    }

    // Return the data field from successful response
    return data.data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw createApiError('Request timeout');
    }

    throw createApiError('Network error');
  }
}

async function requestWithMessage<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; message: string }> {
  const url = `${config.baseURL}${endpoint}`;

  const fetchConfig: RequestInit = {
    ...options,
    headers: {
      ...config.headers,
      ...options.headers,
    },
  };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  fetchConfig.signal = controller.signal;

  try {
    const response = await fetch(url, fetchConfig);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let backendResponse: BackendResponse<T>;

    if (contentType && contentType.includes('application/json')) {
      backendResponse = await response.json();
    } else {
      throw createApiError(`Unexpected response type: ${contentType}`, response.status);
    }

    // Handle backend error response
    if (backendResponse.status === 'error' || !response.ok) {
      throw createApiError(
        backendResponse.message || `HTTP error! status: ${response.status}`,
        response.status,
        backendResponse.errors
      );
    }

    // Return both data and message
    return { data: backendResponse.data as T, message: backendResponse.message };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw createApiError('Request timeout');
    }

    if (error instanceof Error) {
      throw createApiError(error.message);
    }

    throw createApiError('An unexpected error occurred');
  }
}

export async function get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
  const url = new URL(endpoint, config.baseURL);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });
  }

  return request<T>(url.pathname + url.search);
}

export async function post<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function postWithMessage<T>(
  endpoint: string,
  data?: unknown
): Promise<{ data: T; message: string }> {
  return requestWithMessage<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function put<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function patch<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function deleteRequest<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'DELETE',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function putWithMessage<T>(
  endpoint: string,
  data?: unknown
): Promise<{ data: T; message: string }> {
  return requestWithMessage<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function uploadFile<T>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, unknown>
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.keys(additionalData).forEach(key => {
      formData.append(key, String(additionalData[key]));
    });
  }

  const headers = { ...config.headers };
  delete headers['Content-Type']; // Let browser set it for FormData

  return request<T>(endpoint, {
    method: 'POST',
    body: formData,
    headers,
  });
}

// Admin API functions
export const adminApi = {
  // Get pending recipes
  getPendingRecipes: (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) =>
    get<{
      recipes: Recipe[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>('/api/v1/admin/recipes/pending', params),

  // Approve recipe
  approveRecipe: (recipeId: string, adminNote?: string) =>
    putWithMessage<{ recipe: Recipe }>(
      `/api/v1/admin/recipes/${recipeId}/approve`,
      adminNote ? { adminNote } : undefined
    ),

  // Reject recipe
  rejectRecipe: (recipeId: string, rejectionReason: string, adminNote?: string) =>
    putWithMessage<{ recipe: Recipe }>(`/api/v1/admin/recipes/${recipeId}/reject`, {
      reason: rejectionReason,
      adminNote,
    }),

  // Get approval statistics
  getApprovalStats: (period?: 'today' | 'week' | 'month' | 'all') =>
    get<{ pending: number; approvedToday: number; rejectedToday: number }>(
      '/api/v1/admin/recipes/stats',
      period ? { period } : undefined
    ),

  // Get recipe by ID (admin view - any status)
  getRecipeById: (recipeId: string) => get<{ recipe: Recipe }>(`/api/v1/admin/recipes/${recipeId}`),
};
