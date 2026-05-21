import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const SubjectsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const ProductsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const AboutIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

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

  const displayName =
    userProfile?.displayName ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/subjects', icon: SubjectsIcon, label: 'Subjects' },
    { to: '/products', icon: ProductsIcon, label: 'Products' },
    { to: '/about', icon: AboutIcon, label: 'About' },
  ];

  return (
    <>
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo/final_logo.svg" alt="Pamir Academy" className="h-10 sm:h-12 w-auto" />
          </Link>

          {/* Auth buttons or user menu */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-button hover:bg-brand-dark transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand font-bold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate hidden sm:inline text-sm font-medium">
                    {displayName}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Home
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="bg-brand text-white px-5 py-2 rounded-button hover:bg-brand-dark transition-colors font-medium text-sm"
                  onClick={onLoginClick}
                >
                  LOGIN
                </button>
                {onApplyClick ? (
                  <button
                    className="bg-brand text-white px-5 py-2 rounded-button hover:bg-brand-dark transition-colors font-medium text-sm"
                    onClick={onApplyClick}
                  >
                    APPLY NOW
                  </button>
                ) : (
                  <Link to="/register">
                    <button className="bg-brand text-white px-5 py-2 rounded-button hover:bg-brand-dark transition-colors font-medium text-sm">
                      APPLY NOW
                    </button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}

      {/* Search + Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="relative max-w-lg mx-auto mt-6">
          <input
            type="text"
            placeholder="Search courses, subjects..."
            className="w-full h-11 pl-11 pr-4 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm text-gray-700 placeholder:text-gray-400 transition-all"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Navigation */}
        <nav className="mt-6 mb-4">
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-brand transition-colors group"
              >
                <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
