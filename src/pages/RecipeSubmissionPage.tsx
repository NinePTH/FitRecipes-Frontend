import React, { useState } from 'react';
import { ChevronLeft, Upload, Plus, X, Save, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import type { RecipeFormData, Ingredient, Instruction } from '@/types';

export function RecipeSubmissionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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

    // TODO: Submit to API
    console.log('Submitting recipe:', formData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // TODO: Handle success/error responses
      // TODO: Redirect to recipe list or show success message
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Submit New Recipe</h1>
            <p className="text-gray-600">Share your delicious creation with the community</p>
          </div>

          <div className="flex space-x-2">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload photos of your recipe</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>Choose Images</span>
                    </Button>
                  </label>
                  {formData.images.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.images.length} image(s) selected
                    </p>
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

              {/* TODO: Add meal type checkboxes */}
              {/* TODO: Add diet type checkboxes */}
              {/* TODO: Add allergy information */}
              {/* TODO: Add nutrition information form */}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
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
