import { useState, useCallback, useEffect } from 'react';
import {
  smartSearch,
  vectorSearch,
  ingredientSearch,
  hybridSearch,
  isSearchApiAvailable,
  convertFiltersToSearchFormat,
  type SmartSearchResponse,
  type VectorSearchResponse,
  type IngredientSearchResponse,
  type HybridSearchResponse,
  type SearchFilters,
} from '@/services/searchApi';
import type { Recipe, MealType } from '@/types';
import { useAuth } from './useAuth';

interface UseSearchOptions {
  limit?: number;
  autoSearch?: boolean;
  debounceMs?: number;
}

interface SearchState {
  results: Recipe[];
  loading: boolean;
  error: string | null;
  executionTime: number | null;
  parsedQuery?: string;
  extractedFilters?: SearchFilters;
  total: number;
}

export function useSmartSearch(options: UseSearchOptions = {}) {
  const { limit = 20, autoSearch = false, debounceMs = 300 } = options;
  const { user } = useAuth();
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    executionTime: null,
    total: 0,
  });

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<{
    mealType?: MealType[];
    difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
    cuisineType?: string;
    maxPrepTime?: number;
    dietType?: string[];
  }>({});

  const search = useCallback(
    async (searchQuery: string, searchFilters = filters) => {
      if (!searchQuery.trim()) {
        setState({
          results: [],
          loading: false,
          error: null,
          executionTime: null,
          total: 0,
        });
        return;
      }

      if (!isSearchApiAvailable()) {
        setState(prev => ({
          ...prev,
          loading: false,
          error:
            'Search API not configured. Please set VITE_SEARCH_API_BASE_URL and VITE_SEARCH_API_KEY',
        }));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response: SmartSearchResponse = await smartSearch({
          query: searchQuery,
          limit,
          filters: convertFiltersToSearchFormat(searchFilters),
          user_id: user?.id,
        });

        setState({
          results: response.data,
          loading: false,
          error: null,
          executionTime: response.execution_time_ms,
          parsedQuery: response.parsed_query,
          extractedFilters: response.extracted_filters,
          total: response.total,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }));
      }
    },
    [filters, limit, user]
  );

  // Auto-search with debounce
  useEffect(() => {
    if (!autoSearch || !query.trim()) return;

    const timeoutId = setTimeout(() => {
      search(query, filters);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, filters, autoSearch, debounceMs, search]);

  return {
    ...state,
    query,
    setQuery,
    filters,
    setFilters,
    search,
    isAvailable: isSearchApiAvailable(),
  };
}

export function useVectorSearch(options: UseSearchOptions = {}) {
  const { limit = 20 } = options;
  const { user } = useAuth();
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    executionTime: null,
    total: 0,
  });

  const search = useCallback(
    async (
      query: string,
      filters?: {
        mealType?: MealType[];
        difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
        cuisineType?: string;
        maxPrepTime?: number;
        dietType?: string[];
      }
    ) => {
      if (!query.trim()) {
        setState({
          results: [],
          loading: false,
          error: null,
          executionTime: null,
          total: 0,
        });
        return;
      }

      if (!isSearchApiAvailable()) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Search API not configured',
        }));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response: VectorSearchResponse = await vectorSearch({
          query,
          limit,
          filters: filters ? convertFiltersToSearchFormat(filters) : undefined,
          user_id: user?.id,
        });

        setState({
          results: response.data,
          loading: false,
          error: null,
          executionTime: response.execution_time_ms,
          total: response.total,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }));
      }
    },
    [limit, user]
  );

  return {
    ...state,
    search,
    isAvailable: isSearchApiAvailable(),
  };
}

export function useIngredientSearch(options: UseSearchOptions = {}) {
  const { limit = 20 } = options;
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    executionTime: null,
    total: 0,
  });

  const search = useCallback(
    async (
      ingredients: string[],
      matchMode: 'any' | 'all' = 'any',
      filters?: {
        mealType?: MealType[];
        difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
        cuisineType?: string;
        maxPrepTime?: number;
        dietType?: string[];
      }
    ) => {
      if (!ingredients.length) {
        setState({
          results: [],
          loading: false,
          error: null,
          executionTime: null,
          total: 0,
        });
        return;
      }

      if (!isSearchApiAvailable()) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Search API not configured',
        }));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response: IngredientSearchResponse = await ingredientSearch({
          ingredients,
          match_mode: matchMode,
          limit,
          filters: filters ? convertFiltersToSearchFormat(filters) : undefined,
        });

        setState({
          results: response.data,
          loading: false,
          error: null,
          executionTime: response.execution_time_ms,
          total: response.total,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }));
      }
    },
    [limit]
  );

  return {
    ...state,
    search,
    isAvailable: isSearchApiAvailable(),
  };
}

export function useHybridSearch(options: UseSearchOptions = {}) {
  const { limit = 20 } = options;
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    executionTime: null,
    total: 0,
  });

  const search = useCallback(
    async (
      query: string,
      filters?: {
        mealType?: MealType[];
        difficulty?: Array<'EASY' | 'MEDIUM' | 'HARD'>;
        cuisineType?: string;
        maxPrepTime?: number;
        dietType?: string[];
      }
    ) => {
      if (!query.trim()) {
        setState({
          results: [],
          loading: false,
          error: null,
          executionTime: null,
          total: 0,
        });
        return;
      }

      if (!isSearchApiAvailable()) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Search API not configured',
        }));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response: HybridSearchResponse = await hybridSearch({
          query,
          limit,
          filters: filters ? convertFiltersToSearchFormat(filters) : undefined,
        });

        setState({
          results: response.data,
          loading: false,
          error: null,
          executionTime: response.execution_time_ms,
          total: response.total,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }));
      }
    },
    [limit]
  );

  return {
    ...state,
    search,
    isAvailable: isSearchApiAvailable(),
  };
}
