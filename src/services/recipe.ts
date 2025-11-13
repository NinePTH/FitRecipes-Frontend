import * as api from './api';
import type {
  Recipe,
  RecipeSubmissionData,
  RecipeFormData,
  DietaryInfo,
  MealType,
  SortOption,
} from '@/types';

/**
 * Transform UI form data to backend API format
 */
export function transformRecipeFormDataToSubmission(
  formData: RecipeFormData
): RecipeSubmissionData {
  // Transform difficulty: lowercase → uppercase
  const difficulty = formData.difficulty.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD';

  // Transform mealType: array of lowercase → array of uppercase
  const mealType: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT'> | undefined =
    formData.mealType.length > 0
      ? (formData.mealType.map(meal => meal.toUpperCase()) as Array<
          'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT'
        >)
      : undefined;

  // Transform dietType array → dietaryInfo object
  const dietaryInfo: DietaryInfo = {};
  if (formData.dietType.includes('vegetarian')) dietaryInfo.isVegetarian = true;
  if (formData.dietType.includes('vegan')) dietaryInfo.isVegan = true;
  if (formData.dietType.includes('gluten-free')) dietaryInfo.isGlutenFree = true;
  if (formData.dietType.includes('dairy-free')) dietaryInfo.isDairyFree = true;
  if (formData.dietType.includes('keto')) dietaryInfo.isKeto = true;
  if (formData.dietType.includes('paleo')) dietaryInfo.isPaleo = true;

  // Transform ingredients: quantity (number) → amount (string)
  const ingredients = formData.ingredients.map(ing => ({
    name: ing.name,
    amount: ing.quantity.toString(),
    unit: ing.unit,
  }));

  // Transform instructions: structured objects → string array
  const instructions = formData.instructions.map(inst => inst.description);

  // Build submission data matching backend schema
  const submissionData: RecipeSubmissionData = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    mainIngredient: formData.mainIngredient.trim(),
    ingredients,
    instructions,
    cookingTime: formData.cookTime, // UI uses 'cookTime', backend expects 'cookingTime'
    servings: formData.servings,
    difficulty,
  };

  // Add optional fields only if they have values
  if (formData.prepTime > 0) {
    submissionData.prepTime = formData.prepTime;
  }

  if (mealType) {
    submissionData.mealType = mealType;
  }

  if (formData.cuisineType?.trim()) {
    submissionData.cuisineType = formData.cuisineType.trim();
  }

  if (Object.keys(dietaryInfo).length > 0) {
    submissionData.dietaryInfo = dietaryInfo;
  }

  if (formData.nutrition) {
    submissionData.nutritionInfo = formData.nutrition;
  }

  if (formData.allergies && formData.allergies.length > 0) {
    submissionData.allergies = formData.allergies;
  }

  // Handle both new imageUrls (array) and deprecated imageUrl (string)
  if (formData.imageUrls && formData.imageUrls.length > 0) {
    submissionData.imageUrls = formData.imageUrls;
  } else if (formData.imageUrl) {
    submissionData.imageUrls = [formData.imageUrl]; // Convert single URL to array
  }

  return submissionData;
}

/**
 * Upload recipe image to backend
 * @param file Image file to upload (JPEG, PNG, WebP, GIF)
 * @returns Public image URL from Supabase Storage
 * @throws ApiError if upload fails or validation errors
 */
export async function uploadRecipeImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file); // Field name MUST be 'image'

  // Get auth token
  const token = localStorage.getItem('fitrecipes_token');

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Don't set Content-Type - browser handles it automatically for FormData

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/recipes/upload-image`,
    {
      method: 'POST',
      headers,
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    const apiError: api.ApiError = {
      name: 'ApiError',
      message: error.message || 'Failed to upload image',
      statusCode: response.status,
      errors: error.errors,
    };
    throw apiError;
  }

  const result = await response.json();
  return result.data.imageUrl;
}

/**
 * Submit a new recipe to the backend
 * @param formData Recipe form data from UI
 * @returns Created recipe with PENDING status
 */
export async function submitRecipe(formData: RecipeFormData): Promise<Recipe> {
  const submissionData = transformRecipeFormDataToSubmission(formData);

  const response = await api.post<{ recipe: Recipe }>('/api/v1/recipes', submissionData);

  return response.recipe;
}

/**
 * Get recipe details by ID
 * @param recipeId Recipe ID
 * @returns Recipe details
 */
export async function getRecipeById(recipeId: string): Promise<Recipe> {
  const response = await api.get<{ recipe: Recipe }>(`/api/v1/recipes/${recipeId}`);
  return response.recipe;
}

/**
 * Get user's submitted recipes (Chef/Admin only)
 * @param status Optional filter by status: 'PENDING' | 'APPROVED' | 'REJECTED'
 * @returns User's recipes with statistics
 */
export async function getMyRecipes(status?: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<{
  recipes: Recipe[];
  meta: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}> {
  const url = status ? `/api/v1/recipes/my-recipes?status=${status}` : '/api/v1/recipes/my-recipes';

  const response = await api.get<{
    recipes: Recipe[];
    meta: {
      total: number;
      approved: number;
      pending: number;
      rejected: number;
    };
  }>(url);

  return response;
}

/**
 * Update an existing recipe (Chef/Admin only)
 * Note: Only PENDING and REJECTED recipes can be updated
 * REJECTED recipes will be reset to PENDING status
 * @param recipeId Recipe ID
 * @param formData Updated recipe form data
 * @returns Updated recipe
 */
export async function updateRecipe(recipeId: string, formData: RecipeFormData): Promise<Recipe> {
  const submissionData = transformRecipeFormDataToSubmission(formData);

  const response = await api.put<{ recipe: Recipe }>(`/api/v1/recipes/${recipeId}`, submissionData);

  return response.recipe;
}

/**
 * Delete a recipe (Chef/Admin only)
 * @param recipeId Recipe ID
 */
export async function deleteRecipe(recipeId: string): Promise<void> {
  await api.deleteRequest(`/api/v1/recipes/${recipeId}`);
}

/**
 * Get pending recipes (Admin only)
 * @param page Page number (default: 1)
 * @param limit Items per page (default: 10)
 * @returns Paginated list of pending recipes
 */
export async function getPendingRecipes(
  page = 1,
  limit = 10
): Promise<{
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> {
  return await api.get(
    `/api/v1/admin/recipes/pending?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=desc`
  );
}

/**
 * Approve a recipe (Admin only)
 * @param recipeId Recipe ID
 * @param adminNote Optional admin feedback
 * @returns Approved recipe
 */
export async function approveRecipe(recipeId: string, adminNote?: string): Promise<Recipe> {
  const response = await api.put<{ recipe: Recipe }>(
    `/api/v1/admin/recipes/${recipeId}/approve`,
    adminNote ? { adminNote } : {}
  );

  return response.recipe;
}

/**
 * Reject a recipe (Admin only)
 * @param recipeId Recipe ID
 * @param reason Rejection reason (required, 10-500 chars)
 * @returns Rejected recipe
 */
export async function rejectRecipe(recipeId: string, reason: string): Promise<Recipe> {
  const response = await api.put<{ recipe: Recipe }>(`/api/v1/admin/recipes/${recipeId}/reject`, {
    reason,
  });

  return response.recipe;
}

// ==================== Browse Recipes ====================

/**
 * Browse recipes with filters, sorting, and pagination
 * @param params Query parameters for filtering, sorting, and pagination
 * @returns Paginated recipe list
 */
export async function browseRecipes(params: {
  page?: number;
  limit?: number;
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
  mealType?: MealType[];
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
}): Promise<{
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> {
  const queryParams = new URLSearchParams();

  // Add pagination params
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  // Add sort params
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  // Add filter params
  if (params.mealType) {
    params.mealType.forEach(type => queryParams.append('mealType', type));
  }
  if (params.difficulty) {
    params.difficulty.forEach(diff => queryParams.append('difficulty', diff));
  }
  if (params.cuisineType) queryParams.append('cuisineType', params.cuisineType);
  if (params.mainIngredient) queryParams.append('mainIngredient', params.mainIngredient);
  if (params.maxPrepTime) queryParams.append('maxPrepTime', params.maxPrepTime.toString());

  // Add dietary filters (only if true)
  if (params.isVegetarian) queryParams.append('isVegetarian', 'true');
  if (params.isVegan) queryParams.append('isVegan', 'true');
  if (params.isGlutenFree) queryParams.append('isGlutenFree', 'true');
  if (params.isDairyFree) queryParams.append('isDairyFree', 'true');
  if (params.isKeto) queryParams.append('isKeto', 'true');
  if (params.isPaleo) queryParams.append('isPaleo', 'true');

  const url = `/api/v1/recipes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await api.get(url);
}

/**
 * Get recommended recipes (personalized if authenticated)
 * @param limit Number of recommendations (default: 12, max: 50)
 * @returns Recommended recipes
 */
export async function getRecommendedRecipes(limit = 12): Promise<{
  recipes: Recipe[];
  meta: {
    recommendationType: 'personalized' | 'popular';
    total: number;
  };
}> {
  return await api.get(`/api/v1/recipes/recommended?limit=${limit}`);
}

/**
 * Get trending recipes based on recent engagement
 * @param limit Number of recipes (default: 12, max: 50)
 * @param period Time period: '7d' or '30d' (default: '7d')
 * @returns Trending recipes
 */
export async function getTrendingRecipes(
  limit = 12,
  period: '7d' | '30d' = '7d'
): Promise<{
  recipes: Recipe[];
  meta: {
    period: string;
    total: number;
  };
}> {
  return await api.get(`/api/v1/recipes/trending?limit=${limit}&period=${period}`);
}

/**
 * Get recently approved recipes
 * @param limit Number of recipes (default: 12, max: 50)
 * @returns New recipes sorted by approval date
 */
export async function getNewRecipes(limit = 12): Promise<{
  recipes: Recipe[];
  meta: {
    total: number;
  };
}> {
  return await api.get(`/api/v1/recipes/new?limit=${limit}`);
}

// ==================== Rating & Comments ====================

/**
 * Submit or update a rating for a recipe
 * @param recipeId Recipe ID
 * @param rating Rating value (1-5)
 * @returns Rating data and updated recipe stats
 */
export async function submitRating(
  recipeId: string,
  rating: number
): Promise<{
  rating: {
    id: string;
    recipeId: string;
    userId: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
  };
  recipeStats: {
    averageRating: number;
    totalRatings: number;
  };
}> {
  const response = await api.post<{
    rating: {
      id: string;
      recipeId: string;
      userId: string;
      rating: number;
      createdAt: string;
      updatedAt: string;
    };
    recipeStats: {
      averageRating: number;
      totalRatings: number;
    };
  }>(`/api/v1/community/recipes/${recipeId}/ratings`, { rating });

  return response;
}

/**
 * Get user's rating for a recipe
 * @param recipeId Recipe ID
 * @returns User's rating or null if not rated
 */
export async function getUserRating(recipeId: string): Promise<{
  id: string;
  recipeId: string;
  userId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
} | null> {
  try {
    const response = await api.get<{
      rating: {
        id: string;
        recipeId: string;
        userId: string;
        rating: number;
        createdAt: string;
        updatedAt: string;
      } | null;
    }>(`/api/v1/community/recipes/${recipeId}/ratings/me`);
    return response.rating;
  } catch {
    // Return null if no rating found
    return null;
  }
}

/**
 * Delete user's rating for a recipe
 * @param recipeId Recipe ID
 * @returns Updated recipe stats
 */
export async function deleteRating(recipeId: string): Promise<{
  recipeStats: {
    averageRating: number;
    totalRatings: number;
  };
}> {
  return await api.deleteRequest(`/api/v1/community/recipes/${recipeId}/ratings/me`);
}

/**
 * Add a comment to a recipe
 * @param recipeId Recipe ID
 * @param content Comment text (1-1000 chars)
 * @returns Created comment
 */
export async function addComment(
  recipeId: string,
  content: string
): Promise<{
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
}> {
  const response = await api.post<{
    comment: {
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
  }>(`/api/v1/community/recipes/${recipeId}/comments`, { content });

  return response.comment;
}

/**
 * Get comments for a recipe with pagination
 * @param recipeId Recipe ID
 * @param params Pagination and sorting params
 * @returns Paginated comments
 */
export async function getComments(
  recipeId: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  comments: Array<{
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
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const url = `/api/v1/community/recipes/${recipeId}/comments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await api.get(url);
}

/**
 * Update a comment (user's own comment only)
 * @param recipeId Recipe ID
 * @param commentId Comment ID
 * @param content Updated comment text (1-1000 chars)
 * @returns Updated comment
 */
export async function updateComment(
  recipeId: string,
  commentId: string,
  content: string
): Promise<{
  id: string;
  recipeId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}> {
  const response = await api.put<{
    comment: {
      id: string;
      recipeId: string;
      userId: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
      };
      content: string;
      createdAt: string;
      updatedAt: string;
    };
  }>(`/api/v1/community/recipes/${recipeId}/comments/${commentId}`, { content });

  return response.comment;
}

/**
 * Delete a comment (user's own comment or admin)
 * @param recipeId Recipe ID
 * @param commentId Comment ID
 */
export async function deleteComment(recipeId: string, commentId: string): Promise<void> {
  await api.deleteRequest(`/api/v1/community/recipes/${recipeId}/comments/${commentId}`);
}
