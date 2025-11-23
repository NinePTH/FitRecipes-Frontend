import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart3,
  Eye,
  Star,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { useToast } from '@/hooks/useToast';
import {
  getChefAnalyticsOverview,
  getRecipeAnalytics,
  type RecipeAnalytics,
} from '@/services/analytics';

type TimeRange = '7d' | '30d' | '90d' | '1y';

const ChefAnalyticsPage = () => {
  const { recipeId } = useParams<{ recipeId?: string }>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const [recipes, setRecipes] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [analytics, setAnalytics] = useState<RecipeAnalytics | null>(null);

  // Fetch chef's recipes
  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const overview = await getChefAnalyticsOverview('90d');
      setRecipes(overview.topRecipes.map(r => ({ id: r.id, name: r.name })));

      // Auto-select recipe from URL or first recipe
      if (recipeId) {
        setSelectedRecipeId(recipeId);
      } else if (overview.topRecipes.length > 0) {
        setSelectedRecipeId(overview.topRecipes[0].id);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load recipes';
      showToast('error', 'Failed to load recipes', message);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Fetch recipe analytics
  const fetchAnalytics = async () => {
    if (!selectedRecipeId) return;

    try {
      setLoading(true);
      const data = await getRecipeAnalytics(selectedRecipeId, timeRange);
      setAnalytics(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load analytics';
      showToast('error', 'Failed to load analytics', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedRecipeId) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipeId, timeRange]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/chef/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Recipe Analytics</h1>
                </div>
                <p className="text-gray-600">Detailed performance metrics for your recipes</p>
              </div>
              <Button
                onClick={fetchAnalytics}
                disabled={loading || !selectedRecipeId}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Recipe Selector and Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Recipe
                </label>
                <select
                  value={selectedRecipeId}
                  onChange={e => setSelectedRecipeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loadingRecipes}
                >
                  {loadingRecipes && <option>Loading recipes...</option>}
                  {!loadingRecipes && recipes.length === 0 && <option>No recipes found</option>}
                  {recipes.map(recipe => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <div className="flex items-center space-x-2">
                  {(['7d', '30d', '90d', '1y'] as TimeRange[]).map(range => (
                    <Button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      variant={timeRange === range ? 'default' : 'outline'}
                      size="sm"
                    >
                      {range === '7d' && '7 Days'}
                      {range === '30d' && '30 Days'}
                      {range === '90d' && '90 Days'}
                      {range === '1y' && '1 Year'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {loading && !analytics && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          )}

          {!loading && !selectedRecipeId && (
            <Card className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Select a recipe to view analytics</p>
            </Card>
          )}

          {!loading && analytics && (
            <>
              {/* Recipe Info */}
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {analytics.recipe.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Status:{' '}
                      <span
                        className={`font-semibold ${
                          analytics.recipe.status === 'APPROVED'
                            ? 'text-green-600'
                            : analytics.recipe.status === 'PENDING'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {analytics.recipe.status}
                      </span>
                      {analytics.recipe.approvedAt && (
                        <> • Approved on {formatDate(analytics.recipe.approvedAt)}</>
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Views</p>
                      <p className="text-2xl font-bold">{analytics.views.total}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        +{analytics.views.viewsInPeriod} in period
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                      <p className="text-2xl font-bold">{analytics.ratings.average.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analytics.ratings.total} ratings
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Comments</p>
                      <p className="text-2xl font-bold">{analytics.comments.total}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        +{analytics.comments.commentsInPeriod} in period
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Engagement</p>
                      <p className="text-2xl font-bold">
                        {(analytics.engagement.viewToRatingRate * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">View-to-rating</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </Card>
              </div>

              {/* View Trends Chart */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">View Trends</h2>
                <LineChart
                  labels={analytics.views.viewTrends.map(t => formatDate(t.date))}
                  datasets={[
                    {
                      label: 'Daily Views',
                      data: analytics.views.viewTrends.map(t => t.views),
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    },
                  ]}
                  height={350}
                />
              </Card>

              {/* Rating Distribution Chart */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h2>
                <BarChart
                  labels={['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars']}
                  datasets={[
                    {
                      label: 'Number of Ratings',
                      data: [
                        analytics.ratings.distribution['1'],
                        analytics.ratings.distribution['2'],
                        analytics.ratings.distribution['3'],
                        analytics.ratings.distribution['4'],
                        analytics.ratings.distribution['5'],
                      ],
                    },
                  ]}
                  height={300}
                />
              </Card>

              {/* Recent Comments */}
              {analytics.comments.recentComments.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Comments</h2>
                  <div className="space-y-4">
                    {analytics.comments.recentComments.map(comment => (
                      <div
                        key={comment.id}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900">{comment.userName}</p>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChefAnalyticsPage;
