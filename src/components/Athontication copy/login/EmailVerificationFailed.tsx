 import { useNavigate } from "react-router-dom";

export default function EmailVerificationFailed() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300"
    >
      {/* Email Failed SVG */}
      <div className="w-full max-w-lg mb-12">
        <svg
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          {/* Background envelope */}
          <rect
            x="150"
            y="200"
            width="500"
            height="250"
            rx="30"
            className="fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-500"
            strokeWidth="5"
          />
          <path
            d="M150 200L400 350L650 200"
            className="stroke-red-500"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Cross mark */}
          <circle cx="400" cy="350" r="40" className="fill-red-500" />
          <path
            d="M385 335L415 365M385 365L415 335"
            className="stroke-white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Decorative stars */}
          <circle cx="300" cy="180" r="8" className="fill-yellow-400" />
          <circle cx="500" cy="170" r="6" className="fill-yellow-400" />
          <circle cx="420" cy="420" r="5" className="fill-yellow-400" />
        </svg>
      </div>

      {/* Message */}
      <h1 className="text-4xl font-bold mb-4 text-center dark:text-white">
        Email Verification Failed
      </h1>
      <p className="text-center text-lg opacity-70 mb-8 dark:text-white max-w-md">
        Unfortunately, we could not verify your email. Please check the verification link or try again.
      </p>

      {/* Call to Action */}
      <button
        onClick={() => navigate("/user/practice")}
        className="px-8 py-4 rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
      >
        Retry Verification
      </button>
    </div>
  );
}
