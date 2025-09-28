import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import type { Recipe } from '@/types';

// Mock data for user's submitted recipes
const mockUserRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A healthy and colorful bowl packed with protein and fresh vegetables.',
    images: ['https://www.eatingbirdfood.com/wp-content/uploads/2022/11/mediterranean-quinoa-bowl-hero.jpg'],
    ingredients: [
      { id: '1', name: 'Quinoa', quantity: 1, unit: 'cup' },
      { id: '2', name: 'Cucumber', quantity: 1, unit: 'large' },
    ],
    instructions: [
      { id: '1', stepNumber: 1, description: 'Cook quinoa according to package instructions.' },
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    mealType: ['lunch', 'dinner'],
    dietType: ['vegetarian', 'gluten-free'],
    cuisineType: 'Mediterranean',
    mainIngredient: 'Quinoa',
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 11,
      fiber: 5,
      sodium: 380,
    },
    allergies: ['dairy'],
    ratings: [],
    comments: [],
    averageRating: 4.5,
    totalRatings: 12,
    totalComments: 5,
    status: 'approved',
    chefId: '1',
    chef: {
      id: '1',
      email: 'chef@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'chef',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-10T09:00:00Z',
    },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Spicy Thai Basil Chicken',
    description: 'Authentic Thai stir-fry with aromatic basil and chilies.',
    images: ['https://www.allrecipes.com/thmb/NimapCyPk8WQ1gcO-4J5Y6SQgLk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/257938-spicy-thai-basil-chicken-chef-john-4x3-84457b900e2e4ec5823e8ace55df7b34.jpg'],
    ingredients: [
      { id: '1', name: 'Chicken breast', quantity: 500, unit: 'g' },
      { id: '2', name: 'Thai basil', quantity: 1, unit: 'cup' },
    ],
    instructions: [
      { id: '1', stepNumber: 1, description: 'Heat oil in a wok over high heat.' },
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'medium',
    mealType: ['dinner'],
    dietType: ['gluten-free'],
    cuisineType: 'Thai',
    mainIngredient: 'Chicken',
    nutrition: {
      calories: 280,
      protein: 35,
      carbs: 8,
      fat: 12,
      fiber: 2,
      sodium: 890,
    },
    allergies: ['soy'],
    ratings: [],
    comments: [],
    averageRating: 0,
    totalRatings: 0,
    totalComments: 0,
    status: 'pending',
    chefId: '1',
    chef: {
      id: '1',
      email: 'chef@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'chef',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-10T09:00:00Z',
    },
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  },
  {
    id: '3',
    title: 'Classic Chocolate Chip Cookies',
    description: 'Perfectly chewy cookies with premium chocolate chips.',
    images: ['https://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/7/17/1/FN_Simple-Chocolate-Chip-Cookies_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1438794106265.webp'],
    ingredients: [
      { id: '1', name: 'All-purpose flour', quantity: 2.25, unit: 'cups' },
      { id: '2', name: 'Chocolate chips', quantity: 2, unit: 'cups' },
    ],
    instructions: [
      { id: '1', stepNumber: 1, description: 'Preheat oven to 375°F (190°C).' },
    ],
    prepTime: 20,
    cookTime: 12,
    servings: 24,
    difficulty: 'easy',
    mealType: ['dessert'],
    dietType: ['vegetarian'],
    cuisineType: 'American',
    mainIngredient: 'Flour',
    nutrition: {
      calories: 150,
      protein: 2,
      carbs: 22,
      fat: 7,
      fiber: 1,
      sodium: 95,
    },
    allergies: ['gluten', 'dairy', 'eggs'],
    ratings: [],
    comments: [],
    averageRating: 0,
    totalRatings: 0,
    totalComments: 0,
    status: 'rejected',
    rejectionReason: 'Recipe needs more detailed instructions and nutritional accuracy verification.',
    chefId: '1',
    chef: {
      id: '1',
      email: 'chef@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'chef',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-10T09:00:00Z',
    },
    createdAt: '2025-01-18T11:20:00Z',
    updatedAt: '2025-01-21T16:45:00Z',
  },
];

export function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    // TODO: Replace with actual API call to fetch user's recipes
    const fetchUserRecipes = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setRecipes(mockUserRecipes);
        setLoading(false);
      }, 1000);
    };

    fetchUserRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    if (filter === 'all') return true;
    return recipe.status === filter;
  });

  const getStatusBadge = (status: Recipe['status']) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1";
    switch (status) {
      case 'approved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <AlertCircle className="h-3 w-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'rejected':
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

  const handleDelete = async (recipeId: string) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      // TODO: Implement actual delete API call
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      console.log('Recipe deleted:', recipeId);
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

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col md:flex-row bg-gray-200 rounded-lg overflow-hidden">
                <div className="md:w-72 h-56 md:h-48 bg-gray-300"></div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
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
            <p className="text-gray-600">
              Manage and track your submitted recipes
            </p>
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
                  <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {recipes.filter(r => r.status === 'approved').length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {recipes.filter(r => r.status === 'pending').length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {recipes.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Recipes' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
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
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recipes List */}
        <div className="space-y-6">
          {filteredRecipes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' 
                    ? "No recipes yet" 
                    : `No ${filter} recipes`
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? "Start sharing your culinary creations with the community!"
                    : `You don't have any ${filter} recipes at the moment.`
                  }
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
            filteredRecipes.map(recipe => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    {/* Recipe Image */}
                    <div className="md:w-72 flex-shrink-0 h-56 md:h-auto md:flex bg-gray-200 relative">
                      <img
                        src={recipe.images[0]}
                        alt={recipe.title}
                        className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          console.log('Image failed to load:', recipe.images[0]);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    {/* Recipe Details */}
                    <div className="p-6 flex-1 md:flex md:flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {recipe.title}
                            </h3>
                            {getStatusBadge(recipe.status)}
                          </div>
                          <p className="text-gray-600 line-clamp-2">
                            {recipe.description}
                          </p>
                        </div>
                      </div>

                      {/* Recipe Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.prepTime + recipe.cookTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                        {recipe.status === 'approved' && (
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
                          {recipe.status === 'approved' && (
                            <Link to={`/recipe/${recipe.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          )}
                          
                          {(recipe.status === 'pending' || recipe.status === 'rejected') && (
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
                            onClick={() => handleDelete(recipe.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      {recipe.status === 'rejected' && recipe.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                              <p className="text-sm text-red-700 mt-1">
                                {recipe.rejectionReason}
                              </p>
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
      </div>
    </Layout>
  );
}