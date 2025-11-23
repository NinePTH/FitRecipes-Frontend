import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Eye, Star, TrendingUp, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/useToast';
import { getChefAnalyticsOverview, type ChefAnalyticsOverview } from '@/services/analytics';

type TimeRange = '7d' | '30d' | '90d' | '1y';

const ChefPerformancePage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [overview, setOverview] = useState<ChefAnalyticsOverview | null>(null);

  // Fetch analytics overview
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await getChefAnalyticsOverview(timeRange);
      setOverview(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load performance data';
      showToast('error', 'Failed to load performance data', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  // Calculate performance percentile
  const getPercentile = (rank: number, total: number) => {
    return (((total - rank + 1) / total) * 100).toFixed(1);
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
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Performance Overview</h1>
                </div>
                <p className="text-gray-600">Track your growth and ranking among all chefs</p>
              </div>
              <Button onClick={fetchOverview} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center space-x-2 mt-6">
              <span className="text-sm font-medium text-gray-700">Time Range:</span>
              {(['7d', '30d', '90d', '1y'] as TimeRange[]).map(range => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                >
                  {range === '7d' && 'Last 7 Days'}
                  {range === '30d' && 'Last 30 Days'}
                  {range === '90d' && 'Last 90 Days'}
                  {range === '1y' && 'Last Year'}
                </Button>
              ))}
            </div>
          </div>

          {loading && !overview && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading performance data...</p>
            </div>
          )}

          {!loading && overview && (
            <>
              {/* Rankings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Eye className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">View Ranking</h3>
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                      #{overview.rankings.viewRank}
                    </p>
                    <p className="text-sm text-gray-500">of {overview.rankings.totalChefs} chefs</p>
                    <p className="text-xs text-blue-600 mt-2 font-semibold">
                      Top {getPercentile(overview.rankings.viewRank, overview.rankings.totalChefs)}%
                    </p>
                  </div>
                </Card>

                <Card className="p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Rating Ranking</h3>
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                      #{overview.rankings.ratingRank}
                    </p>
                    <p className="text-sm text-gray-500">of {overview.rankings.totalChefs} chefs</p>
                    <p className="text-xs text-yellow-600 mt-2 font-semibold">
                      Top{' '}
                      {getPercentile(overview.rankings.ratingRank, overview.rankings.totalChefs)}%
                    </p>
                  </div>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {overview.performance.totalViews.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        +{overview.performance.viewsInPeriod.toLocaleString()} in period
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {overview.performance.averageRating.toFixed(1)} ⭐
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {overview.performance.totalRatings} ratings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Comments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {overview.performance.totalComments}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        +{overview.performance.commentsInPeriod} in period
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recipe Stats */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recipe Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-gray-900">{overview.myRecipes.total}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Recipes</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">
                      {overview.myRecipes.approved}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Approved</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-600">
                      {overview.myRecipes.pending}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-3xl font-bold text-red-600">{overview.myRecipes.rejected}</p>
                    <p className="text-sm text-gray-600 mt-1">Rejected</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">
                      {overview.myRecipes.newInPeriod}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">New in Period</p>
                  </div>
                </div>
              </Card>

              {/* Top Recipes */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Recipes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recipe Name
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ratings
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {overview.topRecipes.map((recipe, index) => (
                        <tr key={recipe.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                                  index === 0
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : index === 1
                                      ? 'bg-gray-100 text-gray-800'
                                      : index === 2
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-blue-50 text-blue-800'
                                }`}
                              >
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-900">{recipe.name}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <p className="text-sm text-gray-900">{recipe.views.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              {recipe.rating.toFixed(1)} ⭐
                            </p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <p className="text-sm text-gray-900">{recipe.ratingCount}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <p className="text-sm text-gray-900">{recipe.commentCount}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChefPerformancePage;
