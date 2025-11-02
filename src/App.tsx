import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ToastProvider } from '@/contexts';
import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { NotificationSidebar } from '@/components/ui/notification-sidebar'; // DISABLED: Waiting for backend
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          {/* <NotificationSidebar /> */} {/* DISABLED: Waiting for backend */}
          <div className="App">
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

            {/* Catch all - 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
