import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Star, TrendingUp, X, Sparkles, ChefHat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [newRecipes, setNewRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Search suggestions state (placeholder - not implemented yet)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState<{
    ingredients: string[];
    cuisines: string[];
    recipes: string[];
  }>({ ingredients: [], cuisines: [], recipes: [] });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Fetch main recipes with filters
  useEffect(() => {
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
  }, [filters, sortBy]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    // TODO: Implement search when backend is ready
    console.log('Search not implemented yet:', searchTerm);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
    // TODO: Implement search suggestions when backend is ready
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // TODO: Trigger search when backend is ready
    console.log('Selected suggestion:', suggestion);
  };

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

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="aspect-video relative bg-gray-200">
          {(recipe.imageUrls && recipe.imageUrls.length > 0) || recipe.imageUrl || (recipe.images && recipe.images.length > 0) ? (
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
              <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                <PopoverTrigger className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Search by ingredients, recipe name, or cuisine..."
                      value={searchTerm}
                      onChange={e => handleSearchInputChange(e.target.value)}
                      onFocus={() => searchTerm.trim().length > 0 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-10 w-full"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandList className="max-h-[300px]">
                      {suggestions.ingredients.length === 0 &&
                      suggestions.cuisines.length === 0 &&
                      suggestions.recipes.length === 0 ? (
                        <CommandEmpty>No suggestions found.</CommandEmpty>
                      ) : (
                        <>
                          {suggestions.ingredients.length > 0 && (
                            <CommandGroup>
                              <div className="px-2 py-1.5 text-xs font-medium text-slate-500 flex items-center">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Ingredients
                              </div>
                              {suggestions.ingredients.map(ingredient => (
                                <CommandItem
                                  key={ingredient}
                                  onSelect={() => handleSuggestionSelect(ingredient)}
                                  className="cursor-pointer"
                                >
                                  <span className="text-green-600 font-medium">{ingredient}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}

                          {suggestions.cuisines.length > 0 && (
                            <CommandGroup>
                              <div className="px-2 py-1.5 text-xs font-medium text-slate-500 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Cuisines
                              </div>
                              {suggestions.cuisines.map(cuisine => (
                                <CommandItem
                                  key={cuisine}
                                  onSelect={() => handleSuggestionSelect(cuisine)}
                                  className="cursor-pointer"
                                >
                                  <span className="text-blue-600 font-medium">{cuisine}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}

                          {suggestions.recipes.length > 0 && (
                            <CommandGroup>
                              <div className="px-2 py-1.5 text-xs font-medium text-slate-500 flex items-center">
                                <ChefHat className="h-3 w-3 mr-1" />
                                Recipes
                              </div>
                              {suggestions.recipes.map(recipe => (
                                <CommandItem
                                  key={recipe}
                                  onSelect={() => handleSuggestionSelect(recipe)}
                                  className="cursor-pointer"
                                >
                                  <span className="text-purple-600 font-medium">{recipe}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>

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
                          <span className="text-sm text-gray-700 capitalize">{mealType.toLowerCase()}</span>
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
                        <span className="text-sm text-gray-700 capitalize">{difficulty.toLowerCase()}</span>
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
                searchTerm ||
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
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm('')}
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
                        setSearchTerm('');
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
          {searchTerm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Search Results for "{searchTerm}"
                    </h3>
                    <p className="text-sm text-blue-700">
                      Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                      {recipes.length === 0 ? ' - try adjusting your search or filters' : ''}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-100"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Highest Rating</option>
                <option value="recent">Most Recent</option>
                <option value="prep-time-asc">Prep Time (Low to High)</option>
                <option value="prep-time-desc">Prep Time (High to Low)</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {searchTerm ? `${recipes.length} search results` : `${recipes.length} recipes found`}
            </span>
          </div>
        </div>

        {/* Recipe Sections */}
        <div className="space-y-12">
          {/* Recommended Recipes */}
          {recommendedRecipes.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                </div>
                {recommendedRecipes.length >= 4 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/recipes/recommended')}
                  >
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

          {/* Trending Recipes */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">Trending This Week</h2>
              </div>
              {trendingRecipes.length >= 4 && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/recipes/trending')}
                >
                  View All
                </Button>
              )}
            </div>
            {trendingRecipes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No trending recipes available at the moment.</p>
                <p className="text-sm text-gray-500 mt-1">Start Rating or Comment on Recipes to start the Trend.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>

          {/* New Recipes */}
          {newRecipes.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Newly Added</h2>
                </div>
                {newRecipes.length >= 4 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/recipes/new')}
                  >
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

          {/* All Recipes (with filters applied) */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-6 w-6 text-blue-600" />
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No recipes found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to see more results.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({});
                      setSearchTerm('');
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
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
        </div>
      </div>
    </Layout>
  );
}
