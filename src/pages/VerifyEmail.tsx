import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";

export default function EmailVerification({ darkMode }: { darkMode: boolean }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4
      dark:bg-gray-900 dark:text-gray-200
      ${darkMode ? "" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Modal-like container */}
      <div
        className={`w-full max-w-lg rounded-2xl shadow-sm p-8
        dark:bg-gray-800 dark:border dark:border-gray-700
        ${darkMode ? "" : "bg-white border border-gray-100"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              Verify your email
            </h2>
            <p className="text-sm opacity-60 dark:text-white">
              We’ll send a verification code to your email
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border
              dark:bg-gray-900 dark:border-gray-700 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Verification code */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Verification code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border tracking-widest
              dark:bg-gray-900 dark:border-gray-700 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold
              hover:bg-blue-700 transition disabled:opacity-50"
              disabled={!email || !code}
            >
              <span className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Verify Email
              </span>
            </button>

            <button
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
