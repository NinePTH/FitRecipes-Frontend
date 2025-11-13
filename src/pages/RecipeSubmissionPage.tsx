import React, { useState, useEffect } from 'react';
import { ChevronLeft, Upload, Plus, X, Save, Eye, Clock, Users, AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Layout } from '@/components/Layout';
import { submitRecipe, uploadRecipeImage, getRecipeById, updateRecipe } from '@/services/recipe';
import type { ApiError } from '@/services/api';
import type { RecipeFormData, Instruction, NutritionInfo, Recipe } from '@/types';

export function RecipeSubmissionPage() {
  const [searchParams] = useSearchParams();
  const editRecipeId = searchParams.get('edit');
  const isEditing = Boolean(editRecipeId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [originalStatus, setOriginalStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [allergiesInput, setAllergiesInput] = useState(''); // Raw string input for allergies
  const [imageUploadStatus, setImageUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');

  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: '',
    description: '',
  });

  const showAlert = (title: string, description: string) => {
    setAlertDialog({ open: true, title, description });
  };

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
          // Fetch recipe from API
          const recipe = await getRecipeById(editRecipeId);

          // Check if recipe can be edited (only PENDING and REJECTED)
          if (recipe.status === 'APPROVED') {
            showAlert(
              'Cannot Edit Recipe',
              'Approved recipes cannot be edited. Please contact an admin if you need to make changes.'
            );
            setTimeout(() => {
              window.location.href = '/my-recipes';
            }, 2000);
            return;
          }

          // Store original status for success message
          setOriginalStatus(recipe.status);

          // Store rejection reason if recipe was rejected
          if (recipe.status === 'REJECTED' && recipe.rejectionReason) {
            setRejectionReason(recipe.rejectionReason);
          }

          // Convert Recipe to RecipeFormData format
          setFormData({
            title: recipe.title,
            description: recipe.description,
            images: [], // For editing, we'll handle existing images separately
            ingredients: recipe.ingredients.map(ing => ({
              name: ing.name,
              quantity: parseFloat(ing.amount), // Convert amount (string) to quantity (number)
              unit: ing.unit,
            })),
            instructions: recipe.instructions.map((desc, index) => ({
              stepNumber: index + 1,
              description: desc,
            })),
            prepTime: recipe.prepTime,
            cookTime: recipe.cookingTime, // Backend uses 'cookingTime', UI uses 'cookTime'
            servings: recipe.servings,
            difficulty: recipe.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
            mealType: recipe.mealType.map(meal => meal.toLowerCase()) as Array<
              'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
            >,
            dietType: [
              ...(recipe.dietaryInfo?.isVegetarian ? ['vegetarian' as const] : []),
              ...(recipe.dietaryInfo?.isVegan ? ['vegan' as const] : []),
              ...(recipe.dietaryInfo?.isGlutenFree ? ['gluten-free' as const] : []),
              ...(recipe.dietaryInfo?.isDairyFree ? ['dairy-free' as const] : []),
              ...(recipe.dietaryInfo?.isKeto ? ['keto' as const] : []),
              ...(recipe.dietaryInfo?.isPaleo ? ['paleo' as const] : []),
            ],
            cuisineType: recipe.cuisineType || '',
            mainIngredient: recipe.mainIngredient,
            nutrition: recipe.nutritionInfo || {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              fiber: 0,
              sodium: 0,
            },
            allergies: recipe.allergies || [],
          });
          setAllergiesInput(recipe.allergies?.join(', ') || '');

          // Handle imageUrls (new), imageUrl (deprecated), and images (deprecated) from backend
          const existingImageUrls =
            recipe.imageUrls && recipe.imageUrls.length > 0
              ? recipe.imageUrls
              : recipe.images && recipe.images.length > 0
                ? recipe.images
                : recipe.imageUrl
                  ? [recipe.imageUrl]
                  : [];
          setExistingImages(existingImageUrls);

          setLoading(false);
        } catch (error) {
          console.error('Error loading recipe for editing:', error);
          setErrors({ general: 'Failed to load recipe for editing' });
          setLoading(false);
        }
      } else {
        // Load draft from localStorage for new recipe
        const savedDraft = localStorage.getItem('recipeSubmissionDraft');
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            // Filter out images since File objects can't be serialized
            // They become empty objects {} in JSON
            setFormData({
              ...draft,
              images: [], // Always start with empty images array
            });
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
      // Exclude images from draft since File objects can't be serialized
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { images, ...draftData } = formData;
      localStorage.setItem('recipeSubmissionDraft', JSON.stringify(draftData));
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
    field: 'name' | 'quantity' | 'unit', // UI uses 'quantity' not 'amount'
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

    // Title: 3-200 characters (backend requirement)
    if (!formData.title.trim()) {
      newErrors.title = 'Recipe name is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Recipe name must be at least 3 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Recipe name must be less than 200 characters';
    }

    // Description: 10-1000 characters, at least 8 words (backend requirement + word count)
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    } else {
      const wordCount = formData.description.trim().split(/\s+/).length;
      if (wordCount < 8) {
        newErrors.description = `Description must be at least 8 words (currently ${wordCount} word${wordCount === 1 ? '' : 's'})`;
      }
    }

    // Main Ingredient: 2-50 characters (backend requirement)
    if (!formData.mainIngredient.trim()) {
      newErrors.mainIngredient = 'Main ingredient is required';
    } else if (formData.mainIngredient.length < 2) {
      newErrors.mainIngredient = 'Main ingredient must be at least 2 characters';
    } else if (formData.mainIngredient.length > 50) {
      newErrors.mainIngredient = 'Main ingredient must be less than 50 characters';
    }

    // Ingredients: at least 1, all must have name, quantity > 0, unit
    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    } else if (
      formData.ingredients.some(ing => !ing.name.trim() || ing.quantity <= 0 || !ing.unit.trim())
    ) {
      newErrors.ingredients = 'All ingredients must have name, quantity (> 0), and unit';
    }

    // Instructions: at least 1, all must have description
    if (formData.instructions.length === 0) {
      newErrors.instructions = 'At least one instruction step is required';
    } else if (formData.instructions.some(inst => !inst.description.trim())) {
      newErrors.instructions = 'All instruction steps must have descriptions';
    }

    // Prep Time: 1-300 minutes (backend requirement, optional but if provided must be valid)
    if (formData.prepTime < 0) {
      newErrors.prepTime = 'Prep time cannot be negative';
    } else if (formData.prepTime > 300) {
      newErrors.prepTime = 'Prep time must be less than 300 minutes';
    }

    // Cook Time: 1-600 minutes (backend requirement, required)
    if (formData.cookTime <= 0) {
      newErrors.cookTime = 'Cook time is required and must be greater than 0';
    } else if (formData.cookTime > 600) {
      newErrors.cookTime = 'Cook time must be less than 600 minutes';
    }

    // Servings: 1-20 (backend requirement)
    if (formData.servings <= 0) {
      newErrors.servings = 'Servings must be greater than 0';
    } else if (formData.servings > 20) {
      newErrors.servings = 'Servings must be less than 20';
    }

    // Meal Type: at least 1 required
    if (formData.mealType.length === 0) {
      newErrors.mealType = 'Please select at least one meal type';
    }

    // Diet Type: at least 1 required
    if (formData.dietType.length === 0) {
      newErrors.dietType = 'Please select at least one diet type';
    }

    // Cuisine type (optional but if provided should not be empty)
    if (formData.cuisineType && !formData.cuisineType.trim()) {
      newErrors.cuisineType = 'Please provide a cuisine type or leave it empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorField = document.querySelector('.text-red-500');
        if (firstErrorField) {
          const fieldContainer = firstErrorField.closest('div');
          fieldContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);
    setImageUploadStatus('idle');

    try {
      // STEP 1: Upload images first if there are any (max 3 images)
      let uploadedImageUrls: string[] = [];

      if (formData.images.length > 0) {
        setImageUploadStatus('uploading');

        try {
          // Upload all images (up to 3)
          const uploadPromises = formData.images.slice(0, 3).map(file => uploadRecipeImage(file));
          uploadedImageUrls = await Promise.all(uploadPromises);

          setImageUploadStatus('success');
        } catch (uploadError) {
          setImageUploadStatus('error');
          console.error('Image upload failed:', uploadError);
          throw new Error('Failed to upload images. Please try again.');
        }
      }

      // STEP 2: Submit or update recipe
      let recipe: Recipe;

      if (isEditing && editRecipeId) {
        // Update existing recipe - combine new uploads with existing images (max 3 total)
        const combinedImageUrls = [...uploadedImageUrls, ...existingImages].slice(0, 3);
        recipe = await updateRecipe(editRecipeId, {
          ...formData,
          imageUrls: combinedImageUrls,
        });
      } else {
        // Create new recipe with uploaded images
        recipe = await submitRecipe({
          ...formData,
          imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
        });
      }

      // Clear saved draft
      localStorage.removeItem('recipeSubmissionDraft');

      // Show success message
      if (isEditing) {
        const message =
          originalStatus === 'REJECTED'
            ? `Your recipe will be reviewed by an admin again.`
            : `Your changes have been saved.`;
        showAlert(
          'Recipe Updated Successfully',
          `Recipe "${recipe.title}" has been updated!\n\n${message}`
        );
      } else {
        showAlert(
          'Recipe Submitted Successfully',
          `Recipe "${recipe.title}" has been submitted!\n\nStatus: ${recipe.status}\n\nYour recipe is now pending admin review. You'll be notified once it's approved.`
        );
      }

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
      setAllergiesInput('');
      setImageUploadStatus('idle');

      // Redirect to My Recipes if editing, home if creating new
      window.location.href = isEditing ? '/my-recipes' : '/';
    } catch (error) {
      console.error('Error submitting recipe:', error);

      let errorMessage = 'Failed to submit recipe. Please try again.';

      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as ApiError).message;

        // Show validation errors if present
        if ('errors' in error && Array.isArray((error as ApiError).errors)) {
          const validationErrors = (error as ApiError).errors
            ?.map(err => `• ${err.message}`)
            .join('\n');
          errorMessage += '\n\nValidation errors:\n' + validationErrors;
        }
      }

      showAlert('Submission Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImageCount = (existingImages?.length || 0) + formData.images.length;
    const remainingSlots = 3 - currentImageCount;

    // Check if already at limit
    if (remainingSlots <= 0) {
      showAlert('Maximum Images Reached', 'You can only upload a maximum of 3 images per recipe.');
      e.target.value = '';
      return;
    }

    // Validate file types and sizes
    const invalidFiles: string[] = [];
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        invalidFiles.push(`${file.name} (invalid file type)`);
        return false;
      }
      if (!isValidSize) {
        invalidFiles.push(`${file.name} (exceeds 10MB)`);
        return false;
      }
      return true;
    });

    // Show validation errors if any
    if (invalidFiles.length > 0) {
      showAlert(
        'Invalid Files',
        `The following files could not be added:\n\n${invalidFiles.join('\n')}\n\nPlease select valid image files (JPG, PNG, WebP) under 10MB.`
      );
    }

    // Limit to remaining slots
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      showAlert(
        'Image Limit',
        `Only ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''} can be added (maximum 3 total).`
      );
    }

    if (filesToAdd.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...filesToAdd],
      }));
    }

    // Clear the input so the same file can be selected again if needed
    e.target.value = '';
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
    const totalTime = formData.prepTime + formData.cookTime;
    const displayImages =
      existingImages.length > 0 ? existingImages : formData.images.length > 0 ? [] : [];

    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Recipe Preview</h1>
            <Button onClick={() => setPreviewMode(false)} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Close Preview
            </Button>
          </div>

          {/* Main Content - Match RecipeDetailPage Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Recipe Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              {(displayImages.length > 0 || formData.images.length > 0) && (
                <div className="space-y-2">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {displayImages.length > 0 ? (
                      <img
                        src={displayImages[0]}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">Image preview not available</span>
                      </div>
                    )}
                  </div>
                  {displayImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {displayImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${formData.title} ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recipe Title & Description */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {formData.title || 'Recipe Title'}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {formData.description || 'Recipe description will appear here...'}
                </p>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 py-4 border-y">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Prep Time</p>
                    <p className="font-semibold">{formData.prepTime} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Cook Time</p>
                    <p className="font-semibold">{formData.cookTime} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Time</p>
                    <p className="font-semibold">{totalTime} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Servings</p>
                    <p className="font-semibold">{formData.servings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-semibold capitalize">{formData.difficulty}</p>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {formData.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-gray-900">
                            {ingredient.name || 'Ingredient name'}
                          </span>
                          <span className="text-gray-600 font-medium">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                        </div>
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
                    {formData.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed pt-1">
                          {instruction.description || 'Instruction description...'}
                        </p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Nutrition Info */}
              {formData.nutrition && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nutrition Facts</CardTitle>
                    <p className="text-sm text-gray-500">Per serving</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.nutrition.calories && formData.nutrition.calories > 0 && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Calories</span>
                        <span className="font-semibold text-gray-900">
                          {formData.nutrition.calories} kcal
                        </span>
                      </div>
                    )}
                    {formData.nutrition.protein && formData.nutrition.protein > 0 && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Protein</span>
                        <span className="font-semibold text-gray-900">
                          {formData.nutrition.protein}g
                        </span>
                      </div>
                    )}
                    {formData.nutrition.carbs && formData.nutrition.carbs > 0 && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Carbohydrates</span>
                        <span className="font-semibold text-gray-900">
                          {formData.nutrition.carbs}g
                        </span>
                      </div>
                    )}
                    {formData.nutrition.fat && formData.nutrition.fat > 0 && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Fat</span>
                        <span className="font-semibold text-gray-900">
                          {formData.nutrition.fat}g
                        </span>
                      </div>
                    )}
                    {formData.nutrition.fiber && formData.nutrition.fiber > 0 && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Fiber</span>
                        <span className="font-semibold text-gray-900">
                          {formData.nutrition.fiber}g
                        </span>
                      </div>
                    )}
                    {formData.nutrition.sodium && formData.nutrition.sodium > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Sodium</span>
                        <span className="font-semibold text-gray-900">
                          {formData.nutrition.sodium}mg
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recipe Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recipe Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.cuisineType && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cuisine</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {formData.cuisineType}
                      </p>
                    </div>
                  )}
                  {formData.mainIngredient && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Main Ingredient</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {formData.mainIngredient}
                      </p>
                    </div>
                  )}

                  {/* Meal Types */}
                  {formData.mealType.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Meal Type</p>
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

                  {/* Diet Types */}
                  {formData.dietType.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Diet</p>
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

                  {/* Allergens */}
                  {formData.allergies.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Allergens</p>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header - Responsive */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Link
              to={isEditing ? '/my-recipes' : '/'}
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {isEditing ? 'Back to My Recipes' : 'Back to Browse Recipes'}
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

        {/* Info banner for rejected recipes */}
        {isEditing && originalStatus === 'REJECTED' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <div className="text-blue-600 text-xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Resubmission Notice</h3>
                <p className="text-sm text-blue-800">
                  This recipe was previously rejected. After updating, it will be automatically
                  resubmitted with PENDING status for admin review.
                </p>
              </div>
            </div>

            {/* Rejection reason */}
            {rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <div className="text-red-600 text-xl">❌</div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Rejection Reason</h3>
                  <p className="text-sm text-red-800">{rejectionReason}</p>
                </div>
              </div>
            )}
          </>
        )}

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
                  Recipe Images (Max 3)
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-lg p-6 text-center transition-colors group">
                  <Upload className="h-12 w-12 text-gray-400 group-hover:text-primary-500 mx-auto mb-4 transition-colors" />
                  <p className="text-gray-600 group-hover:text-gray-700 mb-2 text-sm sm:text-base transition-colors">
                    Click to upload photos of your recipe
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Images
                  </Button>
                  {((existingImages?.length || 0) > 0 || (formData.images?.length || 0) > 0) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-4 font-medium">
                        {(existingImages?.length || 0) + (formData.images?.length || 0)} image
                        {(existingImages?.length || 0) + (formData.images?.length || 0) !== 1
                          ? 's'
                          : ''}{' '}
                        selected
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {/* Existing images from editing */}
                        {existingImages?.map((imageUrl, index) => (
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
                              onClick={e => {
                                e.stopPropagation();
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
                        {formData.images.map((file, index) => {
                          // Type guard: ensure file is actually a File object
                          if (!(file instanceof File)) {
                            console.warn('Invalid file object in formData.images:', file);
                            return null;
                          }

                          return (
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
                                onClick={e => {
                                  e.stopPropagation();
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
                          );
                        })}
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
                <label className="block text-sm font-medium text-gray-700 mb-3">Meal Types *</label>
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
                {errors.mealType && <p className="text-red-500 text-sm mt-1">{errors.mealType}</p>}
              </div>

              {/* Diet Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Diet Types *</label>
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
                {errors.dietType && <p className="text-red-500 text-sm mt-1">{errors.dietType}</p>}
              </div>

              {/* Allergies */}
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                  Common Allergens (Optional)
                </label>
                <Input
                  id="allergies"
                  value={allergiesInput}
                  onChange={e => {
                    // Store raw input for natural typing
                    setAllergiesInput(e.target.value);
                  }}
                  onBlur={e => {
                    // Update formData array on blur (when user finishes typing)
                    const allergiesArray = e.target.value
                      .split(',')
                      .map(a => a.trim())
                      .filter(Boolean);
                    handleInputChange('allergies', allergiesArray);
                  }}
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
                ? imageUploadStatus === 'uploading'
                  ? 'Uploading image...'
                  : isEditing
                    ? 'Updating...'
                    : 'Submitting...'
                : isEditing
                  ? 'Update Recipe'
                  : 'Submit Recipe'}
            </Button>
          </div>

          {/* Upload Status Indicator */}
          {imageUploadStatus === 'uploading' && (
            <div className="text-center text-blue-600 mt-4">
              <p>⏳ Uploading image... Please wait.</p>
            </div>
          )}
          {imageUploadStatus === 'error' && (
            <div className="text-center text-red-600 mt-4">
              <p>❌ Failed to upload image. Please try again.</p>
            </div>
          )}
        </form>

        {/* TODO: Add draft saving functionality */}
        {/* TODO: Add image preview and removal */}
        {/* TODO: Add ingredient suggestions */}
        {/* TODO: Add rich text editor for instructions */}
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={open => setAlertDialog(prev => ({ ...prev, open }))}
        title={alertDialog.title}
        description={alertDialog.description}
      />
    </Layout>
  );
}
