import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserX, UserCheck, Shield, Eye, ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserDetailsModal } from '@/components/ui/user-details-modal';
import {
  getAllUsers,
  banUser,
  unbanUser,
  changeUserRole,
  getUserDetails,
  type UserDetails,
} from '@/services/userManagement';
import type { User, UserListParams } from '@/services/userManagement';
import { useToast } from '@/hooks/useToast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'CHEF' | 'ADMIN'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');

  // Dialog states
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');
  const [newRole, setNewRole] = useState<'USER' | 'CHEF' | 'ADMIN'>('USER');
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // User details modal
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        loadUsers();
      } else {
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params: UserListParams = {
        page,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await getAllUsers(params);
      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load users';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (user: User) => {
    setLoadingUserDetails(true);
    setUserDetailsModalOpen(true);
    setUserDetails(null);

    try {
      const details = await getUserDetails(user.id);
      setUserDetails(details);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load user details';
      showToast('error', message);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim() || banReason.length < 10) {
      showToast('error', 'Ban reason must be at least 10 characters');
      return;
    }

    try {
      setActionLoading(true);
      await banUser(selectedUser.id, { reason: banReason });
      showToast('success', `User ${selectedUser.email} has been banned`);
      setBanDialogOpen(false);
      setBanReason('');
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to ban user';
      showToast('error', message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await unbanUser(selectedUser.id);
      showToast('success', `User ${selectedUser.email} has been unbanned`);
      setUnbanDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unban user';
      showToast('error', message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await changeUserRole(selectedUser.id, {
        newRole,
        reason: roleChangeReason.trim() || undefined,
      });
      showToast('success', `User role changed to ${newRole}`);
      setRoleDialogOpen(false);
      setRoleChangeReason('');
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to change user role';
      showToast('error', message);
    } finally {
      setActionLoading(false);
    }
  };

  const openBanDialog = (user: User) => {
    setSelectedUser(user);
    setBanReason('');
    setBanDialogOpen(true);
  };

  const openUnbanDialog = (user: User) => {
    setSelectedUser(user);
    setUnbanDialogOpen(true);
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleChangeReason('');
    setRoleDialogOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'CHEF':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and access</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as 'all' | 'USER' | 'CHEF' | 'ADMIN')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="USER">User</option>
                <option value="CHEF">Chef</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'banned')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {users.length} of {total} users
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No users found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <Card key={user.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                      {user.isBanned && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                          BANNED
                        </span>
                      )}
                      {user.isOAuthUser && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                          OAuth
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      {user.recipeCount !== undefined && <span>• {user.recipeCount} recipes</span>}
                      {user.commentCount !== undefined && (
                        <span>• {user.commentCount} comments</span>
                      )}
                      {user.lastLoginAt && (
                        <span>• Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {user.isBanned && user.banReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded">
                        <p className="text-sm text-red-900">
                          <strong>Ban Reason:</strong> {user.banReason}
                        </p>
                        {user.bannedAt && (
                          <p className="text-xs text-red-700 mt-1">
                            Banned on: {new Date(user.bannedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRoleDialog(user)}
                      disabled={user.isBanned}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Change Role
                    </Button>
                    {user.isBanned ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUnbanDialog(user)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Unban
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openBanDialog(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Ban Dialog */}
        <ConfirmDialog
          open={banDialogOpen}
          onOpenChange={open => setBanDialogOpen(open)}
          onConfirm={handleBanUser}
          title="Ban User"
          description={`Are you sure you want to ban ${selectedUser?.email}? This will prevent them from logging in and accessing the platform.`}
          confirmText="Ban User"
          variant="destructive"
          isLoading={actionLoading}
        >
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ban Reason (required, min 10 characters)
            </label>
            <Textarea
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              placeholder="Enter reason for banning this user..."
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">{banReason.length} characters</p>
          </div>
        </ConfirmDialog>

        {/* Unban Dialog */}
        <ConfirmDialog
          open={unbanDialogOpen}
          onOpenChange={open => setUnbanDialogOpen(open)}
          onConfirm={handleUnbanUser}
          title="Unban User"
          description={`Are you sure you want to unban ${selectedUser?.email}? They will be able to log in and access the platform again.`}
          confirmText="Unban User"
          isLoading={actionLoading}
        />

        {/* Change Role Dialog */}
        <ConfirmDialog
          open={roleDialogOpen}
          onOpenChange={open => setRoleDialogOpen(open)}
          onConfirm={handleChangeRole}
          title="Change User Role"
          description={`Change role for ${selectedUser?.email}`}
          confirmText="Change Role"
          isLoading={actionLoading}
        >
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Role</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as 'USER' | 'CHEF' | 'ADMIN')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USER">User</option>
                <option value="CHEF">Chef</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <Textarea
                value={roleChangeReason}
                onChange={e => setRoleChangeReason(e.target.value)}
                placeholder="Enter reason for role change..."
                rows={3}
                className="w-full"
              />
            </div>
          </div>
        </ConfirmDialog>

        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={userDetailsModalOpen}
          onClose={() => setUserDetailsModalOpen(false)}
          userDetails={userDetails}
          loading={loadingUserDetails}
        />
      </div>
    </Layout>
  );
};

export default UserManagementPage;
