import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import * as authService from '@/services/auth';

export function AcceptTermsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if user has already accepted terms
  useEffect(() => {
    if (user && user.termsAccepted) {
      console.log('✅ User already accepted terms, redirecting to home');
      const intendedPath = (location.state as { from?: string })?.from || '/';
      navigate(intendedPath, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleAcceptTerms = async () => {
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const message = await authService.acceptTerms();
      console.log('✅ Terms accepted:', message);

      // Refresh user data to update termsAccepted field
      await refreshUser();

      // Redirect to intended page or home
      const intendedPath = (location.state as { from?: string })?.from || '/';
      navigate(intendedPath, { replace: true });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to accept terms. Please try again.';
      setError(errorMessage);
      console.error('Accept terms error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const message = await authService.declineTerms();
      console.log('✅ Terms declined:', message);

      // Redirect to auth page (user is already logged out by declineTerms)
      navigate('/auth', { replace: true });
    } catch (err) {
      console.error('Decline terms error:', err);

      // Still redirect to auth page even if API fails (user is logged out anyway)
      navigate('/auth', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <ChefHat className="h-12 w-12 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">FitRecipes</span>
          </div>
          <p className="mt-2 text-gray-600">One more step to get started</p>
        </div>

        {/* Terms Acceptance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Terms & Conditions</CardTitle>
            <CardDescription className="text-center">
              Please review and accept our terms to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms Content */}
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms of Service</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  Welcome to FitRecipes! By using our platform, you agree to the following terms:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You will use the platform in accordance with all applicable laws</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>Content you submit must be original or properly attributed</li>
                  <li>We reserve the right to remove content that violates our guidelines</li>
                  <li>Your personal data will be handled according to our Privacy Policy</li>
                </ul>

                <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">Privacy Policy</h4>
                <p>
                  We collect and process your personal information to provide you with our services.
                  This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (name, email)</li>
                  <li>Recipes and content you create</li>
                  <li>Usage data and interactions with the platform</li>
                  <li>OAuth provider information (Google)</li>
                </ul>
                <p className="mt-4">
                  Your data is stored securely and will never be sold to third parties. You can
                  request deletion of your account and data at any time.
                </p>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-3 pt-4">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={e => {
                  setAgreeToTerms(e.target.checked);
                  if (error) setError(null);
                }}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I have read and agree to the{' '}
                <a
                  href="/accept-terms"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/accept-terms"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDecline}
                disabled={isLoading}
                className="flex-1"
              >
                Decline & Sign Out
              </Button>
              <Button
                type="button"
                onClick={handleAcceptTerms}
                disabled={isLoading || !agreeToTerms}
                className="flex-1"
              >
                {isLoading ? 'Accepting...' : 'Accept & Continue'}
              </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-center text-gray-500 pt-4">
              You must accept the terms to use FitRecipes. If you decline, you will be signed out.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
