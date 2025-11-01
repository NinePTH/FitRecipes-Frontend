import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  ChefHat,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Layout } from '@/components/Layout';
import { getMyRecipes, deleteRecipe } from '@/services/recipe';
import type { Recipe } from '@/types';

export function MyRecipesPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<{ id: string; title: string } | null>(null);

  const fetchUserRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const statusFilter =
        filter === 'all'
          ? undefined
          : (filter.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED');
      const data = await getMyRecipes(statusFilter);
      setRecipes(data.recipes);
      setMeta(data.meta);
    } catch (err: unknown) {
      console.error('Error fetching recipes:', err);

      if (err && typeof err === 'object' && 'statusCode' in err) {
        const apiError = err as { statusCode: number; message: string };

        if (apiError.statusCode === 401) {
          navigate('/auth');
          return;
        } else if (apiError.statusCode === 403) {
          setError('You need CHEF or ADMIN role to access this page');
        } else {
          setError(apiError.message || 'Failed to load recipes');
        }
      } else {
        setError('Failed to load recipes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [filter, navigate]);

  useEffect(() => {
    fetchUserRecipes();
  }, [fetchUserRecipes]);

  const handleDelete = async (recipeId: string, recipeTitle: string) => {
    setRecipeToDelete({ id: recipeId, title: recipeTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    setDeletingId(recipeToDelete.id);
    setDeleteDialogOpen(false);

    try {
      await deleteRecipe(recipeToDelete.id);
      await fetchUserRecipes(); // Refresh the list
    } catch (err: unknown) {
      console.error('Error deleting recipe:', err);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setDeletingId(null);
      setRecipeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const getStatusBadge = (status: Recipe['status']) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1';
    switch (status) {
      case 'APPROVED':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <AlertCircle className="h-3 w-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading skeleton for recipe list only
  const RecipeListSkeleton = () => (
    <Card>
      <CardContent className="p-12">
        <div className="space-y-6 animate-pulse">
          {[1, 2].map(i => (
            <div
              key={i}
              className="flex flex-col md:flex-row bg-gray-200 rounded-lg overflow-hidden"
            >
              <div className="md:w-72 h-56 md:h-48 bg-gray-300"></div>
              <div className="flex-1 p-6 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12 max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <Button onClick={() => fetchUserRecipes()} className="mt-4">
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-primary-600" />
              <span>My Recipes</span>
            </h1>
            <p className="text-gray-600">Manage and track your submitted recipes</p>
          </div>
          <Link to="/submit-recipe">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Submit New Recipe
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <ChefHat className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Recipes</p>
                  <p className="text-2xl font-bold text-gray-900">{meta.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{meta.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{meta.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{meta.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Recipes', count: meta.total },
            { key: 'pending', label: 'Pending', count: meta.pending },
            { key: 'approved', label: 'Approved', count: meta.approved },
            { key: 'rejected', label: 'Rejected', count: meta.rejected },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Recipes List */}
        <div className="space-y-6">
          {loading ? (
            <RecipeListSkeleton />
          ) : recipes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'No recipes yet' : `No ${filter} recipes`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? 'Start sharing your culinary creations with the community!'
                    : `You don't have any ${filter} recipes at the moment.`}
                </p>
                {filter === 'all' && (
                  <Link to="/submit-recipe">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Recipe
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            recipes.map(recipe => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    {/* Recipe Image */}
                    <div className="md:w-72 flex-shrink-0 h-56 md:h-auto md:flex bg-gray-200 relative">
                      {(recipe.imageUrls && recipe.imageUrls.length > 0) ||
                      recipe.imageUrl ||
                      (recipe.images && recipe.images.length > 0) ? (
                        <img
                          src={recipe.imageUrls?.[0] || recipe.imageUrl || recipe.images?.[0] || ''}
                          alt={recipe.title}
                          className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <ChefHat className="h-12 w-12" />
                        </div>
                      )}
                    </div>

                    {/* Recipe Details */}
                    <div className="p-6 flex-1 md:flex md:flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                            {getStatusBadge(recipe.status)}
                          </div>
                          <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
                        </div>
                      </div>

                      {/* Recipe Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.prepTime + (recipe.cookingTime || 0)} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                        {recipe.status === 'APPROVED' && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{recipe.averageRating || 'No ratings'}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <p>Submitted on {formatDate(recipe.createdAt)}</p>
                          {recipe.updatedAt !== recipe.createdAt && (
                            <p>Updated on {formatDate(recipe.updatedAt)}</p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {recipe.status === 'APPROVED' && (
                            <Link to={`/recipe/${recipe.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          )}

                          {(recipe.status === 'PENDING' || recipe.status === 'REJECTED') && (
                            <Link to={`/submit-recipe?edit=${recipe.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(recipe.id, recipe.title)}
                            disabled={deletingId === recipe.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {deletingId === recipe.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      {recipe.status === 'REJECTED' && recipe.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                              <p className="text-sm text-red-700 mt-1">{recipe.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Recipe</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{recipeToDelete?.title}"? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deletingId !== null}>
                {deletingId ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
