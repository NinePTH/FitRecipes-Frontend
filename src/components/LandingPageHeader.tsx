import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingPageHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <ChefHat className="h-8 w-8 text-primary-600" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              FitRecipes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/browse"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Browse Recipes
            </Link>
            <Link
              to="/terms"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Terms
            </Link>
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/browse"
                className="block text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Recipes
              </Link>
              <Link
                to="/terms"
                className="block text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Terms
              </Link>
              <div className="pt-4 space-y-2">
                <Link to="/auth" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
