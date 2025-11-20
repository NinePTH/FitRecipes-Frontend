import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { LineChart } from '@/components/charts/LineChart';
import { useToast } from '@/hooks/useToast';
import {
  getRecipeTrends,
  getUserGrowthTrends,
  type RecipeTrends,
  type UserGrowthTrends,
} from '@/services/analytics';

type TimeRange = '7d' | '30d' | '90d' | '1y';

const SystemAnalyticsPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const [recipeTrends, setRecipeTrends] = useState<RecipeTrends | null>(null);
  const [userGrowthTrends, setUserGrowthTrends] = useState<UserGrowthTrends | null>(null);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [recipeData, userGrowthData] = await Promise.all([
        getRecipeTrends(timeRange),
        getUserGrowthTrends(timeRange),
      ]);

      setRecipeTrends(recipeData);
      setUserGrowthTrends(userGrowthData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load analytics';
      showToast('error', 'Failed to load analytics', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

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
            to="/admin/dashboard"
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
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
                </div>
                <p className="text-gray-600">Platform-wide statistics and trends</p>
              </div>
              <Button onClick={fetchAnalytics} disabled={loading} variant="outline" size="sm">
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

          {loading && !recipeTrends && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          )}

          {!loading && recipeTrends && userGrowthTrends && (
            <>
              {/* Recipe Trends Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Submitted</p>
                      <p className="text-2xl font-bold">{recipeTrends.summary.totalSubmitted}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Approved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {recipeTrends.summary.totalApproved}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Rejected</p>
                      <p className="text-2xl font-bold text-red-600">
                        {recipeTrends.summary.totalRejected}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-red-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Approval Rate</p>
                      <p className="text-2xl font-bold">
                        {recipeTrends.summary.approvalRate.toFixed(1)}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </Card>
              </div>

              {/* Recipe Trends Chart */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recipe Submission Trends
                </h2>
                <LineChart
                  labels={recipeTrends.trends.map(t => formatDate(t.date))}
                  datasets={[
                    {
                      label: 'Submitted',
                      data: recipeTrends.trends.map(t => t.submitted),
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    },
                    {
                      label: 'Approved',
                      data: recipeTrends.trends.map(t => t.approved),
                      borderColor: 'rgb(16, 185, 129)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    },
                    {
                      label: 'Rejected',
                      data: recipeTrends.trends.map(t => t.rejected),
                      borderColor: 'rgb(239, 68, 68)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    },
                  ]}
                  height={400}
                />
              </Card>

              {/* User Growth Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total New Users</p>
                      <p className="text-2xl font-bold">{userGrowthTrends.summary.totalNewUsers}</p>
                      <p className="text-xs text-gray-500 mt-1">In selected period</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                      <p className="text-2xl font-bold">
                        {userGrowthTrends.summary.growthRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Period over period</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </Card>
              </div>

              {/* User Growth Chart */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  User Registration Trends
                </h2>
                <LineChart
                  labels={userGrowthTrends.trends.map(t => formatDate(t.date))}
                  datasets={[
                    {
                      label: 'Total Users',
                      data: userGrowthTrends.trends.map(t => t.total),
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    },
                    {
                      label: 'New Customers',
                      data: userGrowthTrends.trends.map(t => t.newUsers),
                      borderColor: 'rgb(16, 185, 129)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    },
                    {
                      label: 'New Chefs',
                      data: userGrowthTrends.trends.map(t => t.newChefs),
                      borderColor: 'rgb(245, 158, 11)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    },
                  ]}
                  height={400}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SystemAnalyticsPage;
