import { useState } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../config/api';
import profileService from '../../services/profileService';
import { getImageUrl } from '../../utils/imageUrl';
import { CameraIcon, CalendarIcon, ShieldCheckIcon, EnvelopeIcon, UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

type TabType = 'profile' | 'security';

export default function Profile() {
  const { user, login } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    bio: user?.bio ?? '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put(`/users/${user?._id}`, {
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
      });
      if (res.data.success) {
        const token = localStorage.getItem('token') ?? '';
        await login(token, { ...user!, ...res.data.data?.user });
        toast.success('Profile updated successfully');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please select an image smaller than 5MB.',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file.',
      });
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const avatarUrl = await profileService.uploadAvatar(file);
      const updatedUser = await profileService.updateProfile(user!._id, {
        avatar: avatarUrl,
      });

      const token = localStorage.getItem('token');
      if (token) {
        await login(token, updatedUser);
      }

      toast.success('Avatar updated successfully');
    } catch (error: any) {
      toast.error('Failed to upload avatar', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.newPassword)) {
      toast.error('Password must contain uppercase, lowercase, and number');
      return;
    }
    setIsChangingPassword(true);
    try {
      await api.put(`/auth/change-password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile Information', icon: UserCircleIcon },
    { id: 'security' as TabType, label: 'Security', icon: LockClosedIcon },
  ];

  return (
    <AdminLayout title="My Profile">
      <PageHeader title="My Profile" description="Manage your personal information and account settings" />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200 mb-6">
        <div className="border-b border-neutral-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <form onSubmit={handleProfileSave} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <h2 className="font-semibold text-neutral-900">Profile Information</h2>

              {/* Avatar Section */}
              <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
                <div className="relative">
                  <Avatar
                    src={getImageUrl(user?.avatar)}
                    alt={user?.name ?? ''}
                    size="xl"
                    fallback={user?.name.charAt(0).toUpperCase()}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors shadow-lg ${
                      isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <CameraIcon className="w-4 h-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />
                  </label>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-sm text-neutral-500">@{user?.username}</p>
                  <p className="text-xs text-primary-500 mt-1 capitalize">{user?.role}</p>
                </div>
              </div>

              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                required
              />
              <Input label="Username" value={user?.username} disabled helperText="Username cannot be changed" />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-neutral-500 mt-1">{profile.bio.length}/500 characters</p>
              </div>
              <Button type="submit" size="sm" isLoading={isSaving}>
                Save Changes
              </Button>
            </form>
          </div>

          {/* Right Column - Account Info */}
          <div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Account Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">Account Status</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {user?.isActive ? (
                        <span className="text-success-600">Active</span>
                      ) : (
                        <span className="text-error-600">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">Email Verification</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {user?.isEmailVerified ? (
                        <span className="text-success-600">Verified</span>
                      ) : (
                        <span className="text-warning-600">Not Verified</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">Member Since</p>
                    <p className="text-sm text-neutral-600 mt-1">{user?.createdAt && formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">Last Updated</p>
                    <p className="text-sm text-neutral-600 mt-1">{user?.updatedAt && formatDate(user.updatedAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">Role</p>
                    <p className="text-sm text-neutral-600 mt-1 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-2xl">
          <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Change Password</h2>
            <p className="text-sm text-neutral-600">Update your password to keep your account secure</p>

            <Input
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              helperText="Minimum 8 characters, with uppercase, lowercase, and number"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
              required
            />

            <div className="bg-neutral-50 rounded-lg p-4">
              <p className="text-sm font-medium text-neutral-700 mb-2">Password Requirements:</p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains at least one uppercase letter</li>
                <li>• Contains at least one lowercase letter</li>
                <li>• Contains at least one number</li>
              </ul>
            </div>

            <Button type="submit" size="sm" isLoading={isChangingPassword}>
              Update Password
            </Button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
