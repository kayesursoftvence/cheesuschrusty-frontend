import { useState, useEffect } from "react";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ModeToggle } from "../ThemeToggle/mode-toggle";
import { useVerifyEmailMutation } from "@/redux/features/auth/authApi";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function EmailVerify() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleVerify = async () => {
    try {
      const res = await verifyEmail({ email, code }).unwrap();
      
      // Store tokens in cookies if returned by backend
      // Backend usually returns access_token/refresh_token or accessToken/refreshToken
      const accessToken = (res as any).data?.accessToken || (res as any).data?.access_token || (res as any).accessToken;
      const refreshToken = (res as any).data?.refreshToken || (res as any).data?.refresh_token || (res as any).refreshToken;
      
      if (accessToken) {
        Cookies.set("token", accessToken, { expires: 7 });
        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, { expires: 7 });
        }
        
        // Also store user info if available
        if ((res as any).data?.user) {
          localStorage.setItem("user", JSON.stringify((res as any).data.user));
          localStorage.setItem("role", (res as any).data.user.role);
        }
      }

      toast.success("Email verified successfully!");
      navigate("/user");
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error?.data?.message || "Verification failed. Please check your code.");
    }
  };

  // Restrict code input to 6 characters/digits
  const handleCodeChange = (e:any) => {
    const value = e.target.value;
    // Optional: allow only digits, remove non-digit characters
    const sanitized = value.replace(/\D/g, "");
    setCode(sanitized.slice(0, 6)); // max 6 digits
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      {/* Theme toggle */}
      <div className="absolute top-8 right-8">
        <ModeToggle />
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl p-8 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Verify your email</h2>
            <p className="text-sm opacity-60">
              Enter the verification code sent to your email
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Code */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Verification code</label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              maxLength={6} // HTML maxLength attribute
              className="w-full px-4 py-3 rounded-xl border tracking-widest dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleVerify}
              disabled={!email || code.length !== 6 || isLoading} // ensure 6-digit code
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {isLoading ? "Verifying..." : "Verify Email"}
              </span>
            </button>

            <button
              type="button"
              className="text-sm font-semibold text-blue-600 hover:underline self-center"
            >
              Resend verification code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
