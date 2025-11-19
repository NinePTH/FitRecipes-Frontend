import { createContext } from 'react';
import type { Recipe } from '@/types';

interface SavedRecipesContextType {
  savedRecipes: Recipe[];
  toggleSaveRecipe: (recipe: Recipe) => void;
  isSaved: (recipeId: string) => boolean;
  loading: boolean;
  error: string | null;
  refreshSavedRecipes: () => Promise<void>;
}

export const SavedRecipesContext = createContext<SavedRecipesContextType | undefined>(undefined);
