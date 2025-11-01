# Confirmation Dialog UI Components - Visual Guide

## Overview
This document showcases the visual design and user experience of the shadcn/ui confirmation dialogs used for deleting ratings and comments.

---

## 🎨 Component Anatomy

### Dialog Structure
```
┌────────────────────────────────────────┐
│  Backdrop (blur + dark overlay)       │
│                                        │
│  ┌──────────────────────────────┐     │
│  │                              │     │
│  │     [Icon] Warning Icon      │     │
│  │                              │     │
│  │     Dialog Title (bold)      │     │
│  │                              │     │
│  │     Description text with    │     │
│  │     additional context       │     │
│  │                              │     │
│  │  [Cancel]      [Confirm]     │     │
│  │  (outline)     (destructive) │     │
│  │                              │     │
│  └──────────────────────────────┘     │
│                                        │
└────────────────────────────────────────┘
```

---

## 🌟 Delete Rating Dialog

### Visual Appearance

```
╔════════════════════════════════════════╗
║  (Blurred background with dark overlay) ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │                                │   ║
║  │         ⚠️                     │   ║
║  │    (Red warning triangle)      │   ║
║  │                                │   ║
║  │   Remove Your Rating?          │   ║
║  │   ═══════════════════          │   ║
║  │                                │   ║
║  │   Are you sure you want to     │   ║
║  │   remove your 4-star rating?   │   ║
║  │   This action will update the  │   ║
║  │   recipe's average rating.     │   ║
║  │                                │   ║
║  │  ┌────────┐    ┌────────────┐ │   ║
║  │  │ Cancel │    │ Remove     │ │   ║
║  │  │        │    │ Rating     │ │   ║
║  │  └────────┘    └────────────┘ │   ║
║  │  (gray)        (red bg)       │   ║
║  │                                │   ║
║  └────────────────────────────────┘   ║
║                                        ║
╚════════════════════════════════════════╝
```

### Design Specs

**Icon**:
- Component: `<AlertTriangle className="h-6 w-6 text-red-600" />`
- Background: `bg-red-100` (light red circle, 48px × 48px)
- Centered at top of dialog

**Title**:
- Text: "Remove Your Rating?"
- Font: 18px, bold (`text-lg font-semibold`)
- Color: `text-gray-900`
- Alignment: Center

**Description**:
- Text: Dynamic with rating number
- Font: 14px (`text-sm`)
- Color: `text-gray-600`
- Alignment: Center
- Line height: Relaxed (`leading-relaxed`)

**Buttons**:
- **Cancel**: 
  - Variant: `outline`
  - Width: Flex 1 (50% of button row)
  - Min-width: 80px
  - Color: Gray border with white background
- **Remove Rating**:
  - Variant: `destructive`
  - Width: Flex 1 (50% of button row)
  - Min-width: 80px
  - Color: Red background with white text

**Backdrop**:
- Color: `bg-black/50` (50% opacity black)
- Blur: `backdrop-blur-sm`
- Animation: Fade in (200ms)

**Dialog Container**:
- Max width: 448px (`max-w-md`)
- Background: White (`bg-white`)
- Border radius: 8px (`rounded-lg`)
- Shadow: Extra large (`shadow-xl`)
- Animation: Fade in + zoom in (200ms)
- Padding: 24px (`p-6`)

---

## 💬 Delete Comment Dialog

### Visual Appearance

```
╔════════════════════════════════════════╗
║  (Blurred background with dark overlay) ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │                                │   ║
║  │         ⚠️                     │   ║
║  │    (Red warning triangle)      │   ║
║  │                                │   ║
║  │   Delete Comment?              │   ║
║  │   ════════════════             │   ║
║  │                                │   ║
║  │   Are you sure you want to     │   ║
║  │   delete this comment? This    │   ║
║  │   action cannot be undone.     │   ║
║  │                                │   ║
║  │  ┌────────┐    ┌────────────┐ │   ║
║  │  │ Cancel │    │  Delete    │ │   ║
║  │  │        │    │            │ │   ║
║  │  └────────┘    └────────────┘ │   ║
║  │  (gray)        (red bg)       │   ║
║  │                                │   ║
║  └────────────────────────────────┘   ║
║                                        ║
╚════════════════════════════════════════╝
```

### Design Specs

**Icon**:
- Same as rating dialog
- `<AlertTriangle className="h-6 w-6 text-red-600" />`
- Background: `bg-red-100` circle

**Title**:
- Text: "Delete Comment?"
- Font: 18px, bold
- Color: `text-gray-900`
- Alignment: Center

**Description**:
- Text: "Are you sure you want to delete this comment? This action cannot be undone."
- Font: 14px
- Color: `text-gray-600`
- Alignment: Center
- Emphasis on "cannot be undone"

**Buttons**:
- **Cancel**: Same as rating dialog
- **Delete**: 
  - Variant: `destructive`
  - Text: "Delete" (shorter than "Remove Rating")
  - Red background

---

## 🎬 Animation Sequence

### Opening Animation (200ms)

```
Step 1: Backdrop appears
  └─ Fade in from transparent to black/50
  └─ Blur effect applied simultaneously

Step 2: Dialog appears (at the same time)
  └─ Fade in from transparent (opacity: 0 → 1)
  └─ Zoom in from 95% to 100% scale
  └─ Combined: "animate-in fade-in-0 zoom-in-95 duration-200"
```

### Closing Animation (200ms)

```
Step 1: User action
  ├─ Click Cancel button
  ├─ Click Confirm button (after action completes)
  ├─ Press Escape key
  └─ Click outside dialog (backdrop)

Step 2: Dialog disappears
  └─ Fade out + zoom out (reverse of opening)
  └─ React state: open={false}

Step 3: Body scroll restored
  └─ document.body.style.overflow = 'unset'
```

---

## 🖱️ User Interactions

### Opening the Dialog

**Rating Deletion**:
1. User hovers over rated star (e.g., 4th star is filled yellow)
2. Tooltip appears: "Click to remove your 4-star rating"
3. User clicks the star
4. Dialog opens with backdrop blur
5. Focus trapped inside dialog

**Comment Deletion**:
1. User hovers over trash icon (gray)
2. Icon turns red on hover
3. Tooltip appears: "Delete comment"
4. User clicks trash icon
5. Dialog opens with backdrop blur
6. Focus trapped inside dialog

### Closing the Dialog

**Method 1: Click Cancel**
- User clicks "Cancel" button
- Dialog closes with animation
- No action taken
- Original state preserved

**Method 2: Click Backdrop**
- User clicks outside dialog (on blurred background)
- Dialog closes (same as Cancel)
- No action taken

**Method 3: Press Escape**
- User presses `Esc` key on keyboard
- Dialog closes (same as Cancel)
- No action taken

**Method 4: Confirm Action**
- User clicks "Remove Rating" or "Delete" button
- `onConfirm()` callback fires
- API call executes
- Dialog closes after successful action
- UI updates (rating removed or comment deleted)

---

## 📱 Responsive Design

### Desktop (≥768px)
```
Dialog:
  - Width: 448px (max-w-md)
  - Padding: 24px all sides
  - Buttons: Side by side (flex-row)
  - Icon: 48px × 48px background circle
  - Icon SVG: 24px × 24px
```

### Tablet (≥640px < 768px)
```
Dialog:
  - Width: 90% of viewport
  - Padding: 24px all sides
  - Buttons: Side by side (flex-row)
  - Icon: 48px × 48px
  - Icon SVG: 24px × 24px
```

### Mobile (<640px)
```
Dialog:
  - Width: Calc(100% - 32px) for 16px margin each side
  - Padding: 24px all sides
  - Buttons: Side by side but smaller
  - Icon: 48px × 48px
  - Icon SVG: 24px × 24px
  - Text: Scales appropriately
```

---

## ♿ Accessibility Features

### ARIA Attributes
```tsx
<div role="alertdialog" 
     aria-labelledby="confirm-dialog-title"
     aria-describedby="confirm-dialog-description">
  <h2 id="confirm-dialog-title">Remove Your Rating?</h2>
  <p id="confirm-dialog-description">Are you sure...</p>
  <button>Cancel</button>
  <button>Remove Rating</button>
</div>
```

### Keyboard Navigation
- **Tab**: Cycle through Cancel → Confirm buttons
- **Shift + Tab**: Reverse cycle
- **Escape**: Close dialog (cancel action)
- **Enter**: Activate focused button
- **Space**: Activate focused button

### Screen Reader Support
- Dialog announced as "Alert Dialog"
- Title read first: "Remove Your Rating?"
- Description read second: Full message
- Buttons read with their labels
- Focus management: Focus returns to trigger element after close

### Focus Trap
- When dialog opens: Focus trapped inside
- Cannot tab to elements outside dialog
- Cannot click elements outside (backdrop blocks)
- When dialog closes: Focus returns to original trigger

---

## 🎨 Color Palette

### Warning Icon
- Icon color: `text-red-600` (#DC2626)
- Background: `bg-red-100` (#FEE2E2)
- Border radius: `rounded-full` (circle)

### Backdrop
- Background: `bg-black/50` (rgba(0, 0, 0, 0.5))
- Blur: `backdrop-blur-sm` (8px blur)

### Dialog Container
- Background: `bg-white` (#FFFFFF)
- Shadow: `shadow-xl` (large shadow for elevation)
- Border: None

### Text Colors
- Title: `text-gray-900` (#111827)
- Description: `text-gray-600` (#4B5563)

### Button: Cancel (Outline)
- Background: Transparent / White
- Border: `border-gray-300` (#D1D5DB)
- Text: `text-gray-700` (#374151)
- Hover: `bg-gray-50` (#F9FAFB)

### Button: Confirm (Destructive)
- Background: `bg-red-600` (#DC2626)
- Text: `text-white` (#FFFFFF)
- Hover: `bg-red-700` (#B91C1C)
- Active: `bg-red-800` (#991B1B)

---

## 🔧 Implementation Code

### Component Props
```typescript
// Rating deletion dialog
<ConfirmDialog
  open={deleteRatingDialog}                    // boolean state
  onOpenChange={setDeleteRatingDialog}         // state setter
  onConfirm={confirmDeleteRating}              // async function
  title="Remove Your Rating?"                  // string
  description={`Are you sure you want to remove your ${ratingToDelete}-star rating? This action will update the recipe's average rating.`}
  confirmText="Remove Rating"                  // string
  cancelText="Cancel"                          // string
  variant="destructive"                        // 'default' | 'destructive'
  icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
/>

// Comment deletion dialog
<ConfirmDialog
  open={deleteCommentDialog}                   // boolean state
  onOpenChange={setDeleteCommentDialog}        // state setter
  onConfirm={confirmDeleteComment}             // async function
  title="Delete Comment?"                      // string
  description="Are you sure you want to delete this comment? This action cannot be undone."
  confirmText="Delete"                         // string
  cancelText="Cancel"                          // string
  variant="destructive"                        // 'default' | 'destructive'
  icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
/>
```

### State Management
```typescript
// Rating dialog state
const [deleteRatingDialog, setDeleteRatingDialog] = useState(false);
const [ratingToDelete, setRatingToDelete] = useState(0);

// Comment dialog state
const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);
const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
```

---

## 📊 User Flow Diagram

### Rating Deletion Flow
```
User clicks rated star
        ↓
Check if same star as current rating
        ↓
    ┌───Yes───┐
    │         │
    ↓         ↓
Open Dialog   Submit new rating
    ↓
User sees warning
    ↓
┌───────┴───────┐
│               │
Cancel      Confirm
│               │
↓               ↓
Close      Delete rating
Dialog          ↓
            Update UI
                ↓
            Close Dialog
```

### Comment Deletion Flow
```
User clicks trash icon
        ↓
Open Dialog
        ↓
User sees warning
        ↓
┌───────┴───────┐
│               │
Cancel      Confirm
│               │
↓               ↓
Close      Delete comment
Dialog          ↓
            Remove from list
                ↓
            Update count
                ↓
            Close Dialog
```

---

## 🎯 Best Practices Implemented

### ✅ User Experience
- Clear, actionable titles (questions, not statements)
- Descriptive messages explaining consequences
- Consistent button placement (Cancel left, Confirm right)
- Visual hierarchy (destructive actions in red)
- Multiple ways to dismiss (Cancel, Escape, backdrop click)

### ✅ Accessibility
- Proper ARIA roles and labels
- Keyboard navigation support
- Focus management
- Screen reader compatible
- Color contrast meets WCAG AA standards

### ✅ Performance
- Smooth 200ms animations
- No layout shift
- Efficient state management
- Cleanup on unmount

### ✅ Visual Design
- Follows shadcn/ui design system
- Consistent with app styling
- Professional appearance
- Mobile-responsive
- Backdrop blur for context

---

**Last Updated**: November 1, 2025  
**Component Version**: 1.0.0  
**Status**: ✅ Production Ready
