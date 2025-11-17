# Search Feature - FitRecipes Frontend

## 📋 Overview

The FitRecipes frontend integrates with the **Vector Search API** to provide intelligent, semantic search capabilities powered by natural language processing (NLP). This enables users to search recipes using natural language queries that automatically extract filters and understand intent.

**Implementation Date**: October 13, 2025  
**Status**: ✅ Fully Implemented

---

## 🎯 Features

### Smart Search (Primary Method)
- **Natural Language Understanding**: Converts user queries into structured search filters
- **Auto-Filter Extraction**: Automatically detects cuisine types, dietary restrictions, preparation times, and more
- **Intent Recognition**: Understands context and semantics beyond keyword matching
- **Real-time Results**: Fast response times with execution time display

**Example Queries**:
```
"quick vegan thai dinner under 30 minutes"
→ Auto-detects: cuisineType=Thai, maxPrepTime=30, dietaryInfo.isVegan=true

"healthy breakfast recipes for weight loss"
→ Auto-detects: mealType=Breakfast, healthGoals=weightLoss

"easy italian pasta dishes"
→ Auto-detects: cuisineType=Italian, difficulty=easy, mainIngredient=pasta
```

### Additional Search Modes
1. **Vector Search**: Semantic similarity search using embeddings
2. **Ingredient Search**: Match recipes by specific ingredients (any/all modes)
3. **Hybrid Search**: Combines keyword + vector search (60/40 weighting)

### UI Features
- **Loading States**: Visual spinner during search operations
- **Execution Time Display**: Shows search performance in milliseconds
- **Extracted Filters Display**: Shows auto-detected filters as badges
- **Error Handling**: Graceful degradation with helpful error messages
- **Search Mode Indicator**: Clear distinction between "Search" and "Browse" modes
- **Debounced Input**: 500ms debounce to reduce unnecessary API calls

---

## 🔧 Configuration

### Environment Variables

Add to your `.env.local`:

```bash
# Vector Search API Configuration
VITE_SEARCH_API_BASE_URL=http://localhost:8000
VITE_SEARCH_API_KEY=your_search_api_key_here
```

**Production Configuration**:
- Update `VITE_SEARCH_API_BASE_URL` to your production search API endpoint
- Generate a secure API key and set as `VITE_SEARCH_API_KEY`
- Ensure CORS is configured on the search API to allow your frontend domain

**Local Development**:
- If search API is not available, the application gracefully falls back to traditional browse mode
- All UI components handle missing API configuration automatically

### Vercel Deployment

Set environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SEARCH_API_BASE_URL` → Your search API URL
   - `VITE_SEARCH_API_KEY` → Your API key
3. Redeploy to apply changes

---

## 🏗️ Architecture

### File Structure

```
src/
├── services/
│   └── searchApi.ts           # Vector Search API client
├── hooks/
│   └── useSearch.ts            # React hooks for search functionality
└── pages/
    └── BrowseRecipesPage.tsx   # Main page with search integration
```

### Service Layer (`searchApi.ts`)

**Exports**:
```typescript
// Main search functions
smartSearch(request: SmartSearchRequest): Promise<SmartSearchResponse>
vectorSearch(request: VectorSearchRequest): Promise<VectorSearchResponse>
ingredientSearch(request: IngredientSearchRequest): Promise<IngredientSearchResponse>
hybridSearch(request: HybridSearchRequest): Promise<HybridSearchResponse>

// Utilities
isSearchApiAvailable(): boolean
convertFiltersToSearchFormat(filters: RecipeFilters): Partial<SearchFilters>
```

**API Client Features**:
- Fetch API integration with proper error handling
- X-API-Key header authentication
- Request/response type safety with TypeScript
- Filter format conversion between UI and API
- Configuration validation

### React Hooks (`useSearch.ts`)

**Available Hooks**:

1. **`useSmartSearch(options)`** - Primary search hook
   ```typescript
   const searchApi = useSmartSearch({
     limit: 20,           // Max results (default: 20)
     autoSearch: false,   // Auto-search on query change (default: false)
     debounceMs: 500      // Debounce delay in ms (default: 300)
   });
   ```

   **Returns**:
   ```typescript
   {
     query: string;
     setQuery: (query: string) => void;
     filters: Partial<SearchFilters>;
     setFilters: (filters: Partial<SearchFilters>) => void;
     results: Recipe[] | null;
     loading: boolean;
     error: string | null;
     executionTime: number | null;
     extractedFilters: Record<string, any> | null;
     parsedQuery: string | null;
     search: () => Promise<void>;
   }
   ```

2. **`useVectorSearch(options)`** - Semantic similarity search
3. **`useIngredientSearch(options)`** - Ingredient-based search
4. **`useHybridSearch(options)`** - Combined keyword + vector search

**Hook Features**:
- Automatic state management (loading, error, results)
- Execution time tracking
- Extracted filter display
- User ID integration from auth context
- Debounced search with configurable delay
- Optional auto-search on query/filter changes

---

## 🎨 User Interface

### Search Input
Located in the top navigation bar:
- Real-time suggestions dropdown (existing feature)
- Disabled state during search operations
- Placeholder text: "Search by ingredients, recipe name, or cuisine..."

### Search Results Header
Displays when `searchMode === 'search'`:

**During Search**:
```
[Spinner] Searching...
```

**After Search Success**:
```
[Search Icon] Search Results for "quick vegan thai dinner"  [85ms]

Found 12 recipes

Auto-detected filters:
[cuisineType: Thai] [maxPrepTime: 30] [dietaryInfo.isVegan: true]
```

**Components**:
- Blue background with border (`bg-blue-50 border-blue-200`)
- Loading spinner animation during search
- Execution time badge (green, shows milliseconds)
- Extracted filters as blue badges
- Recipe count display
- Clear Search button

### Error Display
Shows when `searchApi.error` is present:
```
[Error Icon] Search Error

[Error message from API]

Falling back to traditional browse mode. You can still use filters.

[X] Close
```

**Components**:
- Red background with border (`bg-red-50 border-red-200`)
- Error icon and message
- Helpful fallback message
- Close button to dismiss

### Active Filters Display
Shows search query as a filter badge:
```
Active filters:
[Meal Type: Breakfast] [Diet Type: Vegan] [Search: "healthy breakfast"] [X]
```

### Sort & Display Options
Works identically in both browse and search modes:
- Sort by: Highest Rating, Most Recent, Prep Time, Calories
- View toggle: Grid / List
- Recipe count: Shows search results count or total recipes

---

## 🔄 User Workflows

### Standard Search Flow

1. **User enters query**: "quick vegan thai dinner"
2. **Input debounces**: Waits 500ms after user stops typing
3. **User clicks search or presses Enter**:
   - `handleSearch()` called
   - Sets `searchMode = 'search'`
   - Calls `searchApi.search()`
4. **During search**:
   - Search input disabled
   - Loading spinner shown
   - "Searching..." text displayed
5. **Search completes**:
   - Results displayed in recipe grid
   - Execution time shown (e.g., "85ms")
   - Extracted filters shown as badges
   - Recipe count updated
6. **User can**:
   - Clear search (returns to browse mode)
   - Refine with additional filters
   - Click on recipe to view details

### Fallback Flow (API Unavailable)

1. **User enters query**: "chicken recipes"
2. **Search attempted**: API call fails (network error, not configured, etc.)
3. **Fallback triggered**:
   - Sets `filters.mainIngredient = "chicken"`
   - Calls traditional browse API
   - Sets `searchMode = 'browse'`
4. **User sees**: Normal browse results with filter applied
5. **Error displayed**: Red banner explaining search API unavailable

### Empty Query Handling

1. **User clears search input**: Sets query to ""
2. **On Enter or search click**:
   - Resets to browse mode
   - Clears search results
   - Shows all recipes with current filters
3. **No error shown**: Graceful return to browsing

---

## 🧪 Testing

### Manual Testing Checklist

**Basic Search**:
- [ ] Enter simple query → results displayed
- [ ] See loading spinner during search
- [ ] Execution time shown after search
- [ ] Clear search button works
- [ ] Search input disabled during loading

**Smart Search (NLP)**:
- [ ] "quick vegan thai dinner under 30 minutes" → extracts filters
- [ ] Extracted filters displayed as badges
- [ ] Auto-detected filters applied to results
- [ ] Parsed query shown (if different from original)

**Error Handling**:
- [ ] API unavailable → error banner shown
- [ ] Fallback to browse mode works
- [ ] Error dismissible with X button
- [ ] User can continue browsing after error

**Edge Cases**:
- [ ] Empty query → returns to browse mode
- [ ] No results → appropriate message shown
- [ ] Search + manual filters → combines correctly
- [ ] Clear all filters → clears search too

**Responsive Design**:
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Touch interactions work on mobile

### Automated Testing (Recommended)

```typescript
// Example test for BrowseRecipesPage with search
describe('BrowseRecipesPage - Search Integration', () => {
  it('should perform smart search', async () => {
    render(<BrowseRecipesPage />);
    
    const searchInput = screen.getByPlaceholderText(/search by ingredients/i);
    await userEvent.type(searchInput, 'vegan thai dinner');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/search results/i)).toBeInTheDocument();
    });
  });

  it('should display execution time', async () => {
    render(<BrowseRecipesPage />);
    // ... perform search
    await waitFor(() => {
      expect(screen.getByText(/ms/)).toBeInTheDocument();
    });
  });

  it('should show extracted filters', async () => {
    render(<BrowseRecipesPage />);
    // ... perform smart search
    await waitFor(() => {
      expect(screen.getByText(/auto-detected filters/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 API Reference

### Smart Search

**Endpoint**: `POST /api/v1/search/smart`

**Request**:
```typescript
{
  query: string;               // User's natural language query
  filters?: Partial<SearchFilters>;  // Additional manual filters
  userId?: string;             // Optional user ID for personalization
  limit?: number;              // Max results (default: 20)
}
```

**Response**:
```typescript
{
  results: Recipe[];                   // Matching recipes
  metadata: {
    executionTime: number;             // Search time in ms
    totalResults: number;              // Total matches
    parsedQuery?: string;              // AI interpretation of query
    extractedFilters?: Record<string, any>;  // Auto-detected filters
  };
}
```

**Example**:
```json
// Request
{
  "query": "quick vegan thai dinner under 30 minutes",
  "userId": "user-123",
  "limit": 20
}

// Response
{
  "results": [...],
  "metadata": {
    "executionTime": 85,
    "totalResults": 12,
    "parsedQuery": "Find Thai recipes suitable for dinner that are vegan and can be prepared in 30 minutes or less",
    "extractedFilters": {
      "cuisineType": "Thai",
      "mealType": "Dinner",
      "maxPrepTime": 30,
      "dietaryInfo.isVegan": true
    }
  }
}
```

### Vector Search

**Endpoint**: `POST /api/v1/search/vector`

**Request**:
```typescript
{
  query: string;
  filters?: Partial<SearchFilters>;
  userId?: string;
  limit?: number;
}
```

**Response**: Same structure as Smart Search

### Ingredient Search

**Endpoint**: `POST /api/v1/search/ingredients`

**Request**:
```typescript
{
  ingredients: string[];       // List of ingredients
  matchMode: 'any' | 'all';   // Match any or all ingredients
  filters?: Partial<SearchFilters>;
  userId?: string;
  limit?: number;
}
```

**Response**: Same structure as Smart Search

### Hybrid Search

**Endpoint**: `POST /api/v1/search/hybrid`

**Request**:
```typescript
{
  query: string;
  filters?: Partial<SearchFilters>;
  userId?: string;
  limit?: number;
  keywordWeight?: number;     // 0-1, default 0.6
  vectorWeight?: number;      // 0-1, default 0.4
}
```

**Response**: Same structure as Smart Search

---

## 🐛 Troubleshooting

### Issue: Search API Not Connecting

**Symptoms**:
- Error banner: "Failed to fetch"
- Falls back to browse mode immediately

**Solutions**:
1. Check `.env.local` has correct `VITE_SEARCH_API_BASE_URL`
2. Verify search API is running: `curl http://localhost:8000/health`
3. Check browser console for CORS errors
4. Ensure API key is set: `VITE_SEARCH_API_KEY`
5. Restart dev server after changing env vars: `npm run dev`

### Issue: Extracted Filters Not Showing

**Symptoms**:
- Search works but no "Auto-detected filters" shown

**Causes**:
- Query too simple (e.g., "pasta") - no filters to extract
- Search API not returning `extractedFilters` in metadata
- API not using Smart Search endpoint

**Solutions**:
1. Try more complex queries: "quick healthy vegan dinner"
2. Check API response in Network tab → look for `metadata.extractedFilters`
3. Verify using `/api/v1/search/smart` endpoint

### Issue: Slow Search Performance

**Symptoms**:
- Execution time > 1000ms
- UI feels sluggish

**Solutions**:
1. Check search API server performance
2. Reduce `limit` parameter (default 20)
3. Optimize network: Use CDN, enable HTTP/2
4. Consider caching on backend
5. Increase debounce: `debounceMs: 1000`

### Issue: Search Results Not Displaying

**Symptoms**:
- Search completes but no recipes shown
- Recipe grid empty

**Debug Steps**:
1. Check browser console for errors
2. Inspect `searchApi.results` in React DevTools
3. Verify `useEffect` syncing results → recipes state
4. Check if results format matches Recipe type

**Code to Check**:
```typescript
// In BrowseRecipesPage.tsx
useEffect(() => {
  if (searchApi.results && searchMode === 'search') {
    setRecipes(searchApi.results);
  }
}, [searchApi.results, searchMode]);
```

### Issue: Fallback Not Working

**Symptoms**:
- Search fails and nothing happens
- No error shown, no fallback

**Solutions**:
1. Check `handleSearch()` has try-catch block
2. Verify fallback logic calls `browseRecipes()` with filters
3. Ensure error state properly set: `searchApi.error`
4. Check error display component is rendered

---

## 📈 Performance Optimization

### Current Performance
- **Average search time**: 50-150ms
- **Debounce delay**: 500ms
- **Max results per search**: 20 recipes

### Optimization Tips

**Frontend**:
1. Increase debounce for slower users: `debounceMs: 1000`
2. Implement search result caching (React Query)
3. Reduce result limit for faster response: `limit: 10`
4. Add request cancellation for rapid queries
5. Lazy load recipe images

**Backend** (if you control search API):
1. Add Redis caching for common queries
2. Implement query result pagination
3. Optimize vector database indexing
4. Use CDN for recipe images
5. Enable HTTP/2 and compression

**Network**:
1. Use CDN for static assets
2. Enable Brotli compression
3. Implement service workers for caching
4. Prefetch likely search results

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Search history (recent searches)
- [ ] Search suggestions from API
- [ ] Voice search integration
- [ ] Image-based search (upload photo)
- [ ] Advanced filter UI (ingredient mode)
- [ ] Search analytics tracking
- [ ] "Powered by Vector Search" badge
- [ ] Save searches functionality
- [ ] Share search results (URL with query)

### Technical Improvements
- [ ] Implement React Query for caching
- [ ] Add request cancellation
- [ ] Optimize bundle size (code splitting)
- [ ] Add search telemetry
- [ ] Implement A/B testing for search modes
- [ ] Add unit tests for search hooks
- [ ] Add E2E tests for search flows

---

## 📚 Related Documentation

- **[BROWSE_RECIPES_INTEGRATION_COMPLETE.md](./BROWSE_RECIPES_INTEGRATION_COMPLETE.md)** - Recipe browsing system
- **[SEARCH_API_DOCUMENTATION.md](./SEARCH_API_DOCUMENTATION.md)** - Vector Search API reference
- **[TESTING.md](./TESTING.md)** - Testing guidelines
- **[USER_MANUAL.md](./USER_MANUAL.md)** - User guide

---

## 📝 Changelog

### v1.0.0 (October 13, 2025)
- ✅ Initial implementation of Vector Search integration
- ✅ Created `searchApi.ts` service layer
- ✅ Created `useSearch.ts` React hooks
- ✅ Integrated Smart Search into BrowseRecipesPage
- ✅ Added loading states and execution time display
- ✅ Implemented extracted filter badges
- ✅ Added error handling with fallback
- ✅ Updated UI with search mode indicators
- ✅ Created comprehensive documentation

---

**Last Updated**: October 13, 2025  
**Maintained By**: FitRecipes Development Team
