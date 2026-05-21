import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const DashboardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="10" width="35" height="35" rx="5" fill="currentColor"/><rect x="55" y="10" width="35" height="35" rx="5" fill="currentColor"/><rect x="10" y="55" width="35" height="35" rx="5" fill="currentColor"/><rect x="55" y="55" width="35" height="15" rx="5" fill="currentColor"/><rect x="55" y="75" width="35" height="15" rx="5" fill="currentColor"/>
  </svg>
);
const MeetingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="20" y="15" width="60" height="40" rx="5" stroke="currentColor" strokeWidth="5" fill="none"/><polygon points="80,25 95,15 95,55 80,45" fill="currentColor"/><line x1="30" y1="65" x2="70" y2="65" stroke="currentColor" strokeWidth="5"/><line x1="50" y1="55" x2="50" y2="65" stroke="currentColor" strokeWidth="5"/><line x1="35" y1="73" x2="65" y2="73" stroke="currentColor" strokeWidth="5"/>
  </svg>
);
const CoursesIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="15" width="50" height="65" rx="4" stroke="currentColor" strokeWidth="5" fill="none"/><rect x="25" y="15" width="50" height="65" rx="4" stroke="currentColor" strokeWidth="5" fill="none"/><rect x="35" y="15" width="50" height="65" rx="4" stroke="currentColor" strokeWidth="4" fill="currentColor" fillOpacity="0.15"/><line x1="45" y1="35" x2="75" y2="35" stroke="currentColor" strokeWidth="4"/><line x1="45" y1="48" x2="70" y2="48" stroke="currentColor" strokeWidth="4"/><line x1="45" y1="61" x2="65" y2="61" stroke="currentColor" strokeWidth="4"/>
  </svg>
);
const TestsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="22" y="14" width="56" height="72" rx="8" stroke="currentColor" strokeWidth="5" />
    <line x1="34" y1="34" x2="66" y2="34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="34" y1="50" x2="58" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="34" y1="66" x2="52" y2="66" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <polyline points="60,64 65,69 74,58" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ScheduleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="20" width="70" height="65" rx="5" stroke="currentColor" strokeWidth="5" fill="none"/><line x1="15" y1="38" x2="85" y2="38" stroke="currentColor" strokeWidth="5"/><line x1="35" y1="12" x2="35" y2="28" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><line x1="65" y1="12" x2="65" y2="28" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><rect x="28" y="48" width="12" height="10" rx="2" fill="currentColor"/><rect x="44" y="48" width="12" height="10" rx="2" fill="currentColor"/><rect x="60" y="48" width="12" height="10" rx="2" fill="currentColor"/><rect x="28" y="64" width="12" height="10" rx="2" fill="currentColor"/><rect x="44" y="64" width="12" height="10" rx="2" fill="currentColor"/>
  </svg>
);
const BalanceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="40" r="20" stroke="currentColor" strokeWidth="5" fill="none"/><path d="M30 70 Q50 90 70 70" stroke="currentColor" strokeWidth="5" fill="none"/><circle cx="35" cy="30" r="5" fill="currentColor"/><circle cx="65" cy="30" r="5" fill="currentColor"/>
  </svg>
);
const FinanceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="5" fill="none"/><text x="50" y="58" textAnchor="middle" fill="currentColor" fontSize="30" fontWeight="bold">$</text>
  </svg>
);
const StatisticsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <polyline points="15,75 35,50 55,60 85,25" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><line x1="15" y1="85" x2="85" y2="85" stroke="currentColor" strokeWidth="5"/><polyline points="75,25 85,25 85,35" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="25" width="70" height="45" rx="8" stroke="currentColor" strokeWidth="5" fill="none"/><polyline points="15,30 50,55 85,30" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="75" cy="25" r="10" fill="#C51310"/>
  </svg>
);

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
  { key: "courses", label: "Courses", icon: CoursesIcon, path: "/course-builder" },
  { key: "tests", label: "Tests", icon: TestsIcon, path: "/test-builder" },
  { key: "demo", label: "Demo", icon: MeetingIcon, path: "/demo" },
  { key: "schedule", label: "Schedule", icon: ScheduleIcon, path: "/schedule" },
  { key: "balance", label: "Balance", icon: BalanceIcon, path: "/dashboard" },
  { key: "finance", label: "Finance", icon: FinanceIcon, path: "/dashboard" },
  { key: "statistics", label: "Statistics", icon: StatisticsIcon, path: "/statistics" },
  { key: "messages", label: "Message", icon: MessageIcon, path: "/messages" },
];

export default function DashboardLayout({ activePage, children }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
            <div className="text-gray-800 font-medium text-sm">Admin</div>
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
