# Testing Guide for Search Suggestions

## 🚀 Dev Server Running
**URL:** http://localhost:5173

---

## 📝 How to Test Search Suggestions

### Prerequisites
Make sure your `.env.local` has:
```env
VITE_SEARCH_API_BASE_URL=http://localhost:8000
VITE_SEARCH_API_KEY=your_api_key_here
```

**Note:** If these are not set, the app will work fine but suggestions won't show. This is intentional graceful degradation.

---

## 🧪 Test Scenarios

### 1. Search Suggestions on Browse Page
**Location:** http://localhost:5173/browse-recipes

#### Test Steps:
1. ✅ **Navigate to Browse Recipes page**
2. ✅ **Type in search input** (minimum 2 characters)
   - Try: `"chi"` → Should show "Chicken", "Chinese", etc. after 300ms
   - Try: `"thai"` → Should show Thai recipes and cuisine after 300ms
   - Try: `"veg"` → Should show vegetarian recipes after 300ms
   - **Note:** Suggestions are debounced by 300ms to prevent excessive API calls
   
3. ✅ **Check suggestion dropdown:**
   - Shows purple recipe items with ChefHat icon
   - Shows blue cuisine items with TrendingUp icon
   - Shows metadata (prep time, difficulty, cuisine)
   - Shows match type badges (exact/prefix/fuzzy)

4. ✅ **Click on a recipe suggestion:**
   - Should navigate to recipe detail page
   
5. ✅ **Click on a cuisine suggestion:**
   - Should set cuisine filter and search query

6. ✅ **Check edge cases:**
   - Type 1 character → No suggestions (< 2 char minimum)
   - Clear input → Suggestions disappear
   - Click outside → Suggestions hide

### 2. Loading and Error States

#### Test Loading State:
1. Type in search input quickly
2. Loading state appears immediately
3. After 300ms debounce, API call is made
4. Should see animated Sparkles icon with "Loading suggestions..."
5. **Note:** Typing more characters resets the 300ms timer

#### Test Error State (if API unavailable):
1. Stop your Search API backend (or use wrong URL)
2. Type in search input
3. Should see yellow warning: "Suggestions unavailable. You can still search using the button below."
4. Main search button should still work

#### Test No Results:
1. Type gibberish like `"xyzabc123"`
2. Should show "No suggestions found."

### 3. Search Methods
**Location:** Browse Recipes page, search area

#### Test All 4 Search Methods:
1. ✅ **Smart Search** (default)
   - Type query → Click Search
   - Should show extracted filters below search
   - Example: "vegan thai under 30 minutes"
   
2. ✅ **Vector Search**
   - Select "Vector" from dropdown
   - Type semantic query like "comfort food"
   - Should show similar recipes
   
3. ✅ **Ingredient Search**
   - Select "Ingredient" from dropdown
   - Type ingredient like "chicken"
   - Should show recipes with that ingredient
   
4. ✅ **Hybrid Search**
   - Select "Hybrid" from dropdown
   - Type mixed query
   - Should combine keyword + semantic search

---

## 🎨 Visual Checks

### Suggestion Dropdown UI
- ✅ Recipe items: Purple color, ChefHat icon
- ✅ Cuisine items: Blue color, TrendingUp icon
- ✅ Match badges: Green (exact), Blue (prefix), Gray (fuzzy)
- ✅ Metadata: Cuisine, prep time with Clock icon, difficulty
- ✅ Hover effects: Items highlight on hover
- ✅ Loading state: Animated sparkles
- ✅ Error state: Red text for errors
- ✅ Warning state: Yellow banner for non-blocking errors

### Responsive Design
- ✅ Desktop: Full suggestions dropdown
- ✅ Tablet: Adjusted layout
- ✅ Mobile: Stacked search controls

---

## 🔧 IngredientAutocomplete Component (Not Yet Integrated)

**Component Created:** `src/components/IngredientAutocomplete.tsx`  
**Status:** Ready to use, not yet integrated in any page

### How to Integrate (Future):
```tsx
import { IngredientAutocomplete } from '@/components/IngredientAutocomplete';

function MyForm() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  
  return (
    <IngredientAutocomplete
      value={ingredients}
      onChange={setIngredients}
      placeholder="Add ingredients..."
      maxSelections={20}
    />
  );
}
```

### Where to Use:
1. **Recipe Submission Page** - ingredient input
2. **Advanced Filters Panel** - ingredient filter
3. **Recipe Edit Page** - ingredient management

---

### Expected Results

### Working Search Suggestions:
- ✅ Suggestions appear after 300ms delay (debounced)
- ✅ Typing more characters resets the debounce timer
- ✅ Recipe suggestions navigate to detail
- ✅ Cuisine suggestions set filter
- ✅ Keyboard navigation works (Tab, Enter, Escape)
- ✅ Click outside closes dropdown
- ✅ Loading state shows during debounce and API call
- ✅ Error state doesn't block main search
- ✅ Debounce timer cleared on unmount

### Fallback Behavior (API Unavailable):
- ✅ No suggestions show
- ✅ Yellow warning appears
- ✅ Main search button still works
- ✅ No errors in console

---

## 🐛 Known Issues / Expected Behavior

### Not Bugs:
1. **No suggestions with < 2 characters** - Intentional (prevents too many results)
2. **Suggestions don't show if API unavailable** - Intentional graceful degradation
3. **Clicking suggestion closes dropdown** - Intentional UX

### Potential Issues to Report:
- [ ] Suggestions don't appear at all (check API URL)
- [ ] Clicking recipe suggestion doesn't navigate
- [ ] Clicking cuisine suggestion doesn't filter
- [ ] Console errors
- [ ] UI layout broken
- [ ] Loading state stuck
- [ ] Error messages unclear

---

## 📱 Mobile Testing

### iPhone/Android:
1. Open on mobile browser
2. Test touch interactions
3. Check keyboard behavior
4. Verify responsive layout

### Things to Check:
- ✅ Dropdown fits screen width
- ✅ Touch targets large enough
- ✅ Keyboard doesn't cover suggestions
- ✅ Scrolling works in suggestion list
- ✅ Icons visible and properly sized

---

## ♿ Accessibility Testing

### Keyboard Navigation:
1. ✅ Tab to search input
2. ✅ Type to show suggestions
3. ✅ Arrow keys to navigate suggestions
4. ✅ Enter to select suggestion
5. ✅ Escape to close dropdown

### Screen Reader:
- ✅ Input has proper label
- ✅ Suggestions announced
- ✅ Icons have aria-labels
- ✅ Error messages announced

---

## 📈 Performance Checks

### Network Tab:
- Suggestions endpoint: < 50ms
- No unnecessary re-fetches
- Proper error handling

### React DevTools:
- No unnecessary re-renders
- State updates correctly
- No memory leaks

---

## ✅ Sign-Off Checklist

After testing, verify:
- [ ] Search suggestions work correctly
- [ ] All 4 search methods functional
- [ ] Recipe navigation works
- [ ] Cuisine filtering works
- [ ] Loading states display
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] No console errors
- [ ] UI looks polished

---

## 🎉 Ready for Review!

**Dev Server:** http://localhost:5173  
**Main Page to Test:** http://localhost:5173/browse-recipes

**Implementation Summary:** See `docs/SEARCH_SUGGESTIONS_INTEGRATION_COMPLETE.md`

---

**Questions or Issues?**
- Check `.env.local` configuration
- Verify Search API backend is running
- Check browser console for errors
- Review documentation in `docs/` folder
