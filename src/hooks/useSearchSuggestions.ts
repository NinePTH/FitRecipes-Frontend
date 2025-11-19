import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getSearchSuggestions,
  getIngredientSuggestions,
  isSearchApiAvailable,
  type SearchSuggestion,
  type IngredientSuggestion,
} from '@/services/searchApi';

interface UseSearchSuggestionsResult {
  suggestions: SearchSuggestion[];
  loading: boolean;
  error: string | null;
  fetchSuggestions: (query: string, limit?: number) => Promise<void>;
  clearSuggestions: () => void;
}

/**
 * Hook for fetching search suggestions (recipes and cuisines)
 * Provides autocomplete suggestions for search input with debouncing
 */
export function useSearchSuggestions(debounceMs: number = 300): UseSearchSuggestionsResult {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchSuggestions = useCallback(async (query: string, limit: number = 10) => {
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't fetch if query is too short
    if (query.trim().length < 2) {
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Check if Search API is available
    if (!isSearchApiAvailable()) {
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Set loading immediately for better UX
    setLoading(true);
    setError(null);

    // Debounce the actual API call
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await getSearchSuggestions({ query, limit });
        // API returns suggestions directly with correct structure
        setSuggestions(response.suggestions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suggestions';
        setError(errorMessage);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [debounceMs]);

  const clearSuggestions = useCallback(() => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSuggestions([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    clearSuggestions,
  };
}

interface UseIngredientSuggestionsResult {
  suggestions: IngredientSuggestion[];
  loading: boolean;
  error: string | null;
  fetchSuggestions: (query: string, limit?: number, category?: string) => Promise<void>;
  clearSuggestions: () => void;
}

/**
 * Hook for fetching ingredient suggestions
 * Provides autocomplete suggestions for ingredient input with debouncing
 * Database contains 589+ ingredients with categories
 */
export function useIngredientSuggestions(debounceMs: number = 300): UseIngredientSuggestionsResult {
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchSuggestions = useCallback(
    async (query: string, limit: number = 10, category?: string) => {
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Don't fetch if query is too short
      if (query.trim().length < 1) {
        setSuggestions([]);
        setError(null);
        setLoading(false);
        return;
      }

      // Check if Search API is available
      if (!isSearchApiAvailable()) {
        setSuggestions([]);
        setError(null);
        setLoading(false);
        return;
      }

      // Set loading immediately for better UX
      setLoading(true);
      setError(null);

      // Debounce the actual API call
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const response = await getIngredientSuggestions({ query, limit, category });
          setSuggestions(response.suggestions);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suggestions';
          setError(errorMessage);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  const clearSuggestions = useCallback(() => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSuggestions([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    clearSuggestions,
  };
}
