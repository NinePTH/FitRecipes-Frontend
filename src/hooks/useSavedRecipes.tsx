import { useContext } from 'react';
import { SavedRecipesContext } from '@/contexts/SavedRecipesContext.ts';

export function useSavedRecipes() {
  const context = useContext(SavedRecipesContext);
  if (!context) {
    throw new Error('useSavedRecipes must be used within SavedRecipesProvider');
  }
  return context;
}
