import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Calendar, User, RefreshCw, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/useToast';
import {
  getAuditLogs,
  formatActionName,
  getActionColor,
  type AuditLog,
  type AuditLogListParams,
} from '@/services/auditLogs';

const AuditLogsPage: React.FC = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditLog['action'] | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, actionFilter, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        loadLogs();
      } else {
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params: AuditLogListParams = {
        page,
        limit: 50,
        sortBy: 'timestamp',
        sortOrder: 'desc',
      };

      // Note: backend doesn't support search param for audit logs yet
      if (actionFilter !== 'all') params.action = actionFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await getAuditLogs(params);
      setLogs(response.logs);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load audit logs';
      showToast('error', 'Failed to load audit logs', message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActionFilter('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
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
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                </div>
                <p className="text-gray-600">System activity and administrative actions</p>
              </div>
              <Button onClick={loadLogs} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by admin or user email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Action Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                <select
                  value={actionFilter}
                  onChange={e => setActionFilter(e.target.value as typeof actionFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  <option value="user_banned">User Banned</option>
                  <option value="user_unbanned">User Unbanned</option>
                  <option value="user_role_changed">Role Changed</option>
                  <option value="recipe_deleted">Recipe Deleted</option>
                  <option value="comment_deleted">Comment Deleted</option>
                  <option value="comments_bulk_deleted">Bulk Comment Delete</option>
                  <option value="recipes_bulk_deleted">Bulk Recipe Delete</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || actionFilter !== 'all' || startDate || endDate) && (
              <div className="mt-4 flex justify-end">
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `Showing ${logs.length} of ${total} audit logs`}
            </p>
          </div>

          {/* Audit Logs List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <Card key={log.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
                        >
                          {formatActionName(log.action)}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(log.timestamp)}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {/* Admin Info */}
                        <div className="flex items-start">
                          <User className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-700">Admin:</span>{' '}
                            <span className="text-gray-900">{log.adminName || 'Unknown'}</span>
                          </div>
                        </div>

                        {/* Target Info */}
                        {log.targetName && (
                          <div className="flex items-start">
                            <User className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <span className="font-medium text-gray-700">Target:</span>{' '}
                              <span className="text-gray-900">
                                {log.targetName} ({log.targetType})
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Reason */}
                        {log.reason && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                            <p className="text-gray-800">{log.reason}</p>
                          </div>
                        )}

                        {/* Details */}
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="mt-2">
                            <details className="text-xs">
                              <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                                Additional Details
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded text-gray-700 overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuditLogsPage;
