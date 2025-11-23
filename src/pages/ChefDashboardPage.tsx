import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BarChart3, TrendingUp, Award, Eye, Star } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getChefAnalyticsOverview } from '@/services/analytics';
import type { ChefAnalyticsOverview } from '@/services/analytics';
import { useToast } from '@/hooks/useToast';

const ChefDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<ChefAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getChefAnalyticsOverview('30d');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chef Dashboard</h1>
          <p className="text-gray-600">Manage your recipes and track performance</p>
        </div>

        {/* Quick Stats Overview */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Recipes</p>
                  <p className="text-2xl font-bold">{overview.myRecipes.total}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{overview.myRecipes.newInPeriod} this month
                  </p>
                </div>
                <FileText className="h-10 w-10 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Views</p>
                  <p className="text-2xl font-bold">
                    {overview.performance.totalViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +{overview.performance.viewsInPeriod} this month
                  </p>
                </div>
                <Eye className="h-10 w-10 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {overview.performance.averageRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {overview.performance.totalRatings} ratings
                  </p>
                </div>
                <Star className="h-10 w-10 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Rank</p>
                  <p className="text-2xl font-bold">#{overview.rankings.viewRank}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    of {overview.rankings.totalChefs} chefs
                  </p>
                </div>
                <Award className="h-10 w-10 text-orange-500" />
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Submit New Recipe */}
          <Link to="/chef/submit-recipe">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit New Recipe</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create and submit a new recipe for approval.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-3">
                    Create Recipe →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* My Recipes */}
          <Link to="/chef/my-recipes">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">My Recipes</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View and manage all your submitted recipes.
                  </p>
                  {overview && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• {overview.myRecipes.approved} Approved</p>
                      <p className="text-orange-600">• {overview.myRecipes.pending} Pending</p>
                      {overview.myRecipes.rejected > 0 && (
                        <p className="text-red-600">• {overview.myRecipes.rejected} Rejected</p>
                      )}
                    </div>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-3">
                    View All →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Recipe Analytics */}
          <Link to="/chef/analytics">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipe Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View detailed performance metrics for your recipes.
                  </p>
                  {overview && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• {overview.performance.totalViews.toLocaleString()} Total Views</p>
                      <p>• {overview.performance.totalComments} Comments</p>
                      <p>• {overview.performance.totalRatings} Ratings</p>
                    </div>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-3">
                    View Analytics →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Performance Overview */}
          <Link to="/chef/performance">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Overview</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Track your growth and engagement over time.
                  </p>
                  {overview && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• Views Rank: #{overview.rankings.viewRank}</p>
                      <p>• Rating Rank: #{overview.rankings.ratingRank}</p>
                    </div>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-3">
                    View Details →
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Top Performing Recipes */}
          {overview && overview.topRecipes.length > 0 && (
            <Card className="p-6 md:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Recipes</h3>
              </div>
              <div className="space-y-3">
                {overview.topRecipes.slice(0, 5).map((recipe, index) => (
                  <Link
                    key={recipe.id}
                    to={`/chef/analytics/${recipe.id}`}
                    className="flex items-center justify-between py-2 border-b last:border-b-0 hover:bg-gray-50 rounded px-2 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-500 w-6">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-gray-900">{recipe.name}</p>
                        <p className="text-xs text-gray-500">
                          {recipe.views.toLocaleString()} views • {recipe.commentCount} comments
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ⭐ {recipe.rating.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">({recipe.ratingCount} ratings)</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        {overview && overview.recentActivity.length > 0 && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {overview.recentActivity.slice(0, 10).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 pb-3 border-b last:border-b-0"
                >
                  <div className="mt-1">
                    {activity.type === 'recipe_approved' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {activity.type === 'recipe_rejected' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                    {activity.type === 'comment_received' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    {activity.type === 'rating_received' && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ChefDashboardPage;
