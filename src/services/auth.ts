import { apiClient } from './api';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';

export class AuthService {
  private static readonly TOKEN_KEY = 'fitrecipes_token';
  private static readonly REFRESH_TOKEN_KEY = 'fitrecipes_refresh_token';
  private static readonly USER_KEY = 'fitrecipes_user';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      // Mock implementation
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.setTokens(mockResponse.token, mockResponse.refreshToken);
      this.setUser(mockResponse.user);
      apiClient.setAuthToken(mockResponse.token);

      return mockResponse;
    }

    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    this.setTokens(response.token, response.refreshToken);
    this.setUser(response.user);
    apiClient.setAuthToken(response.token);

    return response;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      // Mock implementation
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.setTokens(mockResponse.token, mockResponse.refreshToken);
      this.setUser(mockResponse.user);
      apiClient.setAuthToken(mockResponse.token);

      return mockResponse;
    }

    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    this.setTokens(response.token, response.refreshToken);
    this.setUser(response.user);
    apiClient.setAuthToken(response.token);

    return response;
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // TODO: Replace with actual API call
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      // Mock implementation - just return current user data
      const user = this.getUser();
      if (!user) {
        throw new Error('No user data available');
      }

      const mockResponse: AuthResponse = {
        user,
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token',
      };

      this.setTokens(mockResponse.token, mockResponse.refreshToken);
      apiClient.setAuthToken(mockResponse.token);

      return mockResponse;
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    this.setTokens(response.token, response.refreshToken);
    this.setUser(response.user);
    apiClient.setAuthToken(response.token);

    return response;
  }

  static async logout(): Promise<void> {
    // TODO: Call API to invalidate token
    if (import.meta.env.VITE_ENABLE_MOCK_DATA !== 'true') {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    this.clearTokens();
    this.clearUser();
    apiClient.removeAuthToken();
  }

  static async resetPassword(email: string): Promise<void> {
    // TODO: Replace with actual API call
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset email sent to:', email);
      return;
    }

    await apiClient.post('/auth/reset-password', { email });
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static hasRole(role: User['role']): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  static hasAnyRole(roles: User['role'][]): boolean {
    const user = this.getUser();
    return user ? roles.includes(user.role) : false;
  }

  private static setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  private static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private static clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Initialize auth on app startup
  static init(): void {
    const token = this.getToken();
    if (token) {
      apiClient.setAuthToken(token);
    }
  }
}
