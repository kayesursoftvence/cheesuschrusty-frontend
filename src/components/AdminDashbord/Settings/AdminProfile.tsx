import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Edit2, Upload, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { useGetMeQuery, useChangePasswordMutation } from '@/redux/features/auth/authApi';
import { useUpdateUserProfileMutation } from '@/redux/features/userManagement/usermanagementApi';
import { toast } from 'react-hot-toast';

// Helper function to get initials from name
const getInitials = (name: string) => {
  if (!name) return 'AD';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface AdminProfileProps {
  role: 'SUPER_ADMIN' | 'SUPORT_MANAGER' | 'CONTENT_MANAGER';
}

const AdminProfile: React.FC<AdminProfileProps> = ({ role }) => {
  const { data: apiResponse, refetch } = useGetMeQuery({});
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const userData = useMemo(() => apiResponse?.data || {}, [apiResponse?.data]);
  const {
    name: initialName = '',
    email = '',
    avatar: initialAvatar,
  } = userData;

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar || null);
  
  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // Error handeling
  type FieldName = "oldPassword" | "newPassword" | "confirmPassword";

  interface FieldError {
    isError: boolean;
    errMes: string;
  }
  type ErrorState = Record<FieldName, FieldError>;
  // const [oldPassword, setOldPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<ErrorState>({
    oldPassword: { isError: false, errMes: "" },
    newPassword: { isError: false, errMes: "" },
    confirmPassword: { isError: false, errMes: "" },
  });

  // debounce timers per field
  const validationTimeoutRef = useRef<
    Record<FieldName, ReturnType<typeof setTimeout> | null>
  >({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  /* ------------------ VALIDATORS ------------------ */

  function validatePassword(password: string): string {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";

    return "";
  }

  function validateField(name: FieldName, value: string): string {
    if (name === "oldPassword" || name === "newPassword") {
      return validatePassword(value);
    }

    if (name === "confirmPassword") {
      if (!value) return "Please confirm your password";
      if (value !== newPassword) return "Passwords do not match";
    }

    return "";
  }

  /* ------------------ HANDLERS ------------------ */

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as FieldName;
    const value = e.target.value;

    // update value instantly
    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

    // clear existing debounce timer
    const timer = validationTimeoutRef.current[name];
    if (timer) clearTimeout(timer);

    // set new debounce timer (1000ms)
    validationTimeoutRef.current[name] = setTimeout(() => {
      const errorMessage = validateField(name, value);

      setError((prev) => ({
        ...prev,
        [name]: {
          isError: Boolean(errorMessage),
          errMes: errorMessage,
        },
      }));
    }, 1000);
  }

  function onInputBlur(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.name as FieldName;

    // clear debounce timer
    const timer = validationTimeoutRef.current[name];
    if (timer) clearTimeout(timer);

    let value = "";
    if (name === "oldPassword") value = oldPassword;
    if (name === "newPassword") value = newPassword;
    if (name === "confirmPassword") value = confirmPassword;

    const errorMessage = validateField(name, value);

    setError((prev) => ({
      ...prev,
      [name]: {
        isError: Boolean(errorMessage),
        errMes: errorMessage,
      },
    }));
  }

  function onInputFocus(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.name as FieldName;

    // stop pending validation
    const timer = validationTimeoutRef.current[name];
    if (timer) clearTimeout(timer);

    setError((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        isError: false,
        errMes: "",
      },
    }));
  }
  




  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with API data when it changes
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setAvatarPreview(userData.avatar || null);
    }
  }, [userData]);

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
      // Update profile (name and avatar)
      const updateData: { name?: string; avatar?: File | null } = {};
      if (name !== initialName) {
        updateData.name = name;
      }
      if (avatarFile) {
        updateData.avatar = avatarFile;
      }

      if (Object.keys(updateData).length > 0) {
        await updateUserProfile(updateData).unwrap();
      }

      // If SUPER_ADMIN and password fields are filled, change password
      if (role === 'SUPER_ADMIN' && oldPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        if (newPassword.length < 8) {
          toast.error('Password must be at least 8 characters');
          return;
        }
        
        await changePassword({
          oldPassword,
          newPassword,
        }).unwrap();
        
        // Clear password fields
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setAvatarFile(null);
      refetch();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : (error as any)?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      console.error('Update profile error:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();
      
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setName(initialName);
    setAvatarFile(null);
    setAvatarPreview(initialAvatar || null);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm ">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account information
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center cursor-pointer text-blue-600 dark:text-blue-400 font-medium text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Edit2 size={16} className="mr-2" /> Edit
          </button>
        )}
      </div>

      {/* Avatar and Basic Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="relative flex-shrink-0">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt={name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
              {getInitials(name)}
            </div>
          )}
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors cursor-pointer"
              title="Upload avatar"
            >
              <Upload size={14} />
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
        
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base ${
                  isEditing
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-base"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Section - Only for SUPER_ADMIN in edit mode */}
      {role === 'SUPER_ADMIN' && isEditing && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lock size={18} className="mr-2" /> Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  name="oldPassword"
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                { (error.oldPassword.errMes.length > 0)&& <span className='text-red-400 text-xs absolute left-6 -bottom-4'>{error.oldPassword.errMes}</span> }
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  name="newPassword"
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  className={`w-full px-4 py-2 pr-10 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 | border  focus:border-blue-500 dark:focus:border-blue-400 ${ error.newPassword.isError ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                { (error.newPassword.errMes.length > 0) && <span className='text-red-400 text-xs absolute left-6 -bottom-4'>{error.newPassword.errMes}</span> }

              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                { (error.confirmPassword.errMes.length > 0) && <span className='text-red-400 text-xs absolute left-6 -bottom-4'>{error.confirmPassword.errMes}</span> }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Section - For SUPORT_MANAGER and CONTENT_MANAGER */}
      {(role === 'SUPORT_MANAGER' || role === 'CONTENT_MANAGER') && isEditing && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lock size={18} className="mr-2" /> Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">old Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={onInputChange}
                  // onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  // onChange={(e) => setNewPassword(e.target.value)}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={onInputChange}
                  // onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancelEdit}
            disabled={isUpdating || isChangingPassword}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X size={16} className="inline mr-2" /> Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isUpdating || isChangingPassword}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save size={16} className="inline mr-2" /> {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

