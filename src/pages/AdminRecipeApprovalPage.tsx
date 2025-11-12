import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, Clock, User, MessageCircle, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/Layout';
import { adminApi } from '@/services/api';
import type { Recipe } from '@/types';
import { useToast } from '@/hooks/useToast';

export function AdminRecipeApprovalPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  // Statistics state
  const [stats, setStats] = useState({ pending: 0, approvedToday: 0, rejectedToday: 0 });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getApprovalStats('today');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fetch pending recipes (initial load only)
  useEffect(() => {
    const fetchPendingRecipes = async () => {
      setLoading(true);
      try {
        const result = await adminApi.getPendingRecipes({
          page: 1,
          limit: 6,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });

        setRecipes(result.recipes);
        setHasNextPage(result.pagination.hasNext);
      } catch (error) {
        console.error('Failed to fetch pending recipes:', error);
        showToast('error', 'Error loading recipes', 'Failed to load pending recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRecipes();
  }, [showToast]); // Only run once on mount

  const loadMoreRecipes = async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const result = await adminApi.getPendingRecipes({
        page: currentPage + 1,
        limit: 6,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      setRecipes(prev => [...prev, ...result.recipes]);
      setCurrentPage(currentPage + 1);
      setHasNextPage(result.pagination.hasNext);
    } catch (error) {
      console.error('Failed to load more recipes:', error);
      showToast('error', 'Error loading more recipes', 'Failed to load more recipes. Please try again.');
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  const handleApprove = async (recipeId: string) => {
    setIsProcessing(true);

    try {
      const result = await adminApi.approveRecipe(recipeId);

      // Remove from list and update stats
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approvedToday: prev.approvedToday + 1,
      }));

      setSelectedRecipe(null);
      showToast('success', 'Recipe approved', result.message || 'Recipe approved successfully!');
    } catch (error) {
      console.error('Failed to approve recipe:', error);
      showToast('error', 'Approval failed', 'Failed to approve recipe. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (recipeId: string, reason?: string) => {
    const reasonToUse = reason || rejectionReason;

    if (!reasonToUse.trim()) {
      showToast('error', 'Rejection reason required', 'Please provide a reason for rejection');
      return;
    }

    if (reasonToUse.trim().length < 10) {
      showToast('error', 'Reason too short', 'Rejection reason must be at least 10 characters');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await adminApi.rejectRecipe(recipeId, reasonToUse);

      // Remove from list and update stats
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejectedToday: prev.rejectedToday + 1,
      }));

      setSelectedRecipe(null);
      setRejectionReason('');
      showToast('success', 'Recipe rejected', result.message || 'Recipe rejected successfully');
    } catch (error) {
      console.error('Failed to reject recipe:', error);
      showToast('error', 'Rejection failed', 'Failed to reject recipe. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
      <div className="aspect-video relative bg-gray-200">
        {(recipe.imageUrls && recipe.imageUrls.length > 0) ||
        recipe.imageUrl ||
        (recipe.images && recipe.images.length > 0) ? (
          <img
            src={recipe.imageUrls?.[0] || recipe.imageUrl || recipe.images?.[0] || ''}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            onError={e => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <ChefHat className="h-12 w-12" />
          </div>
        )}
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
              <span>{recipe.prepTime + (recipe.cookingTime ?? 0)}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{recipe.author?.firstName ?? 'Unknown'}</span>
            </div>
          </div>
          <span className="text-xs">{formatDate(recipe.createdAt)}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {recipe.dietaryInfo && (
            <>
              {recipe.dietaryInfo.isVegan && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  Vegan
                </span>
              )}
              {recipe.dietaryInfo.isVegetarian && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  Vegetarian
                </span>
              )}
              {recipe.dietaryInfo.isGlutenFree && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  Gluten-Free
                </span>
              )}
              {recipe.dietaryInfo.isDairyFree && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  Dairy-Free
                </span>
              )}
              {recipe.dietaryInfo.isKeto && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  Keto
                </span>
              )}
              {recipe.dietaryInfo.isPaleo && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  Paleo
                </span>
              )}
            </>
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

  const RecipeDetailModal = ({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) => {
    const navigate = useNavigate();
    const [localRejectionReason, setLocalRejectionReason] = useState('');

    return (
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
                  src={
                    recipe.imageUrls?.[0] ||
                    recipe.images?.[0] ||
                    recipe.imageUrl ||
                    'https://via.placeholder.com/400x300'
                  }
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
                    <span className="ml-2 text-gray-600">{recipe.cookingTime ?? 0} min</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Servings:</span>
                    <span className="ml-2 text-gray-600">{recipe.servings}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Difficulty:</span>
                    <span className="ml-2 text-gray-600 capitalize">
                      {recipe.difficulty?.toLowerCase() ?? ''}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Cuisine Type</h4>
                  <p className="text-gray-600">{recipe.cuisineType}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Dietary Info</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recipe.dietaryInfo && (
                      <>
                        {recipe.dietaryInfo.isVegan && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            Vegan
                          </span>
                        )}
                        {recipe.dietaryInfo.isVegetarian && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            Vegetarian
                          </span>
                        )}
                        {recipe.dietaryInfo.isGlutenFree && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            Gluten-Free
                          </span>
                        )}
                        {recipe.dietaryInfo.isKeto && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            Keto
                          </span>
                        )}
                        {recipe.dietaryInfo.isPaleo && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            Paleo
                          </span>
                        )}
                        {recipe.dietaryInfo.isDairyFree && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            Dairy-Free
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Author</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-gray-600">
                      {recipe.author?.firstName ?? ''} {recipe.author?.lastName ?? ''}
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
                  value={localRejectionReason}
                  onChange={e => setLocalRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {/* View full details - navigate to public recipe detail page */}
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose();
                    navigate(`/recipe/${recipe.id}`);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(recipe.id, localRejectionReason)}
                  disabled={isProcessing || !localRejectionReason.trim()}
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
  };

  return (
    <>
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
                    <p className="text-2xl font-bold">{stats.pending}</p>
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
                    <p className="text-2xl font-bold">{stats.approvedToday}</p>
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
                    <p className="text-2xl font-bold">{stats.rejectedToday}</p>
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

          {/* TODO: Add filtering and sorting options */}
          {/* TODO: Add bulk approval actions */}
          {/* TODO: Add rejection reason templates */}
          {/* TODO: Add approval history */}
        </div>
      </Layout>

      {/* Recipe Detail Modal - Outside Layout for full-screen overlay */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => {
            setSelectedRecipe(null);
            setRejectionReason('');
          }}
        />
      )}
    </>
  );
}
