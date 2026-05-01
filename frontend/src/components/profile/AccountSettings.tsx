/**
 * Account Settings Component
 * Displays account information and settings
 */

import { CalendarIcon, ShieldCheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import type { User } from '../../types';

interface AccountSettingsProps {
  user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">
        Account Settings
      </h2>

      <div className="space-y-4">
        {/* Account Status */}
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700">Account Status</p>
            <p className="text-sm text-neutral-600 mt-1">
              {user.isActive ? (
                <span className="text-success-600">Active</span>
              ) : (
                <span className="text-error-600">Inactive</span>
              )}
            </p>
          </div>
        </div>

        {/* Email Verification */}
        <div className="flex items-start gap-3">
          <EnvelopeIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700">Email Verification</p>
            <p className="text-sm text-neutral-600 mt-1">
              {user.isEmailVerified ? (
                <span className="text-success-600">Verified</span>
              ) : (
                <span className="text-warning-600">Not Verified</span>
              )}
            </p>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-start gap-3">
          <CalendarIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700">Member Since</p>
            <p className="text-sm text-neutral-600 mt-1">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-start gap-3">
          <CalendarIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700">Last Updated</p>
            <p className="text-sm text-neutral-600 mt-1">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700">Role</p>
            <p className="text-sm text-neutral-600 mt-1 capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
