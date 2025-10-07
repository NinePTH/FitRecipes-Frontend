import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Loader2 } from 'lucide-react';
import type { User } from '@/types';

const TOKEN_KEY = 'fitrecipes_token';
const USER_KEY = 'fitrecipes_user';

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = () => {
      // Extract all parameters from URL
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');
      const email = searchParams.get('email');
      const firstName = searchParams.get('firstName');
      const lastName = searchParams.get('lastName');
      const role = searchParams.get('role') as User['role'] | null;
      const termsAcceptedParam = searchParams.get('termsAccepted');
      const isOAuthUserParam = searchParams.get('isOAuthUser');
      
      // Parse boolean fields from URL parameters
      const termsAccepted = termsAcceptedParam === 'true';
      const isOAuthUser = isOAuthUserParam === 'true';

      // Check if this is an error redirect from backend
      const errorParam = searchParams.get('error');
      const errorMessage = searchParams.get('message');

      if (errorParam) {
        // Handle OAuth errors from backend
        let displayMessage = 'Google authentication failed.';

        switch (errorParam) {
          case 'missing_code':
            displayMessage = 'Authorization code missing. Please try again.';
            break;
          case 'oauth_failed':
            displayMessage = errorMessage || 'Google authentication failed. Please try again.';
            break;
          case 'oauth_not_implemented':
            displayMessage = 'OAuth service is currently unavailable.';
            break;
          case 'invalid_callback':
            displayMessage = 'Invalid authentication response.';
            break;
          default:
            displayMessage = errorMessage || 'Authentication failed.';
        }

        setError(displayMessage);

        // Redirect to auth page with error
        setTimeout(() => {
          navigate(`/auth?error=${errorParam}&message=${encodeURIComponent(displayMessage)}`, {
            replace: true,
          });
        }, 2000);
        return;
      }

      // Validate required parameters for successful OAuth
      if (!token || !userId || !email || !firstName || !role) {
        setError('Invalid authentication response. Missing required information.');
        setTimeout(() => {
          navigate('/auth?error=invalid_callback', { replace: true });
        }, 2000);
        return;
      }

      try {
        // Store authentication token
        localStorage.setItem(TOKEN_KEY, token);

        // Build user object from URL parameters
        const user: User = {
          id: userId,
          email: email,
          firstName: firstName,
          lastName: lastName || '',
          role: role,
          isOAuthUser: isOAuthUser,
          isEmailVerified: true,
          termsAccepted: termsAccepted,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Store user data
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        // Check if user has accepted terms
        if (!termsAccepted) {
          setTimeout(() => {
            navigate('/accept-terms', { replace: true });
          }, 1000);
          return;
        }

        // User has already accepted terms
        const intendedPath = sessionStorage.getItem('oauth_redirect') || '/';
        sessionStorage.removeItem('oauth_redirect');

        setTimeout(() => {
          navigate(intendedPath, { replace: true });
        }, 1000);
      } catch (err) {
        console.error('Failed to process OAuth callback:', err);
        setError('Failed to complete sign in. Please try again.');
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <ChefHat className="h-16 w-16 text-primary-600" />
        </div>

        {/* Loading or Error State */}
        {error ? (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <div className="flex justify-center">
              <svg className="h-16 w-16 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-primary-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Completing Sign In</h2>
            <p className="text-gray-600">Please wait while we sign you in with Google...</p>
          </div>
        )}
      </div>
    </div>
  );
}
