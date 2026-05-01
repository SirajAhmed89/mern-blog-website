/**
 * Change Password Form Component
 * Form for changing user password
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { ChangePasswordData } from '../../services/profileService';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordData) => Promise<void>;
  isLoading?: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  isLoading = false,
}: ChangePasswordFormProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordData>();

  const newPassword = watch('newPassword');

  const handleFormSubmit = async (data: ChangePasswordData) => {
    await onSubmit(data);
    reset();
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">
        Change Password
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Current Password */}
        <div className="relative">
          <Input
            label="Current Password"
            type={showPasswords.current ? 'text' : 'password'}
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
            error={errors.currentPassword?.message}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
          >
            {showPasswords.current ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <Input
            label="New Password"
            type={showPasswords.new ? 'text' : 'password'}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  'Password must contain at least one uppercase letter, one lowercase letter, and one number',
              },
            })}
            error={errors.newPassword?.message}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
          >
            {showPasswords.new ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            label="Confirm New Password"
            type={showPasswords.confirm ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === newPassword || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
          >
            {showPasswords.confirm ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-sm font-medium text-neutral-700 mb-2">
            Password Requirements:
          </p>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
}
