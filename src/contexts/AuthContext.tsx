import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from '@/services/auth';
import type { User } from '@/types';
import { AuthContext } from './AuthContext';

// Re-export for convenience
export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔐 Initializing auth...');
      authService.init();

      const isAuth = authService.isAuthenticated();
      console.log('🔐 Is authenticated?', isAuth);
      console.log(
        '🔐 Token in localStorage:',
        localStorage.getItem('fitrecipes_token') ? 'Present' : 'Missing'
      );
      console.log(
        '🔐 User in localStorage:',
        localStorage.getItem('fitrecipes_user') ? 'Present' : 'Missing'
      );

      if (isAuth) {
        try {
          console.log('🔐 Fetching current user from backend...');
          // Fetch fresh user data from backend
          const currentUser = await authService.getCurrentUser();
          console.log('✅ User fetched:', currentUser);
          setUser(currentUser);
        } catch (error) {
          console.error('❌ Auth verification failed:', error);
          setUser(null);
          // Clear invalid auth data
          authService.init(); // This will clear token if invalid
        }
      } else {
        console.log('🔐 No authentication found');
      }

      setIsLoading(false);
      console.log('🔐 Auth initialization complete');
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
