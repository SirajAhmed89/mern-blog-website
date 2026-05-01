import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { settingsService } from '../../services/settingsService';

export default function CodeInjection() {
  const { hasPermission } = useAuth();
  const toast = useToast();
  const canManageCode = hasPermission('dashboard.settings');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'css' | 'js'>('header');
  const [customCode, setCustomCode] = useState({
    headerCode: '',
    footerCode: '',
    customCSS: '',
    customJS: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      if (data.customCode) {
        setCustomCode(data.customCode);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateSettings({ customCode });
      toast.success('Code injection settings saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateCode = (field: keyof typeof customCode, value: string) => {
    setCustomCode((prev) => ({ ...prev, [field]: value }));
  };

  if (!canManageCode) {
    return (
      <AdminLayout title="Code Injection">
        <PageHeader title="Code Injection" description="Custom code snippets" />
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600">You don't have permission to manage code injection.</p>
          <p className="text-sm text-neutral-500 mt-2">Contact a superadmin for access.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout title="Code Injection">
        <PageHeader title="Code Injection" description="Custom code snippets" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'header' as const, label: 'Header Code', desc: 'Injected in <head> section' },
    { id: 'footer' as const, label: 'Footer Code', desc: 'Injected before </body>' },
    { id: 'css' as const, label: 'Custom CSS', desc: 'Global stylesheet' },
    { id: 'js' as const, label: 'Custom JS', desc: 'Global JavaScript' },
  ];

  const codeFields = {
    header: { field: 'headerCode' as const, placeholder: '<!-- Google Analytics, Meta Tags, etc. -->\n<script>\n  // Your code here\n</script>' },
    footer: { field: 'footerCode' as const, placeholder: '<!-- Chat widgets, Analytics, etc. -->\n<script>\n  // Your code here\n</script>' },
    css: { field: 'customCSS' as const, placeholder: '/* Custom styles */\n.my-class {\n  color: #333;\n}' },
    js: { field: 'customJS' as const, placeholder: '// Custom JavaScript\nconsole.log("Custom JS loaded");' },
  };

  return (
    <AdminLayout title="Code Injection">
      <PageHeader 
        title="Code Injection" 
        description="Add custom code snippets to your site (Analytics, Meta Tags, Custom Styles, etc.)"
      />

      <div className="max-w-5xl">
        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-warning-900">Caution: Advanced Feature</p>
              <p className="text-sm text-warning-700 mt-1">
                Only add code from trusted sources. Malicious code can compromise your site's security and functionality.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-neutral-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs font-normal text-neutral-500 mt-0.5">{tab.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-neutral-700">
                  {tabs.find(t => t.id === activeTab)?.label}
                </label>
                <span className="text-xs text-neutral-500">
                  {customCode[codeFields[activeTab].field].length} characters
                </span>
              </div>
              <textarea
                value={customCode[codeFields[activeTab].field]}
                onChange={(e) => updateCode(codeFields[activeTab].field, e.target.value)}
                rows={16}
                className="w-full px-4 py-3 text-sm font-mono border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-neutral-50"
                placeholder={codeFields[activeTab].placeholder}
                spellCheck={false}
              />
              <p className="text-xs text-neutral-500">
                {activeTab === 'header' && 'Code will be injected in the <head> section of every page.'}
                {activeTab === 'footer' && 'Code will be injected before the closing </body> tag.'}
                {activeTab === 'css' && 'Styles will be applied globally across all pages.'}
                {activeTab === 'js' && 'JavaScript will execute on every page load.'}
              </p>
            </div>

            {/* Use Cases */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm font-medium text-neutral-900 mb-2">Common Use Cases:</p>
              <ul className="text-sm text-neutral-600 space-y-1">
                {activeTab === 'header' && (
                  <>
                    <li>• Google Analytics / Google Tag Manager</li>
                    <li>• Facebook Pixel / Meta Tags</li>
                    <li>• SEO verification codes (Google, Bing)</li>
                    <li>• Custom meta tags and Open Graph tags</li>
                  </>
                )}
                {activeTab === 'footer' && (
                  <>
                    <li>• Live chat widgets (Intercom, Drift, Crisp)</li>
                    <li>• Heatmap tools (Hotjar, Crazy Egg)</li>
                    <li>• Cookie consent banners</li>
                    <li>• Third-party scripts that don't need early loading</li>
                  </>
                )}
                {activeTab === 'css' && (
                  <>
                    <li>• Brand-specific color overrides</li>
                    <li>• Custom font imports (@font-face)</li>
                    <li>• Layout adjustments and responsive tweaks</li>
                    <li>• Animation and transition effects</li>
                  </>
                )}
                {activeTab === 'js' && (
                  <>
                    <li>• Custom event tracking</li>
                    <li>• Dynamic content modifications</li>
                    <li>• Third-party API integrations</li>
                    <li>• Custom user interactions and behaviors</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-neutral-200 px-6 py-4 bg-neutral-50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">
                Changes will apply to all public pages immediately after saving.
              </p>
              <Button type="submit" size="sm" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
