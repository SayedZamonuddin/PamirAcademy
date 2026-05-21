import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ApplyModal = ({ onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register, error: authError, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    setLocalError("");
    setError(null);
    setRegistrationSuccess(false);
  }, [setError]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasNumber && hasLetter && hasSymbol;
  };

  const getPasswordStrength = (password) => {
    if (!password) return null;

    const checks = {
      length: password.length >= 8,
      number: /\d/.test(password),
      letter: /[a-zA-Z]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passed = Object.values(checks).filter(Boolean).length;

    if (passed === 4) return { text: "Strong password", color: "text-green-600" };
    if (passed >= 2) return { text: "Medium strength", color: "text-yellow-600" };
    return { text: "Weak password", color: "text-red-600" };
  };

  const handleRegister = async (e) => {
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
      setLocalError("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }
    if (!isValidPassword(password)) {
      setLocalError("Password must contain at least one number, one letter, and one symbol.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setLocalError("");
    setError(null);

    const result = await register(email, password);
    setIsLoading(false);

    if (result.success) {
      setLocalError("");
      setError(null);
      setRegistrationSuccess(true);
    } else {
      if (result.error) {
        setLocalError(result.error);
      }
    }
  };

  const displayError = !registrationSuccess && (localError || authError);
  const passwordStrength = getPasswordStrength(password);

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
          Create Account for Pamir Academy
        </p>

        {/* Success Message */}
        {registrationSuccess && (
          <div className="w-full max-w-[450px] mb-4 p-5 bg-green-50 border border-green-400 text-green-800 rounded-xl text-center">
            <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>
              </svg>
            </div>
            <p className="font-bold text-lg mb-1">Check Your Email</p>
            <p className="text-sm">
              We sent a verification link to <strong>{email}</strong>.
              Please click the link in the email to verify your account and continue registration.
            </p>
            <p className="text-xs mt-3 text-green-600">
              Didn't receive it? Check your spam folder or wait a moment.
            </p>
          </div>
        )}

        {/* Error Message */}
        {!registrationSuccess && displayError && (
          <div className="w-full max-w-[450px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {displayError}
          </div>
        )}

        {!registrationSuccess && (
          <form
            onSubmit={handleRegister}
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

            {/* New Password Input */}
            <div className="w-full max-w-[450px]">
              <p className="text-sm font-bold mb-2 text-brand">New Password</p>
              <input
                className="w-full h-[42px] rounded-xl border border-gray-200 pl-4 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-all text-sm"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {passwordStrength && (
                <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="w-full max-w-[450px]">
              <p className="text-sm font-bold mb-2 text-brand">Confirm Password</p>
              <input
                className="w-full h-[42px] rounded-xl border border-gray-200 pl-4 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-all text-sm"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              {confirmPassword && (
                <p className={`text-xs mt-1 ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                  {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Password Requirements Notice */}
            <div className="flex items-start gap-2 mt-1 mb-1 w-full max-w-[450px]">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-accent-red leading-tight">
                Your password should contain at least 8 characters (numbers, letters, symbols, 123, Abc, @&!).
              </p>
            </div>

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
                  Creating Account...
                </span>
              ) : (
                "APPLY NOW"
              )}
            </button>

            {/* Already have account Link */}
            <div className="flex items-center gap-1 mb-3">
              <p className="text-gray-500 text-base m-0">Already have an account?</p>
              <p
                className="text-brand text-base m-0 cursor-pointer hover:underline font-medium"
                onClick={onSwitchToLogin}
              >
                Login
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
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
