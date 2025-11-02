# Notification System - Quick Demo

This page demonstrates the notification system with toast notifications and history sidebar.

## 🎯 Try It Out!

Here's a simple example you can add to any page to test the notification system:

```tsx
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';

function NotificationDemo() {
  const toast = useToast();

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Notification Demo</h2>
      
      {/* Show different toast types */}
      <div className="space-y-2">
        <h3 className="font-semibold">Show Toasts:</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => toast.success('Success!', 'Operation completed successfully.')}
            className="bg-green-600 hover:bg-green-700"
          >
            Success Toast
          </Button>
          
          <Button
            onClick={() => toast.error('Error!', 'Something went wrong.')}
            variant="destructive"
          >
            Error Toast
          </Button>
          
          <Button
            onClick={() => toast.warning('Warning!', 'Please check your input.')}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Warning Toast
          </Button>
          
          <Button
            onClick={() => toast.info('Info', 'Did you know?')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Info Toast
          </Button>
        </div>
      </div>

      {/* Notification sidebar controls */}
      <div className="space-y-2">
        <h3 className="font-semibold">Notification Sidebar:</h3>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => toast.toggleSidebar()}>
            Toggle Sidebar
          </Button>
          
          <Button onClick={() => toast.markAllAsRead()} variant="outline">
            Mark All as Read
          </Button>
          
          <Button onClick={() => toast.clearNotifications()} variant="outline">
            Clear All
          </Button>
        </div>
      </div>

      {/* Notification stats */}
      <div className="space-y-2">
        <h3 className="font-semibold">Stats:</h3>
        <div className="text-sm text-gray-600">
          <p>Total Notifications: {toast.notifications.length}</p>
          <p>Unread Count: {toast.unreadCount}</p>
          <p>Sidebar Open: {toast.isSidebarOpen ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Rapid fire demo */}
      <div className="space-y-2">
        <h3 className="font-semibold">Rapid Fire Demo:</h3>
        <Button
          onClick={() => {
            setTimeout(() => toast.success('Recipe saved!'), 0);
            setTimeout(() => toast.info('New comment on your recipe'), 500);
            setTimeout(() => toast.warning('Your session expires in 5 minutes'), 1000);
            setTimeout(() => toast.error('Failed to load image'), 1500);
            setTimeout(() => toast.success('Rating submitted!'), 2000);
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Show 5 Toasts in Sequence
        </Button>
      </div>
    </div>
  );
}

export default NotificationDemo;
```

## 🎬 Usage Flow

### 1. **Show a Toast**
Click any of the toast buttons to show a notification. It will:
- Appear in the top-right corner
- Auto-dismiss after 5 seconds
- Be saved to notification history
- Increment unread count

### 2. **Open Notification Sidebar**
- Click the bell icon (🔔) in the navigation header
- Or click "Toggle Sidebar" button
- Sidebar slides in from the right

### 3. **View Notification History**
In the sidebar, you'll see:
- All past notifications (newest first)
- Unread notifications with blue highlight
- Timestamps (e.g., "5m ago", "2h ago")
- Color-coded icons for each type

### 4. **Mark as Read**
- Click any notification to mark it as read
- Blue highlight disappears
- Unread count decreases
- Or use "Mark all as read" button

### 5. **Clear History**
- Click "Clear all" button (trash icon)
- All notifications removed
- Empty state shown

## 📱 Real-World Examples

### Recipe Submission Success
```tsx
const handleSubmit = async () => {
  try {
    await submitRecipe(formData);
    toast.success(
      'Recipe submitted!',
      'Your recipe is now pending admin approval.'
    );
  } catch (error) {
    toast.error('Submission failed', 'Please try again.');
  }
};
```

### Rating Confirmation
```tsx
const handleRating = async (rating: number) => {
  try {
    await submitRating(recipeId, rating);
    toast.success('Rating submitted!', `You rated this recipe ${rating} stars.`);
  } catch (error) {
    toast.error('Rating failed', 'Please try again later.');
  }
};
```

### Delete Confirmation
```tsx
const handleDelete = async (recipeId: string) => {
  try {
    await deleteRecipe(recipeId);
    toast.success('Recipe deleted', 'Your recipe has been removed.');
  } catch (error) {
    toast.error('Delete failed', 'Could not delete recipe.');
  }
};
```

### Session Expiry Warning
```tsx
useEffect(() => {
  const checkSession = setInterval(() => {
    const timeLeft = getSessionTimeLeft();
    if (timeLeft <= 5) {
      toast.warning(
        'Session expiring soon',
        `Your session expires in ${timeLeft} minutes.`,
        10000 // Show for 10 seconds
      );
    }
  }, 60000); // Check every minute

  return () => clearInterval(checkSession);
}, []);
```

## 🎨 Visual Examples

### Bell Icon with Badge
```
🔔 5+  ← Shows when unread count > 0
```

### Notification Sidebar (Closed)
```
| Page content... |
```

### Notification Sidebar (Open)
```
| Page content... |  [Sidebar]
                    | Notifications (3) |
                    | [Mark all read]   |
                    | [Clear all]       |
                    |                   |
                    | ✓ Recipe saved!   |
                    |   2m ago        • |
                    |                   |
                    | ⓘ New comment     |
                    |   5m ago          |
                    |                   |
                    | ⚠ Session expiry  |
                    |   10m ago         |
```

## 🧪 Testing Checklist

- [ ] Toast appears and auto-dismisses
- [ ] Toast added to history sidebar
- [ ] Unread badge shows on bell icon
- [ ] Sidebar opens/closes smoothly
- [ ] Click notification marks as read
- [ ] Blue highlight removed when read
- [ ] Unread count updates correctly
- [ ] "Mark all as read" works
- [ ] "Clear all" removes notifications
- [ ] Empty state shows when no notifications
- [ ] Timestamps display correctly
- [ ] Icons and colors match toast types
- [ ] Responsive design works on mobile
- [ ] Backdrop closes sidebar

## 📊 Expected Behavior

| Action | Toast | History | Unread Badge | Sidebar |
|--------|-------|---------|--------------|---------|
| Show success toast | ✓ Shows | ✓ Added | ✓ +1 | - |
| Auto-dismiss toast | ✗ Disappears | ✓ Remains | - | - |
| Click notification | - | ✓ Marked read | ✓ -1 | - |
| Mark all as read | - | ✓ All marked | ✓ = 0 | - |
| Clear all | - | ✗ All removed | ✓ = 0 | Empty state |
| Open sidebar | - | - | - | ✓ Opens |
| Click backdrop | - | - | - | ✗ Closes |

## 🎯 Tips

1. **Batch Notifications**: If showing multiple toasts, add delays between them:
   ```tsx
   setTimeout(() => toast.success('Step 1 complete'), 0);
   setTimeout(() => toast.info('Step 2 starting'), 500);
   setTimeout(() => toast.success('All done!'), 1000);
   ```

2. **Important Messages**: Use longer duration for critical notifications:
   ```tsx
   toast.error('Payment failed', 'Please contact support', 10000);
   ```

3. **Keyboard Shortcuts**: Consider adding a keyboard shortcut to toggle sidebar:
   ```tsx
   useEffect(() => {
     const handleKeyPress = (e: KeyboardEvent) => {
       if (e.ctrlKey && e.key === 'n') {
         toggleSidebar();
       }
     };
     window.addEventListener('keydown', handleKeyPress);
     return () => window.removeEventListener('keydown', handleKeyPress);
   }, [toggleSidebar]);
   ```

---

**Status**: ✅ Production Ready  
**Version**: 1.1.0  
**Last Updated**: November 2, 2025
