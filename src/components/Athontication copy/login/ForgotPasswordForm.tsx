/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Key, CheckCircle, ArrowLeft } from "lucide-react";
import { useForgotPasswordMutation, useVerifyResetCodeMutation } from "@/redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import Navbar from "@/Layout/Navbar";

// Validation schemas
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const verifyCodeSchema = z.object({
  code: z.string().min(6, "Code must be 6 characters").max(6, "Code must be 6 characters"),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
type VerifyCodeInputs = z.infer<typeof verifyCodeSchema>;

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -right-20 xs:-top-32 xs:-right-32 md:-top-40 md:-right-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80 from-purple-500/20 to-pink-500/20 rounded-full blur-2xl xs:blur-3xl animate-float"></div>
    <div className="absolute -bottom-20 -left-20 xs:-bottom-32 xs:-left-32 md:-bottom-40 md:-left-32 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80  from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl xs:blur-3xl animate-float-reverse"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 xs:w-72 xs:h-72 md:w-96 md:h-96 from-green-500/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl animate-pulse-slow"></div>
  </div>
);

const ForgotPasswordForm: React.FC = () => {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  
  const navigate = useNavigate();
  
  // Forms
  const emailForm = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  
  const codeForm = useForm<VerifyCodeInputs>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [verifyResetCode, { isLoading: isVerifyingCode }] = useVerifyResetCodeMutation();

  // Step 1: Send reset code
  const onSendCode = async (data: ForgotPasswordInputs) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setEmail(data.email);
      setSentEmail(data.email);
      setStep("code");
    } catch (error: any) {
      alert(error?.data?.message || "Failed to send reset code");
    }
  };

  // Step 2: Verify reset code
  const onVerifyCode = async (data: VerifyCodeInputs) => {
    try {
      const response = await verifyResetCode({
        email,
        code: data.code,
      }).unwrap();

      // Extract token from response if available, otherwise use code as token
      const token = (response as any)?.token || (response as any)?.data?.token || data.code;
      
      setStep("success");
      
      // Navigate to reset password page with email and token
      setTimeout(() => {
        navigate(`/reset?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
      }, 2000);
      
    } catch (error: any) {
      alert(error?.data?.message || "Invalid or expired code");
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <div className="w-full max-w-md bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 transition-colors">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Forgot Password?</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
              Enter your email and we'll send you a verification code
            </p>

            <form onSubmit={emailForm.handleSubmit(onSendCode)} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1.5">Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    {...emailForm.register("email")}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors hover:border-[#10B981]"
                  />
                  <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-400" size={18} />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSendingCode}
                className="w-full cursor-pointer bg-[#10B981] hover:bg-[#0ea571] text-white py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingCode ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>
          </div>
        );

      case "code":
        return (
          <div className="w-full max-w-md bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 transition-colors">
            <button
              onClick={() => setStep("email")}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Enter Verification Code</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              We sent a 6-digit code to <strong className="text-gray-800 dark:text-white">{sentEmail}</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">
              Check your email and enter the code below
            </p>

            <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
              {/* Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1.5">
                  6-digit Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...codeForm.register("code")}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors hover:border-[#10B981] text-center text-lg tracking-widest"
                  />
                  <Key className="absolute left-3 top-3 text-gray-400 dark:text-gray-400" size={18} />
                </div>
                {codeForm.formState.errors.code && (
                  <p className="text-red-500 text-xs mt-1">{codeForm.formState.errors.code.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifyingCode}
                className="w-full cursor-pointer bg-[#10B981] hover:bg-[#0ea571] text-white py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifyingCode ? "Verifying..." : "Verify Code"}
              </button>
              
              {/* Resend Code */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Didn't receive code?
                </p>
                <button
                  type="button"
                  onClick={() => forgotPassword({ email }).unwrap().then(() => alert("Code resent!"))}
                  className="text-sm font-semibold text-[#10B981] hover:text-[#0ea571] dark:text-[#10B981] dark:hover:text-[#0ea571] cursor-pointer underline transition-colors"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        );

      case "success":
        return (
          <div className="w-full max-w-md bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Code Verified!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
              Your code has been verified. Redirecting to password reset page...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10B981] mx-auto"></div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white flex items-center justify-center p-1 xs:p-2 md:p-4 relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 w-full flex items-center justify-center">
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;






 