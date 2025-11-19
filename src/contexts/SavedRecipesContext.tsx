import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '@/types';
import { SavedRecipesContext } from './SavedRecipesContext';
import { savedRecipesApi } from '@/services/savedRecipesApi';
import { useAuth } from '@/hooks/useAuth';

export function SavedRecipesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSavedRecipes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await savedRecipesApi.getSavedRecipes({ limit: 100 });
      setSavedRecipes(response.recipes);

      // Cache to localStorage as backup
      localStorage.setItem('fitrecipes_saved_cache', JSON.stringify(response.recipes));
    } catch (err: unknown) {
      console.error('Failed to load saved recipes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load saved recipes';
      setError(errorMessage);

      // Try to load from localStorage cache as fallback
      const cached = localStorage.getItem('fitrecipes_saved_cache');
      if (cached) {
        try {
          setSavedRecipes(JSON.parse(cached));
        } catch {
          // Ignore cache parse errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load saved recipes from API on mount and when user changes
  useEffect(() => {
    if (user) {
      loadSavedRecipes();
    } else {
      // Clear saved recipes when user logs out
      setSavedRecipes([]);
    }
  }, [user, loadSavedRecipes]);

  const toggleSaveRecipe = async (recipe: Recipe) => {
    if (!user) {
      // User not logged in - could show login prompt
      console.warn('User must be logged in to save recipes');
      return;
    }

    const isCurrentlySaved = savedRecipes.some(r => r.id === recipe.id);

    // Optimistic update - update UI immediately
    if (isCurrentlySaved) {
      setSavedRecipes(prev => prev.filter(r => r.id !== recipe.id));
    } else {
      setSavedRecipes(prev => [...prev, recipe]);
    }

    try {
      // Make API call in background
      if (isCurrentlySaved) {
        await savedRecipesApi.unsaveRecipe(recipe.id);
      } else {
        await savedRecipesApi.saveRecipe(recipe.id);
      }

      // Update localStorage cache
      const newSavedRecipes = isCurrentlySaved
        ? savedRecipes.filter(r => r.id !== recipe.id)
        : [...savedRecipes, recipe];
      localStorage.setItem('fitrecipes_saved_cache', JSON.stringify(newSavedRecipes));
    } catch (err: unknown) {
      console.error('Failed to toggle save:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save recipe';
      setError(errorMessage);

      // Revert optimistic update on error
      if (isCurrentlySaved) {
        setSavedRecipes(prev => [...prev, recipe]);
      } else {
        setSavedRecipes(prev => prev.filter(r => r.id !== recipe.id));
      }

      setError(err.message || 'Failed to update saved status');
    }
  };

  const isSaved = (recipeId: string) => {
    return savedRecipes.some(r => r.id === recipeId);
  };

  return (
    <SavedRecipesContext.Provider
      value={{ savedRecipes, toggleSaveRecipe, isSaved, loading, error, refreshSavedRecipes: loadSavedRecipes }}
    >
      {children}
    </SavedRecipesContext.Provider>
  );
}
