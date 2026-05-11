import { useState, useEffect } from 'react';
import type { JSX, ReactNode } from 'react';
import {
  useGetCredentialsQuery,
  useUpdateCredentialMutation,
  usePostUsageMutation,
  useGetUsageQuery,
  useGetUsageSummaryQuery,
  useUpdateStatusMutation,
  useTestConnectionMutation,
  useSyncIntegrationMutation,
  useRevealCredentialMutation,
} from '@/redux/features/IntegrationApi/integrationApi';
import { toast } from 'react-hot-toast';


import {
  IntegrationProvider,
  type IntegrationCredential,
} from '@/redux/features/IntegrationApi/integration.types';

// Interfaces (keeping existing ones)
interface PasswordVisibility {
  [key: string]: boolean;
}

// Templates and Template interfaces 
export interface IntegrationTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  keyLabel?: string;
  fields?: string;
  provider?: IntegrationProvider;
}

// Integration Templates
const INTEGRATION_TEMPLATES: IntegrationTemplate[] = [
  { id: 'openai', name: 'OpenAI', icon: 'AI', color: '#10a37f', description: 'GPT-4 Turbo & Advanced AI models', provider: IntegrationProvider.OPENAI, fields: 'api_key,model_name,organization_id' },
  { id: 'grok', name: 'Grok', icon: '⚡', color: '#000000', description: 'xAI Real-time information', provider: IntegrationProvider.GROK, fields: 'api_key,model_name' },
  { id: 'cloudinary', name: 'Cloudinary', icon: '☁️', color: '#3448c5', description: 'Image & Video management', provider: IntegrationProvider.CLOUDINARY, fields: 'cloud_name,api_key,api_secret' },
  { id: 'lemonsqueezy', name: 'Lemon Squeezy', icon: '🍋', color: '#ffe066', description: 'Payments & Subscriptions', provider: IntegrationProvider.LEMONSQUEEZY, fields: 'api_key,store_id,webhook_secret,variant_id' },
  { id: 'gemini', name: 'Gemini', icon: '✨', color: '#1a73e8', description: 'Google DeepMind AI Models', provider: IntegrationProvider.GEMINI, fields: 'api_key,model_name' },
  { id: 'stripe', name: 'Stripe', icon: '💳', color: '#635bff', description: 'Payment processing', provider: IntegrationProvider.STRIPE, fields: 'secret_key,publishable_key,webhook_secret' },
  // { id: 'openrouter', name: 'OpenRouter', icon: 'OP', color: '#6b46c1', description: 'Universal AI provider gateway', provider: IntegrationProvider.OPENROUTER },
  // { id: 'mailjet', name: 'Mailjet', icon: 'MJ', color: '#ffc800', description: 'Newsletter & Transactional email', provider: IntegrationProvider.MAILJET },
  // { id: 'google', name: 'Google Translation', icon: '🌐', color: '#4285f4', description: 'Cloud Translation v3 API', provider: IntegrationProvider.GOOGLE_TRANSLATION },
  // { id: 'azure', name: 'Azure EU API', icon: 'AZ', color: '#0078d4', description: 'Admin DB/Server infrastructure', provider: IntegrationProvider.AZURE_EU },
  // { id: 'neon', name: 'Neon Database', icon: 'N', color: '#00e599', description: 'Serverless Postgres Database', provider: IntegrationProvider.NEON_DB },

  // { id: 'resend', name: 'Resend', icon: '📧', color: '#000000', description: 'Email delivery API', keyLabel: 'API Key', fields: 'From Email' },
  // { id: 'posthog', name: 'PostHog', icon: '📊', color: '#1d4aff', description: 'Product analytics', keyLabel: 'API Key', fields: 'Project ID' },
  // { id: 'sentry', name: 'Sentry', icon: '🐛', color: '#362d59', description: 'Error tracking', keyLabel: 'DSN', fields: 'Organization Slug, Project Name' },
  // { id: 'vercel', name: 'Vercel', icon: '▲', color: '#000000', description: 'Deployment platform', keyLabel: 'API Token', fields: 'Team ID' },
  // { id: 'slack', name: 'Slack', icon: '💬', color: '#4a154b', description: 'Team communication', keyLabel: 'Webhook URL', fields: 'Channel Name' }
];

interface PasswordFieldProps {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
  onChange?: (value: string) => void;
}

interface UsageStatsItem {
  value: string;
  label: string;
  isSuccess?: boolean;
}

interface UsageStatsProps {
  stats: {
    title?: string;
    items: UsageStatsItem[];
  };
}

interface LogoConfig {
  bg: string;
  color: string;
  icon: string;
  size?: string;
  weight?: string;
}

interface IntegrationCardProps {
  logo: LogoConfig;
  name: string;
  status: string;
  isActive: boolean;
  children: ReactNode;
  onTest?: () => void;
  onView?: () => void;
  onSync?: () => void;
  onToggleStatus?: (isActive: boolean) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}



// Type for credential data
interface CredentialData {
  apiKey?: string;
  organizationId?: string;
  model?: string;
  projectId?: string;
  cloudName?: string;
  apiSecret?: string;
  connectionString?: string;
  listId?: string;
  storeId?: string;
  productId?: string;
  webhookSecret?: string;
  webhookUrl?: string;
  [key: string]: string | undefined;
}


// Mapping UI providers to API providers
const providerMapping: Record<string, IntegrationProvider> = {
  openai: IntegrationProvider.OPENAI,
  grok: IntegrationProvider.GROK,
  cloudinary: IntegrationProvider.CLOUDINARY,
  lemonsqueezy: IntegrationProvider.LEMONSQUEEZY,
  gemini: IntegrationProvider.GEMINI,
  stripe: IntegrationProvider.STRIPE,
  openrouter: IntegrationProvider.OPENROUTER,
  mailjet: IntegrationProvider.MAILJET,
  google: IntegrationProvider.GOOGLE_TRANSLATION,
  azure: IntegrationProvider.AZURE_EU,
  neon: IntegrationProvider.NEON_DB,
};

const providerUIConfigs: Record<IntegrationProvider, { name: string; icon: string; bg: string; color: string; description: string }> = {
  [IntegrationProvider.OPENAI]: {
    name: "OpenAI",
    icon: "AI",
    bg: "#10a37f",
    color: "white",
    description: "GPT-4 Turbo & Advanced AI models"
  },
  [IntegrationProvider.GROK]: {
    name: "Grok",
    icon: "⚡",
    bg: "#000000",
    color: "white",
    description: "xAI Real-time information"
  },
  [IntegrationProvider.CLOUDINARY]: {
    name: "Cloudinary",
    icon: "☁️",
    bg: "#3448c5",
    color: "white",
    description: "Image & Video management"
  },
  [IntegrationProvider.LEMONSQUEEZY]: {
    name: "Lemon Squeezy",
    icon: "🍋",
    bg: "#ffe066",
    color: "#000000",
    description: "Payments & Subscriptions"
  },
  [IntegrationProvider.OPENROUTER]: {
    name: "OpenRouter",
    icon: "OP",
    bg: "#6b46c1",
    color: "white",
    description: "Universal AI provider gateway"
  },
  [IntegrationProvider.MAILJET]: {
    name: "Mailjet",
    icon: "MJ",
    bg: "#ffc800",
    color: "#000000",
    description: "Newsletter & Transactional email"
  },
  [IntegrationProvider.GOOGLE_TRANSLATION]: {
    name: "Google Translation",
    icon: "🌐",
    bg: "#4285f4",
    color: "white",
    description: "Cloud Translation v3 API"
  },
  [IntegrationProvider.AZURE_EU]: {
    name: "Azure EU API",
    icon: "AZ",
    bg: "#0078d4",
    color: "white",
    description: "Admin DB/Server infrastructure"
  },
  [IntegrationProvider.NEON_DB]: {
    name: "Neon Database",
    icon: "N",
    bg: "#00e599",
    color: "#000000",
    description: "Serverless Postgres Database"
  },
  [IntegrationProvider.GEMINI]: {
    name: "Gemini",
    icon: "✨",
    bg: "#1a73e8",
    color: "white",
    description: "Google DeepMind AI Models"
  },
  [IntegrationProvider.STRIPE]: {
    name: "Stripe",
    icon: "💳",
    bg: "#635bff",
    color: "white",
    description: "Payment processing"
  },
};

// Main Component
function APIIntegrations(): JSX.Element {
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string | null>(null);

  // New Integration Form State
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    icon: '🔌',
    color: '#3b82f6',
    description: '',
    keyLabel: 'API Key',
    fields: '',
    provider: undefined as IntegrationProvider | undefined,
  });

  const [newIntegrationCredentials, setNewIntegrationCredentials] = useState<Record<string, string>>({});
  const [newIntegrationPasswordVisibility, setNewIntegrationPasswordVisibility] = useState<Record<string, boolean>>({});

  // Local state for form inputs
  const [credentials, setCredentials] = useState<Record<string, CredentialData>>({});
  const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({});

  // API Hooks
  const { data: credentialsData, isLoading: isLoadingCredentials, refetch: refetchCredentials } = useGetCredentialsQuery();
  const { data: usageSummaryData } = useGetUsageSummaryQuery();
  const { data: usageData } = useGetUsageQuery();
  const [updateCredential, { isLoading: isUpdating }] = useUpdateCredentialMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [testConnectionMutation] = useTestConnectionMutation();
  const [syncIntegration] = useSyncIntegrationMutation();
  const [postUsage] = usePostUsageMutation();
  const [revealCredential, { isLoading: isRevealing }] = useRevealCredentialMutation();

  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [revealTarget, setRevealTarget] = useState<{ provider: string, fieldId: string } | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);



  // Initialize credentials from API
  useEffect(() => {
    if (credentialsData?.data) {
      const initialCredentials: Record<string, CredentialData> = {};
      credentialsData.data.forEach((cred: IntegrationCredential) => {
        const providerKey = Object.keys(providerMapping).find(
          key => providerMapping[key] === cred.provider
        );
        if (providerKey) {
          const template = INTEGRATION_TEMPLATES.find(t => t.provider === cred.provider);
          const templateFields = template?.fields?.split(',').map(f => f.trim()) || [];
          
          const mergedCreds = { ...(cred.maskedCredentials as any) };
          
          // Robust casing/alias mapping to unify backend and frontend names
          const casingMap: Record<string, string> = {
            'apiKey': 'api_key',
            'model': 'model_name',
            'modelName': 'model_name',
            'organizationId': 'organization_id',
            'secretKey': 'secret_key',
            'publishableKey': 'publishable_key',
            'webhookSecret': 'webhook_secret',
            'storeId': 'store_id',
            'variantId': 'variant_id',
            'cloudName': 'cloud_name',
            'apiSecret': 'api_secret'
          };

          Object.entries(casingMap).forEach(([backendKey, frontendKey]) => {
            if (mergedCreds[backendKey] !== undefined && templateFields.includes(frontendKey)) {
              mergedCreds[frontendKey] = mergedCreds[backendKey];
              delete mergedCreds[backendKey];
            }
          });

          // Ensure all template fields exist in state, even if empty
          templateFields.forEach(field => {
            if (mergedCreds[field] === undefined) {
              mergedCreds[field] = '';
            }
          });
          initialCredentials[providerKey] = mergedCreds as CredentialData;
        }
      });
      setCredentials(initialCredentials);
    }
  }, [credentialsData]);

  function togglePassword(fieldId: string): void {
    const firstDash = fieldId.indexOf('-');
    const providerStr = fieldId.substring(0, firstDash);
    const field = fieldId.substring(firstDash + 1);
    const providerKey = Object.keys(providerMapping).find(
      key => providerMapping[key] === providerStr
    ) || providerStr.toLowerCase();

    const currentValue = credentials[providerKey]?.[field] || '';
    if (currentValue.includes('***') && !passwordVisibility[fieldId]) {
      setRevealTarget({ provider: providerKey, fieldId });
      setRevealModalOpen(true);
      return;
    }

    setPasswordVisibility(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  }

  async function handleRevealSubmit() {
    if (!revealTarget || !adminPassword) return;
    try {
      const provider = providerMapping[revealTarget.provider];
      const res = await revealCredential({ provider, body: { password: adminPassword } }).unwrap();
      
      setCredentials(prev => ({
        ...prev,
        [revealTarget.provider]: {
          ...prev[revealTarget.provider],
          ...res.data
        }
      }));
      
      setPasswordVisibility(prev => ({
        ...prev,
        [revealTarget.fieldId]: true
      }));
      
      toast.success('Credentials revealed successfully');
      setRevealModalOpen(false);
      setAdminPassword('');
      setRevealTarget(null);
      setShowAdminPassword(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reveal credentials. Incorrect password?');
    }
  }

  function copyToClipboard(fieldId: string): void {
    const field = document.getElementById(fieldId) as HTMLInputElement | null;
    if (field) {
      navigator.clipboard.writeText(field.value);
      toast.success('Copied to clipboard!');
    }
  }

  async function handleTestConnection(service: string): Promise<void> {
    const provider = providerMapping[service];
    if (!provider) return;

    try {
      const response = await testConnectionMutation(provider).unwrap();
      toast.success(`${service} connection test successful!\n${response.message || 'The service is responding correctly.'}`);

      // Also post a usage record to log this test if needed
      await postUsage({
        provider,
        operation: 'test_connection',
        requestCount: 1,
        inputUnits: 0,
        outputUnits: 0,
        totalUnits: 0,
        costUsd: 0,
        recordedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      toast.error(`Connection test failed for ${service}\n${error?.data?.message || 'Please check your credentials.'}`);
    }
  }


  async function handleToggleStatus(service: string, currentStatus: boolean): Promise<void> {
    const provider = providerMapping[service];
    if (!provider) return;

    const newStatus = !currentStatus;
    try {
      await updateStatus({
        provider,
        isActive: newStatus,
      }).unwrap();
    } catch (error: any) {
      toast.error(`Failed to ${newStatus ? 'enable' : 'disable'} ${service}`);
      console.error(error);
    }
  }

  async function handleSync(service: string): Promise<void> {
    const provider = providerMapping[service];
    if (!provider) return;

    try {
      await syncIntegration(provider).unwrap();
      toast.success(`${service} data synchronized successfully!`);
    } catch (error: any) {
      toast.error(`Failed to sync ${service} data`);
      console.error(error);
    }
  }


  function viewUsage(service: string): void {
    const provider = providerMapping[service];
    const providerBreakdown = usageSummaryData?.data?.breakdown.find(b => b.provider === provider);

    if (providerBreakdown) {
      toast.success(`${service} Usage Statistics:\nTotal Requests: ${providerBreakdown.requestCount}\nTotal Cost: $${providerBreakdown.totalCostUsd.toFixed(2)}`);
    } else {
      toast.error(`No usage data available for ${service}`);
    }
  }


  function handleCredentialChange(service: string, field: string, value: string): void {
    setCredentials({
      ...credentials,
      [service]: {
        ...credentials[service],
        [field]: value,
      },
    });
    setHasChanges({ ...hasChanges, [service]: true });
  }

  const handleCreateIntegration = async () => {
    if (!newIntegration.name) return;
    
    // Check if integration already exists
    const exists = credentialsData?.data?.some(cred => {
      const config = providerUIConfigs[cred.provider];
      return config && config.name.toLowerCase() === newIntegration.name.toLowerCase();
    });

    if (exists) {
      toast.error(`${newIntegration.name} Integration already exists!`);
      return;
    }

    const provider = newIntegration.provider;
    if (!provider) {
      toast.error('Please select a provider template');
      return;
    }

    try {
      const response = await updateCredential({
        provider,
        body: {
          credentials: newIntegrationCredentials,
        },
      }).unwrap();

      toast.success(response.message || `Integration "${newIntegration.name}" added successfully!`);
      setIsModalOpen(false);
      setNewIntegration({
        name: '',
        icon: '🔌',
        color: '#3b82f6',
        description: '',
        keyLabel: 'API Key',
        fields: '',
        provider: undefined,
      });
      setNewIntegrationCredentials({});
      refetchCredentials();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to add ${newIntegration.name} integration`);
      console.error(error);
    }
  };

  const selectTemplate = (template: IntegrationTemplate) => {
    setNewIntegration({
      name: template.name,
      icon: template.icon,
      color: template.color,
      description: template.description,
      keyLabel: template.keyLabel || 'API Key',
      fields: template.fields || '',
      provider: template.provider,
    });
    
    // Initialize credentials for the new integration
    const fields = template.fields?.split(',') || [];
    const initialCreds: Record<string, string> = {};
    const initialVisibility: Record<string, boolean> = {};
    fields.forEach(f => {
      const field = f.trim();
      initialCreds[field] = '';
      initialVisibility[field] = false;
    });
    setNewIntegrationCredentials(initialCreds);
    setNewIntegrationPasswordVisibility(initialVisibility);
  };

  async function handleUpdateCredential(service: string): Promise<void> {
    const provider = providerMapping[service];
    const credentialData = credentials[service];

    if (!provider || !credentialData) {
      toast.error('Invalid integration data');
      return;
    }

    // Filter out masked values to avoid sending "********" to the server
    const filteredCredentials: Record<string, string> = {};
    Object.entries(credentialData).forEach(([key, value]) => {
      if (value && !String(value).includes('***')) {
        filteredCredentials[key] = value;
      }
    });

    if (Object.keys(filteredCredentials).length === 0) {
      toast.error('No changes detected to rotate');
      return;
    }

    setCurrentProvider(service);
    try {
      const response = await updateCredential({
        provider,
        body: {
          credentials: filteredCredentials,
        },
      }).unwrap();

      toast.success(response.message || `${service} integration settings saved successfully!`);
      setHasChanges({ ...hasChanges, [service]: false });
      refetchCredentials();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to save ${service} integration settings`);
      console.error(error);
    } finally {
      setCurrentProvider(null);
    }
  }


  function PasswordField({ id, value, label, sublabel, onChange }: PasswordFieldProps): JSX.Element {
    return (
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {label}
          <span className="text-red-600 dark:text-red-400 ml-1">*</span>
          {sublabel && (
            <span className="block text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">
              {sublabel}
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type={passwordVisibility[id] ? 'text' : 'password'}
            className="w-full px-4 py-3 pr-[120px] border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 dark:focus:ring-blue-400/5 transition-all outline-none"
            id={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={() => togglePassword(id)}
              className="px-3 py-1.5 text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors font-medium"
            >
              {passwordVisibility[id] ? '🙈 Hide' : '👁️ Show'}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(id)}
              className="px-3 py-1.5 text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors font-medium"
            >
              📋
            </button>
          </div>
        </div>
      </div>
    );
  }


  function UsageStats({ stats }: UsageStatsProps): JSX.Element {
    return (
      <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl mt-4 border border-gray-100 dark:border-gray-800">
        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-[0.08em]">
          {stats.title || 'Usage This Month'}
        </div>
        <div className={`grid ${stats.items.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-6`}>
          {stats.items.map((item: UsageStatsItem, index: number) => (
            <div key={index}>
              <div className={`text-2xl font-bold font-['Fraunces'] ${item.isSuccess ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {item.value}
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  function IntegrationCard({ logo, name, status, isActive, children, onTest, onView, onSync, onToggleStatus, onSave, onCancel, isSaving, hasChanges }: IntegrationCardProps): JSX.Element {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 mb-6 shadow-sm shadow-black/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-white/10"
              style={{
                background: logo.bg,
                color: logo.color,
                fontSize: logo.size || '28px',
                fontWeight: logo.weight || '700'
              }}
            >
              {logo.icon}
            </div>
            <div>
              <div className="text-xl font-bold font-['Fraunces'] text-gray-900 dark:text-white flex items-center gap-3">
                {name}
                <button
                  type="button"
                  onClick={() => onToggleStatus?.(isActive)}
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
              <div className="text-[13px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                {isActive ? 'Connected' : 'Disconnected'} • {status}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onTest && (
              <button
                type="button"
                onClick={onTest}
                className="px-4 py-2 text-[13px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all font-bold flex items-center gap-2 shadow-sm"
              >
                🧪 Test Connection
              </button>
            )}
            {onView && (
              <button
                type="button"
                onClick={onView}
                className="px-4 py-2 text-[13px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all font-bold flex items-center gap-2 shadow-sm"
              >
                📊 View Usage
              </button>
            )}
            {onSync && (
              <button
                type="button"
                onClick={onSync}
                className="px-4 py-2 text-[13px] bg-white dark:bg-gray-800 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all font-bold flex items-center gap-2 shadow-sm shadow-blue-500/5"
              >
                🔄 Sync Subscriptions
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {children}
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={!hasChanges}
            className="px-6 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!hasChanges || isSaving}
            className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : (status === 'Active' ? '🔄 Rotate Credentials' : '💾 Save Changes')}
          </button>
        </div>
      </div>
    );
  }


  // Calculate stats from API data
  const activeIntegrations = credentialsData?.data?.filter((c: IntegrationCredential) => c.isActive).length || 0;
  const totalIntegrations = credentialsData?.data?.length || 0;
  const totalApiCalls = usageSummaryData?.data?.totals.totalRequests || 0;
  const totalCost = usageSummaryData?.data?.totals.totalCostUsd || 0;

  if (isLoadingCredentials) {
    return (
      <section id="page-api-integrations" className="block">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600 dark:text-gray-400">Loading integrations...</div>
        </div>
      </section>
    );
  }


  return (
    <section id="page-api-integrations" className="block">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <h1 className="font-['Fraunces'] text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            API Integrations
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Manage third-party service connections, API keys, and monitor usage
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-xl">➕</span> Add New Integration
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Active Integrations</div>
          <div className="text-3xl font-bold font-['Fraunces'] text-gray-900 dark:text-white mb-2">
            {isLoadingCredentials ? '...' : `${activeIntegrations} / ${totalIntegrations}`}
          </div>
          <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 px-2 py-1 rounded inline-block">
            {activeIntegrations === totalIntegrations ? '✓ All services connected' : `${totalIntegrations - activeIntegrations} inactive`}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">API Calls (30 days)</div>
          <div className="text-3xl font-bold font-['Fraunces'] text-gray-900 dark:text-white mb-2">
            {totalApiCalls >= 1000 ? `${(totalApiCalls / 1000).toFixed(1)}K` : totalApiCalls}
          </div>
          <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 px-2 py-1 rounded inline-block">
            ↑ 12.3K from last month
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Success Rate</div>
          <div className="text-3xl font-bold font-['Fraunces'] text-gray-900 dark:text-white mb-2">99.9%</div>
          <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 px-2 py-1 rounded inline-block">
            ↑ 0.2% improvement
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Total API Cost</div>
          <div className="text-3xl font-bold font-['Fraunces'] text-gray-900 dark:text-white mb-2">${totalCost.toFixed(2)}</div>
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-400/10 px-2 py-1 rounded inline-block">
            Current billing cycle
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="space-y-8 mb-10">
        {credentialsData?.data?.length === 0 && !isLoadingCredentials && (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl">
            <div className="text-4xl mb-4">🔌</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Integrations Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Click "Add New Integration" to get started.</p>
          </div>
        )}
        {credentialsData?.data?.map((cred: IntegrationCredential) => {
          const config = providerUIConfigs[cred.provider];
          const providerType = cred.provider;
          const providerKey = Object.keys(providerMapping).find(
            key => providerMapping[key] === cred.provider
          ) || cred.provider.toLowerCase();

          if (!config) return null;

          return (
            <IntegrationCard
              key={cred.provider}
              logo={{ bg: config.bg, color: config.color, icon: config.icon }}
              name={config.name}
              status={cred.configured ? 'Active' : 'Not Configured'}
              isActive={cred.isActive}
              onTest={() => handleTestConnection(providerKey)}
              onView={() => viewUsage(providerKey)}
              onSync={cred.provider === IntegrationProvider.LEMONSQUEEZY ? () => handleSync(cred.provider) : undefined}
              onToggleStatus={() => handleToggleStatus(providerKey, cred.isActive)}

              onSave={() => handleUpdateCredential(providerKey)}
              onCancel={() => {
                const original = credentialsData?.data?.find(c => c.provider === providerType);
                if (original) {
                  setCredentials(prev => ({ ...prev, [providerKey]: original.maskedCredentials as CredentialData }));
                  setHasChanges(prev => ({ ...prev, [providerKey]: false }));
                }
              }}
              isSaving={isUpdating && currentProvider === providerKey}
              hasChanges={hasChanges[providerKey]}
            >
              <div className="grid gap-2">
                {(() => {
                  const template = INTEGRATION_TEMPLATES.find(t => t.provider === cred.provider);
                  const templateFields = template?.fields?.split(',').map(f => f.trim()) || [];
                  
                  // Strictly follow template fields if available to avoid extra/duplicate fields
                  // If no template, fallback to backend fieldNames
                  const allFields = templateFields.length > 0 ? templateFields : (cred.fieldNames || []);
                  
                  return allFields.map((field: string) => (
                    <PasswordField
                      key={`${cred.provider}-${field}`}
                      id={`${cred.provider}-${field}`}
                      value={credentials[providerKey]?.[field] || ''}
                      label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      onChange={(value) => handleCredentialChange(providerKey, field, value)}
                    />
                  ));
                })()}


                {(() => {
                  const providerBreakdown = usageSummaryData?.data?.breakdown?.find(b => b.provider === cred.provider);
                  const calls = providerBreakdown?.requestCount || 0;
                  const cost = providerBreakdown?.totalCostUsd || 0;
                  return (
                    <UsageStats
                      stats={{
                        items: [
                          { value: calls >= 1000 ? `${(calls / 1000).toFixed(1)}K` : calls.toString(), label: 'API Calls' },
                          { value: `$${cost.toFixed(2)}`, label: 'Total Cost' },
                          { value: '99.9%', label: 'Success Rate', isSuccess: true }
                        ]
                      }}
                    />
                  );
                })()}
              </div>
            </IntegrationCard>
          );
        })}
      </div>

      {/* Reveal Credential Modal */}
      {revealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold font-['Fraunces'] text-gray-900 dark:text-white flex items-center gap-3">
                🔐 Security Verification
              </h2>
              <button
                onClick={() => { setRevealModalOpen(false); setAdminPassword(''); setShowAdminPassword(false); }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Please enter your admin password to reveal sensitive API credentials. This action will be logged.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">Admin Password</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    className="w-full px-4.5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all pr-12"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRevealSubmit(); }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    {showAdminPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => { setRevealModalOpen(false); setAdminPassword(''); setShowAdminPassword(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevealSubmit}
                  disabled={!adminPassword || isRevealing}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                >
                  {isRevealing ? 'Verifying...' : 'Reveal Credentials'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Integration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in border border-gray-100 dark:border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-2xl font-bold font-['Fraunces'] text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-3xl">➕</span> Add New Integration
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <p className="text-base text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
                Choose from popular integrations or create a custom integration for your platform. All credentials are encrypted.
              </p>

              {/* Popular Integrations */}
              <div className="mb-12">
                <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-gray-200 dark:bg-gray-700"></span>
                  Popular Integrations
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {(() => {
                    const availableTemplates = INTEGRATION_TEMPLATES.filter(t => !credentialsData?.data?.some(c => c.provider === t.provider));
                    if (availableTemplates.length === 0) {
                      return (
                        <div className="col-span-full py-8 text-center bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400">All popular integrations have been added.</p>
                        </div>
                      );
                    }
                    return availableTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => selectTemplate(template)}
                        className="flex flex-col items-center p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/20 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
                      >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 z-10">{template.icon}</div>
                        <div className="font-bold text-base text-gray-900 dark:text-white mb-1.5 z-10">{template.name}</div>
                        <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 text-center leading-tight z-10">{template.description}</div>
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Custom Integration Form */}
              <div className="mb-10">
                <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-gray-200 dark:bg-gray-700"></span>
                  Or Create Custom Integration
                </h3>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">Integration Name</label>
                    <input
                      type="text"
                      className="w-full px-4.5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
                      placeholder="e.g., Twilio, SendGrid, etc."
                      value={newIntegration.name}
                      onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">Icon Emoji</label>
                      <input
                        type="text"
                        className="w-full px-4.5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium"
                        placeholder="e.g., 📱, 🔔, 🌟"
                        value={newIntegration.icon}
                        onChange={(e) => setNewIntegration({ ...newIntegration, icon: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">Background Color</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          className="w-14 h-[50px] p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 cursor-pointer shadow-sm"
                          value={newIntegration.color}
                          onChange={(e) => setNewIntegration({ ...newIntegration, color: e.target.value })}
                        />
                        <input
                          type="text"
                          className="flex-1 px-4.5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white transition-all font-mono"
                          value={newIntegration.color}
                          onChange={(e) => setNewIntegration({ ...newIntegration, color: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">Description</label>
                    <input
                      type="text"
                      className="w-full px-4.5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium"
                      placeholder="e.g., SMS notifications, Email delivery API"
                      value={newIntegration.description}
                      onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                      <span className="p-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs">🔑</span>
                      Credential Fields
                    </label>
                    <div className="grid gap-6 p-6 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                      {(newIntegration.fields ? newIntegration.fields.split(',') : []).map((field) => {
                        const trimmedField = field.trim();
                        if (!trimmedField) return null;
                        return (
                          <div key={trimmedField} className="form-group">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                              {trimmedField.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={newIntegrationPasswordVisibility[trimmedField] ? 'text' : 'password'}
                                className="w-full px-4.5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all font-medium pr-12"
                                placeholder={`Enter ${trimmedField.replace(/_/g, ' ')}`}
                                value={newIntegrationCredentials[trimmedField] || ''}
                                onChange={(e) => setNewIntegrationCredentials({ ...newIntegrationCredentials, [trimmedField]: e.target.value })}
                              />
                              <button
                                type="button"
                                onClick={() => setNewIntegrationPasswordVisibility({
                                  ...newIntegrationPasswordVisibility,
                                  [trimmedField]: !newIntegrationPasswordVisibility[trimmedField]
                                })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                              >
                                {newIntegrationPasswordVisibility[trimmedField] ? '🙈' : '👁️'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {!newIntegration.fields && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                          Select a template above to see required fields
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-8 bg-gray-50/50 dark:bg-gray-900/40 rounded-3xl mb-10 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-[0.2em]">Component Preview</div>
                <div className="flex items-center gap-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-2xl shadow-black/10 border border-white/20 active:scale-95 transition-transform"
                    style={{ background: newIntegration.color, color: 'white' }}
                  >
                    {newIntegration.icon}
                  </div>
                  <div>
                    <div className="text-xl font-bold font-['Fraunces'] text-gray-900 dark:text-white mb-1">{newIntegration.name || 'New Integration'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{newIntegration.description || 'Integration description will appear here'}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 text-center flex-1 md:flex-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateIntegration}
                  disabled={!newIntegration.name}
                  className="px-10 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-center flex-1 md:flex-none"
                >
                  ➕ Add Integration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default APIIntegrations;