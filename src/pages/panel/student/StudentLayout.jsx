import { useNavigate } from "react-router-dom";

const STUDENT_AVATAR = "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM5MzI5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080";

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

const NAV_ITEMS = [
  { key: "s-dashboard", label: "Dashboard", icon: DashboardIcon, path: "/student" },
  { key: "s-live", label: "Live", icon: LiveSessionIcon, path: "/student/live-session" },
  { key: "s-schedule", label: "Schedule", icon: ScheduleIcon, path: "/student/schedule" },
  { key: "s-groups", label: "Groups", icon: GroupIcon, path: "/student/groups" },
  { key: "s-messages", label: "Messages", icon: MessageIcon, path: "/student/messages" },
];

export default function StudentLayout({ activePage, children }) {
  const navigate = useNavigate();
  return (
    <div className="font-['Nunito_Sans'] w-screen min-h-screen flex flex-col bg-[#a7a7a7] overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-[clamp(16px,4vw,80px)] py-4 min-h-[80px]">
        <div className="h-[60px] flex items-center">
          <img src="/logo/final_logo.svg" alt="Pamir Academy" className="h-full w-auto object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-white">Ahmad Nazari</div>
            <div className="text-[#7d807f] text-xs">Student — English</div>
          </div>
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-[#006236]">
            <img src={STUDENT_AVATAR} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="bg-[#c51310] text-white px-6 py-2.5 rounded-full border-none cursor-pointer text-sm tracking-wider">LOGOUT</button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex gap-1 px-[3px]">
        {/* Sidebar */}
        <nav className="w-[90px] shrink-0 bg-[#7d807f] rounded-2xl border-[3px] border-[#006236] flex flex-col items-center py-5 gap-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activePage === item.key;
            const Icon = item.icon;
            return (
              <div key={item.key} onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-2 px-1 cursor-pointer rounded-[10px] w-[80px] ${active ? "text-white" : "text-[#006236]"}`}>
                <Icon />
                <span className="text-[11px] text-center leading-tight">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Main content */}
        <div className="flex-1 bg-[#7d807f] rounded-2xl border-[3px] border-[#006236] overflow-hidden flex flex-col">
          {children}
        </div>
      </div>

      {/* Help */}
      <p className="text-center my-6 mb-2">
        <span className="text-[#7d807f]">If you need our help? </span>
        <a href="#" className="text-[#006236] no-underline">contact us</a>
      </p>

      {/* Footer */}
      <footer className="bg-black/65 text-white px-[clamp(24px,5vw,80px)] py-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-white mb-4">About</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {["Impact","Internship","About"].map(i=><li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>)}
            </ul>
          </div>
          <div className="text-center">
            <h3 className="text-white mb-4">Contact</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {["Help Center","Share Your Story","Email"].map(i=><li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>)}
            </ul>
          </div>
          <div className="text-right">
            <h3 className="text-white mb-4">Location</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {["Khorog","London","Dushanbe"].map(i=><li key={i} className="text-white/75">{i}</li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10">
          <div className="h-[50px] bg-white/20 rounded-xl" />
        </div>
      </footer>
    </div>
  );
}
