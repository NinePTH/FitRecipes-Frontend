import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Search, AlertCircle, MessageSquare, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/useToast';
import {
  getAllComments,
  bulkDeleteComments,
  type Comment,
  type CommentListParams,
} from '@/services/analytics';

const ContentModerationPage = () => {
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [recipeFilter, setRecipeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const limit = 20;

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const params: CommentListParams = {
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        recipeId: recipeFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const response = await getAllComments(params);
      setComments(response.comments);
      setTotalPages(response.pagination.totalPages);
      setTotalComments(response.pagination.total);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load comments';
      showToast('error', 'Failed to load comments', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchComments();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, recipeFilter]);

  // Toggle comment selection
  const toggleCommentSelection = (commentId: string) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
  };

  // Select all comments
  const selectAll = () => {
    if (selectedComments.size === comments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(comments.map(c => c.id)));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!deleteReason.trim() || deleteReason.length < 10) {
      showToast('error', 'Validation Error', 'Reason must be at least 10 characters');
      return;
    }

    try {
      setIsDeleting(true);
      const result = await bulkDeleteComments({
        ids: Array.from(selectedComments),
        reason: deleteReason.trim(),
      });

      showToast(
        'success',
        'Comments Deleted',
        `Successfully deleted ${result.deletedCount} comment(s)${result.failedCount > 0 ? `. ${result.failedCount} failed.` : ''}`
      );

      // Refresh and reset
      setSelectedComments(new Set());
      setDeleteReason('');
      setShowDeleteDialog(false);
      fetchComments();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Delete Failed';
      showToast('error', 'Delete Failed', message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
            </div>
            <p className="text-gray-600">Review and moderate user comments across all recipes</p>
          </div>

          {/* Filters and Actions */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Recipe Filter */}
              <Input
                placeholder="Filter by Recipe ID..."
                value={recipeFilter}
                onChange={e => setRecipeFilter(e.target.value)}
              />

              {/* Bulk Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={selectAll}
                  variant="outline"
                  size="sm"
                  disabled={comments.length === 0}
                >
                  {selectedComments.size === comments.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  size="sm"
                  disabled={selectedComments.size === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedComments.size})
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {comments.length} of {totalComments} comments
                {selectedComments.size > 0 && ` • ${selectedComments.size} selected`}
              </p>
            </div>
          </Card>

          {/* Comments List */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading comments...</p>
            </div>
          )}

          {!loading && comments.length === 0 && (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No comments found</p>
            </Card>
          )}

          {!loading && comments.length > 0 && (
            <div className="space-y-4">
              {comments.map(comment => (
                <Card key={comment.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedComments.has(comment.id)}
                      onChange={() => toggleCommentSelection(comment.id)}
                      className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                    />

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{comment.userName}</p>
                          <p className="text-xs text-gray-500">{comment.userEmail}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-2">{comment.content}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-medium text-blue-600">{comment.recipeName}</span>
                        <span>•</span>
                        <span>Recipe ID: {comment.recipeId}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Delete Comments"
        description={`You are about to permanently delete ${selectedComments.size} comment(s). This action cannot be undone.`}
        confirmText="Delete Comments"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 className="h-6 w-6" />}
        isLoading={isDeleting}
      >
        <div className="mt-4">
          <label htmlFor="delete-reason" className="block text-sm font-medium text-gray-700 mb-2">
            Reason for deletion (min 10 characters) *
          </label>
          <textarea
            id="delete-reason"
            value={deleteReason}
            onChange={e => setDeleteReason(e.target.value)}
            placeholder="Enter reason for deleting these comments..."
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isDeleting}
          />
          {deleteReason.length > 0 && deleteReason.length < 10 && (
            <p className="text-xs text-red-600 mt-1">Reason must be at least 10 characters</p>
          )}
        </div>
      </ConfirmDialog>
    </Layout>
  );
};

export default ContentModerationPage;
