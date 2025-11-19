import { useState, useEffect } from 'react';
import type { Recipe } from '@/types';
import { SavedRecipesContext } from './SavedRecipesContext';

// Mock saved recipes for demonstration
const mockSavedRecipes: Partial<Recipe>[] = [
  {
    id: 'mock-saved-1',
    title: 'Quinoa Buddha Bowl',
    description: 'A nutritious and colorful bowl packed with protein and vegetables',
    prepTime: 15,
    cookingTime: 20,
    difficulty: 'EASY',
    averageRating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
    author: {
      id: 'chef1',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah@example.com',
      role: 'CHEF',
    } as Partial<Recipe['author']>,
    dietaryInfo: { isVegan: true, isGlutenFree: true },
  },
  {
    id: 'mock-saved-2',
    title: 'Mediterranean Grilled Salmon',
    description: 'Fresh salmon with herbs and lemon, served with roasted vegetables',
    prepTime: 10,
    cookingTime: 15,
    difficulty: 'MEDIUM',
    averageRating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400'],
    author: {
      id: 'chef2',
      firstName: 'Marco',
      lastName: 'Rossi',
      email: 'marco@example.com',
      role: 'CHEF',
    } as Partial<Recipe['author']>,
    dietaryInfo: { isGlutenFree: true, isPaleo: true },
  },
] as Recipe[];

export function SavedRecipesProvider({ children }: { children: React.ReactNode }) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  // Load saved recipes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fitrecipes_saved');
    if (saved) {
      try {
        setSavedRecipes(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved recipes:', error);
        // Initialize with mock data if loading fails
        setSavedRecipes(mockSavedRecipes as Recipe[]);
      }
    } else {
      // Initialize with mock data if nothing saved
      setSavedRecipes(mockSavedRecipes as Recipe[]);
    }
  }, []);

  // Save to localStorage whenever savedRecipes changes
  useEffect(() => {
    localStorage.setItem('fitrecipes_saved', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const toggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => {
      const exists = prev.some(r => r.id === recipe.id);
      if (exists) {
        return prev.filter(r => r.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const isSaved = (recipeId: string) => {
    return savedRecipes.some(r => r.id === recipeId);
  };

  return (
    <SavedRecipesContext.Provider value={{ savedRecipes, toggleSaveRecipe, isSaved }}>
      {children}
    </SavedRecipesContext.Provider>
  );
}
