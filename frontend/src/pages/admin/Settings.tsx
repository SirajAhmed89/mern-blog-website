import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { settingsService, type SiteSettings } from '../../services/settingsService';

export default function Settings() {
  const { hasPermission } = useAuth();
  const toast = useToast();
  const canSiteSettings = hasPermission('dashboard.settings');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    postsPerPage: 10,
    commentsEnabled: true,
    commentModeration: true,
    allowGuestComments: true,
    newsletterEnabled: true,
    featuresEnabled: {
      search: true,
      categories: true,
      tags: true,
      socialSharing: true,
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
    socialLinks: {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      github: '',
    },
    customCode: {
      headerCode: '',
      footerCode: '',
      customCSS: '',
      customJS: '',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiteSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: keyof SiteSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [field]: value },
    }));
  };

  if (!canSiteSettings) {
    return (
      <AdminLayout title="Settings">
        <PageHeader title="Settings" description="Site configuration and preferences" />
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600">You don't have permission to access site settings.</p>
          <p className="text-sm text-neutral-500 mt-2">Contact a superadmin for access.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout title="Settings">
        <PageHeader title="Settings" description="Manage site configuration and preferences" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <PageHeader title="Settings" description="Manage site configuration and preferences" />

      <div className="max-w-2xl">
        <form onSubmit={handleSiteSave} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-neutral-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <Input
                label="Site Name"
                value={settings.siteName}
                onChange={(e) => updateField('siteName', e.target.value)}
                helperText="The name of your blog"
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => updateField('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="A brief description of your blog"
                />
                <p className="text-xs text-neutral-500">This will appear in search results and social media</p>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Content Settings</h2>
            <div className="space-y-4">
              <Input
                label="Posts Per Page"
                type="number"
                min="1"
                max="100"
                value={settings.postsPerPage.toString()}
                onChange={(e) => updateField('postsPerPage', parseInt(e.target.value) || 10)}
                helperText="Number of posts to display per page"
              />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Feature Toggles</h2>
            <div className="space-y-3">
              {[
                {
                  key: 'commentsEnabled',
                  label: 'Enable Comments',
                  desc: 'Allow users to comment on posts',
                },
                {
                  key: 'commentModeration',
                  label: 'Comment Moderation',
                  desc: 'Require approval before comments are published',
                },
                {
                  key: 'allowGuestComments',
                  label: 'Allow Guest Comments',
                  desc: 'Let non-registered users comment',
                },
                {
                  key: 'newsletterEnabled',
                  label: 'Enable Newsletter',
                  desc: 'Allow users to subscribe to newsletter',
                },
              ].map((item) => (
                <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof SiteSettings] as boolean}
                    onChange={(e) => updateField(item.key as keyof SiteSettings, e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Social Media Links</h2>
            <div className="space-y-4">
              {[
                { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourhandle' },
                { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
                { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
                { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
                { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourusername' },
              ].map((item) => (
                <Input
                  key={item.key}
                  label={item.label}
                  type="url"
                  value={settings.socialLinks[item.key as keyof typeof settings.socialLinks]}
                  onChange={(e) => updateNestedField('socialLinks', item.key, e.target.value)}
                  placeholder={item.placeholder}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <Button type="submit" size="sm" isLoading={isSaving}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
