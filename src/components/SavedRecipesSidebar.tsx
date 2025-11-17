import { X, Bookmark, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { Button } from './ui/button';

interface SavedRecipesSidebarProps {
  onClose: () => void;
  isMobile: boolean;
}

export function SavedRecipesSidebar({ onClose, isMobile }: SavedRecipesSidebarProps) {
  const { savedRecipes, toggleSaveRecipe } = useSavedRecipes();

  // Desktop dropdown
  if (!isMobile) {
    return (
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">
            Saved Recipes {savedRecipes.length > 0 && `(${savedRecipes.length})`}
          </h3>
          {savedRecipes.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Remove all saved recipes?')) {
                  savedRecipes.forEach(recipe => toggleSaveRecipe(recipe));
                }
              }}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Recipes List */}
        <div className="max-h-96 overflow-y-auto">
          {savedRecipes.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <Bookmark className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No saved recipes</p>
              <p className="text-sm mt-1">Save recipes to view them later</p>
            </div>
          ) : (
            savedRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="p-3 border-b hover:bg-gray-50 transition-colors group"
              >
                <div className="flex gap-3">
                  {/* Recipe Image */}
                  <Link
                    to={`/recipe/${recipe.id}`}
                    onClick={onClose}
                    className="flex-shrink-0"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
                      {recipe.imageUrls?.[0] || recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrls?.[0] || recipe.imageUrl || ''}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Bookmark className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Recipe Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/recipe/${recipe.id}`}
                      onClick={onClose}
                      className="block hover:text-primary-600"
                    >
                      <h4 className="font-medium text-sm line-clamp-1">{recipe.title}</h4>
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prepTime + (recipe.cookingTime ?? 0)}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        {recipe.averageRating}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleSaveRecipe(recipe)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Mobile sidebar
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="font-semibold text-gray-900 text-lg">
            Saved Recipes {savedRecipes.length > 0 && `(${savedRecipes.length})`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close saved recipes"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Actions */}
        {savedRecipes.length > 0 && (
          <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.confirm('Remove all saved recipes?')) {
                  savedRecipes.forEach(recipe => toggleSaveRecipe(recipe));
                }
              }}
              className="text-sm"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Recipes List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {savedRecipes.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="font-medium text-lg">No saved recipes</p>
              <p className="text-sm mt-2">Save recipes to view them later</p>
            </div>
          ) : (
            savedRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="p-4 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Recipe Image */}
                  <Link
                    to={`/recipe/${recipe.id}`}
                    onClick={onClose}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                      {recipe.imageUrls?.[0] || recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrls?.[0] || recipe.imageUrl || ''}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Bookmark className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Recipe Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/recipe/${recipe.id}`}
                      onClick={onClose}
                      className="block hover:text-primary-600"
                    >
                      <h4 className="font-medium text-base line-clamp-2">{recipe.title}</h4>
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.prepTime + (recipe.cookingTime ?? 0)}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        {recipe.averageRating}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveRecipe(recipe)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2 h-auto py-1 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
