import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/NotificationBell';
import { SavedRecipesIcon } from '@/components/SavedRecipesIcon';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary-600" />
              <span className="hidden md:block text-xl font-bold text-gray-900">FitRecipes</span>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Browse Recipes
              </Link>

              {(user.role === 'CHEF' || user.role === 'ADMIN') && (
                <Link
                  to="/chef/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/chef')
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Chef Dashboard
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <NotificationBell />

              {/* Saved Recipes */}
              <SavedRecipesIcon />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* User Avatar & Info */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
                className="hidden lg:flex items-center justify-center"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu */}
          <div className="relative z-50 lg:hidden bg-white border-b shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
              <Link
                to="/"
                className={`block text-base font-medium transition-colors ${
                  isActive('/') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Recipes
              </Link>

              {(user.role === 'CHEF' || user.role === 'ADMIN') && (
                <Link
                  to="/chef/dashboard"
                  className={`block text-base font-medium transition-colors ${
                    location.pathname.startsWith('/chef')
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Chef Dashboard
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className={`block text-base font-medium transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <span className="text-base font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-0 h-auto text-base font-medium text-gray-500 hover:text-gray-900"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ChefHat className="h-6 w-6 text-primary-600" />
                <span className="font-bold text-gray-900">FitRecipes</span>
              </div>
              <p className="text-sm text-gray-600">
                Discover and share healthy, delicious recipes from around the world.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Recipes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/" className="hover:text-gray-900">
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-gray-900">
                    Trending
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-gray-900">
                    New Recipes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Top Chefs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Forums
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 mt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 FitRecipes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
