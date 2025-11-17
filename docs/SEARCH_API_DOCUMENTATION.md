# FitRecipes Vector Search API Documentation

**Version:** 1.0.0  
**Base URL:** `https://your-api-domain.com` (or `http://localhost:8000` for local development)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Health Check](#health-check)
   - [Smart Search (Recommended)](#smart-search-recommended)
   - [Vector Search](#vector-search)
   - [Ingredient Search](#ingredient-search)
   - [Hybrid Search](#hybrid-search)
   - [Generate Embedding](#generate-embedding)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Code Examples](#code-examples)

---

## Overview

The FitRecipes Vector Search API provides intelligent semantic search capabilities for recipe discovery using advanced NLP and vector embeddings. The API offers multiple search modes to suit different use cases.

**Key Features:**
- 🧠 Smart Search with natural language understanding
- 🔍 Vector-based semantic search
- 🥗 Ingredient-based search
- ⚡ Hybrid search combining multiple algorithms
- 🎯 Advanced filtering (meal type, difficulty, time, cuisine, dietary preferences)
- 📊 Ranked results with relevance scoring

---

## Authentication

All API requests require an API key passed in the request header:

```http
X-API-Key: your_api_key_here
```

**Example:**
```javascript
fetch('https://api.example.com/search/smart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key_here'
  },
  body: JSON.stringify({ query: 'quick vegan dinner' })
});
```

---

## Endpoints

### Health Check

**GET** `/health`

Check API health and service status.

#### Response

```json
{
  "status": "healthy",
  "model_loaded": true,
  "database_connected": true,
  "version": "1.0.0"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"healthy"` or `"degraded"` |
| `model_loaded` | boolean | Whether the ML model is loaded |
| `database_connected` | boolean | Database connection status |
| `version` | string | API version |

---

### Smart Search (Recommended)

**POST** `/search/smart`

🧠 **The most intelligent search endpoint** - automatically extracts filters from natural language queries and expands them with synonyms for optimal results.

#### Features

- Auto-extracts time constraints, difficulty, cuisine, dietary requirements, and meal types from natural language
- Expands queries with synonyms for better semantic matching
- Merges manual filters with auto-extracted filters (manual takes precedence)
- Multi-query ranking for enhanced relevance

#### Request Body

```json
{
  "query": "quick vegan thai dinner under 30 minutes",
  "limit": 10,
  "filters": {
    "mealType": ["DINNER"],
    "difficulty": ["EASY", "MEDIUM"],
    "maxPrepTime": 45,
    "cuisineType": "Thai"
  },
  "user_id": "user_123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | ✅ Yes | Natural language search query (1-500 chars) |
| `limit` | integer | No | Maximum results (1-50, default: 10) |
| `filters` | object | No | Optional filters (see [Filters](#filters)) |
| `user_id` | string | No | User ID for authorization |

#### Example Queries

```javascript
// Auto-extracts: cuisineType=Thai, maxPrepTime=30, dietaryInfo.isVegan=true
"quick vegan thai dinner under 30 minutes"

// Auto-extracts: difficulty=EASY, dietaryInfo.isGlutenFree=true, mealType=BREAKFAST
"easy gluten-free breakfast for beginners"

// Auto-extracts: cuisineType=Japanese, cleaned query for semantic search
"spicy japanese curry with chicken"

// Auto-extracts: dietaryInfo.isKeto=true, mealType=LUNCH, maxPrepTime=20
"keto lunch recipe ready in 20 minutes"
```

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "recipe_123",
      "title": "Quick Thai Green Curry",
      "description": "A delicious vegan Thai curry ready in 25 minutes",
      "mainIngredient": "tofu",
      "cuisineType": "Thai",
      "mealType": ["DINNER"],
      "difficulty": "EASY",
      "prepTime": 10,
      "cookingTime": 15,
      "servings": 4,
      "averageRating": 4.7,
      "totalRatings": 152,
      "imageUrls": ["https://example.com/image1.jpg"],
      "status": "APPROVED",
      "authorId": "author_456",
      "combined_score": 0.89
    }
  ],
  "total": 1,
  "query": "quick vegan thai dinner under 30 minutes",
  "parsed_query": "vegan thai dinner",
  "extracted_filters": {
    "maxPrepTime": 30,
    "mealType": ["DINNER"],
    "cuisineType": "Thai",
    "dietaryInfo": {
      "isVegan": true
    }
  },
  "execution_time_ms": 145.32
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"success"` or error status |
| `data` | array | Array of recipe objects |
| `total` | integer | Number of results returned |
| `query` | string | Original query |
| `parsed_query` | string | Cleaned query after NLP parsing |
| `extracted_filters` | object | Auto-detected filters |
| `execution_time_ms` | float | Query execution time in milliseconds |

---

### Vector Search

**POST** `/search/vector`

Semantic search endpoint using vector similarity without NLP parsing.

#### Request Body

```json
{
  "query": "spicy thai chicken curry",
  "limit": 10,
  "filters": {
    "mealType": ["DINNER"],
    "difficulty": ["EASY"],
    "maxPrepTime": 60,
    "cuisineType": "Thai"
  },
  "user_id": "user_123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | ✅ Yes | Search query text (1-500 chars) |
| `limit` | integer | No | Maximum results (1-50, default: 10) |
| `filters` | object | No | Optional filters (see [Filters](#filters)) |
| `user_id` | string | No | User ID for authorization |

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "recipe_123",
      "title": "Thai Red Curry Chicken",
      "description": "Authentic Thai curry with tender chicken",
      "mainIngredient": "chicken",
      "cuisineType": "Thai",
      "mealType": ["DINNER"],
      "difficulty": "EASY",
      "prepTime": 15,
      "cookingTime": 30,
      "servings": 4,
      "averageRating": 4.8,
      "totalRatings": 234,
      "imageUrls": ["https://example.com/curry.jpg"],
      "status": "APPROVED",
      "authorId": "author_789",
      "similarity": 0.87
    }
  ],
  "total": 1,
  "query": "spicy thai chicken curry",
  "execution_time_ms": 98.45
}
```

---

### Ingredient Search

**POST** `/search/ingredients`

🥗 Find recipes by specific ingredients with intelligent matching.

#### Match Modes

- **`any`** (OR): Recipes containing ANY of the specified ingredients
- **`all`** (AND): Recipes containing ALL of the specified ingredients

#### Scoring System

| Match Type | Points | Description |
|------------|--------|-------------|
| Primary | 10 | Exact mainIngredient match |
| Secondary | 5 | mainIngredient contains ingredient |
| Tertiary | 3 per match | ingredients JSON array match |
| Quaternary | 2 | Title contains ingredient |
| Quinary | 1 | Description contains ingredient |

#### Request Body

```json
{
  "ingredients": ["chicken", "garlic", "tomato"],
  "match_mode": "any",
  "limit": 10,
  "filters": {
    "mealType": ["LUNCH", "DINNER"],
    "maxPrepTime": 45
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ingredients` | array[string] | ✅ Yes | List of ingredients to search for |
| `match_mode` | string | No | `"any"` (default) or `"all"` |
| `limit` | integer | No | Maximum results (1-50, default: 10) |
| `filters` | object | No | Optional filters (see [Filters](#filters)) |

#### Example Requests

```json
// Find recipes with chicken OR garlic
{
  "ingredients": ["chicken", "garlic"],
  "match_mode": "any",
  "limit": 10
}

// Find recipes with BOTH egg AND rice
{
  "ingredients": ["egg", "rice"],
  "match_mode": "all",
  "limit": 5
}

// Find quick lunch with tomato
{
  "ingredients": ["tomato"],
  "filters": {
    "mealType": ["LUNCH"],
    "maxPrepTime": 30
  }
}
```

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "recipe_456",
      "title": "Garlic Chicken Stir Fry",
      "description": "Quick and easy chicken with garlic",
      "mainIngredient": "chicken",
      "ingredients": [
        {"name": "chicken breast", "amount": "500g"},
        {"name": "garlic", "amount": "4 cloves"},
        {"name": "soy sauce", "amount": "2 tbsp"}
      ],
      "cuisineType": "Asian",
      "mealType": ["DINNER"],
      "difficulty": "EASY",
      "prepTime": 10,
      "cookingTime": 15,
      "servings": 4,
      "averageRating": 4.6,
      "totalRatings": 89,
      "imageUrls": ["https://example.com/stir-fry.jpg"],
      "status": "APPROVED",
      "authorId": "author_012",
      "match_score": 18,
      "matched_count": 2
    }
  ],
  "total": 1,
  "ingredients": ["chicken", "garlic", "tomato"],
  "match_mode": "any",
  "execution_time_ms": 67.89
}
```

| Field | Type | Description |
|-------|------|-------------|
| `match_score` | integer | Ingredient match score (higher = better) |
| `matched_count` | integer | Number of ingredients matched |

---

### Hybrid Search

**POST** `/search/hybrid`

Combines keyword search and vector similarity for complex queries. Best results when you need both semantic understanding and exact keyword matches.

#### Request Body

```json
{
  "query": "authentic italian pasta carbonara",
  "limit": 10,
  "filters": {
    "cuisineType": "Italian",
    "difficulty": ["MEDIUM"]
  }
}
```

Same request format as [Vector Search](#vector-search).

#### Response

Same response format as [Vector Search](#vector-search), but results are ranked using:
- 60% vector similarity score
- 40% keyword relevance score

---

### Generate Embedding

**POST** `/embeddings/generate`

Generate vector embedding for a specific recipe. This is called automatically by the backend when a new recipe is approved.

#### Request Body

```json
{
  "recipe_id": "recipe_123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `recipe_id` | string | ✅ Yes | Recipe ID to generate embedding for |

#### Response

```json
{
  "status": "success",
  "recipe_id": "recipe_123",
  "embedding_generated": true,
  "message": "Embedding generated successfully for recipe recipe_123"
}
```

---

## Data Models

### Filters

Optional filters that can be applied to search requests:

```typescript
interface Filters {
  mealType?: MealType[];          // Array of meal types
  difficulty?: DifficultyLevel[]; // Array of difficulty levels
  maxPrepTime?: number;           // Maximum total time (prepTime + cookingTime) in minutes
  cuisineType?: string;           // Cuisine type (case-insensitive)
  dietaryInfo?: DietaryInfo;      // Dietary requirements
}
```

### MealType Enum

```typescript
type MealType = 
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACK"
  | "DESSERT"
```

### DifficultyLevel Enum

```typescript
type DifficultyLevel = 
  | "EASY"
  | "MEDIUM"
  | "HARD";
```

### DietaryInfo

```typescript
interface DietaryInfo {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isKeto?: boolean;
  isPaleo?: boolean;
  isLowCarb?: boolean;
  isHighProtein?: boolean;
}
```

### Recipe Object

```typescript
interface Recipe {
  id: string;                    // Unique recipe ID
  title: string;                 // Recipe title
  description: string;           // Recipe description
  mainIngredient: string;        // Primary ingredient
  ingredients?: Ingredient[];    // List of ingredients (JSON array)
  cuisineType: string;           // Cuisine type (e.g., "Thai", "Italian")
  mealType: MealType[];          // Array of meal types
  difficulty: DifficultyLevel;   // Difficulty level
  prepTime: number;              // Preparation time in minutes
  cookingTime: number;           // Cooking time in minutes
  servings: number;              // Number of servings
  averageRating: number;         // Average rating (0-5)
  totalRatings: number;          // Total number of ratings
  imageUrls: string[];           // Array of image URLs
  status: string;                // Recipe status (always "APPROVED" in search results)
  authorId: string;              // Author ID
  similarity?: number;           // Similarity score (0-1, vector/hybrid search only)
  match_score?: number;          // Match score (ingredient search only)
  matched_count?: number;        // Matched ingredients count (ingredient search only)
  combined_score?: number;       // Combined score (smart search only)
}
```

### Ingredient

```typescript
interface Ingredient {
  name: string;     // Ingredient name
  amount: string;   // Amount (e.g., "2 cups", "500g")
  unit?: string;    // Optional unit
}
```

---

## Error Handling

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 401 | Unauthorized (invalid or missing API key) |
| 404 | Resource not found |
| 422 | Validation error (invalid request parameters) |
| 500 | Internal server error |

### Common Error Examples

#### 401 Unauthorized
```json
{
  "detail": "Invalid API key"
}
```

#### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "query"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

#### 500 Internal Error
```json
{
  "detail": "Search failed: Database connection error"
}
```

---

## Code Examples

### JavaScript/TypeScript (Fetch API)

```javascript
// Smart Search Example
async function smartSearch(query, filters = {}) {
  try {
    const response = await fetch('https://api.example.com/search/smart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your_api_key_here'
      },
      body: JSON.stringify({
        query: query,
        limit: 10,
        filters: filters
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Results:', data.data);
    console.log('Extracted filters:', data.extracted_filters);
    return data;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

// Usage
smartSearch('quick vegan thai dinner under 30 minutes')
  .then(results => {
    // Handle results
    results.data.forEach(recipe => {
      console.log(`${recipe.title} - ${recipe.similarity}`);
    });
  });
```

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

interface SearchResponse {
  status: string;
  data: Recipe[];
  total: number;
  query: string;
  parsed_query?: string;
  extracted_filters?: any;
  execution_time_ms: number;
}

const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key_here'
  }
});

// Smart Search
async function smartSearch(
  query: string, 
  limit: number = 10
): Promise<SearchResponse> {
  const response = await api.post<SearchResponse>('/search/smart', {
    query,
    limit
  });
  return response.data;
}

// Ingredient Search
async function ingredientSearch(
  ingredients: string[],
  matchMode: 'any' | 'all' = 'any'
) {
  const response = await api.post('/search/ingredients', {
    ingredients,
    match_mode: matchMode,
    limit: 10
  });
  return response.data;
}

// Usage
smartSearch('healthy breakfast under 15 minutes')
  .then(results => {
    console.log(`Found ${results.total} recipes`);
    console.log(`Parsed query: ${results.parsed_query}`);
  })
  .catch(error => {
    console.error('Error:', error.response?.data?.detail);
  });
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'X-API-Key': process.env.REACT_APP_API_KEY
  }
});

function useRecipeSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/search/smart', {
        query,
        limit: 20,
        filters
      });
      
      setResults(response.data.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchByIngredients = async (ingredients, matchMode = 'any') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/search/ingredients', {
        ingredients,
        match_mode: matchMode,
        limit: 20
      });
      
      setResults(response.data.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchRecipes, searchByIngredients };
}

// Component usage
function SearchComponent() {
  const { results, loading, error, searchRecipes } = useRecipeSearch();
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchRecipes(query);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="results">
        {results.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <span>Rating: {recipe.averageRating}/5</span>
            <span>Time: {recipe.prepTime + recipe.cookingTime} min</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Python Example

```python
import requests
from typing import List, Dict, Optional

class RecipeSearchAPI:
    def __init__(self, api_key: str, base_url: str = "https://api.example.com"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "X-API-Key": api_key
        }
    
    def smart_search(
        self, 
        query: str, 
        limit: int = 10,
        filters: Optional[Dict] = None
    ) -> Dict:
        """Perform smart search with NLP"""
        url = f"{self.base_url}/search/smart"
        payload = {
            "query": query,
            "limit": limit,
            "filters": filters or {}
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def ingredient_search(
        self,
        ingredients: List[str],
        match_mode: str = "any",
        limit: int = 10
    ) -> Dict:
        """Search recipes by ingredients"""
        url = f"{self.base_url}/search/ingredients"
        payload = {
            "ingredients": ingredients,
            "match_mode": match_mode,
            "limit": limit
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()

# Usage
api = RecipeSearchAPI(api_key="your_api_key_here")

# Smart search
results = api.smart_search("quick vegan dinner under 30 minutes")
print(f"Found {results['total']} recipes")
for recipe in results['data']:
    print(f"- {recipe['title']} ({recipe['combined_score']:.2f})")

# Ingredient search
results = api.ingredient_search(["chicken", "garlic"], match_mode="any")
print(f"\nFound {results['total']} recipes with chicken or garlic")
```

---

## Best Practices

### 1. Use Smart Search for User Queries

For search bars and natural language queries from users, always use `/search/smart`. It provides the best results by understanding intent and extracting filters automatically.

```javascript
// ✅ Good - Smart search understands intent
searchRecipes('quick vegan thai dinner under 30 minutes')

// ❌ Less optimal - Manual filter extraction
searchRecipes('vegan thai dinner', {
  maxPrepTime: 30,
  mealType: ['DINNER']
})
```

### 2. Debounce Search Requests

Implement debouncing to avoid excessive API calls:

```javascript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  await searchRecipes(query);
}, 300); // Wait 300ms after user stops typing
```

### 3. Cache Search Results

Cache results for identical queries to reduce API calls and improve performance:

```javascript
const searchCache = new Map();

async function cachedSearch(query) {
  if (searchCache.has(query)) {
    return searchCache.get(query);
  }
  
  const results = await searchRecipes(query);
  searchCache.set(query, results);
  return results;
}
```

### 4. Handle Errors Gracefully

Always implement proper error handling:

```javascript
try {
  const results = await searchRecipes(query);
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
    console.error('Invalid API key');
  } else if (error.response?.status === 422) {
    // Handle validation error
    console.error('Invalid query parameters');
  } else {
    // Handle other errors
    console.error('Search failed:', error.message);
  }
}
```

### 5. Optimize Filter Usage

Combine filters efficiently:

```javascript
// ✅ Good - Combine related filters
const filters = {
  mealType: ['BREAKFAST', 'BRUNCH'],
  maxPrepTime: 30,
  difficulty: ['EASY']
};

// ❌ Bad - Too restrictive
const filters = {
  mealType: ['BREAKFAST'],
  maxPrepTime: 10,
  difficulty: ['EASY'],
  cuisineType: 'Japanese'
};
```

### 6. Display Execution Time

Show users how fast the search is:

```javascript
const { data, execution_time_ms } = await searchRecipes(query);
console.log(`Found ${data.length} recipes in ${execution_time_ms}ms`);
```

---

## Rate Limiting

The API may implement rate limiting. Current limits:
- **100 requests per minute** per API key
- **1000 requests per hour** per API key

If you exceed these limits, you'll receive a `429 Too Many Requests` response.

---

## Support

For API support, integration help, or bug reports:
- 📧 Email: api-support@fitrecipes.com
- 📚 Documentation: https://docs.fitrecipes.com
- 🐛 Issues: https://github.com/fitrecipes/api/issues

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Smart search with NLP
- Vector search
- Ingredient search
- Hybrid search
- Advanced filtering
- Dietary preference support

---

**Last Updated:** November 16, 2025
