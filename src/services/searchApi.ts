import type { Recipe, MealType } from '@/types';

// Search API Types based on Vector Search API Documentation

export interface SearchFilters {
  mealType?: MealType[];
  difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
  maxPrepTime?: number;
  cuisineType?: string;
  dietaryInfo?: {
    isVegan?: boolean;
    isVegetarian?: boolean;
    isGlutenFree?: boolean;
    isDairyFree?: boolean;
    isKeto?: boolean;
    isPaleo?: boolean;
    isLowCarb?: boolean;
    isHighProtein?: boolean;
  };
}

export interface SmartSearchRequest {
  query: string;
  limit?: number;
  filters?: SearchFilters;
  user_id?: string;
}

export interface SmartSearchResponse {
  status: string;
  data: Recipe[];
  total: number;
  query: string;
  parsed_query?: string;
  extracted_filters?: SearchFilters;
  execution_time_ms: number;
}

export interface VectorSearchRequest {
  query: string;
  limit?: number;
  filters?: SearchFilters;
  user_id?: string;
}

export interface VectorSearchResponse {
  status: string;
  data: Recipe[];
  total: number;
  query: string;
  execution_time_ms: number;
}

export interface IngredientSearchRequest {
  ingredients: string[];
  match_mode?: 'any' | 'all';
  limit?: number;
  filters?: SearchFilters;
}

export interface IngredientSearchResponse {
  status: string;
  data: Recipe[];
  total: number;
  ingredients: string[];
  match_mode: string;
  execution_time_ms: number;
}

export interface HybridSearchRequest {
  query: string;
  limit?: number;
  filters?: SearchFilters;
}

export interface HybridSearchResponse {
  status: string;
  data: Recipe[];
  total: number;
  query: string;
  execution_time_ms: number;
}

/**
 * Smart Search - Automatically extracts filters from natural language queries
 * This is the recommended search method for user queries
 * 
 * @example
 * smartSearch('quick vegan thai dinner under 30 minutes')
 * // Auto-extracts: cuisineType=Thai, maxPrepTime=30, dietaryInfo.isVegan=true
 */
export async function smartSearch(
  request: SmartSearchRequest
): Promise<SmartSearchResponse> {
  const searchApiUrl = import.meta.env.VITE_SEARCH_API_BASE_URL;
  
  if (!searchApiUrl) {
    throw new Error('Search API URL not configured. Please set VITE_SEARCH_API_BASE_URL in .env');
  }

  const response = await fetch(`${searchApiUrl}/search/smart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_SEARCH_API_KEY || '',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Smart search failed');
  }

  return await response.json();
}

/**
 * Vector Search - Semantic search using vector similarity
 * 
 * @example
 * vectorSearch({ query: 'spicy thai chicken curry', limit: 10 })
 */
export async function vectorSearch(
  request: VectorSearchRequest
): Promise<VectorSearchResponse> {
  const searchApiUrl = import.meta.env.VITE_SEARCH_API_BASE_URL;
  
  if (!searchApiUrl) {
    throw new Error('Search API URL not configured');
  }

  const response = await fetch(`${searchApiUrl}/search/vector`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_SEARCH_API_KEY || '',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Vector search failed');
  }

  return await response.json();
}

/**
 * Ingredient Search - Find recipes by specific ingredients
 * 
 * @example
 * ingredientSearch({ ingredients: ['chicken', 'garlic'], match_mode: 'any' })
 */
export async function ingredientSearch(
  request: IngredientSearchRequest
): Promise<IngredientSearchResponse> {
  const searchApiUrl = import.meta.env.VITE_SEARCH_API_BASE_URL;
  
  if (!searchApiUrl) {
    throw new Error('Search API URL not configured');
  }

  const response = await fetch(`${searchApiUrl}/search/ingredients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_SEARCH_API_KEY || '',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ingredient search failed');
  }

  return await response.json();
}

/**
 * Hybrid Search - Combines keyword search and vector similarity
 * 
 * @example
 * hybridSearch({ query: 'authentic italian pasta carbonara', limit: 10 })
 */
export async function hybridSearch(
  request: HybridSearchRequest
): Promise<HybridSearchResponse> {
  const searchApiUrl = import.meta.env.VITE_SEARCH_API_BASE_URL;
  
  if (!searchApiUrl) {
    throw new Error('Search API URL not configured');
  }

  const response = await fetch(`${searchApiUrl}/search/hybrid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_SEARCH_API_KEY || '',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Hybrid search failed');
  }

  return await response.json();
}

/**
 * Check if Search API is configured and available
 */
export function isSearchApiAvailable(): boolean {
  return !!(import.meta.env.VITE_SEARCH_API_BASE_URL && import.meta.env.VITE_SEARCH_API_KEY);
}

/**
 * Convert UI filters to Search API format
 */
export function convertFiltersToSearchFormat(uiFilters: {
  mealType?: MealType[];
  difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
  cuisineType?: string;
  maxPrepTime?: number;
  dietType?: string[];
}): SearchFilters {
  const searchFilters: SearchFilters = {};

  if (uiFilters.mealType && uiFilters.mealType.length > 0) {
    searchFilters.mealType = uiFilters.mealType;
  }

  if (uiFilters.difficulty && uiFilters.difficulty.length > 0) {
    searchFilters.difficulty = uiFilters.difficulty;
  }

  if (uiFilters.cuisineType) {
    searchFilters.cuisineType = uiFilters.cuisineType;
  }

  if (uiFilters.maxPrepTime) {
    searchFilters.maxPrepTime = uiFilters.maxPrepTime;
  }

  // Convert diet type array to dietaryInfo object
  if (uiFilters.dietType && uiFilters.dietType.length > 0) {
    searchFilters.dietaryInfo = {};
    if (uiFilters.dietType.includes('vegetarian')) searchFilters.dietaryInfo.isVegetarian = true;
    if (uiFilters.dietType.includes('vegan')) searchFilters.dietaryInfo.isVegan = true;
    if (uiFilters.dietType.includes('gluten-free')) searchFilters.dietaryInfo.isGlutenFree = true;
    if (uiFilters.dietType.includes('dairy-free')) searchFilters.dietaryInfo.isDairyFree = true;
    if (uiFilters.dietType.includes('keto')) searchFilters.dietaryInfo.isKeto = true;
    if (uiFilters.dietType.includes('paleo')) searchFilters.dietaryInfo.isPaleo = true;
  }

  return searchFilters;
}
