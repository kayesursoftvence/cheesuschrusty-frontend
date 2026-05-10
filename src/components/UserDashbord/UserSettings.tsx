import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Edit2, HelpCircle, Shield, Bell, Zap, Target, Upload, Save, X, Moon, Sun, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useGetMeQuery, useChangePasswordMutation } from '@/redux/features/auth/authApi';
import { useUpdateUserProfileMutation } from '@/redux/features/userManagement/usermanagementApi';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCancelSubscriptionMutation, useGetMySubscriptionQuery } from '@/redux/features/subscriptions/subscriptionsApi';

// Helper function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  if (!name) return 'US';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to format subscription date
const formatSubscriptionDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to get plan display name
const getPlanDisplayName = (planAlias: string | undefined) => {
  if (!planAlias) return 'Free Plan';
  const planMap: Record<string, string> = {
    'PRO_MONTHLY': 'Premium Monthly',
    'PRO_LIFETIME': 'Lifetime',
    'FREE': 'Free Plan'
  };
  return planMap[planAlias] || planAlias;
};

// Helper function to get status display info
const getStatusInfo = (status: string | undefined) => {
  const statusLower = status?.toLowerCase() || 'none';
  if (statusLower === 'active' || statusLower === 'trialing') {
    return {
      label: statusLower === 'trialing' ? 'Trial' : 'Active',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      badgeBg: 'bg-green-200 dark:bg-green-800',
      badgeText: 'text-green-700 dark:text-green-300'
    };
  } else if (statusLower === 'canceled' || statusLower === 'cancelled') {
    return {
      label: 'Cancelled',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      badgeBg: 'bg-orange-200 dark:bg-orange-800',
      badgeText: 'text-orange-700 dark:text-orange-300'
    };
  } else if (statusLower === 'past_due') {
    return {
      label: 'Past Due',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      badgeBg: 'bg-red-200 dark:bg-red-800',
      badgeText: 'text-red-700 dark:text-red-300'
    };
  }
  return {
    label: 'Inactive',
    bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-700',
    badgeBg: 'bg-gray-200 dark:bg-gray-700',
    badgeText: 'text-gray-700 dark:text-gray-300'
  };
};

// Toggle Switch Component with state
interface ToggleProps {
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleProps> = ({ defaultChecked, onChange, disabled = false }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors ${disabled
          ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50'
          : 'cursor-pointer'
        } ${isChecked
          ? 'bg-blue-600 dark:bg-blue-500'
          : 'bg-gray-300 dark:bg-gray-600'
        }`}
    >
      <div
        className={`w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transition-transform duration-200 ${isChecked ? 'transform translate-x-6' : 'transform translate-x-0'
          }`}
      ></div>
    </div>
  );
};

// Panel Component
interface PanelProps {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  iconColor?: string;
}

const SettingsPanel: React.FC<PanelProps> = ({ title, icon, subtitle, children, iconColor = 'text-orange-500' }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50">
    <div className="flex items-center mb-4">
      <span className={`mr-3 ${iconColor}`}>{icon}</span>
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

// Reusable Password Input Component
const PasswordInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 pr-10"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export const UserSettings: React.FC = () => {
  const { data: apiResponse, refetch } = useGetMeQuery({});
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const location = useLocation();

  console.log(apiResponse)

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  // Extract user data from API response
  const userData = useMemo(() => apiResponse?.data || {}, [apiResponse?.data]);

  const {
    name: initialName = "Marco Rossi",
    email = "marco.rossi@email.com",
    // currentLevel = "B1",
    createdAt = "2024-03-01T00:00:00.000Z",
    currentStreak = 7,
    targetLang = "Italian",
    avatar: initialAvatar,
    weeklyUpdateEnabled = true,
    streakRemindersEnabled = true,
    achievementAlertsEnabled = true,
    dailyGoalMinutes = 30,
  } = userData;

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar || null);
  const [dailyGoal, setDailyGoal] = useState(dailyGoalMinutes);
  const [weeklyUpdate, setWeeklyUpdate] = useState(weeklyUpdateEnabled);
  const [streakReminders, setStreakReminders] = useState(streakRemindersEnabled);
  const [achievementAlerts, setAchievementAlerts] = useState(achievementAlertsEnabled);
  
  // New state for additional options
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user prefers dark mode
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  // const [systemVoice, setSystemVoice] = useState('en-US-Wavenet-A');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // // System voice options
  // const voiceOptions = [
  //   { value: 'en-US-Wavenet-A', label: 'American Male' },
  //   { value: 'en-US-Wavenet-B', label: 'American Female' },
  //   { value: 'en-GB-Wavenet-A', label: 'British Male' },
  //   { value: 'en-GB-Wavenet-B', label: 'British Female' },
  //   { value: 'en-AU-Wavenet-A', label: 'Australian Male' },
  //   { value: 'en-AU-Wavenet-B', label: 'Australian Female' },
  // ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with API data when it changes
  useEffect(() => {
    if (userData) {
      setName(userData.name || initialName);
      setDailyGoal(userData.dailyGoalMinutes || 30);
      setWeeklyUpdate(userData.weeklyUpdateEnabled ?? true);
      setStreakReminders(userData.streakRemindersEnabled ?? true);
      setAchievementAlerts(userData.achievementAlertsEnabled ?? true);
      setAvatarPreview(userData.avatar || null);
    }
  }, [userData, initialName]);

  // Format learning since date
  const learningSince = formatDate(createdAt);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        name,
        weeklyUpdateEnabled: weeklyUpdate,
        streakRemindersEnabled: streakReminders,
        achievementAlertsEnabled: achievementAlerts,
        dailyGoalMinutes: dailyGoal,
        avatar: avatarFile,
      }).unwrap();

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      refetch(); // Refresh user data
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      console.error('Update profile error:', error);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setName(initialName);
    setDailyGoal(dailyGoalMinutes);
    setWeeklyUpdate(weeklyUpdateEnabled);
    setStreakReminders(streakRemindersEnabled);
    setAchievementAlerts(achievementAlertsEnabled);
    setAvatarFile(null);
    setAvatarPreview(initialAvatar || null);
    setIsEditing(false);
  };

  // New handlers for additional options
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSystemVoice(e.target.value);
  //   // Here you would typically save this preference to your backend
  //   toast.success('System voice updated!');
  // };

  const handleNewsletterToggle = (checked: boolean) => {
    setNewsletterSubscribed(checked);
    // Here you would typically make an API call to update newsletter preference
    toast.success(`Newsletter subscription ${checked ? 'enabled' : 'disabled'}!`);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    
    try {
      await changePassword({ 
        oldPassword: currentPassword, 
        newPassword 
      }).unwrap();
      
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
      console.error('Change password error:', error);
    }
  };

  const navigate = useNavigate();
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const { data, refetch: refetchSubscription } = useGetMySubscriptionQuery();
  const subscriptionData = data?.data;
  const isLifetime = subscriptionData?.planAlias === "PRO_LIFETIME" || subscriptionData?.plan === "PRO_LIFETIME";
  const hasUnlimitedAccess = subscriptionData?.isPro || isLifetime;

  // Get status display info
  const statusInfo = getStatusInfo(subscriptionData?.status);
  const isActive = subscriptionData?.status?.toLowerCase() === 'active' ||
    subscriptionData?.status?.toLowerCase() === 'trialing';
  const isCancelled = subscriptionData?.status?.toLowerCase() === 'canceled' ||
    subscriptionData?.status?.toLowerCase() === 'cancelled';

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription().unwrap();
      toast.success('Subscription cancelled successfully!');
      refetchSubscription(); // Refresh subscription data
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to cancel subscription';
      toast.error(errorMessage);
      console.error('Cancel subscription error:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your account and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">

          {/* 1. Profile Information */}
          <SettingsPanel
            title="Profile Information"
            icon={<Target size={20} />}
            subtitle="Update your personal information and learning profile"
            iconColor="text-blue-600 dark:text-blue-400"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                <div className="relative flex-shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white dark:border-gray-800 shadow object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg sm:text-xl font-bold border-4 border-white dark:border-gray-800 shadow">
                      {getInitials(name)}
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      title="Upload avatar"
                    >
                      <Upload size={12} />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className=" text-sm font-semibold py-1 rounded-full">
                      {apiResponse?.data?.name}
                    </span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center justify-center">
                     {subscriptionData?.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Learning {targetLang} since {learningSince} • {currentStreak} day streak
                  </p>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base ${isEditing
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                    }`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm sm:text-base"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Daily Goal (minutes)</label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  disabled={!isEditing}
                  min="1"
                  className={`w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base ${isEditing
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                    }`}
                />
              </div>
            </div>
          </SettingsPanel>

          {/* 2. Subscription Management */}
          <SettingsPanel
            title="Subscription Management"
            icon={<Zap size={20} />}
            subtitle="Manage your premium subscription and billing"
            iconColor="text-purple-600 dark:text-purple-400"
          >
            {hasUnlimitedAccess ? (
              <>
                <div className={`p-3 sm:p-4 ${statusInfo.bgColor} rounded-lg mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border ${statusInfo.borderColor}`}>
                  <div>
                    <h4 className={`font-semibold ${statusInfo.textColor} text-sm sm:text-base`}>
                      {getPlanDisplayName((subscriptionData as any)?.planAlias || subscriptionData?.plan)}
                    </h4>
                    {isActive && subscriptionData?.currentPeriodEnd && (
                      <p className={`text-xs ${statusInfo.textColor} opacity-80`}>
                        {subscriptionData?.status?.toLowerCase() === 'trialing'
                          ? `Trial ends: ${formatSubscriptionDate(subscriptionData?.currentPeriodEnd)}`
                          : ``}
                      </p>
                    )}
                    {isCancelled && subscriptionData?.currentPeriodEnd && (
                      <p className={`text-xs ${statusInfo?.textColor} opacity-80`}>
                        Access until: {formatSubscriptionDate(subscriptionData?.currentPeriodEnd)}
                      </p>
                    )}
                    {!subscriptionData?.currentPeriodEnd && (
                      <p className={`text-xs ${statusInfo?.textColor} opacity-80`}>
                        Subscription details
                      </p>
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${statusInfo?.badgeText} ${statusInfo?.badgeBg} px-3 py-1 rounded-full`}>
                    {statusInfo?.label}
                  </span>
                </div>

                {isActive && subscriptionData?.currentPeriodEnd && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                    {subscriptionData?.status?.toLowerCase() === 'trialing'
                      ? `Your trial period ends on ${formatSubscriptionDate(subscriptionData?.currentPeriodEnd)}. After that, your subscription will automatically renew.`
                      : ``}
                  </p>
                )}

                {isCancelled && subscriptionData?.currentPeriodEnd ? (
                  <div className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-4 sm:mb-6 border border-orange-200 dark:border-orange-800">
                    <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
                      Your subscription has been cancelled. You'll continue to have access to premium features until {formatSubscriptionDate(subscriptionData?.currentPeriodEnd)}.
                    </p>
                  </div>
                ) : ""}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 ">
                  <div className=''>
                    {isActive && !isLifetime && (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                        className="flex-1 px-4 sm:px-6 cursor-pointer py-2.5 sm:py-3 bg-red-600 dark:bg-red-500 text-white font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4 border border-gray-200 dark:border-gray-700 ">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">Free Plan</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {subscriptionData?.hasUsedTrial
                        ? 'You have already used your free trial'
                        : 'Upgrade to unlock premium features'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/#pricing');
                      setTimeout(() => {
                        document.getElementById('pricing')?.scrollIntoView({
                          behavior: 'smooth'
                        });
                      }, 100);
                    }}
                    className="px-4 cursor-pointer sm:px-6 py-2 sm:py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    Upgrade to plan
                  </button>
                </div>
              </div>
            )}
          </SettingsPanel>

          {/* 3. App Preferences */}
          <SettingsPanel
            title="App Preferences"
            icon={<Zap size={20} />}
            subtitle="Customize your learning experience"
            iconColor="text-orange-600 dark:text-orange-400"
          >
            <div className="space-y-4">
              {/* Light/Dark Mode switch */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    {darkMode ? (
                      <Moon size={18} className="mr-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    ) : (
                      <Sun size={18} className="mr-3 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {darkMode ? 'Dark Mode' : 'Light Mode'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                      </p>
                    </div>
                  </div>
                </div>
                <ToggleSwitch
                  defaultChecked={darkMode}
                  onChange={handleDarkModeToggle}
                  id="dark-mode"
                />
              </div>

              {/* System Voice changing option */}
              {/* <div className="space-y-2">
                <div className="flex items-center">
                  <Volume2 size={18} className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">System Voice</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Choose voice for pronunciation</p>
                  </div>
                </div>
                <select
                  value={systemVoice}
                  onChange={handleVoiceChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  {voiceOptions.map((voice) => (
                    <option key={voice.value} value={voice.value}>
                      {voice.label}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Newsletter subscribe option */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <Mail size={18} className="mr-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Newsletter</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive tips and updates</p>
                    </div>
                  </div>
                </div>
                <ToggleSwitch
                  defaultChecked={newsletterSubscribed}
                  onChange={handleNewsletterToggle}
                  id="newsletter"
                />
              </div>
            </div>
          </SettingsPanel>

          {/* 4. Change Password */}
          <SettingsPanel
            title="Change Password"
            icon={<Lock size={20} />}
            subtitle="Update your account password"
            iconColor="text-red-600 dark:text-red-400"
          >
            <div className="space-y-4">
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentPassword || !newPassword || !confirmPassword || isChangingPassword}
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </SettingsPanel>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">

          {/* Notifications */}
          <SettingsPanel
            title="Notifications"
            icon={<Bell size={20} />}
            subtitle="Control your notification preferences"
            iconColor="text-blue-600 dark:text-blue-400"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Weekly Update</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Weekly progress reports</p>
                </div>
                <ToggleSwitch
                  defaultChecked={weeklyUpdate}
                  onChange={setWeeklyUpdate}
                  id="weekly-update"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Streak Reminders</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Don't break your streak</p>
                </div>
                <ToggleSwitch
                  defaultChecked={streakReminders}
                  onChange={setStreakReminders}
                  id="streak-reminders"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Achievement Alerts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">New badges and milestones</p>
                </div>
                <ToggleSwitch
                  defaultChecked={achievementAlerts}
                  onChange={setAchievementAlerts}
                  id="achievement-alerts"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </SettingsPanel>

          {/* Quick Actions */}
          <SettingsPanel
            title="Quick Actions"
            icon={<Zap size={20} />}
            subtitle="Common settings and support options"
            iconColor="text-yellow-600 dark:text-yellow-400"
          >
            <div className="space-y-2 sm:space-y-3">
              <button onClick={() => navigate('/user/support')} className="flex items-center text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm sm:text-base">
                <HelpCircle size={18} className="mr-3 cursor-pointer text-blue-600 dark:text-blue-400 flex-shrink-0" />
                Help Centre
              </button>
              <button onClick={() => navigate('/privacy')} className="flex cursor-pointer items-center text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm sm:text-base">
                <Shield size={18} className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                Privacy Policy
              </button>
            </div>
          </SettingsPanel>

          {/* Edit/Save/Cancel Button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center cursor-pointer p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800 text-sm sm:text-base"
            >
              <Edit2 size={20} className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center cursor-pointer text-white bg-blue-600 dark:bg-blue-500 font-medium text-sm px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} className="mr-2" /> {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 font-medium text-sm px-4 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <X size={18} className="mr-2" /> Cancel
              </button>
            </div>
          )}

          {/* App Version */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              App Version 2.4.1 • ProntoCorso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { Edit2, HelpCircle, Shield, Bell, Zap, Target, Upload, Save, X } from 'lucide-react';
// import { useGetMeQuery } from '@/redux/features/auth/authApi';
// import { useUpdateUserProfileMutation } from '@/redux/features/userManagement/usermanagementApi';
// import { toast } from 'react-hot-toast';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useCancelSubscriptionMutation, useGetMySubscriptionQuery } from '@/redux/features/subscriptions/subscriptionsApi';

// // Helper function to format date
// const formatDate = (dateString: string | null) => {
//   if (!dateString) return 'Recently';
//   const date = new Date(dateString);
//   const month = date.toLocaleDateString('en-US', { month: 'short' });
//   const year = date.getFullYear();
//   return `${month} ${year}`;
// };





// // Helper function to get initials from name
// const getInitials = (name: string) => {
//   if (!name) return 'US';
//   return name
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);
// };

// // Helper function to format subscription date
// const formatSubscriptionDate = (dateString: string | null | undefined) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric'
//   });
// };

// // Helper function to get plan display name
// const getPlanDisplayName = (planAlias: string | undefined) => {
//   if (!planAlias) return 'Free Plan';
//   const planMap: Record<string, string> = {
//     'PRO_MONTHLY': 'Premium Monthly',
//     'PRO_LIFETIME': 'Lifetime',
//     'FREE': 'Free Plan'
//   };
//   return planMap[planAlias] || planAlias;
// };

// // Helper function to get status display info
// const getStatusInfo = (status: string | undefined) => {
//   const statusLower = status?.toLowerCase() || 'none';
//   if (statusLower === 'active' || statusLower === 'trialing') {
//     return {
//       label: statusLower === 'trialing' ? 'Trial' : 'Active',
//       bgColor: 'bg-green-50 dark:bg-green-900/20',
//       textColor: 'text-green-700 dark:text-green-300',
//       borderColor: 'border-green-200 dark:border-green-800',
//       badgeBg: 'bg-green-200 dark:bg-green-800',
//       badgeText: 'text-green-700 dark:text-green-300'
//     };
//   } else if (statusLower === 'canceled' || statusLower === 'cancelled') {
//     return {
//       label: 'Cancelled',
//       bgColor: 'bg-orange-50 dark:bg-orange-900/20',
//       textColor: 'text-orange-700 dark:text-orange-300',
//       borderColor: 'border-orange-200 dark:border-orange-800',
//       badgeBg: 'bg-orange-200 dark:bg-orange-800',
//       badgeText: 'text-orange-700 dark:text-orange-300'
//     };
//   } else if (statusLower === 'past_due') {
//     return {
//       label: 'Past Due',
//       bgColor: 'bg-red-50 dark:bg-red-900/20',
//       textColor: 'text-red-700 dark:text-red-300',
//       borderColor: 'border-red-200 dark:border-red-800',
//       badgeBg: 'bg-red-200 dark:bg-red-800',
//       badgeText: 'text-red-700 dark:text-red-300'
//     };
//   }
//   return {
//     label: 'Inactive',
//     bgColor: 'bg-gray-50 dark:bg-gray-800/50',
//     textColor: 'text-gray-700 dark:text-gray-300',
//     borderColor: 'border-gray-200 dark:border-gray-700',
//     badgeBg: 'bg-gray-200 dark:bg-gray-700',
//     badgeText: 'text-gray-700 dark:text-gray-300'
//   };
// };

// // Toggle Switch Component with state
// interface ToggleProps {
//   defaultChecked: boolean;
//   onChange?: (checked: boolean) => void;
//   id?: string;
//   disabled?: boolean;
// }

// const ToggleSwitch: React.FC<ToggleProps> = ({ defaultChecked, onChange, disabled = false }) => {
//   const [isChecked, setIsChecked] = useState(defaultChecked);

//   const handleToggle = () => {
//     if (disabled) return;
//     const newChecked = !isChecked;
//     setIsChecked(newChecked);
//     if (onChange) {
//       onChange(newChecked);
//     }
//   };

//   return (
//     <div
//       onClick={handleToggle}
//       className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors ${disabled
//           ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50'
//           : 'cursor-pointer'
//         } ${isChecked
//           ? 'bg-blue-600 dark:bg-blue-500'
//           : 'bg-gray-300 dark:bg-gray-600'
//         }`}
//     >
//       <div
//         className={`w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transition-transform duration-200 ${isChecked ? 'transform translate-x-6' : 'transform translate-x-0'
//           }`}
//       ></div>
//     </div>
//   );
// };

// // Panel Component
// interface PanelProps {
//   title: string;
//   icon: React.ReactNode;
//   subtitle: string;
//   children: React.ReactNode;
//   iconColor?: string;
// }

// const SettingsPanel: React.FC<PanelProps> = ({ title, icon, subtitle, children, iconColor = 'text-orange-500' }) => (
//   <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50">
//     <div className="flex items-center mb-4">
//       <span className={`mr-3 ${iconColor}`}>{icon}</span>
//       <div>
//         <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
//         <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
//       </div>
//     </div>
//     {children}
//   </div>
// );

// export const UserSettings: React.FC = () => {
//   const { data: apiResponse, refetch } = useGetMeQuery({});
//   const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
//   const location = useLocation();

//   console.log(apiResponse)

//   useEffect(() => {
//     if (location.hash) {
//       const el = document.getElementById(location.hash.substring(1));
//       el?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [location]);
//   // Extract user data from API response
//   const userData = useMemo(() => apiResponse?.data || {}, [apiResponse?.data]);

//   const {
//     name: initialName = "Marco Rossi",
//     email = "marco.rossi@email.com",
//     // currentLevel = "B1",
//     createdAt = "2024-03-01T00:00:00.000Z",
//     currentStreak = 7,
//     targetLang = "Italian",
//     avatar: initialAvatar,
//     weeklyUpdateEnabled = true,
//     streakRemindersEnabled = true,
//     achievementAlertsEnabled = true,
//     dailyGoalMinutes = 30,
//   } = userData;

//   // Form state
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(initialName);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar || null);
//   const [dailyGoal, setDailyGoal] = useState(dailyGoalMinutes);
//   const [weeklyUpdate, setWeeklyUpdate] = useState(weeklyUpdateEnabled);
//   const [streakReminders, setStreakReminders] = useState(streakRemindersEnabled);
//   const [achievementAlerts, setAchievementAlerts] = useState(achievementAlertsEnabled);

//   // Local UI state (not synced with API)


//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Sync state with API data when it changes
//   useEffect(() => {
//     if (userData) {
//       setName(userData.name || initialName);
//       setDailyGoal(userData.dailyGoalMinutes || 30);
//       setWeeklyUpdate(userData.weeklyUpdateEnabled ?? true);
//       setStreakReminders(userData.streakRemindersEnabled ?? true);
//       setAchievementAlerts(userData.achievementAlertsEnabled ?? true);
//       setAvatarPreview(userData.avatar || null);
//     }
//   }, [userData, initialName]);

//   // Format learning since date
//   const learningSince = formatDate(createdAt);

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatarFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       await updateUserProfile({
//         name,
//         weeklyUpdateEnabled: weeklyUpdate,
//         streakRemindersEnabled: streakReminders,
//         achievementAlertsEnabled: achievementAlerts,
//         dailyGoalMinutes: dailyGoal,
//         avatar: avatarFile,
//       }).unwrap();

//       toast.success('Profile updated successfully!');
//       setIsEditing(false);
//       refetch(); // Refresh user data
//     } catch (error) {
//       const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to update profile';
//       toast.error(errorMessage);
//       console.error('Update profile error:', error);
//     }
//   };

//   const handleCancelEdit = () => {
//     // Reset to original values
//     setName(initialName);
//     setDailyGoal(dailyGoalMinutes);
//     setWeeklyUpdate(weeklyUpdateEnabled);
//     setStreakReminders(streakRemindersEnabled);
//     setAchievementAlerts(achievementAlertsEnabled);
//     setAvatarFile(null);
//     setAvatarPreview(initialAvatar || null);
//     setIsEditing(false);
//   };

//   const navigate = useNavigate();
//   const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
//   const { data, refetch: refetchSubscription } = useGetMySubscriptionQuery();
//   const subscriptionData = data?.data;
//   const isLifetime = subscriptionData?.planAlias === "PRO_LIFETIME" || subscriptionData?.plan === "PRO_LIFETIME";
//   const hasUnlimitedAccess = subscriptionData?.isPro || isLifetime;

//   // Get status display info
//   const statusInfo = getStatusInfo(subscriptionData?.status);
//   const isActive = subscriptionData?.status?.toLowerCase() === 'active' ||
//     subscriptionData?.status?.toLowerCase() === 'trialing';
//   const isCancelled = subscriptionData?.status?.toLowerCase() === 'canceled' ||
//     subscriptionData?.status?.toLowerCase() === 'cancelled';

//   const handleCancelSubscription = async () => {
//     try {
//       await cancelSubscription().unwrap();
//       toast.success('Subscription cancelled successfully!');
//       refetchSubscription(); // Refresh subscription data
//     } catch (error) {
//       const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to cancel subscription';
//       toast.error(errorMessage);
//       console.error('Cancel subscription error:', error);
//     }
//   };
//   return (
//     <div className="p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
//         <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your account and app preferences</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

//         {/* LEFT COLUMN */}
//         <div className="lg:col-span-8 space-y-4 sm:space-y-6">

//           {/* 1. Profile Information */}
//           <SettingsPanel
//             title="Profile Information"
//             icon={<Target size={20} />}
//             subtitle="Update your personal information and learning profile"
//             iconColor="text-blue-600 dark:text-blue-400"
//           >
//             <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4">
//               <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
//                 <div className="relative flex-shrink-0">
//                   {avatarPreview ? (
//                     <img
//                       src={avatarPreview}
//                       alt={name}
//                       className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white dark:border-gray-800 shadow object-cover"
//                     />
//                   ) : (
//                     <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg sm:text-xl font-bold border-4 border-white dark:border-gray-800 shadow">
//                       {getInitials(name)}
//                     </div>
//                   )}
//                   {isEditing && (
//                     <button
//                       onClick={() => fileInputRef.current?.click()}
//                       className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
//                       title="Upload avatar"
//                     >
//                       <Upload size={12} />
//                     </button>
//                   )}
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarChange}
//                     className="hidden"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex flex-wrap gap-2 mb-1">
//                     <span className=" text-sm font-semibold py-1 rounded-full">
//                       {apiResponse.data.name}
//                     </span>
//                     <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center justify-center">
//                      {subscriptionData?.status}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                     Learning {targetLang} since {learningSince} • {currentStreak} day streak
//                   </p>
//                 </div>
//               </div>

//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   disabled={!isEditing}
//                   className={`w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base ${isEditing
//                       ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
//                       : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
//                     }`}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
//                 <input
//                   type="email"
//                   value={email}
//                   className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm sm:text-base"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Daily Goal (minutes)</label>
//                 <input
//                   type="number"
//                   value={dailyGoal}
//                   onChange={(e) => setDailyGoal(Number(e.target.value))}
//                   disabled={!isEditing}
//                   min="1"
//                   className={`w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base ${isEditing
//                       ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
//                       : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
//                     }`}
//                 />
//               </div>
//             </div>
//           </SettingsPanel>

//           {/* 2. Subscription Management */}
//           <SettingsPanel
//             title="Subscription Management"
//             icon={<Zap size={20} />}
//             subtitle="Manage your premium subscription and billing"
//             iconColor="text-purple-600 dark:text-purple-400 "
//           >
//             {hasUnlimitedAccess ? (
//               <>
//                 <div className={`p-3 sm:p-4 ${statusInfo.bgColor} rounded-lg mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border ${statusInfo.borderColor}`}>
//                   <div>
//                     <h4 className={`font-semibold ${statusInfo.textColor} text-sm sm:text-base`}>
//                       {getPlanDisplayName((subscriptionData as any)?.planAlias || subscriptionData.plan)}
//                     </h4>
//                     {isActive && subscriptionData.currentPeriodEnd && (
//                       <p className={`text-xs ${statusInfo.textColor} opacity-80`}>
//                         {subscriptionData.status?.toLowerCase() === 'trialing'
//                           ? `Trial ends: ${formatSubscriptionDate(subscriptionData.currentPeriodEnd)}`
//                           : ``}
//                       </p>
//                     )}
//                     {isCancelled && subscriptionData.currentPeriodEnd && (
//                       <p className={`text-xs ${statusInfo.textColor} opacity-80`}>
//                         Access until: {formatSubscriptionDate(subscriptionData.currentPeriodEnd)}
//                       </p>
//                     )}
//                     {!subscriptionData.currentPeriodEnd && (
//                       <p className={`text-xs ${statusInfo.textColor} opacity-80`}>
//                         Subscription details
//                       </p>
//                     )}
//                   </div>
//                   <span className={`text-xs sm:text-sm font-semibold ${statusInfo.badgeText} ${statusInfo.badgeBg} px-3 py-1 rounded-full`}>
//                     {statusInfo.label}
//                   </span>
//                 </div>

//                 {isActive && subscriptionData.currentPeriodEnd && (
//                   <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
//                     {subscriptionData.status?.toLowerCase() === 'trialing'
//                       ? `Your trial period ends on ${formatSubscriptionDate(subscriptionData.currentPeriodEnd)}. After that, your subscription will automatically renew.`
//                       : ``}
//                   </p>
//                 )}

//                 {isCancelled && subscriptionData.currentPeriodEnd ? (
//                   <div className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-4 sm:mb-6 border border-orange-200 dark:border-orange-800">
//                     <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
//                       Your subscription has been cancelled. You'll continue to have access to premium features until {formatSubscriptionDate(subscriptionData.currentPeriodEnd)}.
//                     </p>
//                   </div>
//                 ) : ""}

//                 <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 ">
//                   <div className=''>
//                     {isActive && !isLifetime && (
//                       <button
//                         onClick={handleCancelSubscription}
//                         disabled={isCancelling}
//                         className="flex-1 px-4 sm:px-6 cursor-pointer py-2.5 sm:py-3 bg-red-600 dark:bg-red-500 text-white font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
//                       </button>
//                     )}
//                   </div>
//                   {/* <div>
//                   {isCancelled && (
//                     <button 
//                       onClick={() => navigate('/#pricing')} 
//                       className="flex-1 px-4 sm:px-6 cursor-pointer py-2.5 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base"
//                     >
//                       Reactivate Subscription
//                     </button>
//                   )}
//                   </div> */}
//                 </div>
//               </>
//             ) : (
//               <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4 border border-gray-200 dark:border-gray-700 ">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                   <div>
//                     <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">Free Plan</h4>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {subscriptionData?.hasUsedTrial
//                         ? 'You have already used your free trial'
//                         : 'Upgrade to unlock premium features'}
//                     </p>
//                   </div>


//                   <button
//                     onClick={() => {
//                       navigate('/#pricing');

//                       setTimeout(() => {
//                         document.getElementById('pricing')?.scrollIntoView({
//                           behavior: 'smooth'
//                         });
//                       }, 100);
//                     }}
//                     className="px-4 cursor-pointer sm:px-6 py-2 sm:py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base"
//                   >
//                     Upgrade to plan
//                   </button>






//                 </div>
//               </div>
//             )}
            
//           </SettingsPanel>
//           {/* <button className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">
//                 Billing History
//               </button> */}
//           {/* 3. App Preferences */}
//           {/* <SettingsPanel
//             title="App Preferences"
//             icon={<Sunset size={20} />}
//             subtitle="Customize your learning experience"
//             iconColor="text-orange-600 dark:text-orange-400"
//           >
//             <div></div>
//           </SettingsPanel> */}


//           <div>
//               {/* Add heare */}
//           </div>

//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="lg:col-span-4 space-y-4 sm:space-y-6">

//           {/* 4. Notifications */}
//           <SettingsPanel
//             title="Notifications"
//             icon={<Bell size={20} />}
//             subtitle="Control your notification preferences"
//             iconColor="text-blue-600 dark:text-blue-400"
//           >
//             <div className="space-y-4">

//               <div className="flex items-center justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Weekly Update</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Weekly progress reports</p>
//                 </div>
//                 <ToggleSwitch
//                   defaultChecked={weeklyUpdate}
//                   onChange={setWeeklyUpdate}
//                   id="weekly-update"
//                   disabled={!isEditing}
//                 />
//               </div>
//               <div className="flex items-center justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Streak Reminders</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Don't break your streak</p>
//                 </div>
//                 <ToggleSwitch
//                   defaultChecked={streakReminders}
//                   onChange={setStreakReminders}
//                   id="streak-reminders"
//                   disabled={!isEditing}
//                 />
//               </div>
//               <div className="flex items-center justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Achievement Alerts</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">New badges and milestones</p>
//                 </div>
//                 <ToggleSwitch
//                   defaultChecked={achievementAlerts}
//                   onChange={setAchievementAlerts}
//                   id="achievement-alerts"
//                   disabled={!isEditing}
//                 />
//               </div>
//             </div>
//           </SettingsPanel>

//           {/* 5. Quick Actions */}
//           <SettingsPanel
//             title="Quick Actions"
//             icon={<Zap size={20} />}
//             subtitle="Common settings and support options"
//             iconColor="text-yellow-600 dark:text-yellow-400"
//           >
//             <div className="space-y-2 sm:space-y-3">
//               <button onClick={() => navigate('/user/support')} className="flex items-center text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm sm:text-base">
//                 <HelpCircle size={18} className="mr-3 cursor-pointer text-blue-600 dark:text-blue-400 flex-shrink-0" />
//                 Help Centre
//               </button>
//               <button onClick={() => navigate('/privacy')} className="flex cursor-pointer items-center text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm sm:text-base">
//                 <Shield size={18} className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
//                 Privacy Policy
//               </button>

//             </div>
//           </SettingsPanel>

//           {/* Edit/Save/Cancel Button */}
//           {!isEditing ? (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="w-full flex items-center justify-center cursor-pointer p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800 text-sm sm:text-base"
//             >
//               <Edit2 size={20} className="mr-2" />
//               Edit Profile
//             </button>
//           ) : (
//             <div className="flex gap-2 w-full">
//               <button
//                 onClick={handleSaveProfile}
//                 disabled={isUpdating}
//                 className="flex-1 flex items-center justify-center cursor-pointer text-white bg-blue-600 dark:bg-blue-500 font-medium text-sm px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Save size={18} className="mr-2" /> {isUpdating ? 'Saving...' : 'Save Changes'}
//               </button>
//               <button
//                 onClick={handleCancelEdit}
//                 disabled={isUpdating}
//                 className="flex-1 flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 font-medium text-sm px-4 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
//               >
//                 <X size={18} className="mr-2" /> Cancel
//               </button>
//             </div>
//           )}

//           {/* App Version */}
//           <div className="text-center">
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               App Version 2.4.1 • ProntoCorso
//             </p>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };


// export default UserSettings;