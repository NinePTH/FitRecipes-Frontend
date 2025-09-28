import React, { useState, useEffect } from 'react';
import { ChevronLeft, Upload, Plus, X, Save, Eye } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import type { RecipeFormData, Ingredient, Instruction, NutritionInfo, Recipe } from '@/types';

export function RecipeSubmissionPage() {
  const [searchParams] = useSearchParams();
  const editRecipeId = searchParams.get('edit');
  const isEditing = Boolean(editRecipeId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    images: [],
    ingredients: [{ name: '', quantity: 0, unit: '' }],
    instructions: [{ stepNumber: 1, description: '' }],
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficulty: 'easy',
    mealType: [],
    dietType: [],
    cuisineType: '',
    mainIngredient: '',
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
    },
    allergies: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing recipe for editing or draft from localStorage
  useEffect(() => {
    const loadRecipeForEditing = async () => {
      if (editRecipeId) {
        setLoading(true);
        try {
          // TODO: Replace with actual API call to fetch recipe by ID
          // Simulate API delay and fetch recipe data
          setTimeout(() => {
            // Mock data for the recipe being edited
            const mockRecipeToEdit: Recipe = {
              id: editRecipeId,
              title: 'Classic Chocolate Chip Cookies',
              description: 'Perfectly chewy cookies with premium chocolate chips.',
              images: ['https://via.placeholder.com/400x300/f59e0b/ffffff?text=Chocolate+Cookies'],
              ingredients: [
                { id: '1', name: 'All-purpose flour', quantity: 2.25, unit: 'cups' },
                { id: '2', name: 'Chocolate chips', quantity: 2, unit: 'cups' },
              ],
              instructions: [
                { id: '1', stepNumber: 1, description: 'Preheat oven to 375°F (190°C).' },
              ],
              prepTime: 20,
              cookTime: 12,
              servings: 24,
              difficulty: 'easy',
              mealType: ['dessert'],
              dietType: ['vegetarian'],
              cuisineType: 'American',
              mainIngredient: 'Flour',
              nutrition: {
                calories: 150,
                protein: 2,
                carbs: 22,
                fat: 7,
                fiber: 1,
                sodium: 95,
              },
              allergies: ['gluten', 'dairy', 'eggs'],
              ratings: [],
              comments: [],
              averageRating: 0,
              totalRatings: 0,
              totalComments: 0,
              status: 'rejected',
              rejectionReason:
                'Recipe needs more detailed instructions and nutritional accuracy verification.',
              chefId: '1',
              chef: {
                id: '1',
                email: 'chef@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'chef',
                createdAt: '2025-01-10T09:00:00Z',
                updatedAt: '2025-01-10T09:00:00Z',
              },
              createdAt: '2025-01-18T11:20:00Z',
              updatedAt: '2025-01-21T16:45:00Z',
            };

            // Convert Recipe to RecipeFormData format
            setFormData({
              title: mockRecipeToEdit.title,
              description: mockRecipeToEdit.description,
              images: [], // For editing, we'll handle existing images separately
              ingredients: mockRecipeToEdit.ingredients.map(ing => ({
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
              })),
              instructions: mockRecipeToEdit.instructions.map(inst => ({
                stepNumber: inst.stepNumber,
                description: inst.description,
              })),
              prepTime: mockRecipeToEdit.prepTime,
              cookTime: mockRecipeToEdit.cookTime,
              servings: mockRecipeToEdit.servings,
              difficulty: mockRecipeToEdit.difficulty,
              mealType: mockRecipeToEdit.mealType,
              dietType: mockRecipeToEdit.dietType,
              cuisineType: mockRecipeToEdit.cuisineType,
              mainIngredient: mockRecipeToEdit.mainIngredient,
              nutrition: mockRecipeToEdit.nutrition || {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                sodium: 0,
              },
              allergies: mockRecipeToEdit.allergies,
            });
            setExistingImages(mockRecipeToEdit.images);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error loading recipe for editing:', error);
          setLoading(false);
        }
      } else {
        // Load draft from localStorage for new recipe
        const savedDraft = localStorage.getItem('recipeSubmissionDraft');
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            setFormData(draft);
          } catch (error) {
            console.error('Error loading draft:', error);
          }
        }
      }
    };

    loadRecipeForEditing();
  }, [editRecipeId]);

  // Save draft to localStorage whenever form data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('recipeSubmissionDraft', JSON.stringify(formData));
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 2000); // Hide indicator after 2 seconds
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [formData]);

  const handleInputChange = (field: keyof RecipeFormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const updateNutrition = (field: keyof NutritionInfo, value: number) => {
    setFormData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: value,
      },
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: 0, unit: '' }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (
    index: number,
    field: keyof Omit<Ingredient, 'id'>,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      ),
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { stepNumber: prev.instructions.length + 1, description: '' },
      ],
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, stepNumber: i + 1 })),
    }));
  };

  const updateInstruction = (
    index: number,
    field: keyof Omit<Instruction, 'id'>,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) =>
        i === index ? { ...instruction, [field]: value } : instruction
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Recipe name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.ingredients.some(ing => !ing.name.trim()))
      newErrors.ingredients = 'All ingredients must have names';
    if (formData.instructions.some(inst => !inst.description.trim()))
      newErrors.instructions = 'All instructions must have descriptions';
    if (!formData.cuisineType.trim()) newErrors.cuisineType = 'Cuisine type is required';
    if (!formData.mainIngredient.trim()) newErrors.mainIngredient = 'Main ingredient is required';
    if (formData.prepTime <= 0) newErrors.prepTime = 'Prep time must be greater than 0';
    if (formData.cookTime <= 0) newErrors.cookTime = 'Cook time must be greater than 0';
    if (formData.servings <= 0) newErrors.servings = 'Servings must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit to API
      console.log('Submitting recipe:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      alert('Recipe submitted successfully! It will be reviewed by our team.');

      // Clear saved draft
      localStorage.removeItem('recipeSubmissionDraft');

      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        images: [],
        ingredients: [{ name: '', quantity: 0, unit: '' }],
        instructions: [{ stepNumber: 1, description: '' }],
        prepTime: 0,
        cookTime: 0,
        servings: 1,
        difficulty: 'easy',
        mealType: [],
        dietType: [],
        cuisineType: '',
        mainIngredient: '',
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sodium: 0,
        },
        allergies: [],
      });

      // TODO: Redirect to recipe list or show success message
      window.location.href = '/';
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to submit recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="aspect-video bg-gray-300 rounded-lg"></div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (previewMode) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Recipe Preview</h1>
            <Button onClick={() => setPreviewMode(false)} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Close Preview
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{formData.title || 'Recipe Title'}</h2>
                  <p className="text-gray-600 mt-2">
                    {formData.description || 'Recipe description...'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {formData.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{ingredient.name || 'Ingredient name'}</span>
                          <span>
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                    <ol className="space-y-2">
                      {formData.instructions.map((instruction, index) => (
                        <li key={index} className="flex space-x-3">
                          <span className="font-semibold text-primary-600">{index + 1}.</span>
                          <span>{instruction.description || 'Instruction description...'}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Recipe Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Prep Time</p>
                    <p className="font-semibold">{formData.prepTime}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Cook Time</p>
                    <p className="font-semibold">{formData.cookTime}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Servings</p>
                    <p className="font-semibold">{formData.servings}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-semibold capitalize">{formData.difficulty}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  {formData.mealType.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Meal Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.mealType.map(type => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full capitalize"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.dietType.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Diet Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.dietType.map(type => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full capitalize"
                          >
                            {type.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.allergies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Allergens</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.allergies.map(allergy => (
                          <span
                            key={allergy}
                            className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Nutrition Info */}
                {formData.nutrition && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Nutrition Per Serving</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.nutrition.calories && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-primary-600">
                            {formData.nutrition.calories}
                          </p>
                          <p className="text-sm text-gray-600">Calories</p>
                        </div>
                      )}
                      {formData.nutrition.protein && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-primary-600">
                            {formData.nutrition.protein}g
                          </p>
                          <p className="text-sm text-gray-600">Protein</p>
                        </div>
                      )}
                      {formData.nutrition.carbs && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-primary-600">
                            {formData.nutrition.carbs}g
                          </p>
                          <p className="text-sm text-gray-600">Carbs</p>
                        </div>
                      )}
                      {formData.nutrition.fat && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-primary-600">
                            {formData.nutrition.fat}g
                          </p>
                          <p className="text-sm text-gray-600">Fat</p>
                        </div>
                      )}
                      {formData.nutrition.fiber && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-primary-600">
                            {formData.nutrition.fiber}g
                          </p>
                          <p className="text-sm text-gray-600">Fiber</p>
                        </div>
                      )}
                      {formData.nutrition.sodium && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-primary-600">
                            {formData.nutrition.sodium}mg
                          </p>
                          <p className="text-sm text-gray-600">Sodium</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Recipes
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Recipe' : 'Submit New Recipe'}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? 'Update your recipe and resubmit for review'
                : 'Share your delicious creation with the community'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {isDraftSaved && (
              <span className="text-sm text-green-600 flex items-center">
                <Save className="h-4 w-4 mr-1" />
                Draft saved
              </span>
            )}
            <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Name *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Enter recipe name"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Describe your recipe..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Images
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 text-center transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">
                    Upload photos of your recipe
                  </p>
                  <p className="text-gray-500 text-xs mb-4">JPG, PNG, WebP up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild className="cursor-pointer">
                      <span>Choose Images</span>
                    </Button>
                  </label>
                  {(existingImages.length > 0 || formData.images.length > 0) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-4 font-medium">
                        {existingImages.length + formData.images.length} image
                        {existingImages.length + formData.images.length !== 1 ? 's' : ''} selected
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {/* Existing images from editing */}
                        {existingImages.map((imageUrl, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={imageUrl}
                                alt={`Existing ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setExistingImages(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                              title="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md font-medium">
                              Existing
                            </div>
                          </div>
                        ))}
                        {/* New uploaded images */}
                        {formData.images.map((file, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index),
                                }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                              title="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-green-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded-md font-medium">
                              New
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="prepTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Prep Time (min) *
                  </label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="1"
                    value={formData.prepTime}
                    onChange={e => handleInputChange('prepTime', parseInt(e.target.value) || 0)}
                    className={errors.prepTime ? 'border-red-500' : ''}
                  />
                  {errors.prepTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cookTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Cook Time (min) *
                  </label>
                  <Input
                    id="cookTime"
                    type="number"
                    min="1"
                    value={formData.cookTime}
                    onChange={e => handleInputChange('cookTime', parseInt(e.target.value) || 0)}
                    className={errors.cookTime ? 'border-red-500' : ''}
                  />
                  {errors.cookTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.cookTime}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="servings"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Servings *
                  </label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={e => handleInputChange('servings', parseInt(e.target.value) || 0)}
                    className={errors.servings ? 'border-red-500' : ''}
                  />
                  {errors.servings && (
                    <p className="text-red-500 text-sm mt-1">{errors.servings}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={e =>
                      handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>List all ingredients needed for your recipe</CardDescription>
                </div>
                <Button type="button" onClick={addIngredient} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex space-x-4 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={e => updateIngredient(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Qty"
                        value={ingredient.quantity || ''}
                        onChange={e =>
                          updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={e => updateIngredient(index, 'unit', e.target.value)}
                      />
                    </div>
                    {formData.ingredients.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        variant="outline"
                        size="icon"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Instructions</CardTitle>
                  <CardDescription>Step-by-step cooking instructions</CardDescription>
                </div>
                <Button type="button" onClick={addInstruction} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-2">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder={`Step ${index + 1} instructions...`}
                        value={instruction.description}
                        onChange={e => updateInstruction(index, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        variant="outline"
                        size="icon"
                        className="mt-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.instructions && (
                  <p className="text-red-500 text-sm">{errors.instructions}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Help others find and understand your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cuisineType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Cuisine Type *
                  </label>
                  <Input
                    id="cuisineType"
                    value={formData.cuisineType}
                    onChange={e => handleInputChange('cuisineType', e.target.value)}
                    placeholder="e.g., Italian, Mexican, Asian"
                    className={errors.cuisineType ? 'border-red-500' : ''}
                  />
                  {errors.cuisineType && (
                    <p className="text-red-500 text-sm mt-1">{errors.cuisineType}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mainIngredient"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Main Ingredient *
                  </label>
                  <Input
                    id="mainIngredient"
                    value={formData.mainIngredient}
                    onChange={e => handleInputChange('mainIngredient', e.target.value)}
                    placeholder="e.g., Chicken, Beef, Tofu"
                    className={errors.mainIngredient ? 'border-red-500' : ''}
                  />
                  {errors.mainIngredient && (
                    <p className="text-red-500 text-sm mt-1">{errors.mainIngredient}</p>
                  )}
                </div>
              </div>

              {/* Meal Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Meal Types</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack', 'dessert'] as const).map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mealType.includes(type)}
                        onChange={e => {
                          const newMealTypes = e.target.checked
                            ? [...formData.mealType, type]
                            : formData.mealType.filter(m => m !== type);
                          handleInputChange('mealType', newMealTypes);
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Diet Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Diet Types</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(
                    ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'] as const
                  ).map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.dietType.includes(type)}
                        onChange={e => {
                          const newDietTypes = e.target.checked
                            ? [...formData.dietType, type]
                            : formData.dietType.filter(d => d !== type);
                          handleInputChange('dietType', newDietTypes);
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {type.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                  Common Allergens (Optional)
                </label>
                <Input
                  id="allergies"
                  value={formData.allergies.join(', ')}
                  onChange={e =>
                    handleInputChange(
                      'allergies',
                      e.target.value
                        .split(',')
                        .map(a => a.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="e.g., nuts, dairy, eggs, gluten (separate with commas)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Help people with allergies identify ingredients to avoid
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Information */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Information (Optional)</CardTitle>
              <CardDescription>Add nutritional data per serving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="calories"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Calories
                  </label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.nutrition?.calories || ''}
                    onChange={e => updateNutrition('calories', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 350"
                  />
                </div>

                <div>
                  <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <Input
                    id="protein"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.nutrition?.protein || ''}
                    onChange={e => updateNutrition('protein', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 25.5"
                  />
                </div>

                <div>
                  <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <Input
                    id="carbs"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.nutrition?.carbs || ''}
                    onChange={e => updateNutrition('carbs', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 45.2"
                  />
                </div>

                <div>
                  <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-2">
                    Fat (g)
                  </label>
                  <Input
                    id="fat"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.nutrition?.fat || ''}
                    onChange={e => updateNutrition('fat', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 12.8"
                  />
                </div>

                <div>
                  <label htmlFor="fiber" className="block text-sm font-medium text-gray-700 mb-2">
                    Fiber (g)
                  </label>
                  <Input
                    id="fiber"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.nutrition?.fiber || ''}
                    onChange={e => updateNutrition('fiber', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 8.5"
                  />
                </div>

                <div>
                  <label htmlFor="sodium" className="block text-sm font-medium text-gray-700 mb-2">
                    Sodium (mg)
                  </label>
                  <Input
                    id="sodium"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.nutrition?.sodium || ''}
                    onChange={e => updateNutrition('sodium', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 420"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting
                ? isEditing
                  ? 'Updating...'
                  : 'Submitting...'
                : isEditing
                  ? 'Update Recipe'
                  : 'Submit Recipe'}
            </Button>
          </div>
        </form>

        {/* TODO: Add draft saving functionality */}
        {/* TODO: Add image preview and removal */}
        {/* TODO: Add ingredient suggestions */}
        {/* TODO: Add rich text editor for instructions */}
      </div>
    </Layout>
  );
}
