/* eslint-disable @typescript-eslint/no-explicit-any */

// src/pages/ResetPasswordForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import Navbar from "@/Layout/Navbar";
  
// Validation Schema
const resetPasswordSchema = z
  .object({
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -right-20 xs:-top-32 xs:-right-32 md:-top-40 md:-right-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80 from-purple-500/20 to-pink-500/20 rounded-full blur-2xl xs:blur-3xl animate-float"></div>
    <div className="absolute -bottom-20 -left-20 xs:-bottom-32 xs:-left-32 md:-bottom-40 md:-left-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80  from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl xs:blur-3xl animate-float-reverse"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 xs:w-72 xs:h-72 md:w-96 md:h-96 from-green-500/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl animate-pulse-slow"></div>
  </div>
);

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  // const token = searchParams.get("token") || searchParams.get("code") || "";
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const resetForm = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

 

const onSubmit = async (data: ResetPasswordInputs) => {
  if (!email) {
    alert("Missing email. Please request a new password reset.");
    navigate("/forgot-password");
    return;
  }

  try {
    await resetPassword({
      email: email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }).unwrap();

    setIsSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 3000);

  } catch (error: any) {
    alert(error?.data?.message || "Failed to reset password");
  }
};



  if (isSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen text-white flex items-center justify-center p-1 xs:p-2 md:p-4 relative overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="w-full max-w-md bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500 dark:text-green-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            Your password has been reset successfully. Redirecting to login...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10B981] mx-auto"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
   <>
    <Navbar />
    <div className="min-h-screen text-white flex items-center justify-center p-1 xs:p-2 md:p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-full max-w-md bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50">
        <button
          onClick={() => navigate("/forgot-password")}
          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Reset Password</h2>
        
        <div className="mb-6 p-3 bg-white/10 dark:bg-blue-900/20 rounded-lg border border-white/10">
          <p className="text-sm text-gray-800 dark:text-blue-300">
            Reset password for: <strong className="text-gray-800 dark:text-white">{email}</strong>
          </p>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
          Enter your new password below
        </p>

        <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1.5">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...resetForm.register("password")}
                placeholder="Enter new password"
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors hover:border-[#10B981]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {resetForm.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {resetForm.formState.errors.password.message}
              </p>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...resetForm.register("confirmPassword")}
                placeholder="Confirm new password"
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors hover:border-[#10B981]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {resetForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-[#10B981] hover:bg-[#0ea571] text-white py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
        </div>
      </div>
    </div></>
  );
};

export default ResetPasswordForm;










// // src/pages/ResetPasswordForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

// // Validation Schema
// const resetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

// const ResetPasswordForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token") || "";
//   const email = searchParams.get("email") || "";
//   const navigate = useNavigate();

//   const [resetPassword] = useResetPasswordMutation();

//   const resetForm = useForm<ResetPasswordInputs>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   const onSubmit = async (data: ResetPasswordInputs) => {
//     try {
//       await resetPassword({ token, email, newPassword: data.password }).unwrap();
//       alert("Password reset successful!");
//       navigate("/login");
//     } catch (error: any) {
//       alert(error?.data?.message || "Failed to reset password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
//       <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 transition-colors">
//         <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reset Password</h2>
//         <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">Enter your new password below</p>

//         <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
//           {/* Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
//               New Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 {...resetForm.register("password")}
//                 placeholder="New password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors hover:border-[#10B981]"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
//               Confirm Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 {...resetForm.register("confirmPassword")}
//                 placeholder="Confirm password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors hover:border-[#10B981]"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordForm;






// // src/pages/ResetPasswordForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

// // Validation Schema
// const resetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

// const ResetPasswordForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token") || "";
//   const email = searchParams.get("email") || "";
//   const navigate = useNavigate();

//   const [resetPassword] = useResetPasswordMutation();

//   const resetForm = useForm<ResetPasswordInputs>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   const onSubmit = async (data: ResetPasswordInputs) => {
//     try {
//       await resetPassword({ token, email, newPassword: data.password }).unwrap();
//       alert("Password reset successful!");
//       navigate("/login");
//     } catch (error: any) {
//       alert(error?.data?.message || "Failed to reset password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
//         <p className="text-gray-500 text-sm mb-6">Enter your new password below</p>

//         <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
//           {/* Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               New Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 {...resetForm.register("password")}
//                 placeholder="New password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Confirm Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 {...resetForm.register("confirmPassword")}
//                 placeholder="Confirm password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordForm;













// // Login/ResetPasswordForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";

// // Validation
// const resetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

// interface Props {
//   resetPassword: any;
//   email: string;
//   onSuccess: () => void;
// }

// const ResetPasswordForm = ({ resetPassword, email, onSuccess }: Props) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const resetForm = useForm<ResetPasswordInputs>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   // const onSubmit = async (data: ResetPasswordInputs) => {
//   //   try {
//   //     await resetPassword({ email, password: data.password }).unwrap();
//   //     onSuccess();
//   //   } catch (error: any) {
//   //     alert(error.data?.message || "Failed to reset password");
//   //   }
//   // };

//  const [searchParams] = useSearchParams();
//   const token = searchParams.get("token") || "";
//   const email = searchParams.get("email") || "";
//   const navigate = useNavigate();

//   const [newPassword, setNewPassword] = useState("");
//   const [resetPassword] = useResetPasswordMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await resetPassword({ token, email, newPassword }).unwrap();
//       alert("Password reset successful!");
//       navigate("/login"); // send user to login page after success
//     } catch (error: any) {
//       alert(error?.data?.message || "Failed to reset password");
//     }
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
//         <p className="text-gray-500 text-sm mb-6">Enter your new password below</p>

//         <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password *</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 {...resetForm.register("password")}
//                 placeholder="New password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.password && (
//               <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.password.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 {...resetForm.register("confirmPassword")}
//                 placeholder="Confirm password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.confirmPassword.message}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordForm;
