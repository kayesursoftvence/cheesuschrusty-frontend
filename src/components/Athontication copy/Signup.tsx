/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
import { Mail, Lock, User, Sparkles, Zap, Eye, EyeOff, Target, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import { toast } from 'react-hot-toast';
import Navbar from '@/Layout/Navbar';
import signupimage from "@/assets/prontocorso/PeopleWorking.png";
import logoLight from "@/assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import logoDark from "@/assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
// import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from '@/hooks/use-theme';
// --- Type Definitions ---
interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dailyGoalMinutes: number;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dailyGoalMinutes?: string;
  image?: string;
  apiError?: string;
}

interface MockInputProps {
  id: string;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}

// Allowed daily goal values from backend
const ALLOWED_DAILY_GOALS = [10, 15, 20, 30, 45, 60];

// --- Animated Background Component ---
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -right-20 xs:-top-32 xs:-right-32 md:-top-40 md:-right-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80 from-purple-500/20 to-pink-500/20 rounded-full blur-2xl xs:blur-3xl animate-float"></div>
    <div className="absolute -bottom-20 -left-20 xs:-bottom-32 xs:-left-32 md:-bottom-40 md:-left-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80  from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl xs:blur-3xl animate-float-reverse"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 xs:w-72 xs:h-72 md:w-96 md:h-96 from-green-500/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl animate-pulse-slow"></div>
  </div>
);

// --- Mock Components with Enhanced Animations ---
const MockInput = React.forwardRef<HTMLInputElement, MockInputProps>(
  ({ id, type = 'text', placeholder, icon: Icon, error, value, onChange, ...props }, ref) => (
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 z-10" />
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`flex h-11 fucus:border-[#10B981] ring-1 ring-[#10B981] xs:h-12 md:h-14 w-full rounded-lg xs:rounded-xl md:rounded-2xl border-1 bg-white/5 px-3 xs:px-3 md:px-4 py-2 xs:py-3 md:py-4 text-xs xs:text-sm md:text-base text-gray-900 dark:text-white transition-all duration-500 placeholder:text-gray-500 focus:outline-none focus:ring-1 xs:focus:ring-2 md:focus:ring-4   focus:border-transparent backdrop-blur-sm ${Icon ? 'pl-9 xs:pl-10 md:pl-12' : 'pl-3 xs:pl-3 md:pl-4'
            } ${error
              ? 'border-red-400/80 shadow-lg shadow-red-500/30'
              : 'border-gray-500/30  hover:border-[#10B981]'
            }`}
          {...props}
        />
        {/* Animated border effect */}
        <div className={`absolute inset-0 rounded-xl md:rounded-2xl from-blue-500 to-purple-500 opacity-0 transition-opacity duration-500 group-focus-within:opacity-20 -z-10 ${error ? 'from-red-500 to-pink-500' : ''
          }`}></div>
      </div>
    </div>
  )
);

MockInput.displayName = 'MockInput';

// New Select Component for Daily Goal
interface MockSelectProps {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  placeholder?: string;
}

const MockSelect: React.FC<MockSelectProps> = ({ id, value, onChange, error, icon: Icon, placeholder }) => {
  return (
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 z-10" />
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`flex h-11 fucus:border-[#10B981] ring-1 ring-[#10B981] xs:h-12 md:h-14 w-full rounded-lg xs:rounded-xl md:rounded-2xl border-1 bg-white/5 px-3 xs:px-3 md:px-4 py-2 xs:py-3 md:py-4 text-xs xs:text-sm md:text-base text-gray-900 dark:text-white transition-all duration-500 focus:outline-none focus:ring-1 xs:focus:ring-2 md:focus:ring-4   focus:border-transparent backdrop-blur-sm appearance-none cursor-pointer ${Icon ? 'pl-9 xs:pl-10 md:pl-12 pr-9 xs:pr-10 md:pr-12' : 'pl-3 xs:pl-3 md:pl-4 pr-9 xs:pr-10 md:pr-12'
            } ${error
              ? 'border-red-400/80 shadow-lg shadow-red-500/30'
              : 'border-gray-500/30  hover:border-[#10B981]'
            }`}
        >
          <option value="" disabled className="bg-white dark:bg-gray-800 text-black dark:text-white">
            {placeholder || 'Select an option'}
          </option>
          {ALLOWED_DAILY_GOALS.map((goal) => (
            <option key={goal} value={goal} className="bg-white dark:bg-gray-800 text-black dark:text-white py-2">
              {goal} minutes
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {/* Animated border effect */}
        <div className={`absolute inset-0 rounded-xl md:rounded-2xl from-blue-500 to-purple-500 opacity-0 transition-opacity duration-500 group-focus-within:opacity-20 -z-10 ${error ? 'from-red-500 to-pink-500' : ''
          }`}></div>
      </div>
    </div>
  );
};

interface MockLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const MockLabel: React.FC<MockLabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-200 flex items-center gap-1 md:gap-2 transition-all duration-300 hover:text-white">
    {children}
  </label>
);

interface MockButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'gradient';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const MockButton: React.FC<MockButtonProps> = ({
  children,
  type = 'button',
  variant = 'gradient',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl md:rounded-2xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-bold text-white shadow-lg md:shadow-2xl transition-all duration-500 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 md:focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/30",
    secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500/30",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500/30",
    gradient: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 focus:ring-blue-500/30"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-1 md:gap-2">
        {children}
      </span>
    </button>
  );
};

// Enhanced background image URL
const CUBE_GROUP_IMAGE = signupimage
// --- Validation Function ---
const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!data.username || data.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.password || data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.password = "Password must include uppercase, lowercase, and numbers.";
  }

  if (!data.confirmPassword || data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!data.dailyGoalMinutes || !ALLOWED_DAILY_GOALS.includes(data.dailyGoalMinutes)) {
    errors.dailyGoalMinutes = `Please select a valid daily goal from: ${ALLOWED_DAILY_GOALS.join(', ')} minutes.`;
  }

  return errors;
};

// --- Main Application Component ---
const App: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Update dark mode status based on theme
  useEffect(() => {
    const updateDarkMode = () => {
      if (theme === "dark") {
        setIsDarkMode(true);
      } else if (theme === "light") {
        setIsDarkMode(false);
      } else {
        // theme === "system"
        setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    };

    updateDarkMode();

    // Listen for system preference changes if theme is "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => setIsDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);


  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dailyGoalMinutes: 30
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  //(selectedFile)
  const handleInputChange = useCallback((field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = field === 'dailyGoalMinutes'
        ? parseInt(e.target.value) || 0
        : e.target.value;

      setFormData(prev => ({
        ...prev,
        [field]: value
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }

      // Clear API error on any input change
      if (errors.apiError) {
        setErrors(prev => ({ ...prev, apiError: undefined }));
      }
    }, [errors]);

  const handleSelectChange = useCallback((field: keyof FormData) =>
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = field === 'dailyGoalMinutes'
        ? parseInt(e.target.value) || 0
        : e.target.value;

      setFormData(prev => ({
        ...prev,
        [field]: value
      }));

      // Clear error when user selects
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }

      // Clear API error on any input change
      if (errors.apiError) {
        setErrors(prev => ({ ...prev, apiError: undefined }));
      }
    }, [errors]);




  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      // Prepare the data for API call - exactly matches your API structure
      const userData = {
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        dailyGoalMinutes: formData.dailyGoalMinutes,
        role: "USER"
      };

      //("Sending registration data:", userData);

      // Call the register mutation
      const response = await register(userData).unwrap();

      // Store user data and tokens
      if (response.data) {
        toast.success('Account created successfully! Please verify your email.');
        navigate('/verify-email', { state: { email: userData.email } });
        return;
      }

    } catch (error: any) {
      // Handle API errors
      let errorMessage = "Registration failed. Please try again.";

      if (error?.data?.message) {
        if (Array.isArray(error.data.message)) {
          errorMessage = error.data.message.join(', ');
        } else {
          errorMessage = error.data.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 409) {
        errorMessage = "Email already registered. Please use a different email or login.";
      } else if (error?.status === 400) {
        errorMessage = "Invalid data. Please check your information.";
      } else if (error?.status === 422) {
        errorMessage = "Validation error. Please check all fields.";
      } else if (error?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setErrors(prev => ({ ...prev, apiError: errorMessage }));

      // Show error toast
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderContent = useMemo(() => {


    return (
      <form onSubmit={handleSubmit} className="grid gap-4 md:gap-8">
        {/* API Error Display */}
        {errors.apiError && (
          <div className="p-4 md:p-5 bg-red-500/10 border border-red-500/30 rounded-xl md:rounded-2xl mb-4 animate-shake">
            <div className="flex items-center gap-2 md:gap-3 text-red-400">
              <Zap className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <p className="text-xs md:text-sm font-medium">{errors.apiError}</p>
            </div>
          </div>
        )}

        {/* Name Input */}
        <div className="grid gap-2 md:gap-3 animate-slide-up">
          <MockLabel htmlFor="name">
            <User className="h-4 w-4  dark:text-white text-gray-800" />
            <span className='text-gray-800 dark:text-white'>Full Name</span>
          </MockLabel>
          <MockInput
            id="name"
            type="text"
            placeholder="Enter your full name"
            icon={User}
            value={formData.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            required
          />
          {errors.name && (
            <p className="text-red-400 text-xs md:text-sm mt-1 md:mt-2 flex items-center gap-1 md:gap-2 animate-shake">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Username Input */}
        <div className="grid gap-2 md:gap-3 animate-slide-up delay-75">
          <MockLabel htmlFor="username">
            <User className="h-4 w-4 dark:text-white text-gray-800" />
            <span className='dark:text-white text-gray-800'>Username</span>
          </MockLabel>
          <MockInput
            id="username"
            type="text"
            placeholder="Choose a username"
            icon={User}
            value={formData.username}
            onChange={handleInputChange('username')}
            error={errors.username}
            required
          />
          {errors.username && (
            <p className="text-red-400 text-xs md:text-sm mt-1 md:mt-2 flex items-center gap-1 md:gap-2 animate-shake">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              {errors.username}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div className="grid gap-2 md:gap-3 animate-slide-up delay-100">
          <MockLabel htmlFor="email">
            <Mail className="h-4 w-4 dark:text-white text-gray-800" />
            <span className='dark:text-white text-gray-800'> Email Address</span>
          </MockLabel>
          <MockInput
            id="email"
            type="email"
            placeholder="your.email@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            required
          />
          {errors.email && (
            <p className="text-red-400 text-xs md:text-sm mt-1 md:mt-2 flex items-center gap-1 md:gap-2 animate-shake">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="grid gap-2 md:gap-3 animate-slide-up delay-200">
          <MockLabel htmlFor="password">
            <Lock className="h-4 w-4 dark:text-white text-gray-800" />
            <span className='dark:text-white text-gray-800'> Password</span>
          </MockLabel>
          <div className="relative">
            <MockInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              icon={Lock}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 cursor-pointer dark:text-white text-black" /> : <Eye className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 cursor-pointer dark:text-white text-black" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs md:text-sm mt-1 md:mt-2 flex items-center gap-1 md:gap-2 animate-shake">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              {errors.password}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1 md:mt-2 flex items-center gap-1 md:gap-2">
            <Sparkles className="h-3 w-3" />
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className="grid gap-2 md:gap-3 animate-slide-up delay-250">
          <MockLabel htmlFor="confirmPassword">
            <Lock className="h-4 w-4 dark:text-white text-gray-800" />
            <span className='dark:text-white text-gray-800'> Confirm Password</span>
          </MockLabel>
          <div className="relative">
            <MockInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 cursor-pointer dark:text-white text-black" /> : <Eye className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 cursor-pointer dark:text-white text-black" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs md:text-sm mt-1 md:mt-2 flex items-center gap-1 md:gap-2 animate-shake">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Daily Goal Minutes Select */}
        <div className="grid gap-2 md:gap-3 animate-slide-up delay-300">
          <MockLabel htmlFor="dailyGoalMinutes">
            <Target className="h-4 w-4 dark:text-white text-gray-800" />
            <span className='dark:text-white text-gray-800'> Daily Goal (Minutes)</span>
          </MockLabel>
          <MockSelect
            id="dailyGoalMinutes"
            value={formData.dailyGoalMinutes.toString()}
            onChange={handleSelectChange('dailyGoalMinutes')}
            error={errors.dailyGoalMinutes}
            icon={Target}

            placeholder="Select your daily goal"
          />
          {errors.dailyGoalMinutes && (
            <p className="text-red-400 text-xs md:text-sm mt-1 md:mt-2 flex items-center gap-1 md:gap-2 animate-shake">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              {errors.dailyGoalMinutes}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1 md:mt-2 flex items-center gap-1 md:gap-2">
            <Sparkles className="h-3 w-3" />
            Choose from: {ALLOWED_DAILY_GOALS.join(', ')} minutes
          </p>
        </div>

        {/* Terms and Privacy Policy Agreement Checkbox */}
        <div className="flex items-start gap-3 md:gap-4 animate-slide-up delay-350 mt-4 md:mt-6">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 md:h-5 md:w-5 rounded border-2 border-gray-500/30 bg-white/5 text-[#10B981] focus:ring-2 focus:ring-[#10B981]/30 focus:ring-offset-0 cursor-pointer transition-all duration-300 hover:border-[#34D399]/50 checked:bg-[#10B981] checked:border-[#10B981] flex-shrink-0 accent-[#10B981]"
          />
          <label htmlFor="agreeToTerms" className="text-xs dark:text-white text-gray-800 md:text-sm text-gray-300 dark:text-gray-300 leading-relaxed cursor-pointer">
            I agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline transition-colors hover:text-blue-300">
              Terms of Service
            </a>
            {" "}and have read the{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline transition-colors hover:text-blue-300">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        <MockButton
          type="submit"
          disabled={isSubmitting || isRegistering || !agreedToTerms}
          variant="success"
          className="w-full h-12 !bg-[#10B981] hover:!bg-[#0ea571] text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer md:h-14 text-sm md:text-lg animate-slide-up delay-400 mt-2 md:mt-6"
        >
          {isSubmitting || isRegistering ? (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-4 w-4 md:h-5 md:w-5 border-2 md:border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-xs md:text-base dark:text-white text-gray-800">Creating Your Account...</span>
            </div>
          ) : (
            <>
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              <span className="text-xs md:text-base dark:text-white text-gray-800">Create Account</span>
            </>
          )}
        </MockButton>
      </form>
    );
  }, [formData, errors, isSubmitting, isRegistering, showPassword, showConfirmPassword, agreedToTerms, handleInputChange, handleSelectChange, handleSubmit]);

  return (

    <>
      <Navbar />
      <div className="min-h-screen   text-white flex items-center justify-center p-1 xs:p-2 md:p-4 relative overflow-hidden">
        <AnimatedBackground />

        {/* Mobile Image Banner */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-32 xs:h-36 md:h-48 overflow-hidden">
          <div className="absolute inset-0 from-blue-500/10 via-purple-500/10 to-cyan-500/10 z-10"></div>
          <img
            src={CUBE_GROUP_IMAGE}
            alt="Abstract futuristic background"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 right-3 xs:right-4 bg-black/40 backdrop-blur-xl rounded-lg xs:rounded-xl p-3 xs:p-4 border border-white/10">
            <h3 className="text-base xs:text-lg font-bold text-white mb-1.5 xs:mb-2 flex items-center gap-1.5 xs:gap-2">
              <Sparkles className="h-4 w-4 xs:h-5 xs:w-5 text-[#10B981]" />
              Achieve Your Italian Fluency Goals.
            </h3>
            <p className="text-gray-300 text-[10px] xs:text-xs leading-relaxed">
              Pick up exactly where you left off. Your next lesson is waiting for you.
            </p>
          </div>
        </div>

        <div className="w-full max-w-7xl lg:grid lg:grid-cols-2 shadow-xl xs:shadow-3xl rounded-lg xs:rounded-xl md:rounded-3xl overflow-hidden border border-gray-700/50 backdrop-blur-xl transform transition-all duration-1000 hover:shadow-4xl relative z-10 mt-32 xs:mt-36 md:mt-0 lg:mt-0">
          {/* Left Side: Form */}
          <div className="flex items-center justify-center py-6 xs:py-8 md:py-16 px-3 xs:px-4 md:px-6 lg:px-16   lg:min-h-[600px]">
            <div className="mx-auto grid w-full max-w-md gap-4 xs:gap-6 md:gap-10">
              <div className="grid gap-3 xs:gap-4 md:gap-6 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-2">
                  <img src={isDarkMode ? logoDark : logoLight} alt="ProntoCorso Logo" className="h-12  md:h-16 " />

                </div>


                {/* <div className={`flex justify-center mb-2 ${isDarkMode ? 'dark:opacity-100 dark:scale-114  ' : 'opacity-100 scale-110'}`}>
                <div className={`h-12 w-48 md:h-16 md:w-64 flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'scale-100' : 'scale-100'}`}>
                  <img 
                    src={isDarkMode ? logoDark : logoLight} 
                    alt="ProntoCorso Logo" 
                    className={`h-full w-full object-contain transition-opacity duration-300 ${isDarkMode ? 'dark:brightness-100' : 'brightness-100'}`}
                  />
                </div>
              </div> */}


                <div className="inline-flex items-center gap-2 from-[#10B981]/20 to-emerald-500/20 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-[#10B981]/30 mb-2 md:mb-4 transform transition-all duration-500 hover:scale-105">
                  <div className="h-2 w-2 md:h-3 md:w-3 bg-[#10B981] rounded-full animate-pulse"></div>
                  <span className="text-[#10B981] text-xs md:text-base font-bold">Join Thousands of Creators</span>
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-[#10B981]" />
                </div>
                <h1 className="text-3xl dark:text-white md:text-5xl   text-black font-black animate-gradient">
                  Create Account
                </h1>
                <p className="text-balance text-gray-700 dark:text-gray-500 text-sm md:text-xl leading-relaxed animate-fade-in text-left">
                  Start your journey with us. Unlock exclusive features and join our growing community.
                </p>
              </div>

              {renderContent}

              <div className="mt-4 md:mt-8 text-center text-xs md:text-base text-gray-400 animate-fade-in">
                <>
                  Already have an account?{" "}
                  <Link to="/login">
                    <button className="font-bold text-black  dark:text-white cursor-pointer hover:text-gray-700 transition-all duration-300 text-xs md:text-base">
                      Sign In Here
                    </button>
                  </Link>
                </>
              </div>
            </div>
          </div>

          {/* Right Side: Visual - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block relative overflow-hidden group">
            <div className="absolute inset-0 from-blue-500/10 via-purple-500/10 to-cyan-500/10 z-10"></div>
            <img
              src={CUBE_GROUP_IMAGE}
              alt="Abstract futuristic background"
              className="h-full w-full object-cover transform scale-110 transition-transform duration-7000 group-hover:scale-125"
            />
            {/* <div className="absolute bottom-10 left-10 right-10 bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/10 transform transition-all duration-500 group-hover:scale-105">
            <h3 className="text-3xl font-bold text-black mb-4 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-[#10B981]" />
              Achieve Your Italian Fluency Goals.
            </h3>
            <p className="text-black dark:text-gray-300 text-base leading-relaxed">
              Pick up exactly where you left off. Your next lesson is waiting for you.
            </p>
          </div> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 pt-20 pb-10 px-[5%] border-t border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div>
              <Link to="/#home" state={{ from: "/" }} className="flex items-center gap-4">
                <img src={isDarkMode ? logoDark : logoLight} alt="ProntoCorso" className="w-50  mb-6 rounded-full" />

              </Link>
              <p className="text-sm leading-relaxed mb-8 text-slate-600 dark:text-gray-400">
                Empowering citizenship applicants with the specific tactical
                skills needed to pass the <span className="font-bold text-slate-900 dark:text-white">B1c</span> exam.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h5 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
                  Portal
                </h5>
                <ul className="space-y-4 text-sm font-semibold">
                  <li>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate("/#pricing");
                        // Wait for navigation, then scroll to pricing section
                        setTimeout(() => {
                          const pricingSection = document.getElementById("pricing");
                          if (pricingSection) {
                            pricingSection.scrollIntoView({ behavior: "smooth" });
                          } else {
                            // If element not found immediately, try again after a short delay
                            setTimeout(() => {
                              const pricingSection = document.getElementById("pricing");
                              pricingSection?.scrollIntoView({ behavior: "smooth" });
                            }, 500);
                          }
                        }, 100);
                      }}
                      className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
                  Legal
                </h5>
                <ul className="space-y-4 text-sm font-semibold">
                  <li>
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h5 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
                About
              </h5>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400 italic">
                ProntoCorso is an independent tool built to accompany your
                primary language education. Focused on CILS, CELI, and PLIDA
                preparation.
              </p>
            </div>
          </div>

          {/* Disclaimer Text */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-gray-700">
            <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-300 text-center max-w-5xl mx-auto">
              ProntoCorso is an independent educational tool. It accompanies your primary language education. We focus on preparation standards for exams including CILS, CELI, and PLIDA. We are not affiliated with these exam bodies. All content is original. It is not derived from official proprietary exam materials. We strictly adhere to the CEFR B1 Standard. This content is for practice purposes only. It does not guarantee a passing score. CILS is a trademark of the Università per Stranieri di Siena. CELI is a trademark of the Università per Stranieri di Perugia. PLIDA is a trademark of the Dante Alighieri Society. All other trademarks are the property of their respective owners.
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-gray-400">
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </a> |   <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms of Service
            </a>  |  © {new Date().getFullYear()} ProntoCorso.
          </p>
        </div>
      </footer>
    </>

  );
};

export default App;




