import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  Star,
  TrendingUp,
  X,
  Plus,
  ChefHat,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { savedRecipesApi } from '@/services/savedRecipesApi';
import {
  useSmartSearch,
  useVectorSearch,
  useIngredientSearch,
  useHybridSearch,
} from '@/hooks/useSearch';
import { useSearchSuggestions, useIngredientSuggestions } from '@/hooks/useSearchSuggestions';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Layout } from '@/components/Layout';
import {
  browseRecipes,
  getRecommendedRecipes,
  getTrendingRecipes,
  getNewRecipes,
} from '@/services/recipe';
import type { Recipe, RecipeFilters, SortOption } from '@/types';

export function BrowseRecipesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [newRecipes, setNewRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [savedStatusMap, setSavedStatusMap] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Search integration with multiple methods
  const smartSearchApi = useSmartSearch({ limit: 20, autoSearch: false, debounceMs: 500 });
  const vectorSearchApi = useVectorSearch({ limit: 20 });
  const ingredientSearchApi = useIngredientSearch({ limit: 20 });
  const hybridSearchApi = useHybridSearch({ limit: 20 });

  const [searchMethod, setSearchMethod] = useState<'smart' | 'vector' | 'ingredient' | 'hybrid'>(
    'smart'
  );
  const [searchMode, setSearchMode] = useState<'browse' | 'search'>('browse');
  const [searchQuery, setSearchQuery] = useState('');

  // Search suggestions with real API integration (300ms debounce)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionApi = useSearchSuggestions(300);
  const ingredientSuggestionApi = useIngredientSuggestions(300);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Fetch main recipes with filters
  useEffect(() => {
    // Don't fetch browse recipes if in search mode
    if (searchMode === 'search') {
      return;
    }

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        // Convert UI filters to API format
        const apiFilters: {
          page: number;
          limit: number;
          sortBy: SortOption;
          sortOrder: 'asc' | 'desc';
          mealType?: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT'>;
          difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
          cuisineType?: string;
          mainIngredient?: string;
          maxPrepTime?: number;
          isVegetarian?: boolean;
          isVegan?: boolean;
          isGlutenFree?: boolean;
          isDairyFree?: boolean;
          isKeto?: boolean;
          isPaleo?: boolean;
        } = {
          page: 1,
          limit: 8,
          sortBy,
          sortOrder: 'desc',
        };

        // Map meal types
        if (filters.mealType && filters.mealType.length > 0) {
          apiFilters.mealType = filters.mealType;
        }

        // Map difficulty
        if (filters.difficulty && filters.difficulty.length > 0) {
          apiFilters.difficulty = filters.difficulty;
        }

        // Map other filters
        if (filters.cuisineType) apiFilters.cuisineType = filters.cuisineType;
        if (filters.mainIngredient) apiFilters.mainIngredient = filters.mainIngredient;
        if (filters.maxPrepTime) apiFilters.maxPrepTime = filters.maxPrepTime;

        // Map dietary filters
        if (filters.dietType) {
          if (filters.dietType.includes('vegetarian')) apiFilters.isVegetarian = true;
          if (filters.dietType.includes('vegan')) apiFilters.isVegan = true;
          if (filters.dietType.includes('gluten-free')) apiFilters.isGlutenFree = true;
          if (filters.dietType.includes('dairy-free')) apiFilters.isDairyFree = true;
          if (filters.dietType.includes('keto')) apiFilters.isKeto = true;
          if (filters.dietType.includes('paleo')) apiFilters.isPaleo = true;
        }

        const response = await browseRecipes(apiFilters);
        setRecipes(response.recipes);
        setCurrentPage(response.pagination.page);
        setHasNextPage(response.pagination.hasNext);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filters, sortBy, searchMode]);

  // Fetch recommended, trending, and new recipes on mount
  useEffect(() => {
    const fetchSpecialSections = async () => {
      try {
        const [recommended, trending, newRec] = await Promise.all([
          getRecommendedRecipes(4),
          getTrendingRecipes(4, '7d'),
          getNewRecipes(4),
        ]);
        setRecommendedRecipes(recommended.recipes);
        setTrendingRecipes(trending.recipes);
        setNewRecipes(newRec.recipes);
      } catch (error) {
        console.error('Error fetching special sections:', error);
      }
    };

    fetchSpecialSections();
  }, []);

  // Bulk check saved status for all visible recipes
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) {
        setSavedStatusMap({});
        return;
      }

      // Collect all recipe IDs from all sections
      const allRecipeIds = [
        ...recipes.map(r => r.id),
        ...recommendedRecipes.map(r => r.id),
        ...trendingRecipes.map(r => r.id),
        ...newRecipes.map(r => r.id),
      ].filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

      if (allRecipeIds.length === 0) return;

      try {
        const response = await savedRecipesApi.bulkCheckSaved(allRecipeIds);
        const statusMap: Record<string, boolean> = {};

        // Handle both array and object formats
        if (response && response.savedRecipes) {
          if (Array.isArray(response.savedRecipes)) {
            // Array format: [{ recipeId: "123", isSaved: true }, ...]
            response.savedRecipes.forEach((item: { recipeId: string; isSaved: boolean }) => {
              statusMap[item.recipeId] = item.isSaved;
            });
          } else if (typeof response.savedRecipes === 'object') {
            // Object/Map format: { "123": true, "456": false, ... }
            Object.entries(response.savedRecipes).forEach(([recipeId, isSaved]) => {
              statusMap[recipeId] = isSaved as boolean;
            });
          }
          setSavedStatusMap(statusMap);
        } else {
          console.warn('Bulk check API returned unexpected format:', response);
          setSavedStatusMap({});
        }
      } catch (_error) {
        console.error('Error checking saved status:', _error);
        // Graceful degradation: just don't show saved status
        setSavedStatusMap({});
      }
    };

    checkSavedStatus();
  }, [recipes, recommendedRecipes, trendingRecipes, newRecipes, user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);

    const query = searchQuery.trim();

    if (!query) {
      // Empty search - switch back to browse mode
      setSearchMode('browse');
      setRecipes([]);
      return;
    }

    // Execute search based on selected method
    setSearchMode('search');
    setRecipes([]); // Clear old results immediately
    setFilters({}); // Clear filters - search API doesn't support filtering
    setShowFilters(false);

    try {
      switch (searchMethod) {
        case 'smart':
          if (smartSearchApi.isAvailable) {
            await smartSearchApi.search(query, filters);
            setRecipes(smartSearchApi.results);
          }
          break;
        case 'vector':
          await vectorSearchApi.search(query, filters);
          setRecipes(vectorSearchApi.results);
          break;
        case 'ingredient': {
          // Split query by commas to handle multiple ingredients
          const ingredients = query
            .split(',')
            .map(ing => ing.trim())
            .filter(ing => ing.length > 0);
          await ingredientSearchApi.search(ingredients, 'any', filters);
          setRecipes(ingredientSearchApi.results);
          break;
        }
        case 'hybrid':
          await hybridSearchApi.search(query, filters);
          setRecipes(hybridSearchApi.results);
          break;
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback: Use regular browse with mainIngredient filter
      setSearchMode('browse');
      setFilters(prev => ({ ...prev, mainIngredient: query }));
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);

    // Clear search results if input is empty
    if (!value.trim() && searchMode === 'search') {
      setSearchMode('browse');
      // Refetch browse recipes
      setFilters(prev => ({ ...prev }));
      suggestionApi.clearSuggestions();
      setShowSuggestions(false);
      return;
    }

    // Fetch suggestions based on search method
    if (value.trim().length >= 2) {
      // Use ingredient suggestions for ingredient search, recipe suggestions for others
      if (searchMethod === 'ingredient') {
        // For ingredient search, only suggest based on the current ingredient being typed
        // (text after the last comma)
        const lastCommaIndex = value.lastIndexOf(',');
        const currentIngredient =
          lastCommaIndex === -1 ? value.trim() : value.substring(lastCommaIndex + 1).trim();

        // Only fetch if current ingredient has at least 2 characters
        if (currentIngredient.length >= 2) {
          ingredientSuggestionApi.fetchSuggestions(currentIngredient);
          setShowSuggestions(true);
        } else {
          ingredientSuggestionApi.clearSuggestions();
          setShowSuggestions(false);
        }
      } else {
        suggestionApi.fetchSuggestions(value.trim());
        setShowSuggestions(true);
      }
    } else {
      suggestionApi.clearSuggestions();
      ingredientSuggestionApi.clearSuggestions();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (recipeTitle: string) => {
    setShowSuggestions(false);
    // Complete the search query with the selected recipe title
    setSearchQuery(recipeTitle);
    // Trigger search programmatically
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  };

  const handleIngredientSelect = (ingredientName: string) => {
    // Replace only the current ingredient being typed (after last comma)
    const currentQuery = searchQuery.trim();
    const lastCommaIndex = currentQuery.lastIndexOf(',');

    let newQuery: string;
    if (lastCommaIndex === -1) {
      // No comma found - replace entire query
      newQuery = ingredientName;
    } else {
      // Replace text after last comma
      const beforeLastComma = currentQuery.substring(0, lastCommaIndex + 1);
      newQuery = `${beforeLastComma} ${ingredientName}`;
    }

    setSearchQuery(newQuery);
    setShowSuggestions(false);

    // Optionally trigger search immediately
    // handleSearch(new Event('submit') as any);
  };

  // Check if any filters are applied (excluding sortBy which is always set)
  const hasAnyFilters = () => {
    return (
      (filters.mealType && filters.mealType.length > 0) ||
      (filters.difficulty && filters.difficulty.length > 0) ||
      (filters.dietType && filters.dietType.length > 0) ||
      !!filters.cuisineType ||
      !!filters.mainIngredient ||
      !!filters.maxPrepTime
    );
  };

  // Get current search API for loading/error states
  const currentSearchApi = {
    smart: smartSearchApi,
    vector: vectorSearchApi,
    ingredient: ingredientSearchApi,
    hybrid: hybridSearchApi,
  }[searchMethod];

  // Update recipes when search results change
  useEffect(() => {
    if (searchMode === 'search' && currentSearchApi.results.length > 0) {
      setRecipes(currentSearchApi.results);
      setLoading(false);
    }
  }, [currentSearchApi.results, searchMode]);

  const loadMoreRecipes = async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      // Build API filters (same as main fetch)
      const apiFilters: {
        page: number;
        limit: number;
        sortBy: SortOption;
        sortOrder: 'asc' | 'desc';
        mealType?: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT'>;
        difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
        cuisineType?: string;
        mainIngredient?: string;
        maxPrepTime?: number;
        isVegetarian?: boolean;
        isVegan?: boolean;
        isGlutenFree?: boolean;
        isDairyFree?: boolean;
        isKeto?: boolean;
        isPaleo?: boolean;
      } = {
        page: currentPage + 1,
        limit: 8,
        sortBy,
        sortOrder: 'desc',
      };

      if (filters.mealType && filters.mealType.length > 0) {
        apiFilters.mealType = filters.mealType;
      }
      if (filters.difficulty && filters.difficulty.length > 0) {
        apiFilters.difficulty = filters.difficulty;
      }
      if (filters.cuisineType) apiFilters.cuisineType = filters.cuisineType;
      if (filters.mainIngredient) apiFilters.mainIngredient = filters.mainIngredient;
      if (filters.maxPrepTime) apiFilters.maxPrepTime = filters.maxPrepTime;

      if (filters.dietType) {
        if (filters.dietType.includes('vegetarian')) apiFilters.isVegetarian = true;
        if (filters.dietType.includes('vegan')) apiFilters.isVegan = true;
        if (filters.dietType.includes('gluten-free')) apiFilters.isGlutenFree = true;
        if (filters.dietType.includes('dairy-free')) apiFilters.isDairyFree = true;
        if (filters.dietType.includes('keto')) apiFilters.isKeto = true;
        if (filters.dietType.includes('paleo')) apiFilters.isPaleo = true;
      }

      const response = await browseRecipes(apiFilters);
      setRecipes(prev => [...prev, ...response.recipes]);
      setCurrentPage(response.pagination.page);
      setHasNextPage(response.pagination.hasNext);
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const { toggleSaveRecipe } = useSavedRecipes();
    const saved = savedStatusMap[recipe.id] || false;

    const handleToggleSave = async (e: React.MouseEvent) => {
      e.stopPropagation();

      // Optimistic update
      setSavedStatusMap(prev => ({
        ...prev,
        [recipe.id]: !saved,
      }));

      try {
        await toggleSaveRecipe(recipe);
      } catch {
        // Revert on error
        setSavedStatusMap(prev => ({
          ...prev,
          [recipe.id]: saved,
        }));
      }
    };

    return (
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow duration-200 relative group cursor-pointer"
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
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
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                saved
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={saved ? 'Remove from saved' : 'Save recipe'}
              title={saved ? 'Remove from saved' : 'Save recipe'}
            >
              <Bookmark className={`h-3 w-3 ${saved ? 'fill-current' : ''}`} />
            </button>
            <div className="bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>{recipe.averageRating}</span>
            </div>
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
            <span className="text-xs">
              by{' '}
              {'authorFirstName' in recipe
                ? (recipe as unknown as { authorFirstName: string }).authorFirstName
                : recipe.author?.firstName || 'Unknown'}
            </span>
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
    );
  };

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
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <form onSubmit={handleSearch} className="space-y-3 md:space-y-0">
            {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {/* Search Input */}
              <div className="flex-1 relative order-2 md:order-1">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Search by ingredients, recipe name, or cuisine..."
                    value={searchQuery}
                    onChange={e => handleSearchInputChange(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 w-full"
                    disabled={currentSearchApi.loading}
                  />
                </div>
                {/* Search Suggestions Dropdown */}
                {showSuggestions &&
                  (searchMethod === 'ingredient'
                    ? ingredientSuggestionApi.loading ||
                      ingredientSuggestionApi.suggestions.length > 0
                    : suggestionApi.loading || suggestionApi.suggestions.length > 0) && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md border shadow-lg">
                      <Command>
                        <CommandList className="max-h-[300px]">
                          {(
                            searchMethod === 'ingredient'
                              ? ingredientSuggestionApi.loading
                              : suggestionApi.loading
                          ) ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                              <Sparkles className="h-5 w-5 mx-auto mb-2 animate-pulse" />
                              Loading suggestions...
                            </div>
                          ) : (
                              searchMethod === 'ingredient'
                                ? ingredientSuggestionApi.error
                                : suggestionApi.error
                            ) ? (
                            <div className="px-4 py-4 text-center text-sm text-red-500">
                              {searchMethod === 'ingredient'
                                ? ingredientSuggestionApi.error
                                : suggestionApi.error}
                            </div>
                          ) : (
                              searchMethod === 'ingredient'
                                ? ingredientSuggestionApi.suggestions.length === 0
                                : suggestionApi.suggestions.length === 0
                            ) ? (
                            <CommandEmpty>No suggestions found.</CommandEmpty>
                          ) : searchMethod === 'ingredient' ? (
                            <CommandGroup>
                              {ingredientSuggestionApi.suggestions.map((suggestion, index) => {
                                return (
                                  <CommandItem
                                    key={`${suggestion.name}-${index}`}
                                    onClick={() => handleIngredientSelect(suggestion.name)}
                                    className="cursor-pointer flex items-center justify-between py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Plus className="h-4 w-4 text-green-600" />
                                      <div>
                                        <div className="font-medium text-green-600">
                                          {suggestion.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {suggestion.category}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                                          suggestion.match_type === 'exact'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}
                                      >
                                        {suggestion.match_type}
                                      </span>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          ) : (
                            <CommandGroup>
                              {suggestionApi.suggestions.map(suggestion => {
                                return (
                                  <CommandItem
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionSelect(suggestion.title)}
                                    className="cursor-pointer flex items-center justify-between py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <ChefHat className="h-4 w-4 text-purple-600" />
                                      <div>
                                        <div className="font-medium text-purple-600">
                                          {suggestion.title}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                          {suggestion.cuisineType && (
                                            <span>{suggestion.cuisineType}</span>
                                          )}
                                          {suggestion.mainIngredient && (
                                            <span>• {suggestion.mainIngredient}</span>
                                          )}
                                          {suggestion.averageRating > 0 && (
                                            <span className="flex items-center gap-1">
                                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                              {suggestion.averageRating.toFixed(1)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                                          suggestion.match_type === 'title'
                                            ? 'bg-green-100 text-green-700'
                                            : suggestion.match_type === 'description'
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-gray-100 text-gray-600'
                                        }`}
                                      >
                                        {suggestion.match_type}
                                      </span>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </div>
                  )}
                {/* Show error if suggestions API fails but don't block search */}
                {showSuggestions &&
                  (searchMethod === 'ingredient'
                    ? ingredientSuggestionApi.error
                    : suggestionApi.error) && (
                    <div className="absolute z-50 w-full mt-1 bg-yellow-50 border border-yellow-200 rounded-md p-2">
                      <p className="text-xs text-yellow-700">
                        Suggestions unavailable. You can still search using the button below.
                      </p>
                    </div>
                  )}
              </div>

              {/* Search Method Selector */}
              <select
                value={searchMethod}
                onChange={e =>
                  setSearchMethod(e.target.value as 'smart' | 'vector' | 'ingredient' | 'hybrid')
                }
                className="w-full md:w-auto px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm appearance-none bg-no-repeat bg-right order-1 md:order-2"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="smart">Smart Search</option>
                {/* <option value="vector">Vector Search</option> */}
                <option value="ingredient">Ingredient</option>
                {/* <option value="hybrid">Hybrid</option> */}
              </select>

              {/* Search and Filter Buttons */}
              <div className="flex gap-3 md:gap-4 order-3">
                <Button
                  type="submit"
                  className="flex-1 md:flex-none"
                  disabled={currentSearchApi.loading}
                >
                  {currentSearchApi.loading ? 'Searching...' : 'Search'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 md:flex-none"
                  disabled={searchMode === 'search'}
                  title={searchMode === 'search' ? 'Filters not available in search mode' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </form>

          {/* Search Mode Info Message */}
          {searchMode === 'search' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <p className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Filters and sorting are currently not available in search mode. Filter search will
                be available in future updates.
              </p>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <div className="border-t pt-6 mt-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filter Recipes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({})}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Meal Type Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Meal Type</h4>
                  <div className="space-y-2">
                    {(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT'] as const).map(
                      mealType => (
                        <label
                          key={mealType}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.mealType?.includes(mealType) || false}
                            onChange={e => {
                              const currentMealTypes = filters.mealType || [];
                              if (e.target.checked) {
                                setFilters({
                                  ...filters,
                                  mealType: [...currentMealTypes, mealType],
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  mealType: currentMealTypes.filter(type => type !== mealType),
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {mealType.toLowerCase()}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Diet Type Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Diet Type</h4>
                  <div className="space-y-2">
                    {(
                      ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'] as const
                    ).map(dietType => (
                      <label key={dietType} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.dietType?.includes(dietType) || false}
                          onChange={e => {
                            const currentDietTypes = filters.dietType || [];
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                dietType: [...currentDietTypes, dietType],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                dietType: currentDietTypes.filter(type => type !== dietType),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {dietType.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Difficulty</h4>
                  <div className="space-y-2">
                    {(['EASY', 'MEDIUM', 'HARD'] as const).map(difficulty => (
                      <label
                        key={difficulty}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.difficulty?.includes(difficulty) || false}
                          onChange={e => {
                            const currentDifficulties = filters.difficulty || [];
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                difficulty: [...currentDifficulties, difficulty],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                difficulty: currentDifficulties.filter(d => d !== difficulty),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {difficulty.toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cuisine Type Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Cuisine Type</h4>
                  <select
                    value={filters.cuisineType || ''}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        cuisineType: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Cuisines</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Asian">Asian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Italian">Italian</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="French">French</option>
                    <option value="Thai">Thai</option>
                  </select>
                </div>

                {/* Main Ingredient Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Main Ingredient</h4>
                  <select
                    value={filters.mainIngredient || ''}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        mainIngredient: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Ingredients</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Beef">Beef</option>
                    <option value="Fish">Fish</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Quinoa">Quinoa</option>
                    <option value="Rice">Rice</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Tofu">Tofu</option>
                  </select>
                </div>

                {/* Preparation Time Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Preparation Time</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prepTime"
                        checked={filters.maxPrepTime === 15}
                        onChange={() => setFilters({ ...filters, maxPrepTime: 15 })}
                        className="border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Under 15 minutes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prepTime"
                        checked={filters.maxPrepTime === 30}
                        onChange={() => setFilters({ ...filters, maxPrepTime: 30 })}
                        className="border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Under 30 minutes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prepTime"
                        checked={filters.maxPrepTime === 60}
                        onChange={() => setFilters({ ...filters, maxPrepTime: 60 })}
                        className="border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Under 1 hour</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prepTime"
                        checked={filters.maxPrepTime === undefined}
                        onChange={() => setFilters({ ...filters, maxPrepTime: undefined })}
                        className="border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Any time</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.mealType?.length ||
                filters.dietType?.length ||
                filters.difficulty?.length ||
                searchQuery ||
                filters.mainIngredient ||
                filters.cuisineType ||
                filters.maxPrepTime) && (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.mealType?.map(type => (
                      <span
                        key={type}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {type}
                        <button
                          onClick={() => {
                            const newMealTypes = filters.mealType?.filter(t => t !== type) || [];
                            setFilters({
                              ...filters,
                              mealType: newMealTypes.length > 0 ? newMealTypes : undefined,
                            });
                          }}
                          className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-primary-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {filters.dietType?.map(type => (
                      <span
                        key={type}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {type.replace('-', ' ')}
                        <button
                          onClick={() => {
                            const newDietTypes = filters.dietType?.filter(t => t !== type) || [];
                            setFilters({
                              ...filters,
                              dietType: newDietTypes.length > 0 ? newDietTypes : undefined,
                            });
                          }}
                          className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-green-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {filters.difficulty?.map(difficulty => (
                      <span
                        key={difficulty}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                      >
                        {difficulty}
                        <button
                          onClick={() => {
                            const newDifficulties =
                              filters.difficulty?.filter(d => d !== difficulty) || [];
                            setFilters({
                              ...filters,
                              difficulty: newDifficulties.length > 0 ? newDifficulties : undefined,
                            });
                          }}
                          className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-orange-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {filters.cuisineType && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {filters.cuisineType}
                        <button
                          onClick={() => setFilters({ ...filters, cuisineType: undefined })}
                          className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-purple-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.mainIngredient && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {filters.mainIngredient}
                        <button
                          onClick={() => setFilters({ ...filters, mainIngredient: undefined })}
                          className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.maxPrepTime && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Under {filters.maxPrepTime}m
                        <button
                          onClick={() => setFilters({ ...filters, maxPrepTime: undefined })}
                          className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-gray-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-purple-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setFilters({
                          mealType: undefined,
                          dietType: undefined,
                          difficulty: undefined,
                          mainIngredient: undefined,
                          cuisineType: undefined,
                          maxPrepTime: undefined,
                        });
                        setSearchQuery('');
                        setSearchMode('browse');
                      }}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Results Header */}
          {searchMode === 'search' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentSearchApi.loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                  ) : (
                    <Search className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-blue-900">
                        {currentSearchApi.loading
                          ? 'Searching...'
                          : `Search Results for "${searchQuery}"`}
                      </h3>
                      {/* Execution time - commented for cleaner UI, uncomment for debugging */}
                      {/* {currentSearchApi.executionTime && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {currentSearchApi.executionTime}ms
                        </span>
                      )} */}
                    </div>
                    {!currentSearchApi.loading &&
                      searchMode === 'search' &&
                      recipes.length >= 0 && (
                        <>
                          <p className="text-sm text-blue-700">
                            Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                            {recipes.length === 0 ? ' - try adjusting your search or filters' : ''}
                          </p>
                          {smartSearchApi.extractedFilters &&
                            Object.keys(smartSearchApi.extractedFilters).length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-blue-600 font-medium">
                                  Auto-detected filters:
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.entries(smartSearchApi.extractedFilters).map(
                                    ([key, value]) => (
                                      <span
                                        key={key}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                                      >
                                        {key}:{' '}
                                        {typeof value === 'object'
                                          ? JSON.stringify(value)
                                          : String(value)}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </>
                      )}
                  </div>
                </div>
                {!currentSearchApi.loading && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchMode('browse');
                      setRecipes([]);
                      // Trigger refetch by resetting filters (maintains current filters)
                      setFilters(prev => ({ ...prev }));
                    }}
                    className="text-blue-600 border-blue-200 hover:bg-blue-100"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Search Error Display */}
          {currentSearchApi.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                  <p className="mt-1 text-sm text-red-700">{currentSearchApi.error}</p>
                  <p className="mt-2 text-xs text-red-600">
                    Falling back to traditional browse mode. You can still use filters.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchMode('browse');
                  }}
                  className="flex-shrink-0 text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={searchMode === 'search'}
                title={searchMode === 'search' ? 'Sorting not available in search mode' : ''}
              >
                <option value="rating">Highest Rating</option>
                <option value="recent">Most Recent</option>
                <option value="prep-time-asc">Prep Time (Low to High)</option>
                <option value="prep-time-desc">Prep Time (High to Low)</option>
              </select>
            </div>
            {searchMode === 'browse' &&
              (filters.cuisineType ||
                filters.difficulty?.length ||
                filters.maxPrepTime ||
                filters.mealType?.length ||
                filters.dietType?.length ||
                filters.mainIngredient) && (
                <span className="text-sm text-gray-500">{`${recipes.length} recipes found`}</span>
              )}
          </div>
        </div>

        {/* Recipe Sections */}
        <div className="space-y-12">
          {/* Only show browse sections when NOT in search mode */}
          {searchMode === 'browse' && !hasAnyFilters() && (
            <>
              {/* Recommended Recipes */}
              {recommendedRecipes.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-6 w-6 text-primary-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                    </div>
                    {recommendedRecipes.length >= 4 && (
                      <Button variant="outline" onClick={() => navigate('/recipes/recommended')}>
                        View All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedRecipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </section>
              )}

              {/* Trending Recipes - Only show if there are recipes */}
              {trendingRecipes.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Trending This Week</h2>
                    </div>
                    {trendingRecipes.length >= 4 && (
                      <Button variant="outline" onClick={() => navigate('/recipes/trending')}>
                        View All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingRecipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </section>
              )}

              {/* New Recipes */}
              {newRecipes.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-6 w-6 text-primary-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Newly Added</h2>
                    </div>
                    {newRecipes.length >= 4 && (
                      <Button variant="outline" onClick={() => navigate('/recipes/new')}>
                        View All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newRecipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Search Results Section - No Pagination */}
          {searchMode === 'search' && (
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Search className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
              </div>

              {currentSearchApi.loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                    <p className="text-gray-600 mb-6">
                      No recipes match your search query. Try different keywords or clear the
                      search.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchMode('browse');
                        setRecipes([]);
                        // Trigger refetch by resetting filters
                        setFilters(prev => ({ ...prev }));
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Search
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* All Recipes Section - With Pagination (Browse Mode Only) */}
          {searchMode === 'browse' && (
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Search className="h-6 w-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">All Recipes</h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>

                    {filters.mealType?.length ||
                    filters.dietType?.length ||
                    filters.difficulty?.length ||
                    filters.mainIngredient ||
                    filters.cuisineType ||
                    filters.maxPrepTime ? (
                      // Browse mode with filters - show filter-related message
                      <>
                        <p className="text-gray-600 mb-6">
                          Try adjusting your filters to see more results.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFilters({});
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear All Filters
                        </Button>
                      </>
                    ) : (
                      // No filters or search active - show role-based message
                      <>
                        {user?.role === 'USER' ? (
                          <p className="text-gray-600 mb-6">
                            Please give chefs a time to post new recipes.
                          </p>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-6">
                              No recipes available yet. Be the first to add one!
                            </p>
                            <Button onClick={() => navigate('/chef/submit-recipe')}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Recipe
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>

                  {/* Load More Button - Only in Browse Mode */}
                  {hasNextPage && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={loadMoreRecipes}
                        disabled={isFetchingNextPage}
                        className="px-8"
                      >
                        {isFetchingNextPage ? 'Loading...' : 'Load More Recipes'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
