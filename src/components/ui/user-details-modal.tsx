import React from 'react';
import { X, User, Mail, Shield, Calendar, BarChart3 } from 'lucide-react';
import { Card } from './card';
import type { UserDetails } from '@/services/userManagement';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserDetails | null;
  loading: boolean;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userDetails,
  loading,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'CHEF':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading user details...</p>
            </div>
          )}

          {!loading && !userDetails && (
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load user details</p>
            </div>
          )}

          {!loading && userDetails && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {userDetails.user.firstName} {userDetails.user.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{userDetails.user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(userDetails.user.role)}`}
                    >
                      {userDetails.user.role}
                    </span>
                    {userDetails.user.isBanned && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Banned
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Joined:</span>
                    </div>
                    <p className="text-gray-900 ml-6">{formatDate(userDetails.user.createdAt)}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Last Updated:</span>
                    </div>
                    <p className="text-gray-900 ml-6">{formatDate(userDetails.user.createdAt)}</p>
                  </div>
                </div>

                {userDetails.user.isBanned && userDetails.user.bannedAt && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">Ban Information</p>
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Banned on:</span>{' '}
                      {formatDate(userDetails.user.bannedAt)}
                    </p>
                    {userDetails.user.banReason && (
                      <p className="text-sm text-red-700 mt-1">
                        <span className="font-medium">Reason:</span> {userDetails.user.banReason}
                      </p>
                    )}
                  </div>
                )}
              </Card>

              {/* Statistics */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Activity Statistics</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {userDetails.statistics.recipesSubmitted}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Recipes</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {userDetails.statistics.recipesApproved}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Approved</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {userDetails.statistics.commentsPosted}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Comments</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {userDetails.statistics.ratingsGiven}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Ratings</p>
                  </div>
                </div>
                {userDetails.statistics.averageRecipeRating &&
                  userDetails.statistics.averageRecipeRating > 0 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">Average Recipe Rating</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-1">
                        {userDetails.statistics.averageRecipeRating.toFixed(1)} ⭐
                      </p>
                    </div>
                  )}
              </Card>

              {/* Recent Activity */}
              {userDetails.recentActivity.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-gray-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
                  </div>
                  <div className="space-y-3">
                    {userDetails.recentActivity.slice(0, 5).map(activity => (
                      <div
                        key={activity.timestamp}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
