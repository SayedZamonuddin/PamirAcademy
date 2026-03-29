import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiPost, apiGet, apiPut, getTokens, setTokens, clearTokens } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const USER_KEY = "pamir_user";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

function storeUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const syncUser = useCallback((user) => {
    setCurrentUser(user);
    storeUser(user);
  }, []);

  useEffect(() => {
    const tokens = getTokens();
    if (tokens?.access) {
      apiGet("/auth/me/")
        .then((user) => syncUser(user))
        .catch(() => {
          clearTokens();
          syncUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      const stored = getStoredUser();
      setCurrentUser(stored);
      setLoading(false);
    }
  }, [syncUser]);

  const register = async (email, password, role = "student") => {
    try {
      setError(null);
      if (!email || !password) {
        const msg = "Email and password are required.";
        setError(msg);
        return { success: false, error: msg };
      }
      const data = await apiPost("/auth/register/", { email, password, role });
      return {
        success: true,
        message: data.message || "Account created. Check your email to verify.",
        user: data.user,
      };
    } catch (err) {
      const msg = err.message || "Failed to create account.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const verifyEmail = async (token) => {
    try {
      setError(null);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/verify-email/${token}/`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      if (data.tokens) {
        setTokens(data.tokens);
        syncUser(data.user);
      }
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || "Verification failed.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const resendVerification = async (email) => {
    try {
      setError(null);
      const data = await apiPost("/auth/resend-verification/", { email });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: true, message: "If that email exists, a verification link has been sent." };
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
      const data = await apiPost("/auth/login/", { email, password });
      setTokens(data.tokens);
      syncUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || "Invalid email or password.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    clearTokens();
    syncUser(null);
    return { success: true };
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const data = await apiPost("/auth/password-reset/", { email });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: true, message: "If that email exists, a reset link has been sent." };
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setError(null);
      const data = await apiPut("/auth/me/", profileData);
      syncUser(data);
      return { success: true };
    } catch (err) {
      const msg = err.message || "Failed to update profile.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    verifyEmail,
    resendVerification,
    login,
    logout,
    resetPassword,
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
