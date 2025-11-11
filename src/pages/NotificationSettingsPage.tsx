import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Layout } from '@/components/Layout';
import { Loader2, Bell, Mail, Smartphone } from 'lucide-react';
import { requestPushPermission } from '@/services/pushNotifications';
import { useState } from 'react';

export function NotificationSettingsPage() {
  const { preferences, isLoading, updatePreferences, isUpdating } = useNotificationPreferences();
  const [testingPush, setTestingPush] = useState(false);

  const handleTestPushPermission = async () => {
    setTestingPush(true);
    try {
      console.log('🔔 Manual push permission test started');
      const token = await requestPushPermission();
      if (token) {
        alert('✅ Push notification permission granted! Token registered successfully.');
      } else {
        alert('❌ Push notification permission denied or failed. Check browser console for details.');
      }
    } catch (error) {
      console.error('Push permission test failed:', error);
      alert('❌ Error requesting push permission. Check browser console.');
    } finally {
      setTestingPush(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    );
  }

  if (!preferences) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Failed to load preferences</h3>
            <p className="text-red-600 text-sm mb-4">
              Unable to connect to the notification service. This could mean:
            </p>
            <ul className="list-disc list-inside text-red-600 text-sm space-y-1 mb-4">
              <li>Backend notification API is not available</li>
              <li>Notification endpoints are not implemented yet</li>
              <li>Network connection issue</li>
            </ul>
            <p className="text-red-600 text-sm">
              Check the browser console for more details.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleToggle = (
    section: keyof typeof preferences,
    key: string,
    value: boolean | string
  ) => {
    updatePreferences({
      [section]: {
        ...preferences[section],
        [key]: value,
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Notification Settings</h1>
        <p className="text-gray-600 mb-8">
          Manage how you receive notifications about your recipes and activity
        </p>

        {isUpdating && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-800">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Saving preferences...</span>
          </div>
        )}

        {/* Manual Push Permission Button (for debugging if automatic prompt was dismissed) */}
        {typeof window !== 'undefined' && 
         'Notification' in window && 
         Notification.permission === 'default' && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Enable browser notifications
                </p>
                <p className="text-xs text-blue-700">
                  Get notified even when the app is closed
                </p>
              </div>
            </div>
            <button
              onClick={handleTestPushPermission}
              disabled={testingPush}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingPush ? 'Enabling...' : 'Enable'}
            </button>
          </div>
        )}

        {/* In-App Notifications */}
        <section className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">In-App Notifications</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Notifications that appear in your notification center
          </p>
          <div className="space-y-3">
            <ToggleItem
              label="Recipe Approved"
              description="When your recipe is approved by an admin"
              checked={preferences.webNotifications.recipeApproved}
              onChange={checked => handleToggle('webNotifications', 'recipeApproved', checked)}
            />
            <ToggleItem
              label="Recipe Rejected"
              description="When your recipe is rejected"
              checked={preferences.webNotifications.recipeRejected}
              onChange={checked => handleToggle('webNotifications', 'recipeRejected', checked)}
            />
            <ToggleItem
              label="New Comments"
              description="When someone comments on your recipe"
              checked={preferences.webNotifications.newComment}
              onChange={checked => handleToggle('webNotifications', 'newComment', checked)}
            />
            <ToggleItem
              label="5-Star Ratings"
              description="When someone gives your recipe 5 stars"
              checked={preferences.webNotifications.highRating}
              onChange={checked => handleToggle('webNotifications', 'highRating', checked)}
            />
            {preferences.webNotifications.newSubmission !== undefined && (
              <ToggleItem
                label="New Recipe Submissions (Admin)"
                description="When a chef submits a new recipe for approval"
                checked={preferences.webNotifications.newSubmission}
                onChange={checked => handleToggle('webNotifications', 'newSubmission', checked)}
              />
            )}
          </div>
        </section>

        {/* Push Notifications */}
        <section className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Push Notifications</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Receive browser push notifications even when the app is closed
          </p>
          <ToggleItem
            label="Enable Push Notifications"
            description="Receive browser push notifications"
            checked={preferences.pushNotifications.enabled}
            onChange={checked => handleToggle('pushNotifications', 'enabled', checked)}
          />
          {preferences.pushNotifications.enabled && (
            <div className="ml-6 mt-3 space-y-3 pl-4 border-l-2 border-gray-200">
              <ToggleItem
                label="Recipe Approved"
                checked={preferences.pushNotifications.recipeApproved}
                onChange={checked =>
                  handleToggle('pushNotifications', 'recipeApproved', checked)
                }
              />
              <ToggleItem
                label="Recipe Rejected"
                checked={preferences.pushNotifications.recipeRejected}
                onChange={checked =>
                  handleToggle('pushNotifications', 'recipeRejected', checked)
                }
              />
              <ToggleItem
                label="New Comments"
                checked={preferences.pushNotifications.newComment}
                onChange={checked => handleToggle('pushNotifications', 'newComment', checked)}
              />
              <ToggleItem
                label="5-Star Ratings"
                checked={preferences.pushNotifications.highRating}
                onChange={checked => handleToggle('pushNotifications', 'highRating', checked)}
              />
              {preferences.pushNotifications.newSubmission !== undefined && (
                <ToggleItem
                  label="New Recipe Submissions (Admin)"
                  checked={preferences.pushNotifications.newSubmission}
                  onChange={checked =>
                    handleToggle('pushNotifications', 'newSubmission', checked)
                  }
                />
              )}
            </div>
          )}
        </section>

        {/* Email Notifications */}
        <section className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Receive notifications via email for important updates
          </p>
          <ToggleItem
            label="Enable Email Notifications"
            description="Receive notifications via email"
            checked={preferences.emailNotifications.enabled}
            onChange={checked => handleToggle('emailNotifications', 'enabled', checked)}
          />
          {preferences.emailNotifications.enabled && (
            <div className="ml-6 mt-3 space-y-4 pl-4 border-l-2 border-gray-200">
              <ToggleItem
                label="Recipe Approved"
                checked={preferences.emailNotifications.recipeApproved}
                onChange={checked =>
                  handleToggle('emailNotifications', 'recipeApproved', checked)
                }
              />
              <ToggleItem
                label="Recipe Rejected"
                checked={preferences.emailNotifications.recipeRejected}
                onChange={checked =>
                  handleToggle('emailNotifications', 'recipeRejected', checked)
                }
              />
              <ToggleItem
                label="New Comments"
                checked={preferences.emailNotifications.newComment}
                onChange={checked => handleToggle('emailNotifications', 'newComment', checked)}
              />

              {/* Digest Frequency */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Email Digest Frequency
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Receive a summary of notifications at regular intervals
                </p>
                <select
                  value={preferences.emailNotifications.digestFrequency}
                  onChange={e =>
                    handleToggle('emailNotifications', 'digestFrequency', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="never">Never (immediate emails only)</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

// Helper component
interface ToggleItemProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleItem({ label, description, checked, onChange }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-600">{description}</div>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
      </label>
    </div>
  );
}
