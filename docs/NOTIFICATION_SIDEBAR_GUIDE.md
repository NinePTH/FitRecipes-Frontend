# Notification History Sidebar

A comprehensive notification history system with a slide-out sidebar, unread badges, mark as read functionality, and notification persistence.

## ✨ Features

✅ **Slide-out Sidebar**: Smooth slide animation from the right side  
✅ **Notification History**: All toasts are saved to history  
✅ **Unread Badges**: Visual indicators for unread notifications  
✅ **Mark as Read**: Click any notification to mark it as read  
✅ **Mark All as Read**: Button to mark all notifications as read  
✅ **Clear All**: Remove all notifications from history  
✅ **Unread Counter**: Badge on bell icon shows unread count  
✅ **Timestamps**: Relative time display (e.g., "5m ago", "2h ago")  
✅ **Color-coded Icons**: Each notification type has its own icon and color  
✅ **Responsive**: Full-width on mobile, 384px wide on desktop  
✅ **Backdrop**: Click outside to close sidebar  
✅ **Empty State**: Friendly message when no notifications  

## 📦 Components

### 1. **NotificationSidebar** (`src/components/ui/notification-sidebar.tsx`)
The main sidebar component that displays notification history.

### 2. **Updated Toast Context** (`src/contexts/ToastContext.tsx`)
Enhanced with notification history management:
- `notifications`: Array of all notifications (newest first)
- `markAsRead(id)`: Mark a single notification as read
- `markAllAsRead()`: Mark all notifications as read
- `clearNotifications()`: Clear all notifications
- `isSidebarOpen`: Sidebar visibility state
- `toggleSidebar()`: Open/close the sidebar
- `unreadCount`: Number of unread notifications

### 3. **Layout Component** (`src/components/Layout.tsx`)
Updated with bell icon button and unread badge.

## 🚀 Usage

### Opening the Sidebar

The notification bell icon is in the navigation header:

```tsx
// Automatically included in Layout component
<Bell className="h-5 w-5" />
{unreadCount > 0 && (
  <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
)}
```

Users can click the bell icon to open/close the sidebar.

### Programmatic Control

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { toggleSidebar, isSidebarOpen } = useToast();

  return (
    <button onClick={toggleSidebar}>
      {isSidebarOpen ? 'Close' : 'Open'} Notifications
    </button>
  );
}
```

### Accessing Notification History

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { notifications, unreadCount } = useToast();

  return (
    <div>
      <p>Total notifications: {notifications.length}</p>
      <p>Unread: {unreadCount}</p>
      <ul>
        {notifications.map(notif => (
          <li key={notif.id}>
            {notif.title} - {notif.isRead ? 'Read' : 'Unread'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Mark as Read

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { notifications, markAsRead } = useToast();

  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markAsRead(notif.id)}>
          {notif.title}
        </div>
      ))}
    </div>
  );
}
```

### Clear Notifications

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { clearNotifications, markAllAsRead } = useToast();

  return (
    <>
      <button onClick={markAllAsRead}>Mark All as Read</button>
      <button onClick={clearNotifications}>Clear All</button>
    </>
  );
}
```

## 🎨 Notification States

### Unread Notification
- Blue background highlight (`bg-blue-50/50`)
- Blue dot indicator on the right
- Bold title text
- Counts toward unread badge

### Read Notification
- White background
- No blue dot
- Normal font weight
- Does not count toward badge

## 📱 Responsive Design

### Desktop (768px+)
- Sidebar width: 384px (24rem)
- Slides in from right edge
- Dark backdrop overlay

### Mobile (<768px)
- Sidebar width: Full screen
- Slides in from right edge
- Dark backdrop overlay

## 🎯 User Interactions

### Opening the Sidebar
1. Click bell icon in navigation header
2. Sidebar slides in from right
3. Dark backdrop appears

### Closing the Sidebar
1. Click X button in sidebar header
2. Click dark backdrop outside sidebar
3. Sidebar slides out to the right

### Mark as Read
1. Click any notification item
2. Blue background disappears
3. Blue dot indicator removed
4. Unread count decreases

### Mark All as Read
1. Click "Mark all as read" button (top of sidebar)
2. All notifications marked as read
3. Unread count becomes 0
4. Blue badges disappear

### Clear All Notifications
1. Click "Clear all" button (trash icon, top of sidebar)
2. All notifications removed
3. Empty state shown
4. Unread count becomes 0

## 🕐 Timestamp Display

Notifications show relative time:

| Time Difference | Display |
|----------------|---------|
| < 1 minute | "Just now" |
| < 60 minutes | "5m ago", "30m ago" |
| < 24 hours | "2h ago", "12h ago" |
| < 7 days | "1d ago", "5d ago" |
| ≥ 7 days | Full date (e.g., "10/15/2024") |

## 🎨 Icon & Color Mapping

| Type | Icon | Color | Badge |
|------|------|-------|-------|
| Success | CheckCircle | Green (`text-green-600`) | Green dot |
| Error | AlertCircle | Red (`text-red-600`) | Red dot |
| Warning | AlertTriangle | Yellow (`text-yellow-600`) | Yellow dot |
| Info | Info | Blue (`text-blue-600`) | Blue dot |

## 📋 Empty State

When no notifications exist:
- Large info icon (gray)
- "No notifications" heading
- "You're all caught up!" message
- Centered layout

## 🔧 Technical Details

### State Management
```typescript
// Toast Context manages:
- toasts: Toast[]              // Active toasts (auto-dismiss)
- notifications: Toast[]       // Persistent history
- isSidebarOpen: boolean       // Sidebar visibility
```

### Notification Structure
```typescript
interface Toast {
  id: string;                  // Unique identifier
  type: ToastType;             // success | error | warning | info
  title: string;               // Main message
  description?: string;        // Optional details
  duration?: number;           // Auto-dismiss duration (ms)
  timestamp?: Date;            // Creation time
  isRead?: boolean;            // Read status (default: false)
}
```

### Automatic History Tracking
Every time you show a toast:
```tsx
toast.success('Recipe saved!', 'Your recipe has been published.');
```

It automatically:
1. Shows the toast notification (auto-dismiss after 5s)
2. Adds to notification history (persistent)
3. Sets `isRead: false` and `timestamp: new Date()`
4. Updates unread count badge

## 🎯 Best Practices

### 1. Notification Frequency
- ✅ Use for important user feedback
- ✅ Show success confirmations
- ✅ Display error messages
- ❌ Don't spam with too many notifications
- ❌ Don't use for debugging/console logs

### 2. Notification Content
- ✅ Keep titles short (2-5 words)
- ✅ Add descriptions for context
- ✅ Use appropriate type (success/error/warning/info)
- ✅ Be specific about what happened

### 3. Mark as Read
- Users can click any notification to mark it as read
- Use "Mark all as read" for bulk actions
- Read notifications stay in history until cleared

### 4. Clearing History
- Users control when to clear notifications
- "Clear all" removes entire history
- Cannot be undone (no restore feature)

## 🧪 Testing

### Manual Testing Checklist

1. **Show Notification**
   - [ ] Toast appears on screen
   - [ ] Notification added to history
   - [ ] Unread badge increments

2. **Open Sidebar**
   - [ ] Sidebar slides in smoothly
   - [ ] Backdrop appears
   - [ ] Unread notifications highlighted

3. **Mark as Read**
   - [ ] Click notification marks it as read
   - [ ] Blue highlight removed
   - [ ] Unread count decreases

4. **Mark All as Read**
   - [ ] Button marks all notifications
   - [ ] All blue highlights removed
   - [ ] Unread count becomes 0

5. **Clear All**
   - [ ] Button removes all notifications
   - [ ] Empty state displayed
   - [ ] Unread count becomes 0

6. **Close Sidebar**
   - [ ] X button closes sidebar
   - [ ] Backdrop click closes sidebar
   - [ ] Sidebar slides out smoothly

7. **Responsive**
   - [ ] Full width on mobile
   - [ ] 384px width on desktop
   - [ ] Bell icon visible on all sizes

## 📊 Implementation Stats

- **Bundle Size Impact**: +4.8 kB (notification-sidebar.tsx)
- **Total Bundle**: 448.46 kB (119.81 kB gzipped)
- **New Components**: 1 (NotificationSidebar)
- **Updated Components**: 3 (ToastContext, Layout, App)
- **New Features**: 7 (history, mark read, sidebar, badge, timestamps, clear, empty state)

## 🔗 Related Documentation

- [Toast Notification System](./TOAST_NOTIFICATION_SYSTEM.md) - Core toast implementation
- [Testing Guide](./TESTING.md) - Testing best practices
- [Component Library](./README.md) - Full component documentation

---

**Status**: ✅ Fully Implemented and Production Ready  
**Version**: 1.1.0  
**Last Updated**: November 2, 2025
