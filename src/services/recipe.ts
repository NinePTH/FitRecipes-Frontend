import * as api from './api';
import type {
  Recipe,
  RecipeSubmissionData,
  RecipeFormData,
  DietaryInfo,
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

  if (formData.tags && formData.tags.length > 0) {
    submissionData.tags = formData.tags;
  }

  if (formData.allergies && formData.allergies.length > 0) {
    submissionData.allergies = formData.allergies;
  }

  if (formData.imageUrl) {
    submissionData.imageUrl = formData.imageUrl;
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

  console.log('Submitting recipe to backend:', submissionData);

  const response = await api.post<{ recipe: Recipe }>(
    '/api/v1/recipes',
    submissionData
  );

  return response.recipe;
}

/**
 * Get recipe details by ID
 * @param recipeId Recipe ID
 * @returns Recipe details
 */
export async function getRecipeById(recipeId: string): Promise<Recipe> {
  return await api.get<Recipe>(`/api/v1/recipes/${recipeId}`);
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
export async function approveRecipe(
  recipeId: string,
  adminNote?: string
): Promise<Recipe> {
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
  const response = await api.put<{ recipe: Recipe }>(
    `/api/v1/admin/recipes/${recipeId}/reject`,
    { reason }
  );

  return response.recipe;
}
