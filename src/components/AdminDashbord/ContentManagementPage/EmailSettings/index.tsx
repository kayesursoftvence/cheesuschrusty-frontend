import  { useState, ChangeEvent } from 'react';
import type { JSX } from 'react';

interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  description: string;
}

function EmailSettings(): JSX.Element {
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    host: 'smtp.gmail.com',
    port: '587',
    username: 'noreply@prontocorso.com',
    password: '••••••••••••'
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const emailTemplates: EmailTemplate[] = [
    {
      id: 1,
      name: 'Welcome Email',
      description: 'Sent to new users after registration'
    },
    {
      id: 2,
      name: 'Password Reset',
      description: 'Sent when user requests password reset'
    },
    {
      id: 3,
      name: 'Subscription Confirmation',
      description: 'Sent after successful Pro upgrade'
    }
  ];

  function handleInputChange(field: keyof SmtpConfig, value: string): void {
    setSmtpConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleSendTestEmail(): void {
    alert('Sending test email...\n\n✅ Test email sent successfully!\nCheck your inbox.');
  }

  function handleSaveConfiguration(): void {
    alert('Saving SMTP configuration...\n\n✅ Configuration saved successfully!');
  }

  function handleEditTemplate(templateName: string): void {
    alert(`Opening editor for: ${templateName}`);
  }

  return (
    <section id="page-email-settings" className="block">
      <div className="mb-8">
        <h1 className="font-['Fraunces'] text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
          Email Settings
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Configure SMTP settings and manage email templates
        </p>
      </div>

      {/* SMTP Configuration Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-sm mb-6">
        <h3 className="font-['Fraunces'] text-xl font-bold mb-1.5 text-gray-900 dark:text-white">
          SMTP Configuration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Gmail SMTP settings for transactional emails
        </p>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all"
            value={smtpConfig.host}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('host', e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            SMTP Port
          </label>
          <input
            type="number"
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all"
            value={smtpConfig.port}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('port', e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Username
          </label>
          <input
            type="email"
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all"
            value={smtpConfig.username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3.5 py-2.5 pr-24 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all"
              value={smtpConfig.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {showPassword ? '🙈 Hide' : '👁️ Show'}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
          <button
            type="button"
            onClick={handleSendTestEmail}
            className="px-5 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            Send Test Email
          </button>
          <button
            type="button"
            onClick={handleSaveConfiguration}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Email Templates Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-sm mb-6">
        <h3 className="font-['Fraunces'] text-xl font-bold mb-1.5 text-gray-900 dark:text-white">
          Email Templates
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Manage transactional email templates
        </p>

        <div className="grid gap-4 mt-5">
          {emailTemplates.map((template: EmailTemplate) => (
            <div
              key={template.id}
              className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {template.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleEditTemplate(template.name)}
                className="px-3.5 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EmailSettings;