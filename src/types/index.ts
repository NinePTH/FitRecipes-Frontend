// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'CHEF' | 'ADMIN';
  avatar?: string;
  isEmailVerified?: boolean;
  isOAuthUser?: boolean;
  termsAccepted?: boolean;
  failedLoginAttempts?: number;
  lockoutUntil?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Backend API Response Format
export interface BackendResponse<T = unknown> {
  status: 'success' | 'error';
  data: T | null;
  message: string;
  errors?: Array<{
    code: string;
    message: string;
    path?: string[];
  }>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface GoogleOAuthResponse {
  authUrl: string;
  state: string;
}

export interface GoogleOAuthCallbackData {
  code: string;
  state: string;
}

export interface ResendVerificationData {
  email: string;
}

// Recipe Types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrls: string[]; // Backend uses 'imageUrls' (array, max 3)
  imageUrl?: string; // Deprecated: For backward compatibility only
  images?: string[]; // Deprecated: For backward compatibility only
  ingredients: Ingredient[];
  instructions: string[]; // Backend uses string array
  prepTime: number; // in minutes
  cookingTime: number; // Backend uses 'cookingTime' not 'cookTime'
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'; // Backend uses uppercase
  mealType: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT'>; // Array of meal types, uppercase
  cuisineType?: string;
  mainIngredient: string;
  tags?: string[]; // Optional tags for search
  dietaryInfo?: DietaryInfo; // Backend uses object with boolean flags
  nutritionInfo?: NutritionInfo; // Backend uses 'nutritionInfo'
  allergies?: string[]; // Keep for UI compatibility
  ratings?: RecipeRating[];
  comments?: RecipeComment[];
  averageRating: number;
  totalRatings: number;
  totalComments?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Backend uses uppercase
  approvedAt?: string;
  approvedById?: string;
  approvedBy?: { firstName: string; lastName: string };
  rejectedAt?: string;
  rejectedById?: string;
  rejectionReason?: string;
  adminNote?: string;
  authorId: string; // Backend uses 'authorId' not 'chefId'
  author: User; // Backend uses 'author' not 'chef'
  createdAt: string;
  updatedAt: string;
}

// Dietary Information (Backend format)
export interface DietaryInfo {
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isKeto?: boolean;
  isPaleo?: boolean;
}

export interface Ingredient {
  id?: string; // Optional for UI
  name: string;
  amount: string; // Backend uses 'amount' as string
  unit: string;
}

export interface Instruction {
  id?: string; // Optional for UI
  stepNumber: number;
  description: string;
  image?: string;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
}

export interface RecipeRating {
  id: string;
  userId: string;
  user: User;
  rating: number; // 1-5
  createdAt: string;
}

export interface RecipeComment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Filter and Search Types
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT'; // Backend uses uppercase
export type DietType = 'vegetarian' | 'vegan' | 'gluten-free' | 'keto' | 'paleo' | 'dairy-free'; // UI-level type
export type SortOption = 'rating' | 'recent' | 'prep-time-asc' | 'prep-time-desc';

export interface RecipeFilters {
  mealType?: MealType[];
  dietType?: DietType[];
  difficulty?: Recipe['difficulty'][];
  mainIngredient?: string;
  cuisineType?: string;
  maxPrepTime?: number;
  search?: string;
}

export interface RecipeSearchParams extends RecipeFilters {
  page: number;
  limit: number;
  sort: SortOption;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Form Types (UI-level structure - uses lowercase for compatibility)
export interface RecipeFormData {
  title: string;
  description: string;
  images: File[];
  imageUrls?: string[]; // Existing image URLs from backend (for edit mode)
  imageUrl?: string; // Deprecated: For backward compatibility
  ingredients: Array<{ name: string; quantity: number; unit: string }>; // UI uses quantity as number
  instructions: Array<{ stepNumber: number; description: string }>; // UI uses structured instructions
  prepTime: number;
  cookTime: number; // UI uses 'cookTime', will be transformed to 'cookingTime' for backend
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard'; // UI uses lowercase, will be transformed to uppercase
  mealType: Array<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'>; // UI allows multiple, lowercase
  dietType: DietType[]; // UI uses array, will be transformed to dietaryInfo object
  cuisineType: string;
  mainIngredient: string;
  nutrition?: NutritionInfo;
  allergies: string[];
  tags?: string[];
}

// Backend Recipe Submission Data (what API expects)
export interface RecipeSubmissionData {
  title: string;
  description: string;
  mainIngredient: string;
  ingredients: Array<{ name: string; amount: string; unit: string }>;
  instructions: string[]; // Array of step descriptions
  prepTime?: number; // Optional, defaults to 10
  cookingTime: number; // Required
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  mealType?: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT'>; // Optional array of meal types
  cuisineType?: string;
  dietaryInfo?: DietaryInfo;
  nutritionInfo?: NutritionInfo;
  allergies?: string[]; // Optional array of allergen names (2-50 chars each, auto-normalized to lowercase)
  tags?: string[];
  imageUrls?: string[]; // Array of image URLs (max 3)
  imageUrl?: string; // Deprecated: For backward compatibility
}

// Component Props Types
export interface InfiniteScrollProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
}
