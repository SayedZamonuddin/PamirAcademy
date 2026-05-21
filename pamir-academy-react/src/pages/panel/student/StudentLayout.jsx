import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getStudentProfile } from "../../../utils/registrationApi";

/* ---- SVG Icons ---- */
const DashboardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="10" width="35" height="35" rx="5" fill="currentColor"/><rect x="55" y="10" width="35" height="35" rx="5" fill="currentColor"/><rect x="10" y="55" width="35" height="35" rx="5" fill="currentColor"/><rect x="55" y="55" width="35" height="15" rx="5" fill="currentColor"/><rect x="55" y="75" width="35" height="15" rx="5" fill="currentColor"/>
  </svg>
);
const LiveSessionIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="20" width="70" height="45" rx="5" stroke="currentColor" strokeWidth="5" fill="none"/>
    <polygon points="42,35 42,55 62,45" fill="currentColor"/>
    <line x1="30" y1="75" x2="70" y2="75" stroke="currentColor" strokeWidth="5"/>
    <line x1="50" y1="65" x2="50" y2="75" stroke="currentColor" strokeWidth="5"/>
    <circle cx="78" cy="22" r="8" fill="#c51310"/>
  </svg>
);
const ScheduleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="20" width="70" height="65" rx="5" stroke="currentColor" strokeWidth="5" fill="none"/><line x1="15" y1="38" x2="85" y2="38" stroke="currentColor" strokeWidth="5"/><line x1="35" y1="12" x2="35" y2="28" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><line x1="65" y1="12" x2="65" y2="28" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><rect x="28" y="48" width="12" height="10" rx="2" fill="currentColor"/><rect x="44" y="48" width="12" height="10" rx="2" fill="currentColor"/><rect x="60" y="48" width="12" height="10" rx="2" fill="currentColor"/><rect x="28" y="64" width="12" height="10" rx="2" fill="currentColor"/><rect x="44" y="64" width="12" height="10" rx="2" fill="currentColor"/>
  </svg>
);
const GroupIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <circle cx="35" cy="35" r="12" stroke="currentColor" strokeWidth="5" fill="none"/>
    <path d="M15 75 C15 55 55 55 55 75" stroke="currentColor" strokeWidth="5" fill="none"/>
    <circle cx="62" cy="30" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
    <path d="M55 70 C55 53 85 53 85 70" stroke="currentColor" strokeWidth="4" fill="none"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="25" width="70" height="45" rx="8" stroke="currentColor" strokeWidth="5" fill="none"/><polyline points="15,30 50,55 85,30" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="75" cy="25" r="10" fill="#C51310"/>
  </svg>
);

const CoursesIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <path d="M20 25h60v50H20z" stroke="currentColor" strokeWidth="5" fill="none" rx="4"/>
    <path d="M50 25v50" stroke="currentColor" strokeWidth="4"/>
    <path d="M30 40h12M30 50h12M30 60h12M58 40h12M58 50h12M58 60h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const NAV_ITEMS = [
  { key: "s-dashboard", label: "Dashboard", icon: DashboardIcon, path: "/student" },
  { key: "s-courses", label: "Courses", icon: CoursesIcon, path: "/student/courses" },
  { key: "s-live", label: "Live", icon: LiveSessionIcon, path: "/student/live-session" },
  { key: "s-schedule", label: "Schedule", icon: ScheduleIcon, path: "/student/schedule" },
  { key: "s-groups", label: "Groups", icon: GroupIcon, path: "/student/groups" },
  { key: "s-messages", label: "Messages", icon: MessageIcon, path: "/student/messages" },
];

export default function StudentLayout({ activePage, children }) {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getStudentProfile();
        if (!cancelled) setProfile(data || null);
      } catch {
        if (!cancelled) setProfile(null);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const mediaBase = useMemo(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    return apiBase.replace(/\/api\/?$/, "");
  }, []);

  const fullName = useMemo(() => {
    const first = (profile?.first_name || "").trim();
    const last = (profile?.last_name || "").trim();
    const joined = `${first} ${last}`.trim();
    if (joined) return joined;
    if (currentUser?.display_name) return currentUser.display_name;
    if (currentUser?.email) return currentUser.email.split("@")[0];
    return "Student";
  }, [profile, currentUser]);

  const photoUrl = useMemo(() => {
    const raw = profile?.photo;
    if (!raw) return null;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return raw.startsWith("/") ? `${mediaBase}${raw}` : `${mediaBase}/${raw}`;
  }, [profile, mediaBase]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-[clamp(16px,4vw,80px)] py-4 min-h-[70px]">
        <div className="h-[50px] flex items-center">
          <img src="/logo/final_logo.svg" alt="Pamir Academy" className="h-full w-auto object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-gray-800 font-medium text-sm">{fullName}</div>
            <div className="text-gray-400 text-xs">Student</div>
          </div>
          <div className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-brand">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand text-white flex items-center justify-center text-sm font-bold">
                {fullName?.charAt(0)?.toUpperCase() || "S"}
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-full border-none cursor-pointer text-sm font-medium tracking-wider transition-colors">LOGOUT</button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex gap-3 p-3">
        {/* Sidebar */}
        <nav className="w-[90px] shrink-0 bg-white rounded-2xl shadow-card flex flex-col items-center py-5 gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activePage === item.key;
            const Icon = item.icon;
            return (
              <div key={item.key} onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-2.5 px-1 cursor-pointer rounded-xl w-[78px] transition-all ${
                  active ? "text-brand bg-brand-light shadow-sm" : "text-gray-400 hover:text-brand hover:bg-gray-50"
                }`}>
                <Icon />
                <span className="text-[11px] text-center leading-tight font-medium">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Main content */}
        <div className="flex-1 bg-white rounded-2xl shadow-card overflow-hidden flex flex-col">
          {children}
        </div>
      </div>

      {/* Help */}
      <p className="text-center my-4 text-sm">
        <span className="text-gray-400">If you need our help? </span>
        <a href="#" className="text-brand no-underline font-medium hover:underline">contact us</a>
      </p>
    </div>
  );
}
