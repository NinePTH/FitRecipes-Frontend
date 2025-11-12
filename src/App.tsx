import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, ToastProvider } from '@/contexts';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt';
import { useFcmListener } from '@/hooks/useFcmListener';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { requestPushPermission } from '@/services/pushNotifications';
import { AuthPage } from '@/pages/AuthPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { GoogleCallbackPage } from '@/pages/GoogleCallbackPage';
import { AcceptTermsPage } from '@/pages/AcceptTermsPage';
import { TermsViewPage } from '@/pages/TermsViewPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import ResendVerificationPage from '@/pages/ResendVerificationPage';
import { BrowseRecipesPage } from '@/pages/BrowseRecipesPage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { RecipeSubmissionPage } from '@/pages/RecipeSubmissionPage';
import { AdminRecipeApprovalPage } from '@/pages/AdminRecipeApprovalPage';
import { MyRecipesPage } from '@/pages/MyRecipesPage';
import { RecommendedRecipesPage } from '@/pages/RecommendedRecipesPage';
import { TrendingRecipesPage } from '@/pages/TrendingRecipesPage';
import { NewRecipesPage } from '@/pages/NewRecipesPage';
import { NotificationSettingsPage } from '@/pages/NotificationSettingsPage';
import { AllNotificationsPage } from '@/pages/AllNotificationsPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

// Inner component to access auth context
function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Debug: Log auth state
  useEffect(() => {
    console.log('🔐 Auth State:', {
      user: user ? `${user.firstName} ${user.lastName} (${user.email})` : null,
      isAuthenticated,
      isLoading,
      token: localStorage.getItem('fitrecipes_token') ? 'Present' : 'Missing',
      userInStorage: localStorage.getItem('fitrecipes_user') ? 'Present' : 'Missing',
    });
  }, [user, isAuthenticated, isLoading]);

  // Listen for FCM messages
  useFcmListener();

  // Request push permission after user logs in
  // NOTE: Chrome requires user gesture, so this automatic request will fail
  // Users should use the manual button in notification settings instead
  useEffect(() => {
    console.log('🔔 Push permission effect triggered. User:', user ? 'Logged in' : 'Not logged in');

    if (user && 'Notification' in window) {
      console.log('🔔 Checking push notification status...');
      console.log('Current permission:', Notification.permission);

      if (Notification.permission === 'granted') {
        console.log('✅ Push notifications already granted');
        // Register token if permission already granted
        const hasRegistered = localStorage.getItem('fcm_token_registered');
        if (!hasRegistered) {
          console.log('🔔 Registering FCM token...');
          requestPushPermission()
            .then(token => {
              if (token) {
                console.log('✅ FCM token registered');
                localStorage.setItem('fcm_token_registered', 'true');
              }
            })
            .catch(err => console.error('Failed to register FCM token:', err));
        }
      } else if (Notification.permission === 'denied') {
        console.log('❌ Push notifications denied by user');
      } else {
        console.log(
          '⚠️ Push notification permission not set. User needs to grant permission manually.'
        );
        console.log(
          '👉 Go to /notification-settings and click "Request Push Permission Now" button'
        );
      }
    } else if (!user) {
      console.log('No user logged in');
    } else if (!('Notification' in window)) {
      console.log('❌ Notifications not supported in this browser');
    }
  }, [user]);

  return (
    <div className="App">
      {/* Push Notification Prompt Banner (shows for authenticated users with default permission) */}
      {user && <PushNotificationPrompt />}

      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />
        <Route path="/accept-terms" element={<AcceptTermsPage />} />
        <Route path="/terms" element={<TermsViewPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />

        {/* Protected Routes - All authenticated users */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BrowseRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse-recipes"
          element={
            <ProtectedRoute>
              <BrowseRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/recommended"
          element={
            <ProtectedRoute>
              <RecommendedRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/trending"
          element={
            <ProtectedRoute>
              <TrendingRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/new"
          element={
            <ProtectedRoute>
              <NewRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute>
              <RecipeDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Chef and Admin only */}
        <Route
          path="/submit-recipe"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <RecipeSubmissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <MyRecipesPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminRecipeApprovalPage />
            </ProtectedRoute>
          }
        />

        {/* Notification Routes - All authenticated users */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AllNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification-settings"
          element={
            <ProtectedRoute>
              <NotificationSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
