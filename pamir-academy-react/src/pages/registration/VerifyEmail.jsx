import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found in the URL.");
      return;
    }

    let cancelled = false;
    verifyEmail(token).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setStatus("success");
        setTimeout(() => navigate("/register"), 2000);
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Verification failed.");
      }
    });

    return () => { cancelled = true; };
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <a href="/" className="inline-block mb-6">
          <img src="/logo/final_logo.svg" alt="Pamir Academy" className="h-[50px] w-auto mx-auto" />
        </a>

        {status === "verifying" && (
          <>
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand mb-2">Verifying your email...</h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand mb-2">Email Verified!</h2>
            <p className="text-gray-500">Redirecting you to continue registration...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c51310" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-4">{errorMsg}</p>
            <button
              onClick={() => navigate("/register")}
              className="bg-brand text-white px-6 py-2.5 rounded-full border-none cursor-pointer hover:bg-brand-dark transition-colors"
            >
              Go to Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
}
