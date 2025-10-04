import * as api from './api';
import type { ApiError } from './api';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
  GoogleOAuthResponse,
  GoogleOAuthCallbackData,
} from '@/types';

const TOKEN_KEY = 'fitrecipes_token';
const USER_KEY = 'fitrecipes_user';

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as ApiError).name === 'ApiError'
  );
}

/**
 * Register a new user
 * Backend will send email verification
 */
export async function register(data: RegisterData): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>('/api/v1/auth/register', data);
    return response;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message);
    }
    throw new Error('Registration failed. Please try again.');
  }
}

/**
 * Login with email and password
 * Handles account lockout after 5 failed attempts
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials);

    // Store token and user data
    setToken(response.token);
    setUser(response.user);
    api.setAuthToken(response.token);

    return response;
  } catch (error) {
    if (isApiError(error)) {
      // Check for specific error messages from backend
      if (error.message.includes('locked')) {
        throw new Error(error.message);
      }
      if (error.message.includes('Google')) {
        throw new Error(error.message);
      }
      throw new Error(error.message);
    }
    throw new Error('Login failed. Please try again.');
  }
}

/**
 * Logout the current user
 * Calls backend to invalidate session
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/api/v1/auth/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local data
    clearToken();
    clearUser();
    api.removeAuthToken();
  }
}

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get<User | { user: User }>('/api/v1/auth/me');
    
    // Handle wrapped response: {user: {...}} or direct user object
    const userData = 'user' in response ? response.user : response;
    
    setUser(userData);
    return userData;
  } catch (error) {
    // If token is invalid, clear auth data
    clearToken();
    clearUser();
    api.removeAuthToken();

    if (isApiError(error)) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get user profile.');
  }
}

/**
 * Send password reset email
 */
export async function forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>('/api/v1/auth/forgot-password', data);
    return response;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message);
    }
    throw new Error('Failed to send password reset email. Please try again.');
  }
}

/**
 * Reset password with token from email
 */
export async function resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>('/api/v1/auth/reset-password', data);
    return response;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message);
    }
    throw new Error('Failed to reset password. Please try again.');
  }
}

/**
 * Initiate Google OAuth flow
 * Returns authorization URL to redirect user to
 */
export async function initiateGoogleOAuth(): Promise<string> {
  try {
    const response = await api.get<GoogleOAuthResponse>('/api/v1/auth/google');
    return response.authUrl;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message);
    }
    throw new Error('Failed to initiate Google login. Please try again.');
  }
}

/**
 * Handle Google OAuth callback
 * Called after user authorizes with Google
 */
export async function handleGoogleCallback(data: GoogleOAuthCallbackData): Promise<AuthResponse> {
  try {
    const response = await api.get<AuthResponse>('/api/v1/auth/google/callback', {
      code: data.code,
      state: data.state,
    });

    // Store token and user data
    setToken(response.token);
    setUser(response.user);
    api.setAuthToken(response.token);

    return response;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message);
    }
    throw new Error('Google login failed. Please try again.');
  }
}

/**
 * Google OAuth for mobile apps
 */
export async function googleMobileAuth(idToken: string): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/api/v1/auth/google/mobile', {
      idToken,
    });

    // Store token and user data
    setToken(response.token);
    setUser(response.user);
    api.setAuthToken(response.token);

    return response;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message);
    }
    throw new Error('Google login failed. Please try again.');
  }
}

/**
 * Get stored JWT token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored user data
 */
export function getUser(): User | null {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken() && !!getUser();
}

/**
 * Check if user has specific role
 */
export function hasRole(role: User['role']): boolean {
  const user = getUser();
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: User['role'][]): boolean {
  const user = getUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Store JWT token
 */
function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Clear stored token
 */
function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Store user data
 */
function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Clear stored user data
 */
function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * Initialize auth on app startup
 * Restores auth token if available
 */
export function init(): void {
  const token = getToken();
  if (token) {
    api.setAuthToken(token);
  }
}

/**
 * Verify token is still valid by checking with backend
 * Call this on app startup or after page refresh
 */
export async function verifyAuth(): Promise<boolean> {
  if (!isAuthenticated()) {
    return false;
  }

  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}
