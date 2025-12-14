# Functional Requirements - Additional Features

**Last Updated**: November 25, 2025

This document outlines functional requirements for implemented features excluding User Authentication, Recipe Search by Ingredients, Recipe Browse and Recommendation, Recipe Submission, Recipe Approval System, and Community Engagement.

---

## Feature 1 – Smart Search (Vector Search)

Natural Language Search
1. The system must accept natural language queries and extract filters automatically (cuisine, diet, prep time, difficulty, meal type).
2. The system must provide multiple search modes: Smart Search, Vector Search, Ingredient Search, and Hybrid Search.
3. The system must display real-time search suggestions as user types with 300ms debounce.

Search Results Display
1. The system must show extracted filters as visual badges.
2. The system must display search execution time.
3. The system must gracefully fall back to browse mode if search API is unavailable.

---

## Feature 2 – Saved Recipes (Bookmarks)

Save Recipe
1. The system must allow users to save/bookmark any approved recipe.
2. The system must display saved status indicator on recipe cards and detail pages.

View Saved Recipes
1. The system must allow users to view all their saved recipes in a dedicated page.
2. The system must allow users to unsave/remove recipes from their collection.
3. The system must persist saved recipes across user sessions.

---

## Feature 3 – Notifications

Enable/Disable Push Notifications
1. The system must support browser push notifications using Firebase Cloud Messaging.
2. The system must allow users to enable/disable push notifications from settings.
3. The system must display one-time notification prompt banner 2 seconds after first login.

Enable/Disable Email Notifications
1. The system must support email notifications for important updates.
2. The system must allow users to enable/disable email notifications from settings.
3. The system must allow users to configure email digest frequency (never, daily, weekly).

Notification Types (Push and Email)
1. The system must send notifications for recipe approval/rejection via push and email.
2. The system must send notifications for new comments on user's recipes via push and email.
3. The system must send notifications for new ratings on user's recipes via push.
4. The system must send notifications for role changes and system announcements via push.

Notification Management
1. The system must allow users to view notification history with filters (type, status, priority).
2. The system must allow users to mark notifications as read individually or in bulk.

---

## Feature 4 – Admin User Management

View Users
1. The system must allow admins to view paginated list of all users with search and filtering.
2. The system must allow admins to view detailed user information including statistics and activity history.

Ban/Unban Users
1. The system must allow admins to ban users with mandatory reason (minimum 10 characters).
2. The system must allow admins to unban previously banned users.

Change User Role
1. The system must allow admins to change user roles (Customer, Chef, Admin) with optional reason.
2. The system must prevent admins from banning themselves or changing their own role.

Audit Trail
1. The system must log all admin actions in audit trail with timestamp, admin ID, and action details.

---

---

## Feature 5 – Analytics Dashboard

Chef Analytics (Performance Overview)
1. The system must allow chefs to view analytics dashboard for their own recipes (views, ratings, engagement).
2. The system must allow chefs to view performance metrics including view rank and rating rank.
3. The system must display top performing recipes with statistics.

Admin Analytics
1. The system must allow admins to view system-wide analytics dashboard.
2. The system must display user metrics: total users, growth rate, role distribution, banned users count.
3. The system must display recipe metrics: total recipes, pending count, approval ratio, trending recipes.
4. The system must display engagement metrics: comments, ratings, user activity trends, popular cuisines.

Recipe View Tracking
1. The system must track recipe views when users access recipe detail page.
2. The system must increment view count for analytics and trending calculations.
3. The system must fail silently if view tracking backend is unavailable.

---

## Feature 6 – Notification Management

Notification Center
1. The system must allow users to access notification center from top navigation bar.
2. The system must display unread notification count badge.
3. The system must allow users to view notifications in dropdown panel (desktop) or sidebar (mobile).

Filter and Actions
1. The system must allow users to filter notifications by type, status, and priority.
2. The system must allow users to delete individual notifications or all notifications.
3. The system must support notification priority levels (High, Medium, Low).

---

## Feature 7 – Comment Moderation

User Actions
1. The system must allow users to edit their own comments.
2. The system must allow users to delete their own comments.

Admin Actions
1. The system must allow admins to delete any user's comment.
2. The system must update comment count immediately after deletion.

---

## Feature 8 – Audit Logging

Log Actions
1. The system must log all admin actions (user bans, role changes, recipe deletions).
2. The system must store audit logs with timestamp, admin ID, action type, and reason.

View Logs
1. The system must allow admins to view audit log summary in dashboard.
2. The system must keep audit logs immutable and retained for compliance.

---

**Total Features**: 8  
**Total Functional Requirements**: 34
