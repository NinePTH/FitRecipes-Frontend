import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

// TODO: Replace with actual user state from authentication context
const mockUser = {
  id: '1',
  name: 'John Doe',
  role: 'admin' as 'chef' | 'admin' | 'customer',
  avatar: null,
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">FitRecipes</span>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Browse Recipes
              </Link>

              {mockUser.role === 'chef' && (
                <Link
                  to="/submit"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/submit') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Submit Recipe
                </Link>
              )}

              {mockUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Recipe Approval
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Search Icon - Mobile */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* User Avatar & Dropdown - TODO: Implement dropdown */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900">
                  {mockUser.name}
                </span>
              </div>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
