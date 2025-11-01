import { useState, useEffect } from 'react';
import { Clock, Star, ChefHat, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { getNewRecipes } from '@/services/recipe';
import type { Recipe } from '@/types';

export function NewRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const RECIPES_PER_PAGE = 12;

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await getNewRecipes(RECIPES_PER_PAGE);
        setRecipes(response.recipes);
        setCurrentPage(1);
        setHasNextPage(response.recipes.length === RECIPES_PER_PAGE);
      } catch (error) {
        console.error('Error fetching new recipes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const loadMoreRecipes = async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      // Note: Backend might need pagination support for new recipes
      const response = await getNewRecipes(RECIPES_PER_PAGE * (currentPage + 1));
      const newRecipes = response.recipes.slice(recipes.length);
      setRecipes(prev => [...prev, ...newRecipes]);
      setCurrentPage(prev => prev + 1);
      setHasNextPage(response.recipes.length === RECIPES_PER_PAGE * (currentPage + 1));
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="aspect-video relative bg-gray-200">
          {(recipe.imageUrls && recipe.imageUrls.length > 0) ||
          recipe.imageUrl ||
          (recipe.images && recipe.images.length > 0) ? (
            <img
              src={recipe.imageUrls?.[0] || recipe.imageUrl || recipe.images?.[0] || ''}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <ChefHat className="h-12 w-12" />
            </div>
          )}
          <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>New</span>
          </div>
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{recipe.averageRating}</span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime + (recipe.cookingTime ?? 0)}m</span>
              </div>
              <span className="capitalize">{recipe.difficulty.toLowerCase()}</span>
            </div>
            <span className="text-xs">by {recipe.author.firstName}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {recipe.dietaryInfo && (
              <>
                {recipe.dietaryInfo.isVegan && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Vegan
                  </span>
                )}
                {recipe.dietaryInfo.isVegetarian && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Vegetarian
                  </span>
                )}
                {recipe.dietaryInfo.isGlutenFree && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
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
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Paleo
                  </span>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center space-x-3">
            <Sparkles className="h-10 w-10 text-blue-600" />
            <span>New Recipes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest recipes added to our community
          </p>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No new recipes yet</h3>
            <p className="text-gray-600">
              Be the first to contribute! Share your recipe with the community.
            </p>
            <Link to="/submit-recipe">
              <Button className="mt-4">Submit a Recipe</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center pt-8">
                <Button
                  onClick={loadMoreRecipes}
                  disabled={isFetchingNextPage}
                  size="lg"
                  variant="outline"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More Recipes'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
