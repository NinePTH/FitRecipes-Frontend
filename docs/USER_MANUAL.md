# FitRecipes User Manual

**Version 1.1** | Last Updated: December 2025

## 📋 Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Core Features](#core-features)
- [Notifications](#notifications)
- [Account Management](#account-management)
- [Troubleshooting](#troubleshooting)

---

## Introduction

**FitRecipes** is a healthy recipe web application that allows users to discover, share, and manage nutritious recipes. Whether you're looking for meal inspiration or want to share your culinary creations, FitRecipes provides an intuitive platform for the health-conscious community.

### Key Benefits
- 🍽️ Browse thousands of healthy recipes
- 📝 Submit and share your own recipes
- ⭐ Rate and comment on recipes
- 🔔 Stay updated with real-time notifications
- 📱 Works seamlessly on desktop and mobile devices

---

## Getting Started

### Creating an Account

1. **Visit the Registration Page**
   - Click "Sign Up" on the homepage
   - Choose your user type: Customer, Chef, or Admin

2. **Sign Up Options**
   - **Email/Password**: Fill in your details and create a password
   - **Google Sign-In**: Use your Google account for quick registration

3. **Email Verification**
   - Check your email for a verification link
   - Click the link to activate your account
   - Didn't receive it? Use the "Resend Verification" option

### Logging In

1. Go to the login page
2. Enter your email and password, or use "Sign in with Google"
3. Click "Sign In" to access your account

---

## User Roles

### 👤 Customer
**Capabilities:**
- Browse and search recipes
- View recipe details with ingredients and instructions
- Rate recipes (1-5 stars)
- Leave comments on recipes
- Save favorite recipes
- Receive notifications about recipe updates

### 👨‍🍳 Chef
**All Customer features plus:**
- Submit new recipes with photos
- Edit your submitted recipes
- View your recipe collection in "My Recipes"
- Track approval status of submitted recipes
- Receive notifications when recipes are approved/rejected

### 🛡️ Admin
**All Chef features plus:**
- Review pending recipe submissions
- Approve or reject recipes with feedback
- Delete any recipe (pending, approved, or rejected)
- Manage user accounts (view, ban/unban, change roles)
- Access admin dashboard with system-wide analytics
- Moderate comments and ratings
- View user activity and engagement metrics

---

## Core Features

### 🔍 Browsing Recipes

**Smart Search (AI-Powered):**
- **Natural Language Queries**: Search using everyday language
  - Example: "quick vegan thai dinner under 30 minutes"
  - Example: "healthy breakfast recipes for weight loss"
  - Example: "easy italian pasta dishes"
- **Auto-Filter Extraction**: System automatically detects:
  - Cuisine types (Thai, Italian, Mexican, etc.)
  - Dietary restrictions (Vegan, Vegetarian, Keto, etc.)
  - Preparation time (under 30 minutes, quick, etc.)
  - Difficulty level (easy, medium, hard)
  - Meal types (breakfast, lunch, dinner, snack)
- **Real-time Suggestions**: As you type, see matching recipes and ingredients
- **Multiple Search Modes**:
  - Smart Search (default, AI-powered)
  - Vector Search (semantic similarity)
  - Ingredient Search (find by specific ingredients)
  - Hybrid Search (combines multiple methods)
- **Visual Feedback**: Extracted filters shown as badges with execution time

**Manual Filters:**
- Filter by:
  - **Meal Type**: Breakfast, Lunch, Dinner, Snack, Dessert
  - **Diet Type**: Vegetarian, Vegan, Keto, Paleo, Gluten-Free
  - **Difficulty**: Easy, Medium, Hard
  - **Cuisine**: Italian, Asian, Mexican, etc.
  - **Allergens**: View allergen information for safety
  - **Prep Time**: Filter by maximum preparation time

**Recipe Cards Display:**
- Recipe image with title
- Prep and cook time
- Average rating and review count
- Key dietary indicators (badges)
- Save/bookmark button for quick access

### 📖 Viewing Recipe Details

**Recipe Information Includes:**
- High-quality images (up to 3 photos)
- Complete ingredient list with measurements
- Step-by-step cooking instructions
- Nutrition facts per serving
- Prep time, cook time, and serving size
- Difficulty level and cuisine type
- Meal type badges (Breakfast, Lunch, etc.)
- Dietary information (Vegan, Gluten-Free, etc.)
- Allergen warnings

**Interactive Features:**
- Rate the recipe (1-5 stars)
- Edit or delete your rating
- Add comments and reviews
- Edit or delete your comments
- Share recipe on social media (coming soon)

### 📝 Submitting Recipes (Chef Only)

**Step-by-Step Submission:**

1. **Basic Information**
   - Recipe title (descriptive and appetizing)
   - Detailed description
   - Cuisine type and main ingredient

2. **Upload Images**
   - Add up to 3 high-quality photos
   - Drag and drop or click to upload
   - Supported formats: JPG, PNG

3. **Ingredients**
   - Add ingredients one by one
   - Specify quantity and unit of measurement
   - Edit or remove as needed

4. **Instructions**
   - Write clear, step-by-step instructions
   - Number them automatically
   - Keep each step concise

5. **Recipe Details**
   - Set prep time and cook time
   - Specify number of servings
   - Choose difficulty level

6. **Categories**
   - Select meal types (can choose multiple)
   - Choose diet types (Vegan, Keto, etc.)
   - Add allergen information

7. **Nutrition Information** (Optional)
   - Calories per serving
   - Macronutrients (protein, carbs, fat)
   - Fiber and sodium content

8. **Preview and Submit**
   - Click "Preview" to see how your recipe will look
   - Review all information for accuracy
   - Submit for admin approval

**Recipe Status:**
- **Pending**: Waiting for admin review
- **Approved**: Live and visible to all users
- **Rejected**: Not approved (check rejection reason)

### 📚 My Recipes (Chef Only)

**Manage Your Collection:**
- View all your submitted recipes
- Filter by status (Pending, Approved, Rejected)
- Edit existing recipes
- Delete recipes you no longer want
- Track approval status

**Editing Recipes:**
- Click "Edit" on any of your recipes
- Make changes to any section
- Re-submit for approval if needed
- Note: Approved recipes may need re-approval after edits

### ✅ Recipe Approval (Admin Only)

**Admin Dashboard Features:**
- View all pending recipe submissions
- See recipe preview with full details
- Check nutrition information and allergens
- Review recipe images
- Track approval statistics (pending, approved, rejected counts)

**Approval Actions:**
- **Approve**: Make recipe public immediately
  - Optional: Add admin note for internal tracking
  - Recipe becomes visible to all users
  - Chef receives approval notification
- **Reject**: Provide detailed feedback to chef
  - Specify reason for rejection (required, 10+ characters)
  - Chef receives notification with explanation
  - Recipe remains in chef's collection as "Rejected"
- **Delete**: Remove recipe permanently from system
  - Requires deletion reason (minimum 10 characters)
  - Cascades to remove all comments, ratings, and saved entries
  - Creates audit log entry for tracking
  - Available for any recipe status (pending, approved, rejected)

**Bulk Actions:**
- Delete multiple recipes at once
- Provide single reason for batch deletion
- View success/failure status for each item

### 👥 User Management (Admin Only)

**Access User Management:**
- Navigate to "User Management" from admin menu
- View complete list of all registered users
- See user statistics and activity metrics

**User Information Displayed:**
- Email address and full name
- User role (Customer, Chef, Admin)
- Account status (Active, Banned)
- Registration date
- Last activity timestamp
- Number of recipes submitted (for Chefs)
- Account verification status

**Filter and Search:**
- Filter by role (Customer, Chef, Admin)
- Filter by status (Active, Banned)
- Search by email or name
- Sort by registration date, last activity, or role

**User Management Actions:**

1. **View User Details**
   - Click on user to see detailed information
   - View user's recipe contributions
   - See comment and rating history
   - Check engagement metrics

2. **Ban User**
   - Select "Ban" from user actions
   - Provide ban reason (required, min 10 characters)
   - Banned users cannot log in
   - User receives notification about suspension
   - Ban reason stored for audit purposes

3. **Unban User**
   - Select "Unban" for banned users
   - Immediately restores account access
   - User receives welcome back notification
   - Original ban reason remains in audit log

4. **Change User Role**
   - Promote Customer to Chef (enables recipe submission)
   - Promote Chef to Admin (grants full admin access)
   - Demote Admin to Chef or Customer
   - User receives notification about role change
   - Role change is immediate and reflected system-wide
   - Optional: Provide reason for role change

**Audit Trail:**
- All admin actions are logged
- Includes timestamp, admin ID, and action details
- Ban/unban reasons stored for accountability
- Accessible in admin dashboard

### 📊 Analytics & Dashboard

**Chef Analytics (Chef Only):**
- Access from "My Recipes" page
- View recipe performance metrics:
  - Total views per recipe
  - Average rating and rating count
  - Comment count and engagement
  - Save/bookmark count
  - Recipe status (pending, approved, rejected)
- Track recipe trends over time
- Identify top-performing recipes
- See approval/rejection feedback

**Admin Dashboard (Admin Only):**
- System-wide overview and statistics
- **User Metrics**:
  - Total registered users
  - User growth over time
  - Active vs inactive users
  - Users by role distribution
  - Banned users count
- **Recipe Metrics**:
  - Total recipes in system
  - Pending approval count
  - Approved vs rejected ratio
  - Most viewed recipes
  - Top-rated recipes
  - Recipe submissions over time
- **Engagement Metrics**:
  - Total comments and ratings
  - Average engagement per recipe
  - User activity trends
  - Popular cuisines and meal types
- **Content Moderation**:
  - Flagged content count
  - Recent admin actions
  - Audit log summary

---

## Notifications

### 🔔 Notification System

**Types of Notifications:**
- Recipe approval/rejection updates
- New comments on your recipes
- Recipe rating notifications
- System announcements

### Managing Notifications

**Notification Bell (Top Navigation):**
- Shows unread count badge
- Click to view recent notifications
- Desktop: Dropdown panel below bell icon
- Mobile: Full-screen sidebar from right

**Notification Actions:**
- Click notification to view details
- Mark individual as read
- Mark all as read
- Delete notifications

**View All Notifications Page:**
- Access via "View all notifications" link
- Filter by:
  - Type (Recipe, Comment, Rating, System)
  - Status (Read/Unread)
  - Priority (High, Medium, Low)
- Sort by date (newest/oldest)
- Bulk actions: mark all read, delete

### 📲 Push Notifications (Optional)

**Enable Browser Notifications:**
1. Go to Notification Settings (user menu → Settings)
2. Click "Enable Push Notifications"
3. Allow browser permission when prompted
4. Receive real-time updates even when tab is inactive

**Supported Browsers:**
- Chrome, Edge, Firefox, Safari
- Mobile Chrome and Mobile Safari

**Managing Push Notifications:**
- Enable/disable in Notification Settings
- Control notification types in preferences
- Disable by clicking "Disable Push Notifications"
- Your device will stop receiving push alerts

**Push Notification Banner:**
- Appears 2 seconds after login (first time only)
- Dismissable with X button
- Won't show again after dismissal
- One-time prompt to enable notifications

**Notification Types You'll Receive:**
- **Recipe Updates**: When your recipe is approved or rejected
- **Comments**: New comments on your recipes
- **Ratings**: New ratings on your recipes
- **Admin Actions**: Account role changes, bans, or warnings
- **System Announcements**: Important platform updates

---

## Account Management

### Profile Settings

**Accessing Settings:**
- Click your name in the top navigation
- Select "Settings" from dropdown menu

**Available Settings:**
- Update personal information
- Change password
- Notification preferences
- Push notification management

### Notification Preferences

**Customize What You Receive:**
- Email notifications on/off
- Push notifications on/off
- Notification types to receive
- Priority level settings

### Password Reset

**Forgot Password?**
1. Click "Forgot Password?" on login page
2. Enter your email address
3. Check email for reset link
4. Click link and set new password
5. Log in with new credentials

### Logout

- Click your name in top navigation
- Select "Logout"
- You'll be redirected to the login page

---

## Troubleshooting

### Common Issues

**Can't Log In?**
- Verify email and password are correct
- Check if email is verified (check inbox/spam)
- Use "Forgot Password" if needed
- Try clearing browser cache

**Email Verification Not Received?**
- Check spam/junk folder
- Use "Resend Verification" link
- Ensure email address is correct
- Wait a few minutes and check again

**Recipe Submission Failed?**
- Ensure all required fields are filled
- Check image file sizes (max 5MB each)
- Verify image formats (JPG/PNG only)
- Check your internet connection
- Try saving as draft and submitting later

**Images Not Uploading?**
- Verify file size is under 5MB
- Use JPG or PNG format only
- Check internet connection
- Try uploading one at a time
- Compress large images before uploading

**Notifications Not Working?**
- Check browser notification permissions
- Ensure push notifications are enabled in settings
- Verify browser supports notifications
- Try disabling and re-enabling push notifications
- Check if browser is blocking notifications

**Recipe Not Appearing After Approval?**
- Refresh the page
- Clear browser cache
- Wait a few minutes for system to update
- Check in "Browse Recipes" page

**Can't Rate or Comment?**
- Ensure you're logged in
- You cannot rate your own recipes
- Check if recipe is approved
- Verify you're not on a pending recipe

**Search Not Working?**
- Check your internet connection
- Try different search terms or queries
- Use manual filters if Smart Search is unavailable
- Clear search query and try again
- System automatically falls back to browse mode if search fails

**Admin Actions Not Available?**
- Verify you have Admin role
- Check if you're logged in with correct account
- Some actions require specific permissions
- Contact system administrator if issue persists

**User Management Issues?**
- Ensure ban reason is at least 10 characters
- Cannot ban yourself as admin
- Role changes are immediate but may need page refresh

### Browser Compatibility

**Supported Browsers:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile Support:**
- iOS Safari (latest version)
- Android Chrome (latest version)
- Responsive design works on all screen sizes

### Getting Help

**Need Additional Support?**
- Contact: support@fitrecipes.com
- Check FAQ section on website
- Submit feedback through user menu
- Report bugs via GitHub issues

---

## Quick Tips

### For Customers
✅ Use filters to find recipes matching your dietary needs  
✅ Save favorite recipes for quick access  
✅ Rate recipes to help other users  
✅ Leave detailed comments to help chefs improve  

### For Chefs
✅ Use high-quality, well-lit photos  
✅ Write clear, detailed instructions  
✅ Include accurate nutrition information  
✅ Specify all allergens for user safety  
✅ Use preview feature before submitting  
✅ Respond to comments on your recipes  

### For Admins
✅ Review recipes thoroughly before approval  
✅ Provide constructive rejection feedback (min 10 characters)  
✅ Check for duplicate recipes  
✅ Verify nutrition information accuracy  
✅ Ensure images are appropriate  
✅ Always provide clear reasons for deletions or bans  
✅ Monitor user activity and engagement metrics  
✅ Use bulk actions for efficient content moderation  
✅ Review audit logs regularly for accountability  

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search recipes | `/` |
| Close notification panel | `Esc` |
| Close dialogs/modals | `Esc` |
| Navigate forms | `Tab` |
| Submit forms | `Enter` |
| Navigate search suggestions | `↑` `↓` |
| Select suggestion | `Enter` |

---

## Privacy & Security

- Your password is securely encrypted
- Email addresses are never shared with third parties
- Recipes are visible to all users once approved
- Comments and ratings are public with your name
- You can delete your content at any time
- Push notification tokens are stored securely

---

## Getting the Most from FitRecipes

1. **Complete your profile** - Add a profile picture and bio
2. **Enable notifications** - Stay updated on recipe activity
3. **Be active** - Rate and comment on recipes regularly
4. **Share quality recipes** - Help grow the community
5. **Provide feedback** - Help us improve the platform

---

**Thank you for using FitRecipes!** 🎉

*For technical support or feedback, contact: support@fitrecipes.com*
