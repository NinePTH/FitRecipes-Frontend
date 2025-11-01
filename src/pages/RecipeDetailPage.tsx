import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Heart, Share2, MessageCircle, ChevronLeft, AlertCircle, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import {
  getRecipeById,
  submitRating,
  getUserRating,
  deleteRating,
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from '@/services/recipe';
import type { Recipe } from '@/types';

type CommentItem = {
  id: string;
  recipeId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
};

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Rating state
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  
  // Comment state
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Confirmation dialog state
  const [deleteRatingDialog, setDeleteRatingDialog] = useState(false);
  const [ratingToDelete, setRatingToDelete] = useState(0);
  const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

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

  // Load user's rating when recipe is loaded
  useEffect(() => {
    const loadUserRating = async () => {
      if (!id || !user) return;
      
      try {
        const rating = await getUserRating(id);
        if (rating) {
          setUserRating(rating.rating);
        }
      } catch (error) {
        console.error('Error loading user rating:', error);
      }
    };

    loadUserRating();
  }, [id, user]);

  // Load comments when recipe is loaded
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      
      setLoadingComments(true);
      try {
        const result = await getComments(id, {
          page: commentPage,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });
        
        if (commentPage === 1) {
          setComments(result.comments);
        } else {
          setComments(prev => [...prev, ...result.comments]);
        }
        
        setHasMoreComments(result.pagination.hasNext);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [id, commentPage]);

  const handleRating = async (rating: number) => {
    if (!user) {
      alert('Please login to rate this recipe');
      return;
    }

    if (!id) return;

    // If clicking on the same star rating, show delete confirmation dialog
    if (rating === userRating) {
      setRatingToDelete(rating);
      setDeleteRatingDialog(true);
      return;
    }

    // Otherwise, submit new rating
    setIsSubmittingRating(true);
    try {
      const result = await submitRating(id, rating);
      setUserRating(result.rating.rating);
      
      // Update recipe stats
      if (recipe) {
        setRecipe({
          ...recipe,
          averageRating: result.recipeStats.averageRating,
          totalRatings: result.recipeStats.totalRatings,
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const confirmDeleteRating = async () => {
    if (!id) return;

    setIsSubmittingRating(true);
    try {
      const result = await deleteRating(id);
      setUserRating(0);
      
      // Update recipe stats
      if (recipe) {
        setRecipe({
          ...recipe,
          averageRating: result.recipeStats.averageRating,
          totalRatings: result.recipeStats.totalRatings,
        });
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Failed to delete rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!id) return;

    setIsSubmittingComment(true);

    try {
      const newComment = await addComment(id, comment.trim());
      
      // Add new comment to the top of the list
      setComments(prev => [newComment, ...prev]);
      
      // Update recipe total comments
      if (recipe) {
        setRecipe({
          ...recipe,
          totalComments: (recipe.totalComments || 0) + 1,
        });
      }

      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentEdit = async (commentId: string) => {
    if (!editingCommentContent.trim() || !id) return;

    try {
      const updated = await updateComment(id, commentId, editingCommentContent.trim());
      
      // Update comment in the list
      setComments(prev => {
        return prev.map(c => {
          if (c.id === commentId) {
            return { ...c, content: updated.content, updatedAt: updated.updatedAt };
          }
          return c;
        });
      });
      
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteCommentDialog(true);
  };

  const confirmDeleteComment = async () => {
    if (!id || !commentToDelete) return;

    try {
      await deleteComment(id, commentToDelete);
      
      // Remove comment from the list
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
      
      // Update recipe total comments
      if (recipe) {
        setRecipe({
          ...recipe,
          totalComments: Math.max(0, (recipe.totalComments || 0) - 1),
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const loadMoreComments = () => {
    setCommentPage(prev => prev + 1);
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
                    disabled={isSubmittingRating}
                    className={`text-2xl ${
                      rating <= userRating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={
                      rating === userRating
                        ? `Click to remove your ${rating}-star rating`
                        : `Rate ${rating} star${rating > 1 ? 's' : ''}`
                    }
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {isSubmittingRating
                    ? 'Submitting...'
                    : userRating > 0
                      ? `You rated this ${userRating} star${userRating > 1 ? 's' : ''} (click to remove)`
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
              {comments && comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map(commentItem => (
                    <div
                      key={commentItem.id}
                      className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 hover:bg-gray-50 rounded-lg p-4 -m-4 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {commentItem.user.firstName[0]}
                            {commentItem.user.lastName[0]}
                          </span>
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {commentItem.user.firstName} {commentItem.user.lastName}
                              </h4>
                              {commentItem.user.role === 'CHEF' && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                  Chef
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatDate(commentItem.createdAt)}
                              </span>
                            </div>
                            
                            {/* Edit/Delete buttons for own comments */}
                            {user && user.id === commentItem.userId && (
                              <div className="flex items-center space-x-2">
                                {editingCommentId === commentItem.id ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingCommentContent('');
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleCommentEdit(commentItem.id)}
                                      disabled={!editingCommentContent.trim()}
                                    >
                                      Save
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(commentItem.id);
                                        setEditingCommentContent(commentItem.content);
                                      }}
                                      className="text-gray-400 hover:text-primary-600 transition-colors"
                                      title="Edit comment"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleCommentDelete(commentItem.id)}
                                      className="text-gray-400 hover:text-red-600 transition-colors"
                                      title="Delete comment"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Comment text or edit textarea */}
                          {editingCommentId === commentItem.id ? (
                            <Textarea
                              value={editingCommentContent}
                              onChange={e => setEditingCommentContent(e.target.value)}
                              rows={3}
                              className="mt-2"
                            />
                          ) : (
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {commentItem.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Load More Comments Button */}
                  {hasMoreComments && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        onClick={loadMoreComments}
                        disabled={loadingComments}
                      >
                        {loadingComments ? 'Loading...' : 'Load More Comments'}
                      </Button>
                    </div>
                  )}
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

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          open={deleteRatingDialog}
          onOpenChange={setDeleteRatingDialog}
          onConfirm={confirmDeleteRating}
          title="Remove Your Rating?"
          description={`Are you sure you want to remove your ${ratingToDelete}-star rating? This action will update the recipe's average rating.`}
          confirmText="Remove Rating"
          cancelText="Cancel"
          variant="destructive"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />

        <ConfirmDialog
          open={deleteCommentDialog}
          onOpenChange={setDeleteCommentDialog}
          onConfirm={confirmDeleteComment}
          title="Delete Comment?"
          description="Are you sure you want to delete this comment? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      </div>
    </Layout>
  );
}
