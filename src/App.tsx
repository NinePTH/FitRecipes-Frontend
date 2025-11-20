import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, ToastProvider } from '@/contexts';
import { SavedRecipesProvider } from '@/contexts/SavedRecipesContext.tsx';
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
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ChefDashboardPage from '@/pages/ChefDashboardPage';
import UserManagementPage from '@/pages/UserManagementPage';
import ContentModerationPage from '@/pages/ContentModerationPage';
import SystemAnalyticsPage from '@/pages/SystemAnalyticsPage';
import ChefAnalyticsPage from '@/pages/ChefAnalyticsPage';
import ChefPerformancePage from '@/pages/ChefPerformancePage';
import AuditLogsPage from '@/pages/AuditLogsPage';

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
  const { user } = useAuth();

  // Listen for FCM messages
  useFcmListener();

  // Request push permission after user logs in
  // NOTE: Chrome requires user gesture, so this automatic request will fail
  // Users should use the manual button in notification settings instead
  useEffect(() => {
    if (user && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        // Register token if permission already granted
        const hasRegistered = localStorage.getItem('fcm_token_registered');
        if (!hasRegistered) {
          requestPushPermission()
            .then(token => {
              if (token) {
                localStorage.setItem('fcm_token_registered', 'true');
              }
            })
            .catch(err => console.error('Failed to register FCM token:', err));
        }
      }
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
          path="/chef/submit-recipe"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <RecipeSubmissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/my-recipes"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <MyRecipesPage />
            </ProtectedRoute>
          }
        />

        {/* Chef Dashboard Routes */}
        <Route
          path="/chef/dashboard"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <ChefDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/analytics"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <ChefAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/analytics/:recipeId"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <ChefAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/performance"
          element={
            <ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
              <ChefPerformancePage />
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

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recipes"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminRecipeApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <ContentModerationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <SystemAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AuditLogsPage />
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
          <SavedRecipesProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </SavedRecipesProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
