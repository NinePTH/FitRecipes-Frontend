# Toast Notification System

A beautiful, accessible toast notification system for FitRecipes using shadcn/ui patterns.

## Features

✅ **4 Toast Types**: Success, Error, Warning, Info  
✅ **Auto-dismiss**: Configurable duration (default 5 seconds)  
✅ **Manual Close**: X button to dismiss  
✅ **Smooth Animations**: Slide in from right, fade out on exit  
✅ **Stacking**: Multiple toasts stack vertically  
✅ **Accessible**: ARIA live regions for screen readers  
✅ **Responsive**: Works on all screen sizes  
✅ **Color-coded**: Green (success), Red (error), Yellow (warning), Blue (info)  
✅ **Notification History**: All toasts saved to history sidebar (see [Notification Sidebar Guide](./NOTIFICATION_SIDEBAR_GUIDE.md))  
✅ **Mark as Read**: Click notifications in sidebar to mark as read  
✅ **Unread Badges**: Bell icon shows unread notification count  

## Installation

Already installed! The Toast system is integrated into the app via `ToastProvider` in `App.tsx`.

## Usage

### Basic Usage

Import the `useToast` hook in any component:

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.success('Recipe saved!', 'Your recipe has been saved successfully.');
  };

  return <button onClick={handleClick}>Save Recipe</button>;
}
```

### Toast Methods

```tsx
const toast = useToast();

// Success toast (green)
toast.success('Title', 'Optional description');

// Error toast (red)
toast.error('Error!', 'Something went wrong.');

// Warning toast (yellow)
toast.warning('Warning!', 'Please check your input.');

// Info toast (blue)
toast.info('Info', 'Did you know?');

// Custom duration (in milliseconds)
toast.success('Quick message', undefined, 3000); // 3 seconds
toast.error('Important!', 'This stays longer', 10000); // 10 seconds
```

### Advanced Usage

```tsx
// Generic showToast method
toast.showToast('success', 'Title', 'Description', 5000);

// Without description
toast.success('Recipe deleted!');

// Long duration for important messages
toast.error('Failed to connect', 'Please check your internet connection', 10000);
```

## Real-World Examples

### Recipe Submission

```tsx
import { useToast } from '@/hooks/useToast';

function RecipeSubmissionPage() {
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      await submitRecipe(formData);
      toast.success(
        'Recipe submitted!',
        'Your recipe is now pending admin approval.'
      );
      navigate('/my-recipes');
    } catch (error) {
      toast.error(
        'Submission failed',
        'Please check your form and try again.'
      );
    }
  };
}
```

### Login Success/Failure

```tsx
import { useToast } from '@/hooks/useToast';

function AuthPage() {
  const toast = useToast();

  const handleLogin = async () => {
    try {
      await login(email, password);
      toast.success('Welcome back!', `Logged in as ${email}`);
      navigate('/browse-recipes');
    } catch (error) {
      toast.error('Login failed', 'Invalid email or password');
    }
  };
}
```

### Recipe Rating

```tsx
import { useToast } from '@/hooks/useToast';

function RecipeDetailPage() {
  const toast = useToast();

  const handleRating = async (rating: number) => {
    try {
      await submitRating(recipeId, rating);
      toast.success('Rating submitted!', `You rated this recipe ${rating} stars.`);
    } catch (error) {
      toast.error('Rating failed', 'Please try again.');
    }
  };
}
```

### Delete Confirmation

```tsx
import { useToast } from '@/hooks/useToast';

function MyRecipesPage() {
  const toast = useToast();

  const handleDelete = async (recipeId: string) => {
    try {
      await deleteRecipe(recipeId);
      toast.success('Recipe deleted', 'Your recipe has been removed.');
    } catch (error) {
      toast.error('Delete failed', 'Could not delete recipe.');
    }
  };
}
```

### Form Validation

```tsx
import { useToast } from '@/hooks/useToast';

function RecipeForm() {
  const toast = useToast();

  const validateForm = () => {
    if (!title) {
      toast.warning('Missing title', 'Please enter a recipe title.');
      return false;
    }
    
    if (ingredients.length === 0) {
      toast.warning('No ingredients', 'Add at least one ingredient.');
      return false;
    }
    
    return true;
  };
}
```

### Network Error

```tsx
import { useToast } from '@/hooks/useToast';

function BrowseRecipesPage() {
  const toast = useToast();

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (error) {
      toast.error(
        'Network error',
        'Failed to load recipes. Please check your connection.',
        8000 // Show longer for network errors
      );
    }
  };
}
```

### Info Messages

```tsx
import { useToast } from '@/hooks/useToast';

function RecipeDetailPage() {
  const toast = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Link copied!', 'Recipe link copied to clipboard.');
  };

  const handleShare = () => {
    toast.info('Coming soon', 'Social sharing feature is under development.');
  };
}
```

## Toast Types & Colors

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| Success | Green | CheckCircle | Successful actions (save, delete, submit) |
| Error | Red | AlertCircle | Errors, failures, validation issues |
| Warning | Yellow | AlertTriangle | Warnings, missing data, cautionary messages |
| Info | Blue | Info | General information, tips, notifications |

## Accessibility

- **ARIA Live Region**: Toasts are announced to screen readers
- **Keyboard Accessible**: Can be dismissed with X button (keyboard navigable)
- **Color + Icon**: Not relying on color alone (icon + text)
- **Focus Management**: Doesn't trap focus or interrupt navigation

## Positioning

Toasts appear in the **top-right corner** on desktop and **top-center** on mobile, stacking vertically when multiple toasts are shown.

## Duration Guidelines

- **Success messages**: 3-5 seconds (default 5s)
- **Info messages**: 5 seconds
- **Warnings**: 5-7 seconds
- **Errors**: 7-10 seconds (longer so users can read)
- **Critical errors**: 10+ seconds or require manual dismiss

## Component Files

- `src/components/ui/toast.tsx` - Toast UI component
- `src/contexts/ToastContext.tsx` - Toast provider and context
- `src/hooks/useToast.ts` - useToast hook for easy access
- `src/components/ui/notification-sidebar.tsx` - Notification history sidebar
- `src/components/Layout.tsx` - Bell icon and unread badge

## 📚 Related Features

### Notification History Sidebar
Every toast is automatically saved to a notification history sidebar. Users can:
- View all past notifications
- Mark notifications as read
- Clear notification history
- See unread count badge on bell icon

For complete documentation, see **[Notification Sidebar Guide](./NOTIFICATION_SIDEBAR_GUIDE.md)**.

### Accessing Notification History

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const toast = useToast();
  
  // Show a toast (automatically saved to history)
  toast.success('Recipe saved!');
  
  // Access notification features
  console.log('Total notifications:', toast.notifications.length);
  console.log('Unread count:', toast.unreadCount);
  
  // Open notification sidebar
  toast.toggleSidebar();
  
  // Mark all as read
  toast.markAllAsRead();
  
  // Clear all notifications
  toast.clearNotifications();
}
```

## Styling

Toasts use Tailwind CSS with the following color schemes:

```css
/* Success (Green) */
bg-green-50 border-green-200 text-green-900

/* Error (Red) */
bg-red-50 border-red-200 text-red-900

/* Warning (Yellow) */
bg-yellow-50 border-yellow-200 text-yellow-900

/* Info (Blue) */
bg-blue-50 border-blue-200 text-blue-900
```

## Best Practices

1. ✅ **Keep titles short** (2-4 words)
2. ✅ **Descriptions optional** but helpful for context
3. ✅ **Use appropriate type** (success for success, error for errors)
4. ✅ **Don't overuse** - Only for important feedback
5. ✅ **Be specific** - "Recipe saved" is better than "Success"
6. ✅ **Actionable errors** - Tell users what to do next
7. ❌ **Don't spam** - Avoid showing too many toasts at once

## Examples in Codebase

To see the toast system in action, check these pages:
- Recipe submission success/failure
- Login/logout notifications
- Recipe rating confirmations
- Delete confirmations
- Form validation errors
- Network error handling

---

**Status**: ✅ Fully Implemented and Production Ready  
**Version**: 1.0.0  
**Last Updated**: November 2, 2025
