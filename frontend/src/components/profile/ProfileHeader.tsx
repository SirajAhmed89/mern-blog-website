/**
 * Profile Header Component
 * Displays user avatar, name, and basic info
 */

import { CameraIcon } from '@heroicons/react/24/outline';
import Avatar from '../ui/Avatar';
import { getImageUrl } from '../../utils/imageUrl';
import type { User } from '../../types';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onAvatarChange?: (file: File) => void;
  isUploading?: boolean;
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  onAvatarChange,
  isUploading = false,
}: ProfileHeaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <Avatar
            src={getImageUrl(user.avatar)}
            alt={user.name}
            size="xl"
            fallback={user.name.charAt(0).toUpperCase()}
          />
          
          {isOwnProfile && onAvatarChange && (
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors shadow-lg ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <CameraIcon className="w-4 h-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {user.name}
          </h1>
          <p className="text-neutral-600 mt-1">@{user.username}</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 capitalize">
              {user.role}
            </span>
            
            {user.isEmailVerified && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                ✓ Verified
              </span>
            )}
            
            {!user.isActive && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-error-100 text-error-700">
                Inactive
              </span>
            )}
          </div>

          {user.bio && (
            <p className="text-neutral-600 mt-4 max-w-2xl">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
