import { useNavigate } from 'react-router-dom';
import { ChefHat, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-16 w-16 text-primary-600" />
            <span className="text-4xl font-bold text-gray-900">FitRecipes</span>
          </div>
        </div>

        {/* 404 Error */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Oops! The recipe you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} size="lg" className="w-full sm:w-auto">
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Illustration Text */}
        <div className="pt-8">
          <p className="text-sm text-gray-500">
            Lost in the kitchen? Let's get you back to cooking! 🍳
          </p>
        </div>
      </div>
    </div>
  );
}
