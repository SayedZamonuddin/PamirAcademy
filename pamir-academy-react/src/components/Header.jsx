import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/general.css";
import "../styles/main-page-responsive-css/responsive-general.css";

const Header = ({ onLoginClick, onApplyClick }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await logout();
    setIsLoggingOut(false);
    setShowUserMenu(false);
    if (result.success) {
      navigate("/");
    }
  };

  // Get display name (from profile, user object, or email)
  const displayName =
    userProfile?.displayName ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  return (
    <>
      {/* Logo, Login, and Apply Now */}
      <div className="logo-login-container-css">
        <div className="logo-container-css">
          <Link to="/">
            <img
              className="pamir-academy-logo"
              src="/logo/final_logo.svg"
              alt="Pamir Academy Logo"
            />
          </Link>
        </div>
        <div className="login-apply-now-container-css">
          {currentUser ? (
            // Logged in state - show user menu
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#006236] text-white rounded-full hover:bg-[#004d2a] transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#006236] font-bold text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate hidden sm:inline">
                  {displayName}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    🏠 Home
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "⏳ Logging out..." : "🚪 Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Logged out state - show login and apply buttons
            <>
              <div>
                <button
                  className="login-css login-gray-css login-js"
                  onClick={onLoginClick}
                >
                  LOGIN
                </button>
              </div>
              <div>
                {onApplyClick ? (
                  <button 
                    className="apply-now-css apply-now-gray-css apply-now-js"
                    onClick={onApplyClick}
                  >
                    APPLY NOW
                  </button>
                ) : (
                  <Link to="/register">
                    <button className="apply-now-css apply-now-gray-css apply-now-js">
                      APPLY NOW
                    </button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Main Body Without Logo and Apply */}
      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          {/* Search */}
          <div className="search-container-css">
            <input type="text" placeholder="Search" className="search-css" />
            <button className="search-icon-css">
              <img
                className="search-img-css"
                src="/icons/search-icon.png"
                alt="Search"
              />
            </button>
          </div>

          {/* Navbar */}
          <div className="header-css">
            <div className="icon-text-container-css">
              <Link to="/">
                <img
                  className="navbar-icons-css"
                  src="/icons/home-icon.png"
                  alt="Home"
                />
              </Link>
              <Link className="header-text-css" to="/">
                Home
              </Link>
            </div>
            <div className="icon-text-container-css">
              <Link to="/subjects">
                <img
                  className="navbar-icons-css"
                  src="/icons/subjects-icon.png"
                  alt="Subjects"
                />
              </Link>
              <Link className="header-text-css" to="/subjects">
                Subjects
              </Link>
            </div>
            <div className="icon-text-container-css">
              <Link to="/products">
                <img
                  className="navbar-icons-css"
                  src="/icons/products-icon.png"
                  alt="Products"
                />
              </Link>
              <Link className="header-text-css" to="/products">
                Products
              </Link>
            </div>
            <div className="icon-text-container-css">
              <Link to="/about">
                <img
                  className="navbar-icons-css"
                  src="/icons/about-icon.png"
                  alt="About"
                />
              </Link>
              <Link className="header-text-css" to="/about">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
