import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/general.css";

const LoginModal = ({ onClose, onSwitchToApply }) => {
  const navigate = useNavigate();
  const { login, resetPassword, error: authError, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Clear all errors when modal opens
  useEffect(() => {
    setLocalError("");
    setError(null);
    setResetEmailSent(false);
    setShowResetPassword(false);
  }, [setError]);

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError(null);

    // Client-side validation
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
    setError(null); // Clear any previous errors
    
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      // Clear all errors on success
      setLocalError("");
      setError(null);
      onClose();
      navigate("/");
    } else {
      // Only show error if login actually failed
      if (result.error) {
        setLocalError(result.error);
      }
    }
  };

  // Handle password reset
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

  // Display error message
  const displayError = localError || authError;

  return (
    <div
      className="login-apply-background-black-css login-apply-background-black-js fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="login-apply-background-gray-css bg-[#d9d9d9] w-[600px] max-w-[90vw] rounded-[30px] p-8 relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div
          className="login-apply-x-cancel-css absolute top-[-15px] right-[-15px] bg-[#006236] w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#004d2a] transition-colors"
          onClick={onClose}
        >
          <p className="m-0 font-bold">X</p>
        </div>

        {/* Title */}
        <p className="login-apply-title-css text-xl font-bold mb-6 mt-2">
          {showResetPassword ? "Reset Password" : "Login to Pamir Academy"}
        </p>

        {/* Error Message - Only show if not successful and not showing reset success */}
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
          className="login-apply-compontents-container-css w-full flex flex-col items-center gap-4"
        >
          {/* Email Input */}
          <div className="w-full max-w-[450px]">
            <p className="login-apply-email-css text-sm font-bold mb-2 text-[#006236]">
              Email
            </p>
            <input
              className="login-apply-email-input-css w-full h-[38px] rounded-[20px] border border-[rgba(155,140,140,0.6)] pl-3 focus:outline-[#006236] focus:outline-1"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Password Input - Hide when showing reset password form */}
          {!showResetPassword && (
            <div className="w-full max-w-[450px]">
              <p className="login-apply-password-css text-sm font-bold mb-2 text-[#006236]">
                Password
              </p>
              <input
                className="login-apply-password-input-css w-full h-[38px] rounded-[20px] border border-[rgba(155,140,140,0.6)] pl-3 focus:outline-[#006236] focus:outline-1"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Password Requirements Notice - Hide when showing reset password */}
          {!showResetPassword && (
            <div className="login-apply-attention-container-css flex items-start gap-2 mt-2 mb-2 w-full max-w-[450px]">
              <img
                className="attention-icon-css w-5 h-5 mt-0.5 flex-shrink-0"
                src="/icons/attention.png"
                alt="Attention"
              />
              <p className="login-apply-attention-css text-[9px] text-[#c5221f] italic leading-tight">
                Your password should contain at least 8 characters (numbers,
                letters, symbols, 123, Abc, @&!).
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="login-apply-button-css w-full max-w-[450px] h-[38px] rounded-[15px] bg-[#006236] text-white border-none mt-2 mb-4 cursor-pointer hover:bg-[#004d2a] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
                className="text-[#006236] text-sm cursor-pointer hover:underline"
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

          {/* Back to Login Link (when in reset password mode) */}
          {showResetPassword && (
            <div className="w-full max-w-[450px] text-center mb-2">
              <p
                className="text-[#006236] text-sm cursor-pointer hover:underline"
                onClick={() => {
                  setShowResetPassword(false);
                  setLocalError("");
                  setResetEmailSent(false);
                }}
              >
                ← Back to Login
              </p>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="login-apply-creat-an-account-container-css flex items-center gap-1 mb-3">
            <p className="login-apply-create-an-account-css text-[#7d807f] text-lg m-0">
              Don't have an account?
            </p>
            <p
              className="login-apply-sign-up-css text-[#006236] text-lg m-0 cursor-pointer hover:underline"
              onClick={onSwitchToApply}
            >
              Sign up
            </p>
          </div>

          {/* Contact Us Link */}
          <div className="login-apply-need-help-container-css flex items-center gap-1">
            <p className="login-apply-need-help-css text-[#7d807f] text-lg m-0">
              If you need our help?
            </p>
            <p className="login-apply-contact-us-css text-[#006236] text-lg m-0 cursor-pointer hover:underline">
              Contact Us
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
