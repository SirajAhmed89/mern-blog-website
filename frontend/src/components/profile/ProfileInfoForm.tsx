/**
 * Profile Info Form Component
 * Form for editing user profile information
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { User } from '../../types';
import type { UpdateProfileData } from '../../services/profileService';

interface ProfileInfoFormProps {
  user: User;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileInfoForm({
  user,
  onSubmit,
  isLoading = false,
}: ProfileInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileData>({
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || '',
    },
  });

  const handleFormSubmit = async (data: UpdateProfileData) => {
    await onSubmit(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">
          Profile Information
        </h2>
        
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name */}
        <Input
          label="Full Name"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={errors.name?.message}
          disabled={!isEditing || isLoading}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
          disabled={!isEditing || isLoading}
        />

        {/* Username (Read-only) */}
        <Input
          label="Username"
          value={user.username}
          disabled
          helperText="Username cannot be changed"
        />

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Bio
          </label>
          <textarea
            {...register('bio', {
              maxLength: {
                value: 500,
                message: 'Bio must be less than 500 characters',
              },
            })}
            rows={4}
            disabled={!isEditing || isLoading}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              !isEditing || isLoading
                ? 'bg-neutral-50 text-neutral-500 cursor-not-allowed'
                : 'bg-white text-neutral-900'
            } ${errors.bio ? 'border-error-500' : 'border-neutral-300'}`}
            placeholder="Tell us about yourself..."
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-error-500">{errors.bio.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={!isDirty || isLoading}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
