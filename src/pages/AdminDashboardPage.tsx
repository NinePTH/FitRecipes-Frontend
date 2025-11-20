import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  AlertCircle,
  ScrollText,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAdminDashboardOverview } from '@/services/analytics';
import type { AdminDashboardOverview } from '@/services/analytics';
import { useToast } from '@/hooks/useToast';

const AdminDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboardOverview('30d');
      setOverview(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard data';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, content, and view system analytics</p>
        </div>

        {/* Quick Stats Overview */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold">{overview.users.total}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{overview.users.newInPeriod} this month
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Recipes</p>
                  <p className="text-2xl font-bold">{overview.recipes.total}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{overview.recipes.newInPeriod} this month
                  </p>
                </div>
                <FileText className="h-10 w-10 text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-2xl font-bold">{overview.recipes.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">Recipes awaiting review</p>
                </div>
                <AlertCircle className="h-10 w-10 text-orange-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {overview.engagement.averageRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {overview.engagement.totalRatings} total ratings
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-purple-500" />
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <Link to="/admin/users">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View all users, ban/unban accounts, and change user roles.
                  </p>
                  {overview && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• {overview.users.byRole.USER} Users</p>
                      <p>• {overview.users.byRole.CHEF} Chefs</p>
                      <p>• {overview.users.byRole.ADMIN} Admins</p>
                      {overview.users.banned > 0 && (
                        <p className="text-red-600">• {overview.users.banned} Banned</p>
                      )}
                    </div>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-3">
                    Manage Users →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Recipe Approval */}
          <Link to="/admin/recipes">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipe Approval</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Review and approve/reject pending recipe submissions.
                  </p>
                  {overview && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• {overview.recipes.approved} Approved</p>
                      <p className="text-orange-600">• {overview.recipes.pending} Pending</p>
                      <p>• {overview.recipes.rejected} Rejected</p>
                    </div>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-3">
                    Review Recipes →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Content Moderation */}
          <Link to="/admin/moderation">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Moderation</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View and moderate user comments across all recipes.
                  </p>
                  {overview && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• {overview.engagement.totalComments} Total Comments</p>
                      <p>• {overview.engagement.commentsInPeriod} This Month</p>
                    </div>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-3">
                    Moderate Comments →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* System Analytics */}
          <Link to="/admin/analytics">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">System Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View detailed charts and statistics about platform usage.
                  </p>
                  {overview && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• User Growth Trends</p>
                      <p>• Recipe Submission Trends</p>
                      <p>• Engagement Metrics</p>
                    </div>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-3">
                    View Analytics →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Audit Logs */}
          <Link to="/admin/audit-logs">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <ScrollText className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Logs</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View system activity and administrative action history.
                  </p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>• User Actions</p>
                    <p>• Content Deletions</p>
                    <p>• Role Changes</p>
                  </div>
                  <Button variant="link" className="p-0 h-auto mt-3">
                    View Logs →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Top Chefs */}
        {overview && overview.topChefs.length > 0 && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Shield className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Top Chefs</h3>
              </div>
              <div className="space-y-3">
                {overview.topChefs.slice(0, 5).map((chef, index) => (
                  <div
                    key={chef.userId}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-500 w-6">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-gray-900">{chef.name}</p>
                        <p className="text-xs text-gray-500">{chef.recipeCount} recipes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ⭐ {chef.averageRating.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chef.totalViews.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
