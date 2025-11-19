import { get, post, deleteRequest } from './api';
import type { Recipe } from '@/types';

// API Response Types (unwrapped by api.ts - these are the actual return types)
interface SaveRecipeResponse {
  id: string;
  userId: string;
  recipeId: string;
  savedAt: string;
  alreadySaved: boolean;
}

interface UnsaveRecipeResponse {
  success: boolean;
}

interface CheckSavedResponse {
  isSaved: boolean;
  savedAt: string | null;
}

interface BulkCheckSavedResponse {
  savedRecipes: Array<{
    recipeId: string;
    isSaved: boolean;
    savedAt: string | null;
  }> | Record<string, boolean>; // Support both array and object formats
}

interface SavedRecipesResponse {
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const savedRecipesApi = {
  /**
   * Save a recipe to user's collection
   * @param recipeId - Recipe ID to save
   * @returns Save response with metadata
   */
  saveRecipe: async (recipeId: string): Promise<SaveRecipeResponse> => {
    return post<SaveRecipeResponse>(`/api/v1/recipes/${recipeId}/save`);
  },

  /**
   * Remove a recipe from user's saved collection
   * @param recipeId - Recipe ID to unsave
   */
  unsaveRecipe: async (recipeId: string): Promise<UnsaveRecipeResponse> => {
    return deleteRequest<UnsaveRecipeResponse>(`/api/v1/recipes/${recipeId}/save`);
  },

  /**
   * Check if a recipe is saved by the current user
   * @param recipeId - Recipe ID to check
   * @returns Saved status with timestamp
   */
  checkSaved: async (recipeId: string): Promise<CheckSavedResponse> => {
    return get<CheckSavedResponse>(`/api/v1/recipes/${recipeId}/saved`);
  },

  /**
   * Bulk check saved status for multiple recipes (optimized for browse pages)
   * @param recipeIds - Array of recipe IDs (max 100)
   * @returns Saved status for each recipe
   */
  bulkCheckSaved: async (recipeIds: string[]): Promise<BulkCheckSavedResponse> => {
    return post<BulkCheckSavedResponse>('/api/v1/recipes/saved/check', { recipeIds });
  },

  /**
   * Get all saved recipes for the current user with pagination
   * @param params - Query parameters for pagination and sorting
   * @returns Paginated list of saved recipes
   */
  getSavedRecipes: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: 'savedAt' | 'title' | 'averageRating';
    sortOrder?: 'asc' | 'desc';
  }): Promise<SavedRecipesResponse> => {
    const queryParams = new URLSearchParams({
      page: String(params?.page || 1),
      limit: String(params?.limit || 20),
      sortBy: params?.sortBy || 'savedAt',
      sortOrder: params?.sortOrder || 'desc',
    });
    return get<SavedRecipesResponse>(`/api/v1/users/me/saved-recipes?${queryParams}`);
  },
};
