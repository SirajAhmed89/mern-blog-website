/**
 * Profile Page
 * User profile view and edit page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import profileService from '../services/profileService';
import type { UpdateProfileData, ChangePasswordData } from '../services/profileService';
import {
  ProfileHeader,
  ProfileInfoForm,
  ChangePasswordForm,
  AccountSettings,
} from '../components/profile';
import Button from '../components/ui/Button';

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    try {
      setIsLoadingProfile(true);
      const updatedUser = await profileService.updateProfile(user._id, data);

      // Update local storage and context
      const token = localStorage.getItem('token');
      if (token) {
        await login(token, updatedUser);
      }

      toast.success('Profile updated successfully', {
        description: 'Your profile information has been updated.',
      });
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangePassword = async (data: ChangePasswordData) => {
    try {
      setIsLoadingPassword(true);
      await profileService.changePassword(data);

      toast.success('Password changed successfully', {
        description: 'Your password has been updated.',
      });
    } catch (error: any) {
      toast.error('Failed to change password', {
        description: error.response?.data?.message || 'Please check your current password.',
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    try {
      setIsUploadingAvatar(true);

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please select an image smaller than 5MB.',
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please select an image file.',
        });
        return;
      }

      const avatarUrl = await profileService.uploadAvatar(file);
      const updatedUser = await profileService.updateProfile(user._id, {
        avatar: avatarUrl,
      });

      // Update local storage and context
      const token = localStorage.getItem('token');
      if (token) {
        await login(token, updatedUser);
      }

      toast.success('Avatar updated successfully', {
        description: 'Your profile picture has been updated.',
      });
    } catch (error: any) {
      toast.error('Failed to upload avatar', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
          <p className="text-neutral-600 mt-2">
            Manage your profile information and account settings
          </p>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader
            user={user}
            isOwnProfile={true}
            onAvatarChange={handleAvatarChange}
            isUploading={isUploadingAvatar}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info & Password */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileInfoForm
                user={user}
                onSubmit={handleUpdateProfile}
                isLoading={isLoadingProfile}
              />

              <ChangePasswordForm
                onSubmit={handleChangePassword}
                isLoading={isLoadingPassword}
              />
            </div>

            {/* Right Column - Account Settings */}
            <div className="lg:col-span-1">
              <AccountSettings user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
