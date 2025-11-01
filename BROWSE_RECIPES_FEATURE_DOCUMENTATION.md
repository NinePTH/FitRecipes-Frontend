# Browse Recipes Feature - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Features](#features)
   - [Recipe Discovery Sections](#1-recipe-discovery-sections)
   - [Advanced Filtering System](#2-advanced-filtering-system)
   - [Search Functionality](#3-search-functionality)
   - [Sorting Options](#4-sorting-options)
   - [Pagination](#5-pagination)
4. [API Integration](#api-integration)
5. [User Flows](#user-flows)
6. [Technical Implementation](#technical-implementation)

---

## Overview

The **Browse Recipes Page** is the main discovery hub for users to find healthy recipes. It provides a comprehensive search and filtering experience with multiple curated sections to help users discover recipes based on their preferences, dietary restrictions, and interests.

### Key Statistics
- **Initial Load**: 20 recipes (4 + 4 + 4 + 8)
- **Recipe Sections**: 4 distinct sections
- **Filter Options**: 30+ filter combinations
- **Dietary Restrictions**: 6 types supported
- **Sort Options**: 4 different sorting methods

---

## Architecture Diagram

```mermaid
graph TB
    subgraph "User Interface"
        A[Browse Recipes Page]
        B[Search Bar]
        C[Filter Panel]
        D[Sort Dropdown]
        E[Recipe Sections]
    end
    
    subgraph "Recipe Sections"
        E1[Recommended for You]
        E2[Trending This Week]
        E3[Newly Added]
        E4[All Recipes]
    end
    
    subgraph "State Management"
        F[React State]
        F1[recipes - 8 items]
        F2[recommendedRecipes - 4 items]
        F3[trendingRecipes - 4 items]
        F4[newRecipes - 4 items]
        F5[filters]
        F6[sortBy]
        F7[searchTerm]
    end
    
    subgraph "Backend API"
        G[Recipe Service]
        G1[GET /api/v1/recipes/browse]
        G2[GET /api/v1/recipes/recommended]
        G3[GET /api/v1/recipes/trending]
        G4[GET /api/v1/recipes/new]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    E --> E1
    E --> E2
    E --> E3
    E --> E4
    
    B --> F7
    C --> F5
    D --> F6
    
    F --> G
    F1 --> G1
    F2 --> G2
    F3 --> G3
    F4 --> G4
    
    G1 --> F1
    G2 --> F2
    G3 --> F3
    G4 --> F4
    
    style A fill:#e1f5ff
    style E1 fill:#fff4e6
    style E2 fill:#fff4e6
    style E3 fill:#fff4e6
    style E4 fill:#fff4e6
    style G fill:#e8f5e9
```

---

## Features

### 1. Recipe Discovery Sections

#### 1.1 Recommended for You
**Purpose**: Personalized recipe recommendations based on user preferences and history.

**Specifications**:
- **Recipe Limit**: 4 recipes
- **API Endpoint**: `GET /api/v1/recipes/recommended?limit=4`
- **Fetch Timing**: On page mount (once)
- **Pagination**: None (fixed 4 items)
- **View All**: Button navigates to full recommendations page (TODO)

```mermaid
sequenceDiagram
    participant User
    participant Page as Browse Page
    participant API as Backend API
    participant State as React State
    
    User->>Page: Visits Browse Recipes
    Page->>API: GET /recommended?limit=4
    API-->>Page: {recipes: [...], meta: {...}}
    Page->>State: setRecommendedRecipes(4 items)
    State-->>Page: Update UI
    Page-->>User: Display 4 recipe cards
    
    User->>Page: Click "View All"
    Page-->>User: Navigate to full page (TODO)
```

---

#### 1.2 Trending This Week
**Purpose**: Show recipes gaining popularity based on views and interactions in the last 7 days.

**Specifications**:
- **Recipe Limit**: 4 recipes
- **API Endpoint**: `GET /api/v1/recipes/trending?limit=4&period=7d`
- **Time Period**: Last 7 days
- **Fetch Timing**: On page mount (once)
- **Pagination**: None (fixed 4 items)
- **Empty State**: Shows "No trending recipes available at the moment"
- **View All**: Button navigates to full trending page (TODO)

```mermaid
sequenceDiagram
    participant User
    participant Page as Browse Page
    participant API as Backend API
    participant State as React State
    
    User->>Page: Visits Browse Recipes
    Page->>API: GET /trending?limit=4&period=7d
    
    alt Has trending data
        API-->>Page: {recipes: [4 items], meta: {...}}
        Page->>State: setTrendingRecipes(4 items)
        State-->>Page: Update UI
        Page-->>User: Display 4 recipe cards
    else No trending data
        API-->>Page: {recipes: [], meta: {...}}
        Page->>State: setTrendingRecipes([])
        State-->>Page: Update UI
        Page-->>User: Display empty state message
    end
```

**Empty State Behavior**:
- Section remains visible even with 0 recipes
- Shows icon and message: "No trending recipes available at the moment"
- This happens when there isn't enough recipe activity in the last 7 days

---

#### 1.3 Newly Added
**Purpose**: Display the most recently published/approved recipes.

**Specifications**:
- **Recipe Limit**: 4 recipes
- **API Endpoint**: `GET /api/v1/recipes/new?limit=4`
- **Fetch Timing**: On page mount (once)
- **Pagination**: None (fixed 4 items)
- **Sorting**: By `createdAt` descending
- **View All**: Button navigates to full new recipes page (TODO)

```mermaid
sequenceDiagram
    participant User
    participant Page as Browse Page
    participant API as Backend API
    participant State as React State
    
    User->>Page: Visits Browse Recipes
    Page->>API: GET /new?limit=4
    API-->>Page: {recipes: [...], meta: {...}}
    Page->>State: setNewRecipes(4 items)
    State-->>Page: Update UI
    Page-->>User: Display 4 recipe cards
    
    User->>Page: Click "View All"
    Page-->>User: Navigate to full page (TODO)
```

---

#### 1.4 All Recipes
**Purpose**: Main browsable recipe list with filters, sorting, and pagination.

**Specifications**:
- **Initial Limit**: 8 recipes
- **API Endpoint**: `GET /api/v1/recipes/browse?limit=8&page=1`
- **Fetch Timing**: 
  - On page mount
  - When filters change
  - When sorting changes
- **Pagination**: "Load More" button (loads 8 more each click)
- **Supports**: Full filtering, sorting, and search

```mermaid
sequenceDiagram
    participant User
    participant Page as Browse Page
    participant API as Backend API
    participant State as React State
    
    User->>Page: Visits Browse Recipes
    Page->>API: GET /browse?limit=8&page=1&sortBy=rating
    API-->>Page: {recipes: [8 items], pagination: {...}}
    Page->>State: setRecipes(8 items)
    Page->>State: setHasNextPage(true/false)
    State-->>Page: Update UI
    Page-->>User: Display 8 recipe cards
    
    User->>Page: Apply filters
    Page->>API: GET /browse?limit=8&page=1&filters=...
    API-->>Page: {recipes: [...], pagination: {...}}
    Page->>State: Replace recipes
    State-->>Page: Update UI
    
    User->>Page: Click "Load More"
    Page->>API: GET /browse?limit=8&page=2&filters=...
    API-->>Page: {recipes: [8 more items], pagination: {...}}
    Page->>State: Append to existing recipes
    State-->>Page: Update UI
    Page-->>User: Display 16 total recipe cards
```

---

### 2. Advanced Filtering System

The filtering system provides 30+ filter combinations across 6 categories.

```mermaid
graph LR
    A[Filter Panel] --> B[Meal Type]
    A --> C[Diet Type]
    A --> D[Difficulty]
    A --> E[Cuisine Type]
    A --> F[Main Ingredient]
    A --> G[Prep Time]
    
    B --> B1[Breakfast]
    B --> B2[Lunch]
    B --> B3[Dinner]
    B --> B4[Snack]
    B --> B5[Dessert]
    
    C --> C1[Vegetarian]
    C --> C2[Vegan]
    C --> C3[Gluten-Free]
    C --> C4[Dairy-Free]
    C --> C5[Keto]
    C --> C6[Paleo]
    
    D --> D1[Easy]
    D --> D2[Medium]
    D --> D3[Hard]
    
    E --> E1[Mediterranean]
    E --> E2[Asian]
    E --> E3[Mexican]
    E --> E4[Italian]
    E --> E5[Others...]
    
    F --> F1[Chicken]
    F --> F2[Beef]
    F --> F3[Fish]
    F --> F4[Vegetables]
    F --> F5[Others...]
    
    G --> G1[Under 15 min]
    G --> G2[Under 30 min]
    G --> G3[Under 1 hour]
    G --> G4[Any time]
    
    style A fill:#e3f2fd
    style B fill:#fff9c4
    style C fill:#c8e6c9
    style D fill:#ffccbc
    style E fill:#d1c4e9
    style F fill:#b2dfdb
    style G fill:#f8bbd0
```

#### Filter Categories

| Category | Type | Options | API Parameter |
|----------|------|---------|---------------|
| **Meal Type** | Multi-select checkbox | 5 options | `mealType[]` |
| **Diet Type** | Multi-select checkbox | 6 options | `isVegetarian`, `isVegan`, etc. |
| **Difficulty** | Multi-select checkbox | 3 options | `difficulty[]` |
| **Cuisine Type** | Single-select dropdown | 8+ options | `cuisineType` |
| **Main Ingredient** | Single-select dropdown | 8+ options | `mainIngredient` |
| **Prep Time** | Single-select radio | 4 options | `maxPrepTime` |

#### Filter Behavior Flow

```mermaid
stateDiagram-v2
    [*] --> NoFilters
    NoFilters --> FilterApplied: User selects filter
    FilterApplied --> APICall: Trigger API request
    APICall --> Loading: Show loading state
    Loading --> ResultsDisplayed: Recipes received
    ResultsDisplayed --> FilterApplied: Add more filters
    FilterApplied --> NoFilters: Clear All Filters
    ResultsDisplayed --> NoFilters: Clear All Filters
    ResultsDisplayed --> [*]
```

#### Active Filter Display

When filters are applied, they appear as **removable badge chips**:
- Color-coded by filter type
- Individual "X" button to remove each filter
- "Clear All Filters" button to reset everything

---

### 3. Search Functionality

**Current Status**: Placeholder (TODO - backend not ready)

**Planned Features**:
```mermaid
graph TD
    A[User Types in Search] --> B{Input Length > 0}
    B -->|Yes| C[Show Suggestions Popover]
    B -->|No| D[Hide Suggestions]
    
    C --> E[Ingredients Group]
    C --> F[Cuisines Group]
    C --> G[Recipe Names Group]
    
    E --> H[User Selects]
    F --> H
    G --> H
    
    H --> I[Set Search Term]
    I --> J[Trigger Search API]
    J --> K[Display Results]
    
    style A fill:#e1f5ff
    style C fill:#fff9c4
    style K fill:#c8e6c9
```

**Placeholder Behavior**:
- Search input is functional
- Logs search term to console
- Does not filter results yet
- Suggestions dropdown is empty

---

### 4. Sorting Options

Users can sort the "All Recipes" section by:

| Option | Value | API Parameter | Description |
|--------|-------|---------------|-------------|
| **Highest Rating** | `rating` | `sortBy=rating&sortOrder=desc` | Default - Best rated first |
| **Most Recent** | `recent` | `sortBy=createdAt&sortOrder=desc` | Newest recipes first |
| **Prep Time (Low to High)** | `prep-time-asc` | `sortBy=prepTime&sortOrder=asc` | Quickest recipes first |
| **Prep Time (High to Low)** | `prep-time-desc` | `sortBy=prepTime&sortOrder=desc` | Longest recipes first |

```mermaid
sequenceDiagram
    participant User
    participant UI as Sort Dropdown
    participant State as React State
    participant API as Backend API
    
    User->>UI: Select "Most Recent"
    UI->>State: setSortBy('recent')
    State->>API: GET /browse?sortBy=createdAt&sortOrder=desc
    API-->>State: {recipes: [...]}
    State->>UI: Update recipe list
    UI-->>User: Display sorted recipes
```

**Behavior**:
- Sorting triggers a new API call
- Resets to page 1
- Preserves active filters
- Shows loading state during fetch

---

### 5. Pagination

Only the **"All Recipes"** section supports pagination.

```mermaid
stateDiagram-v2
    [*] --> Page1: Initial load (8 recipes)
    Page1 --> Page2: Click "Load More"
    Page2 --> Page3: Click "Load More"
    Page3 --> PageN: Continue...
    PageN --> NoMore: hasNextPage = false
    NoMore --> [*]: Button hidden
    
    note right of Page1
        Displays: 8 recipes
        API: page=1, limit=8
    end note
    
    note right of Page2
        Displays: 16 recipes
        API: page=2, limit=8
        Appends to existing
    end note
    
    note right of NoMore
        All recipes loaded
        Load More button hidden
    end note
```

**Implementation Details**:
- **Load More Button**: Appears only when `hasNextPage === true`
- **Loading State**: Button shows "Loading..." when fetching
- **Append Mode**: New recipes are added to existing list (not replaced)
- **Filter Reset**: Changing filters resets to page 1

---

## API Integration

### API Endpoints Summary

| Endpoint | Method | Purpose | Limit | Pagination |
|----------|--------|---------|-------|------------|
| `/api/v1/recipes/browse` | GET | Main recipe list with filters | 8 | Yes |
| `/api/v1/recipes/recommended` | GET | Personalized recommendations | 4 | No |
| `/api/v1/recipes/trending` | GET | Popular recipes (7 days) | 4 | No |
| `/api/v1/recipes/new` | GET | Recently added recipes | 4 | No |

### Request/Response Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Service Layer
    participant API as Backend API
    participant DB as Database
    
    C->>S: browseRecipes(filters)
    S->>API: GET /api/v1/recipes/browse
    Note over S,API: Headers: Authorization, Content-Type
    API->>DB: Query with filters
    DB-->>API: Recipe data
    API-->>S: Response {recipes, pagination, meta}
    S-->>C: Parsed response
    C->>C: Update UI state
```

### Example API Request

```http
GET /api/v1/recipes/browse?page=1&limit=8&sortBy=rating&sortOrder=desc&isVegan=true&difficulty=EASY&maxPrepTime=30
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Example API Response

```json
{
  "recipes": [
    {
      "id": "recipe-123",
      "title": "Vegan Buddha Bowl",
      "description": "Healthy and delicious plant-based bowl",
      "imageUrls": ["https://..."],
      "prepTime": 15,
      "cookingTime": 10,
      "difficulty": "EASY",
      "mealType": ["LUNCH", "DINNER"],
      "averageRating": 4.8,
      "totalRatings": 42,
      "author": {
        "id": "user-456",
        "firstName": "John",
        "lastName": "Doe"
      },
      "dietaryInfo": {
        "isVegan": true,
        "isGlutenFree": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 8,
    "total": 156,
    "totalPages": 20,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2025-11-01T10:30:00Z"
  }
}
```

---

## User Flows

### Flow 1: Browse Without Filters

```mermaid
journey
    title User Browses Recipes (No Filters)
    section Page Load
      Visit Browse Page: 5: User
      View Recommended (4): 5: User
      View Trending (4 or empty): 4: User
      View New (4): 5: User
      View All Recipes (8): 5: User
    section Explore
      Scroll through recipes: 5: User
      Click "Load More": 5: User
      View 16 recipes total: 5: User
      Click recipe card: 5: User
      Navigate to detail page: 5: User
```

---

### Flow 2: Browse With Filters

```mermaid
journey
    title User Searches with Filters
    section Initial
      Visit Browse Page: 5: User
      See all sections: 5: User
    section Filter
      Click "Filters" button: 5: User
      Select "Vegan": 5: User
      Select "Under 30 min": 5: User
      See active filter badges: 5: User
    section Results
      View filtered recipes (8): 4: User
      Recipe count updates: 4: User
      Load more filtered results: 4: User
    section Refine
      Add "Easy" difficulty: 5: User
      Results refresh: 4: User
      Click "Clear All Filters": 5: User
      Back to all recipes: 5: User
```

---

### Flow 3: Sort and Paginate

```mermaid
journey
    title User Sorts and Loads More
    section Start
      View default (rating sort): 5: User
    section Sort
      Change to "Most Recent": 5: User
      See newest recipes first: 5: User
    section Paginate
      Scroll to bottom: 5: User
      Click "Load More": 5: User
      View 16 recipes: 5: User
      Click "Load More" again: 5: User
      View 24 recipes: 5: User
      No more recipes: 3: User
      Button disappears: 3: User
```

---

## Technical Implementation

### Component Structure

```
BrowseRecipesPage
├── Header Section
│   ├── Title: "Discover Healthy Recipes"
│   └── Subtitle
├── Search & Filters Panel
│   ├── Search Input (with suggestions popover)
│   ├── Filters Button (toggles panel)
│   ├── Filter Panel (collapsible)
│   │   ├── Meal Type Checkboxes
│   │   ├── Diet Type Checkboxes
│   │   ├── Difficulty Checkboxes
│   │   ├── Cuisine Type Dropdown
│   │   ├── Main Ingredient Dropdown
│   │   └── Prep Time Radio Buttons
│   ├── Active Filters Display (badge chips)
│   └── Sort Dropdown
├── Recipe Sections
│   ├── Recommended for You
│   │   ├── Section Header + "View All" Button
│   │   └── 4 Recipe Cards (grid: 1/2/4 cols)
│   ├── Trending This Week
│   │   ├── Section Header + "View All" Button
│   │   └── 4 Recipe Cards or Empty State
│   ├── Newly Added
│   │   ├── Section Header + "View All" Button
│   │   └── 4 Recipe Cards (grid: 1/2/4 cols)
│   └── All Recipes
│       ├── Section Header
│       ├── 8+ Recipe Cards (grid: 1/2/3/4 cols)
│       └── "Load More" Button (conditional)
└── Recipe Card Component (reusable)
    ├── Image + Rating Badge
    ├── Title (1 line, truncated)
    ├── Description (2 lines, truncated)
    ├── Time + Difficulty + Author
    └── Dietary Badges (up to 6)
```

### State Management

```typescript
// Recipe Data
const [recipes, setRecipes] = useState<Recipe[]>([]);                    // All Recipes section
const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);  // 4 items
const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);        // 4 items or []
const [newRecipes, setNewRecipes] = useState<Recipe[]>([]);                  // 4 items

// UI State
const [loading, setLoading] = useState(true);                            // Initial load
const [showFilters, setShowFilters] = useState(false);                   // Filter panel toggle
const [showSuggestions, setShowSuggestions] = useState(false);           // Search suggestions

// Filter State
const [searchTerm, setSearchTerm] = useState('');                        // Search input
const [filters, setFilters] = useState<RecipeFilters>({});               // All active filters
const [sortBy, setSortBy] = useState<SortOption>('rating');              // Sort option

// Pagination State
const [currentPage, setCurrentPage] = useState(1);                       // Current page number
const [hasNextPage, setHasNextPage] = useState(false);                   // More pages available
const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);     // Loading next page
```

### Key Functions

| Function | Purpose | Triggers |
|----------|---------|----------|
| `fetchRecipes()` | Load main recipe list | Mount, filter change, sort change |
| `fetchSpecialSections()` | Load 3 special sections | Mount (once) |
| `handleSearch()` | Process search submission | Search form submit |
| `loadMoreRecipes()` | Load next page | "Load More" button click |
| `setFilters()` | Update active filters | Filter checkbox/dropdown change |
| `setSortBy()` | Change sort order | Sort dropdown change |

---

## Summary

### Recipe Counts Per Section

| Section | Initial Load | Can Load More | Total Possible |
|---------|--------------|---------------|----------------|
| Recommended for You | 4 | ❌ No | 4 |
| Trending This Week | 0-4 | ❌ No | 4 |
| Newly Added | 4 | ❌ No | 4 |
| All Recipes | 8 | ✅ Yes | Unlimited (paginated) |
| **Total Initial** | **20** | - | - |

### User Actions Available

✅ **Implemented**:
- Browse 4 curated sections
- Apply 30+ filter combinations
- Sort by 4 different options
- Load more recipes (pagination)
- View empty states
- Remove individual filters
- Clear all filters

⏳ **Pending (TODO)**:
- Search functionality
- Search suggestions
- "View All" buttons for special sections
- Full section pages (Recommended/Trending/New)

---

**Last Updated**: November 1, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready (with noted TODOs)
