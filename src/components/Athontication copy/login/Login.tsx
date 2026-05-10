/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock,  Rocket, Sparkles, CheckCircle, Zap,  Eye, EyeOff, AlertCircle } from 'lucide-react';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLoginMutation } from "@/redux/features/auth/authApi";
import Cookies from "js-cookie";
import Navbar from "@/Layout/Navbar";
import loginimage from "@/assets/prontocorso/Loginwithguy.png";
import logo from "@/assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import img from "@/assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
// import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from "@/hooks/use-theme";
 // OR import toast from "react-hot-toast"; if using react-hot-toast

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // Remove role from schema as it should come from backend
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -right-20 xs:-top-32 xs:-right-32 md:-top-40 md:-right-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80 from-purple-500/20 to-pink-500/20 rounded-full blur-2xl xs:blur-3xl animate-float"></div>
    <div className="absolute -bottom-20 -left-20 xs:-bottom-32 xs:-left-32 md:-bottom-40 md:-left-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80  from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl xs:blur-3xl animate-float-reverse"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 xs:w-72 xs:h-72 md:w-96 md:h-96 from-green-500/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl animate-pulse-slow"></div>
  </div>
);

interface MockInputProps {
  id: string;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const MockInput = React.forwardRef<HTMLInputElement, MockInputProps>(
  ({ id, type = 'text', placeholder, icon: Icon, error, value, onChange, ...props }, ref) => (
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 transition-all duration-300 group-focus-within:text-blue-400 group-hover:text-blue-300 z-10" />
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`flex h-11 xs:h-12 text-black md:h-14 w-full rounded-lg xs:rounded-xl md:rounded-2xl border-2 bg-white/5 px-3 xs:px-3 md:px-4 py-2 xs:py-3 md:py-4 text-xs xs:text-sm md:text-base text-white transition-all duration-500 placeholder:text-gray-500 focus:outline-none focus:ring-1 xs:focus:ring-2 md:focus:ring-4 focus:ring-blue-500/30 focus:border-transparent backdrop-blur-sm transform group-hover:scale-[1.02] ${
            Icon ? 'pl-9 xs:pl-10 md:pl-12' : 'pl-3'
          } ${
            error 
              ? 'border-red-400/80 shadow-lg shadow-red-500/30' 
              : 'border-gray-500/30 hover:border-blue-400/50'
          }`}
          {...props}
        />
        {/* Animated border effect */}
        <div className={`absolute inset-0 rounded-lg xs:rounded-xl md:rounded-2xl from-blue-500 to-purple-500 opacity-0 transition-opacity duration-500 group-focus-within:opacity-20 -z-10 ${
          error ? 'from-red-500 to-pink-500' : ''
        }`}></div>
      </div>
    </div>
  )
);

MockInput.displayName = 'MockInput';

interface MockLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const MockLabel: React.FC<MockLabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1.5 xs:mb-2 md:mb-3 text-[10px] xs:text-xs md:text-sm font-semibold text-gray-200 flex items-center gap-1 xs:gap-1 md:gap-2 transition-all duration-300 hover:text-white">
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
  const baseClasses = "inline-flex items-center justify-center rounded-lg xs:rounded-xl md:rounded-2xl px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 text-xs xs:text-sm md:text-base font-bold text-white shadow-md xs:shadow-lg md:shadow-2xl transition-all duration-500 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-1 xs:focus:ring-2 md:focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group";
  
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
      <span className="relative z-10 flex items-center gap-1 xs:gap-1 md:gap-2">
        {children}
      </span>
    </button>
  );
};

// Enhanced background image URL
const LOGIN_IMAGE =  loginimage
const Login = () => {
  const [login, { isLoading,   }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Extract error message from RTK Query error
  const getErrorMessage = useCallback((error: any): string => {
    if (!error) return '';
    
 
    
    if (typeof error.data === 'string') {
      return error.data;
    }
    
    if (error.status === 401) {
      return 'Invalid email or password';
    }
    
    if (error.status === 404) {
      return 'User not found';
    }
    
    if (error.status === 500) {
      return 'Server error. Please try again later';
    }
    
    return 'invalid email or password';
  }, []);

  const onSubmit = async (data: LoginFormInputs) => {
    
    try {
      // Call the login mutation
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      
    
      // Store tokens in localStorage or cookies
      if (result.data) {
       
        Cookies.set('accessToken', result.data.accessToken);
        Cookies.set('refreshToken', result.data.refreshToken);  
      }
      // Show success state
      setIsLoggedIn(true);
      
   


  setTimeout(() => {
      const role = result.data?.user?.role;
      
      switch (role) {
        case "SUPER_ADMIN":
          return navigate("/admin");
        case "SUPORT_MANAGER": 
          return navigate("/admin");
        case "CONTENT_MANAGER":
          return navigate("/admin");
        case "USER":
          return navigate("/user");
        default:
          return navigate("/");
      }
    }, 500);



    } catch (error: any) {
      console.error('Login error:', error);
      setApiError(getErrorMessage(error));
      
      // Clear form on error
      reset({
        email: data.email,
        password: '',
      });
    }
  };

  const renderContent = useMemo(() => {
    if (isLoggedIn) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-3 xs:p-4 md:p-8 text-center from-gray-800/80 to-gray-900/80 rounded-xl xs:rounded-2xl md:rounded-3xl shadow-xl xs:shadow-2xl border border-gray-700/50 backdrop-blur-xl transform transition-all duration-1000 animate-fade-in">
          <div className="mb-3 xs:mb-4 md:mb-6 p-3 xs:p-4 md:p-6 from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 animate-bounce-in">
            <CheckCircle className="h-8 w-8 xs:h-12 xs:w-12 md:h-20 md:w-20 text-green-400 animate-pulse" />
          </div>
          <h2 className="text-xl xs:text-2xl md:text-5xl font-black from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3 xs:mb-4 md:mb-6 animate-slide-up">
            Welcome Back!
          </h2>
          <p className="text-gray-300 text-xs xs:text-sm md:text-lg mb-4 xs:mb-6 md:mb-8 max-w-md leading-relaxed animate-slide-up delay-200">
            Successfully logged in. Redirecting you to your personalized dashboard...
          </p>
          <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3 text-green-400 animate-pulse">
            <Rocket className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5" />
            <span className="text-xs xs:text-sm md:text-base">Taking you to your workspace...</span>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 xs:gap-4 md:gap-8">
        {/* Display API Error */}
        {apiError && (
          <div className="p-3 xs:p-4 md:p-6 rounded-lg xs:rounded-xl md:rounded-2xl border border-red-500/30 from-red-500/10 to-red-600/5 backdrop-blur-sm animate-shake">
            <div className="flex items-center gap-2 xs:gap-3 text-red-400">
              <AlertCircle className="h-4 w-4 xs:h-5 xs:w-5 md:h-6 md:w-6 flex-shrink-0" />
              <div>
                <p className="font-semibold text-xs xs:text-sm dark:text-white md:text-base mb-1">Login Failed</p>
                <p className="text-[10px] xs:text-xs md:text-sm text-red-300">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Input */}
        <div className="grid gap-1.5 xs:gap-2 md:gap-3 animate-slide-up">
          <MockLabel htmlFor="email">
            <Mail className="h-3.5 w-3.5 xs:h-4 xs:w-4 dark:text-white text-gray-800" />
            <span className="dark:text-white text-gray-800">Email Address</span>
          </MockLabel>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register("email")}
              className={`flex h-11 fucus:border-[#10B981] ring-1 ring-[#10B981] xs:h-12 md:h-14 w-full rounded-lg xs:rounded-xl md:rounded-2xl border-1 bg-white/5 px-3 xs:px-3 md:px-4 py-2 xs:py-3 md:py-4 text-xs xs:text-sm md:text-base text-gray-900 dark:text-white transition-all duration-500 placeholder:text-gray-500 focus:outline-none focus:ring-1 xs:focus:ring-2 md:focus:ring-4   focus:border-transparent backdrop-blur-sm ${
                errors.email || apiError
                  ? 'border-red-400/80 shadow-lg shadow-red-500/30' 
                  : 'border-gray-500/30  hover:border-[#10B981]'
              } pl-9 xs:pl-10 md:pl-12`}
            />
            <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-red-400 text-[10px] xs:text-xs md:text-sm mt-1 xs:mt-1 md:mt-2 flex items-center gap-1 xs:gap-1 md:gap-2 animate-shake">
              <Zap className="h-2.5 w-2.5 xs:h-3 xs:w-3 md:h-4 md:w-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="grid gap-1.5 xs:gap-2 md:gap-3 animate-slide-up delay-100">
          <MockLabel htmlFor="password">
            <Lock className="h-3.5 w-3.5 xs:h-4 xs:w-4 dark:text-white text-gray-800" />
            <span className="dark:text-white text-gray-800">Password</span>
          </MockLabel>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className={`flex h-11 fucus:border-[#10B981] ring-1 ring-[#10B981] xs:h-12 md:h-14 w-full rounded-lg xs:rounded-xl md:rounded-2xl border-1 bg-white/5 px-3 xs:px-3 md:px-4 py-2 xs:py-3 md:py-4 text-xs xs:text-sm md:text-base text-gray-900 dark:text-white transition-all duration-500 placeholder:text-gray-500 focus:outline-none focus:ring-1 xs:focus:ring-2 md:focus:ring-4   focus:border-transparent backdrop-blur-sm ${
                errors.password || apiError
                  ? 'border-red-400/80 shadow-lg shadow-red-500/30' 
                  : 'border-gray-500/30  hover:border-[#10B981]'
              } pl-9 xs:pl-10 md:pl-12 pr-9 xs:pr-10 md:pr-12`}
            />
            <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
            >
              {showPassword ? 
                <EyeOff className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5" /> : 
                <Eye className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5" />
              }
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-[10px] xs:text-xs md:text-sm mt-1 xs:mt-1 md:mt-2 flex items-center gap-1 xs:gap-1 md:gap-2 animate-shake">
              <Zap className="h-2.5 w-2.5 xs:h-3 xs:w-3 md:h-4 md:w-4" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password Link */}

{/* Forgot Password Link */}
<div className="flex justify-end animate-slide-up delay-150">
  <Link to="/forgot-password" className="group">
    <span className="text-[10px] xs:text-xs md:text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-1 xs:gap-1 md:gap-2">
      <Lock className="h-2.5 w-2.5 xs:h-3 xs:w-3 md:h-4 md:w-4 dark:text-white text-gray-800" />
      <span className="dark:text-white text-gray-800">Forgot your password?</span>
    </span>
  </Link>
</div>



 
        {/* Submit Button */}
        <MockButton 
          type="submit" 
          disabled={isLoading} 
          variant="success"
          className="w-full h-11 !bg-[#10B981] hover:!bg-[#0ea571] text-white cursor-pointer xs:h-12 md:h-14 text-xs xs:text-sm md:text-lg animate-slide-up delay-300 mt-1 xs:mt-2 md:mt-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3">
              <div className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 border-2 xs:border-2 md:border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-xs xs:text-xs md:text-base">Signing You In...</span>
            </div>
          ) : (
            <>
              <Rocket className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-1 xs:mr-1 md:mr-2" />
              <span className="text-xs xs:text-xs md:text-base">Access Your Account</span>
            </>
          )}
        </MockButton>
      </form>
    );
  }, [isLoggedIn, errors, isLoading, apiError, showPassword, handleSubmit, onSubmit, register]);

  return (

<>

<Navbar />

    <div className="min-h-screen   text-white flex items-center justify-center p-1 xs:p-2 md:p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Mobile Image Banner */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-32 xs:h-36 md:h-48 overflow-hidden">
        <div className="absolute inset-0 from-blue-500/10 via-purple-500/10 to-cyan-500/10 z-10"></div>
        <img
          src={LOGIN_IMAGE}
          alt="Collaborative workspace"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 right-3 xs:right-4 bg-black/40 dark:bg-white/40 backdrop-blur-xl rounded-lg xs:rounded-xl p-3 xs:p-4 border border-white/10 dark:border-black/10">
          <h3 className="text-base xs:text-lg font-bold text-white mb-1.5 xs:mb-2 flex items-center gap-1.5 xs:gap-2">
            <Sparkles className="h-4 w-4 xs:h-5 xs:w-5 text-[#10B981]" />
            Achieve Your Italian Fluency Goals.
          </h3>
          <p className="text-black dark:text-white text-[10px] xs:text-xs leading-relaxed">
            Pick up exactly where you left off. Your next lesson is waiting for you.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 shadow-xl xs:shadow-3xl rounded-lg xs:rounded-xl md:rounded-3xl overflow-hidden border border-gray-700/50 backdrop-blur-xl transform transition-all duration-1000 hover:shadow-4xl relative z-10 mt-32 xs:mt-36 md:mt-0 lg:mt-0">
        {/* Left Side: Form */}
        <div className="flex items-center justify-center py-6 xs:py-8 md:py-16 px-3 xs:px-4 md:px-6 lg:px-16   lg:min-h-[600px]">
          <div className="mx-auto grid w-full max-w-md gap-4 xs:gap-6 md:gap-10">
            <div className="grid gap-3 xs:gap-4 md:gap-6 text-center">
              <div className="inline-flex items-center gap-1.5 xs:gap-2 bg-gray-100 dark:bg-green-50/30 px-3 xs:px-4 py-1.5 xs:py-2 md:px-6 md:py-3 rounded-lg xs:rounded-xl md:rounded-2xl border border-gray-200 dark:border-green-100/30 mb-2 md:mb-4 transform transition-all duration-500 hover:scale-105">
                <div className="h-1.5 w-1.5 xs:h-2 xs:w-2 md:h-3 md:w-3 bg-[#10B981] rounded-full animate-pulse"></div>
                <span className="text-[#10B981] text-[10px] xs:text-xs md:text-base font-bold">Welcome Back!</span>
                <Sparkles className="h-2.5 w-2.5 xs:h-3 xs:w-3 md:h-4 md:w-4 text-[#10B981]" />
              </div>
              {/* <h1 className="text-2xl dark:text-white text-gray-800 xs:text-3xl md:text-6xl font-black from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                Login
              </h1> */}
              <p className="text-balance text-gray-300 text-xs dark:text-gray-800 text-left font-bold xs:text-sm md:text-2xl leading-relaxed animate-fade-in">
                <span className="dark:text-white text-gray-800">Welcome back! Ready to continue your Italian practice?
                </span>
                {/* <span className="dark:text-white text-gray-800">Access your account and continue your creative journey with us.</span> */}
              </p>
            </div>

            {renderContent}
            
            <div className="mt-3 xs:mt-4 md:mt-8 text-center text-[10px] xs:text-xs md:text-base text-gray-400 animate-fade-in">
              {isLoggedIn ? (
                <div className="flex items-center justify-center gap-1.5 xs:gap-2 md:gap-3 text-green-400 animate-pulse">
                  <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5" />
                  <span className="text-[10px] xs:text-xs md:text-base">Redirecting to your dashboard...</span>
                </div>
              ) : (
                <>
                  New to our platform?{" "}
                  <Link to="/signup">
                    <button className="font-bold text-black dark:text-white cursor-pointer hover:text-gray-700 transition-all duration-300  text-[10px] xs:text-xs md:text-base">
                      Create Account Here
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Visual - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block relative overflow-hidden group">
          <div className="absolute inset-0 from-blue-500/10 via-purple-500/10 to-cyan-500/10 z-10"></div>
          <img
            src={LOGIN_IMAGE}
            alt="Collaborative workspace"
            className="h-full w-full object-cover transform scale-110 transition-transform duration-7000 group-hover:scale-125"
          />
          <div className="absolute bottom-10 left-10 right-10 bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/10 transform transition-all duration-500 group-hover:scale-105">
            {/* <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-400" />
              Continue Your Journey
            </h3> */}


<h3 className="text-3xl font-bold text-black mb-4 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-[#10B981]" />
              Achieve Your Italian Fluency Goals.
            </h3>


            <p className="text-black   text-base leading-relaxed">
              Pick up exactly where you left off. Your next lesson is waiting for you.
            </p>
          </div>
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 pt-20 pb-10 px-[5%] border-t border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div>
              <Link to="/#home" state={{ from: "/" }} className="flex items-center gap-4">
                <img src={isDarkMode ? img : logo} alt="ProntoCorso" className="w-50  mb-6 rounded-full" />

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

export default Login;









 