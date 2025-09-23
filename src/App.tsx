
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '@/pages/AuthPage';
import { BrowseRecipesPage } from '@/pages/BrowseRecipesPage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { RecipeSubmissionPage } from '@/pages/RecipeSubmissionPage';
import { AdminRecipeApprovalPage } from '@/pages/AdminRecipeApprovalPage';

// TODO: Implement authentication context and protected routes
const isAuthenticated = true; // Mock authentication state
const userRole: 'chef' | 'admin' | 'customer' = 'admin'; // Mock user role

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={isAuthenticated ? <BrowseRecipesPage /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/recipe/:id" 
            element={isAuthenticated ? <RecipeDetailPage /> : <Navigate to="/auth" replace />} 
          />
          
          {/* Chef Only Routes */}
          <Route 
            path="/submit" 
            element={
              isAuthenticated && (userRole === 'chef' || userRole === 'admin') 
                ? <RecipeSubmissionPage /> 
                : <Navigate to="/" replace />
            } 
          />
          
          {/* Admin Only Routes */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated && userRole === 'admin' 
                ? <AdminRecipeApprovalPage /> 
                : <Navigate to="/" replace />
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
