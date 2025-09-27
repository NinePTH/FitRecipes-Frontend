import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Star, Heart, Share2, MessageCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/Layout';
import type { Recipe } from '@/types';

// Mock data - TODO: Replace with API call
const mockRecipe: Recipe = {
  id: '1',
  title: 'Mediterranean Quinoa Bowl',
  description:
    'A healthy and colorful bowl packed with protein and fresh vegetables. This recipe combines the earthy flavors of quinoa with the vibrant tastes of Mediterranean cuisine.',
  images: [
    'https://www.eatingbirdfood.com/wp-content/uploads/2022/11/mediterranean-quinoa-bowl-hero.jpg',
    'https://www.cookedandloved.com/wp-content/uploads/2023/07/mediterranean-chicken-quinoa-bowl-social.jpg',
    'https://choosingchia.com/jessh-jessh/uploads/2019/07/meditteranean-quinoa-salad-2.jpg',
  ],
  ingredients: [
    { id: '1', name: 'Quinoa', quantity: 1, unit: 'cup' },
    { id: '2', name: 'Cucumber', quantity: 1, unit: 'large' },
    { id: '3', name: 'Tomatoes', quantity: 2, unit: 'medium' },
    { id: '4', name: 'Red onion', quantity: 0.5, unit: 'small' },
    { id: '5', name: 'Feta cheese', quantity: 100, unit: 'g' },
    { id: '6', name: 'Olive oil', quantity: 3, unit: 'tbsp' },
    { id: '7', name: 'Lemon juice', quantity: 2, unit: 'tbsp' },
    { id: '8', name: 'Fresh herbs (parsley, mint)', quantity: 0.25, unit: 'cup' },
  ],
  instructions: [
    {
      id: '1',
      stepNumber: 1,
      description:
        'Rinse quinoa under cold water until water runs clear. Cook quinoa according to package instructions.',
    },
    {
      id: '2',
      stepNumber: 2,
      description: 'While quinoa cooks, dice cucumber, tomatoes, and red onion into small pieces.',
    },
    { id: '3', stepNumber: 3, description: 'Crumble feta cheese and chop fresh herbs.' },
    {
      id: '4',
      stepNumber: 4,
      description: 'In a large bowl, combine cooked quinoa with vegetables and herbs.',
    },
    {
      id: '5',
      stepNumber: 5,
      description: 'Drizzle with olive oil and lemon juice. Season with salt and pepper to taste.',
    },
    { id: '6', stepNumber: 6, description: 'Top with crumbled feta cheese and serve immediately.' },
  ],
  prepTime: 15,
  cookTime: 20,
  servings: 4,
  difficulty: 'easy',
  mealType: ['lunch', 'dinner'],
  dietType: ['vegetarian', 'gluten-free'],
  cuisineType: 'Mediterranean',
  mainIngredient: 'Quinoa',
  nutrition: {
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 11,
    fiber: 5,
    sodium: 380,
  },
  allergies: ['dairy'],
  ratings: [],
  comments: [],
  averageRating: 4.5,
  totalRatings: 12,
  totalComments: 5,
  status: 'approved',
  chefId: '1',
  chef: {
    id: '1',
    email: 'chef@example.com',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    role: 'chef',
    createdAt: '',
    updatedAt: '',
  },
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRecipe = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setRecipe(mockRecipe);
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // TODO: Submit rating to API
    console.log('Rating submitted:', rating);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmittingComment(true);
    // TODO: Submit comment to API
    console.log('Comment submitted:', comment);

    setTimeout(() => {
      setComment('');
      setIsSubmittingComment(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Recipe not found</h1>
          <p className="text-gray-600 mt-2">The recipe you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="mt-4">Browse Recipes</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Recipes
        </Link>

        {/* Recipe Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
          <p className="text-xl text-gray-600">{recipe.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime + recipe.cookTime} minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>
                  {recipe.averageRating} ({recipe.totalRatings} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Recipe Images */}
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={recipe.images[selectedImageIndex]}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          {recipe.images.length > 1 && (
            <div className="flex space-x-2">
              {recipe.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${recipe.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map(ingredient => (
                    <li
                      key={ingredient.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-gray-600">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map(instruction => (
                    <li key={instruction.id} className="flex space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {instruction.stepNumber}
                      </span>
                      <p className="text-gray-700 pt-1">{instruction.description}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Info */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Prep Time</h4>
                  <p className="text-gray-600">{recipe.prepTime} minutes</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cook Time</h4>
                  <p className="text-gray-600">{recipe.cookTime} minutes</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Difficulty</h4>
                  <p className="text-gray-600 capitalize">{recipe.difficulty}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cuisine</h4>
                  <p className="text-gray-600">{recipe.cuisineType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Diet Type</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recipe.dietType.map(diet => (
                      <span
                        key={diet}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition */}
            {recipe.nutrition && (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition (per serving)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Calories</span>
                    <span>{recipe.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>{recipe.nutrition.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs</span>
                    <span>{recipe.nutrition.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span>{recipe.nutrition.fat}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fiber</span>
                    <span>{recipe.nutrition.fiber}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sodium</span>
                    <span>{recipe.nutrition.sodium}mg</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chef Info */}
            <Card>
              <CardHeader>
                <CardTitle>Chef</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {recipe.chef.firstName[0]}
                      {recipe.chef.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {recipe.chef.firstName} {recipe.chef.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Chef</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rating and Comments */}
        <div className="space-y-6">
          {/* Rate this recipe */}
          <Card>
            <CardHeader>
              <CardTitle>Rate this Recipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className={`text-2xl ${
                      rating <= userRating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {userRating > 0
                    ? `You rated this ${userRating} star${userRating > 1 ? 's' : ''}`
                    : 'Click to rate'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Add Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Add a Comment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts about this recipe..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                />
                <Button type="submit" disabled={isSubmittingComment || !comment.trim()}>
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments Section - TODO: Implement actual comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({recipe.totalComments})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TODO: Add related recipes section */}
        {/* TODO: Implement actual comment loading and display */}
        {/* TODO: Add print recipe functionality */}
        {/* TODO: Add recipe scaling (adjust servings) */}
      </div>
    </Layout>
  );
}
