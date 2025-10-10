import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/Layout';
import type { Recipe } from '@/types';

// Mock data for pending recipes
const mockPendingRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spicy Thai Green Curry',
    description: 'Authentic Thai green curry with fresh herbs and coconut milk.',
    images: [
      'https://img-global.cpcdn.com/recipes/a6c3492e0161dd9f/680x781cq80/%E0%B8%A3%E0%B8%9B-%E0%B8%AB%E0%B8%A5%E0%B8%81-%E0%B8%82%E0%B8%AD%E0%B8%87-%E0%B8%AA%E0%B8%95%E0%B8%A3-%E0%B9%81%E0%B8%81%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%A2%E0%B8%A7%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99%E0%B9%84%E0%B8%81-%E0%B8%84%E0%B8%A5%E0%B8%99.jpg',
    ],
    ingredients: [],
    instructions: [],
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
    mealType: ['lunch', 'dinner'],
    dietType: ['gluten-free'],
    cuisineType: 'Thai',
    mainIngredient: 'Chicken',
    allergies: [],
    ratings: [],
    comments: [],
    averageRating: 0,
    totalRatings: 0,
    totalComments: 0,
    status: 'pending',
    chefId: '2',
    chef: {
      id: '2',
      email: 'chef2@example.com',
      firstName: 'John',
      lastName: 'Smith',
      role: 'CHEF',
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'Mediterranean Chickpea Salad',
    description: 'Fresh and healthy chickpea salad with Mediterranean flavors.',
    images: [
      'https://www.themediterraneandish.com/wp-content/uploads/2023/12/TMD-Chickpea-Salad-Leads-01-Angle-Horizontal.jpg',
    ],
    ingredients: [],
    instructions: [],
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: 'easy',
    mealType: ['lunch'],
    dietType: ['vegetarian', 'vegan'],
    cuisineType: 'Mediterranean',
    mainIngredient: 'Chickpeas',
    allergies: [],
    ratings: [],
    comments: [],
    averageRating: 0,
    totalRatings: 0,
    totalComments: 0,
    status: 'pending',
    chefId: '3',
    chef: {
      id: '3',
      email: 'chef3@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'CHEF',
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '2025-01-19T09:15:00Z',
    updatedAt: '2025-01-19T09:15:00Z',
  },
];

export function AdminRecipeApprovalPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Infinite scroll state
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPendingRecipes = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setRecipes(mockPendingRecipes);
        setLoading(false);
      }, 1000);
    };

    fetchPendingRecipes();
  }, []);

  const loadMoreRecipes = () => {
    // TODO: Implement infinite scroll
    console.log('Loading more recipes...');
    setIsFetchingNextPage(true);

    setTimeout(() => {
      setIsFetchingNextPage(false);
      // Simulate no more pages after first load
      setHasNextPage(false);
    }, 1000);
  };

  const handleApprove = async (recipeId: string) => {
    setIsProcessing(true);

    // TODO: Call API to approve recipe
    console.log('Approving recipe:', recipeId);

    // Simulate API call
    setTimeout(() => {
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setSelectedRecipe(null);
      setIsProcessing(false);
      // TODO: Show success notification
    }, 1000);
  };

  const handleReject = async (recipeId: string) => {
    if (!rejectionReason.trim()) {
      // TODO: Show error notification
      console.log('Rejection reason is required');
      return;
    }

    setIsProcessing(true);

    // TODO: Call API to reject recipe
    console.log('Rejecting recipe:', recipeId, 'Reason:', rejectionReason);

    // Simulate API call
    setTimeout(() => {
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setSelectedRecipe(null);
      setRejectionReason('');
      setIsProcessing(false);
      // TODO: Show success notification
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video relative">
        <img
          src={recipe.images[0] || 'https://via.placeholder.com/300x200'}
          alt={recipe.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
          Pending
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime + recipe.cookTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{recipe.chef.firstName}</span>
            </div>
          </div>
          <span className="text-xs">{formatDate(recipe.createdAt)}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {recipe.dietType.slice(0, 2).map(diet => (
            <span
              key={diet}
              className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
            >
              {diet}
            </span>
          ))}
          {recipe.dietType.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{recipe.dietType.length - 2}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedRecipe(recipe)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Review
          </Button>
          <Button
            size="sm"
            onClick={() => handleApprove(recipe.id)}
            disabled={isProcessing}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const RecipeDetailModal = ({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{recipe.title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recipe Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={recipe.images[0] || 'https://via.placeholder.com/400x300'}
                alt={recipe.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Recipe Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600">{recipe.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Prep Time:</span>
                  <span className="ml-2 text-gray-600">{recipe.prepTime} min</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Cook Time:</span>
                  <span className="ml-2 text-gray-600">{recipe.cookTime} min</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Servings:</span>
                  <span className="ml-2 text-gray-600">{recipe.servings}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Difficulty:</span>
                  <span className="ml-2 text-gray-600 capitalize">{recipe.difficulty}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Cuisine Type</h4>
                <p className="text-gray-600">{recipe.cuisineType}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Diet Types</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recipe.dietType.map(diet => (
                    <span
                      key={diet}
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Chef</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-gray-600">
                    {recipe.chef.firstName} {recipe.chef.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TODO: Show ingredients and instructions */}

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="rejectionReason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rejection Reason (if rejecting)
              </label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(recipe.id)}
                disabled={isProcessing || !rejectionReason.trim()}
              >
                <X className="h-4 w-4 mr-2" />
                {isProcessing ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button onClick={() => handleApprove(recipe.id)} disabled={isProcessing}>
                <Check className="h-4 w-4 mr-2" />
                {isProcessing ? 'Approving...' : 'Approve'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipe Approval</h1>
          <p className="text-gray-600 mt-2">Review and approve recipes submitted by chefs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{recipes.length}</p>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Approved Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Rejected Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Recipes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Recipes</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 aspect-video rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Recipes</h3>
                <p className="text-gray-600">All recipes have been reviewed. Great job!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              {/* Infinite Scroll Load More */}
              {hasNextPage && (
                <div className="text-center mt-8">
                  <Button
                    onClick={loadMoreRecipes}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    size="lg"
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load More Recipes'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            onClose={() => {
              setSelectedRecipe(null);
              setRejectionReason('');
            }}
          />
        )}

        {/* TODO: Add filtering and sorting options */}
        {/* TODO: Add bulk approval actions */}
        {/* TODO: Add rejection reason templates */}
        {/* TODO: Add approval history */}
      </div>
    </Layout>
  );
}
