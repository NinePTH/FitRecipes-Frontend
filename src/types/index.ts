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
  images: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  mealType: MealType[];
  dietType: DietType[];
  cuisineType: string;
  mainIngredient: string;
  nutrition?: NutritionInfo;
  allergies: string[];
  ratings: RecipeRating[];
  comments: RecipeComment[];
  averageRating: number;
  totalRatings: number;
  totalComments: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  chefId: string;
  chef: User;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Instruction {
  id: string;
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
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
export type DietType = 'vegetarian' | 'vegan' | 'gluten-free' | 'keto' | 'paleo' | 'dairy-free';
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

// Form Types
export interface RecipeFormData {
  title: string;
  description: string;
  images: File[];
  ingredients: Omit<Ingredient, 'id'>[];
  instructions: Omit<Instruction, 'id'>[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: Recipe['difficulty'];
  mealType: MealType[];
  dietType: DietType[];
  cuisineType: string;
  mainIngredient: string;
  nutrition?: NutritionInfo;
  allergies: string[];
}

// Component Props Types
export interface InfiniteScrollProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
}
