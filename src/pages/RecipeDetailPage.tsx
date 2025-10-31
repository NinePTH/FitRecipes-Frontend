import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Heart, Share2, MessageCircle, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/Layout';
import { getRecipeById } from '@/services/recipe';
import type { Recipe } from '@/types';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('Recipe ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedRecipe = await getRecipeById(id);
        console.log('Fetched recipe data:', fetchedRecipe);
        console.log('Recipe type:', typeof fetchedRecipe);
        console.log('Recipe keys:', fetchedRecipe ? Object.keys(fetchedRecipe) : 'null');
        console.log('Recipe images:', fetchedRecipe?.images);
        console.log('Recipe imageUrl:', fetchedRecipe?.imageUrl);
        console.log('Recipe ingredients:', fetchedRecipe?.ingredients);
        console.log('Recipe instructions:', fetchedRecipe?.instructions);
        console.log('Recipe title:', fetchedRecipe?.title);
        setRecipe(fetchedRecipe);
      } catch (err: unknown) {
        console.error('Error fetching recipe:', err);
        
        if (err && typeof err === 'object' && 'statusCode' in err) {
          const apiError = err as { statusCode: number; message: string };
          
          if (apiError.statusCode === 404) {
            setError('Recipe not found');
          } else if (apiError.statusCode === 403) {
            setError('You do not have permission to view this recipe');
          } else {
            setError(apiError.message || 'Failed to load recipe');
          }
        } else {
          setError('Failed to load recipe. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // TODO: Submit rating to API
    console.log('Rating submitted:', rating);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmittingComment(true);

    // TODO: Submit comment to API
    console.log('Comment submitted:', comment);

    // Simulate adding comment to the list (replace with actual API call)
    setTimeout(() => {
      if (recipe) {
        const newComment = {
          id: `temp-${Date.now()}`,
          userId: 'current-user',
          user: {
            id: 'current-user',
            email: 'currentuser@example.com',
            firstName: 'Current',
            lastName: 'User',
            role: 'USER' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          content: comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setRecipe({
          ...recipe,
          comments: [newComment, ...(recipe.comments || [])],
          totalComments: (recipe.totalComments || 0) + 1,
        });
      }

      setComment('');
      setIsSubmittingComment(false);
    }, 1000);
  };

  // Get images array - handle imageUrls (new), images (deprecated), and imageUrl (deprecated)
  const recipeImages = recipe
    ? recipe.imageUrls && recipe.imageUrls.length > 0
      ? recipe.imageUrls
      : recipe.images && recipe.images.length > 0
        ? recipe.images
        : recipe.imageUrl
          ? [recipe.imageUrl]
          : []
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12 max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-6">
            {error.includes('permission')
              ? 'This recipe may be pending approval or has been rejected.'
              : 'Please try again later or contact support if the problem persists.'}
          </p>
          <Link to="/">
            <Button>Browse All Recipes</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Recipe not found</h1>
          <p className="text-gray-600 mt-2">The recipe you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="mt-4">Browse Recipes</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Recipes
        </Link>

        {/* Recipe Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
          <p className="text-xl text-gray-600">{recipe.description}</p>

          {/* Main Ingredient Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Main Ingredient:</span>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
              {recipe.mainIngredient}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime + (recipe.cookingTime || 0)} minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>
                  {recipe.averageRating} ({recipe.totalRatings} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Recipe Images */}
        {recipeImages.length > 0 && (
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-sm">
              <img
                src={recipeImages[selectedImageIndex]}
                alt={recipe.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {recipeImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {recipeImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-3 transition-all duration-200 hover:scale-105 ${
                      selectedImageIndex === index
                        ? 'border-primary-500 shadow-lg ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${recipe.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Image Placeholder */}
        {recipeImages.length === 0 && (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-sm flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-gray-600">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions?.map((instruction, index) => (
                    <li key={index} className="flex space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Info */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Prep Time</h4>
                  <p className="text-gray-600">{recipe.prepTime} minutes</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cook Time</h4>
                  <p className="text-gray-600">{recipe.cookingTime || 0} minutes</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Difficulty</h4>
                  <p className="text-gray-600 capitalize">{recipe.difficulty}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cuisine</h4>
                  <p className="text-gray-600">{recipe.cuisineType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Main Ingredient</h4>
                  <p className="text-gray-600">{recipe.mainIngredient}</p>
                </div>
                {recipe.dietaryInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900">Dietary Info</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipe.dietaryInfo.isVegetarian && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Vegetarian
                        </span>
                      )}
                      {recipe.dietaryInfo.isVegan && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Vegan
                        </span>
                      )}
                      {recipe.dietaryInfo.isGlutenFree && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Gluten-Free
                        </span>
                      )}
                      {recipe.dietaryInfo.isDairyFree && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Dairy-Free
                        </span>
                      )}
                      {recipe.dietaryInfo.isKeto && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Keto
                        </span>
                      )}
                      {recipe.dietaryInfo.isPaleo && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Paleo
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nutrition */}
            {recipe.nutritionInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition (per serving)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Calories</span>
                    <span>{recipe.nutritionInfo.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>{recipe.nutritionInfo.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs</span>
                    <span>{recipe.nutritionInfo.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span>{recipe.nutritionInfo.fat}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fiber</span>
                    <span>{recipe.nutritionInfo.fiber}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sodium</span>
                    <span>{recipe.nutritionInfo.sodium}mg</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chef Info */}
            {recipe.author && (
              <Card>
                <CardHeader>
                  <CardTitle>Chef</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {recipe.author.firstName[0]}
                        {recipe.author.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {recipe.author.firstName} {recipe.author.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Chef</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Rating and Comments */}
        <div className="space-y-6">
          {/* Rate this recipe */}
          <Card>
            <CardHeader>
              <CardTitle>Rate this Recipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className={`text-2xl ${
                      rating <= userRating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {userRating > 0
                    ? `You rated this ${userRating} star${userRating > 1 ? 's' : ''}`
                    : 'Click to rate'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Add Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Add a Comment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts about this recipe..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                />
                <Button type="submit" disabled={isSubmittingComment || !comment.trim()}>
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Comments ({recipe.totalComments})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipe.comments && recipe.comments.length > 0 ? (
                <div className="space-y-6">
                  {recipe.comments?.map(comment => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 hover:bg-gray-50 rounded-lg p-4 -m-4 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {comment.user.firstName[0]}
                            {comment.user.lastName[0]}
                          </span>
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {comment.user.firstName} {comment.user.lastName}
                            </h4>
                            {comment.user.role === 'CHEF' && (
                              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                Chef
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* TODO: Add related recipes section */}
        {/* TODO: Implement actual comment loading and display */}
        {/* TODO: Add print recipe functionality */}
        {/* TODO: Add recipe scaling (adjust servings) */}
      </div>
    </Layout>
  );
}
