import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginModal = ({ onClose, onSwitchToApply }) => {
  const navigate = useNavigate();
  const { login, resetPassword, error: authError, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    setLocalError("");
    setError(null);
    setResetEmailSent(false);
    setShowResetPassword(false);
  }, [setError]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError(null);

    if (!email.trim()) {
      setLocalError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setLocalError("");
    setError(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      setLocalError("");
      setError(null);
      onClose();
      navigate(result.redirect || "/");
    } else {
      if (result.error) {
        setLocalError(result.error);
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError(null);

    if (!email.trim()) {
      setLocalError("Please enter your email address to reset password.");
      return;
    }
    if (!isValidEmail(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email);
    setIsLoading(false);

    if (result.success) {
      setResetEmailSent(true);
    }
  };

  const displayError = localError || authError;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white w-[600px] max-w-[90vw] rounded-modal p-8 relative flex flex-col items-center shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div
          className="absolute -top-3 -right-3 bg-brand w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-brand-dark transition-colors shadow-lg"
          onClick={onClose}
        >
          <p className="m-0 font-bold">X</p>
        </div>

        {/* Title */}
        <p className="text-xl font-bold mb-6 mt-2">
          {showResetPassword ? "Reset Password" : "Login to Pamir Academy"}
        </p>

        {/* Error Message */}
        {!resetEmailSent && displayError && (
          <div className="w-full max-w-[450px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {displayError}
          </div>
        )}

        {/* Reset Password Success Message */}
        {resetEmailSent && (
          <div className="w-full max-w-[450px] mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            Password reset email sent! Please check your inbox.
          </div>
        )}

        <form
          onSubmit={showResetPassword ? handleResetPassword : handleLogin}
          className="w-full flex flex-col items-center gap-4"
        >
          {/* Email Input */}
          <div className="w-full max-w-[450px]">
            <p className="text-sm font-bold mb-2 text-brand">Email</p>
            <input
              className="w-full h-[42px] rounded-xl border border-gray-200 pl-4 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-all text-sm"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          {!showResetPassword && (
            <div className="w-full max-w-[450px]">
              <p className="text-sm font-bold mb-2 text-brand">Password</p>
              <input
                className="w-full h-[42px] rounded-xl border border-gray-200 pl-4 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-all text-sm"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Password Requirements Notice */}
          {!showResetPassword && (
            <div className="flex items-start gap-2 mt-1 mb-1 w-full max-w-[450px]">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-accent-red leading-tight">
                Your password should contain at least 8 characters (numbers, letters, symbols, 123, Abc, @&!).
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full max-w-[450px] h-[42px] rounded-xl bg-brand text-white border-none mt-2 mb-4 cursor-pointer hover:bg-brand-dark transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {showResetPassword ? "Sending..." : "Logging in..."}
              </span>
            ) : showResetPassword ? (
              "SEND RESET EMAIL"
            ) : (
              "LOGIN"
            )}
          </button>

          {/* Forgot Password Link */}
          {!showResetPassword && (
            <div className="w-full max-w-[450px] text-center mb-2">
              <p
                className="text-brand text-sm cursor-pointer hover:underline"
                onClick={() => {
                  setShowResetPassword(true);
                  setLocalError("");
                  setResetEmailSent(false);
                }}
              >
                Forgot your password?
              </p>
            </div>
          )}

          {/* Back to Login Link */}
          {showResetPassword && (
            <div className="w-full max-w-[450px] text-center mb-2">
              <p
                className="text-brand text-sm cursor-pointer hover:underline"
                onClick={() => {
                  setShowResetPassword(false);
                  setLocalError("");
                  setResetEmailSent(false);
                }}
              >
                Back to Login
              </p>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="flex items-center gap-1 mb-3">
            <p className="text-gray-500 text-base m-0">Don't have an account?</p>
            <p
              className="text-brand text-base m-0 cursor-pointer hover:underline font-medium"
              onClick={onSwitchToApply}
            >
              Sign up
            </p>
          </div>

          {/* Contact Us Link */}
          <div className="flex items-center gap-1">
            <p className="text-gray-500 text-base m-0">If you need our help?</p>
            <p className="text-brand text-base m-0 cursor-pointer hover:underline font-medium">
              Contact Us
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
