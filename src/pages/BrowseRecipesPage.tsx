import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Star, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import type { Recipe, RecipeFilters, SortOption } from '@/types';

// Mock data - TODO: Replace with API calls
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A healthy and colorful bowl packed with protein and fresh vegetables.',
    images: ['https://via.placeholder.com/300x200'],
    ingredients: [],
    instructions: [],
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: 'easy',
    mealType: ['lunch', 'dinner'],
    dietType: ['vegetarian', 'gluten-free'],
    cuisineType: 'Mediterranean',
    mainIngredient: 'Quinoa',
    allergies: [],
    ratings: [],
    comments: [],
    averageRating: 4.5,
    totalRatings: 12,
    totalComments: 5,
    status: 'approved',
    chefId: '1',
    chef: { id: '1', email: 'chef@example.com', firstName: 'Maria', lastName: 'Rodriguez', role: 'chef', createdAt: '', updatedAt: '' },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  // Add more mock recipes as needed
];

export function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters] = useState<RecipeFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Infinite scroll state
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRecipes = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setRecipes(mockRecipes);
        setLoading(false);
      }, 1000);
    };

    fetchRecipes();
  }, [searchTerm, filters, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchTerm);
  };

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

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="aspect-video relative">
          <img
            src={recipe.images[0] || 'https://via.placeholder.com/300x200'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{recipe.averageRating}</span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime + recipe.cookTime}m</span>
              </div>
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
            <span className="text-xs">by {recipe.chef.firstName}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {recipe.dietType.slice(0, 2).map((diet) => (
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
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Discover Healthy Recipes</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find delicious, nutritious recipes from our community of talented chefs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by ingredients, recipe name, or cuisine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* TODO: Implement expandable filter panel */}
          {showFilters && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-500">
                Filter options will be implemented here (Meal Type, Diet Type, Difficulty, etc.)
              </p>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Highest Rating</option>
                <option value="recent">Most Recent</option>
                <option value="prep-time-asc">Prep Time (Low to High)</option>
                <option value="prep-time-desc">Prep Time (High to Low)</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {recipes.length} recipes found
            </span>
          </div>
        </div>

        {/* Recipe Sections */}
        <div className="space-y-12">
          {/* Recommended for You */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 aspect-video rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.slice(0, 4).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>

          {/* Trending Recipes */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Recipes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>

          {/* New Recipes */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Plus className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">New Recipes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>

          {/* Infinite Scroll Load More */}
          {hasNextPage && (
            <div className="text-center">
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
        </div>

        {/* TODO: Implement infinite scroll with intersection observer */}
        {/* TODO: Add skeleton loading states */}
        {/* TODO: Add error handling */}
        {/* TODO: Add empty state */}
      </div>
    </Layout>
  );
}