import { createContext, useContext, useState, useEffect } from "react";

// Stub auth context for Django backend integration.
// Replace the implementation below with API calls to your Django backend
// (e.g. POST /api/auth/register, POST /api/auth/login, etc.).

const AUTH_STORAGE_KEY = "pamir_auth_user";
const PROFILE_STORAGE_KEY = "pamir_auth_profile";
const CODES_STORAGE_KEY = "pamir_verification_codes";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getErrorMessage = (errorCode) => {
  if (errorCode?.includes?.("permission") || errorCode === "permission-denied") {
    return "Permission denied. Please try again.";
  }
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please try logging in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up first.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return errorCode ? `Error: ${errorCode}` : "An error occurred. Please try again.";
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Restore session from localStorage (stub only; replace with Django token/session check)
  useEffect(() => {
    const user = getStoredUser();
    const profile = getStoredProfile();
    setCurrentUser(user);
    setUserProfile(profile);
    setLoading(false);
  }, []);

  const register = async (email, password, displayName = "") => {
    try {
      setError(null);
      if (!email || !password) {
        const msg = "Email and password are required.";
        setError(msg);
        return { success: false, error: msg };
      }
      if (password.length < 6) {
        const msg = getErrorMessage("auth/weak-password");
        setError(msg);
        return { success: false, error: msg };
      }

      // Stub: create local user. Replace with: POST /api/auth/register
      const uid = `stub_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const user = { uid, email, displayName: displayName || "" };
      const profile = {
        uid,
        email,
        displayName: displayName || "",
        role: "student",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setCurrentUser(user);
      setUserProfile(profile);
      setError(null);
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.message || "Failed to create account. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      if (!email || !password) {
        const msg = "Email and password are required.";
        setError(msg);
        return { success: false, error: msg };
      }

      // Stub: accept if stored user email matches, or create temporary user. Replace with: POST /api/auth/login
      const stored = getStoredUser();
      let user;
      if (stored && stored.email && stored.email.toLowerCase() === email.toLowerCase()) {
        user = stored;
      } else {
        user = {
          uid: `stub_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          email,
          displayName: "",
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        const profile = getStoredProfile() || {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          role: "student",
        };
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        setUserProfile(profile);
      }

      setCurrentUser(user);
      setError(null);
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.message || "Invalid email or password.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      setCurrentUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (err) {
      setError(err.message || "Logout failed.");
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    // Stub: no email sent. Replace with: POST /api/auth/password-reset
    return { success: true, message: "Password reset email sent!" };
  };

  const sendEmailVerificationLink = async () => {
    setError(null);
    if (!currentUser) {
      setError("No user logged in");
      return { success: false, error: "No user logged in" };
    }
    // Stub. Replace with Django backend.
    return { success: true, message: "Verification email sent! Please check your inbox." };
  };

  const sendVerificationCode = async (email) => {
    try {
      setError(null);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const codes = JSON.parse(localStorage.getItem(CODES_STORAGE_KEY) || "[]");
      codes.push({
        email: email.toLowerCase(),
        code,
        expiresAt,
        used: false,
      });
      localStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(codes));

      // Stub: no email sent. Replace with Django backend to send email.
      return {
        success: true,
        message: "Verification code sent to your email!",
        ...(import.meta.env.DEV && { code }),
      };
    } catch (err) {
      const errorMessage = err.message || "Failed to send verification code";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const verifyCode = async (email, code) => {
    try {
      setError(null);
      const emailLower = email.toLowerCase();
      const codes = JSON.parse(localStorage.getItem(CODES_STORAGE_KEY) || "[]");
      const entry = codes.find(
        (c) => c.email === emailLower && c.code === code && !c.used
      );

      if (!entry) {
        return { success: false, error: "Invalid or expired verification code." };
      }
      if (new Date() > new Date(entry.expiresAt)) {
        return { success: false, error: "Verification code has expired. Please request a new one." };
      }

      entry.used = true;
      localStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(codes));
      return { success: true, message: "Email verified successfully!" };
    } catch (err) {
      const errorMessage = err.message || "Failed to verify code";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setError(null);
      if (!currentUser) {
        throw new Error("No user logged in");
      }
      const updated = {
        ...getStoredProfile(),
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      setUserProfile(updated);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    register,
    login,
    logout,
    resetPassword,
    sendEmailVerificationLink,
    sendVerificationCode,
    verifyCode,
    updateUserProfile,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
