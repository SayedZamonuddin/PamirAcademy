import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getStudentProfile } from "../../../utils/registrationApi";
import { getStudentDashboard, getAnnouncements } from "../../../utils/panelApi";
import StudentLayout from "./StudentLayout";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ---- SVG Icons ---- */
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const LevelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

function formatHour(h) {
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [dashData, setDashData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getStudentProfile();
        if (!cancelled && data?.first_name) setFirstName(data.first_name);
      } catch { /* fallback below */ }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dash, ann] = await Promise.all([
          getStudentDashboard(),
          getAnnouncements().catch(() => []),
        ]);
        if (!cancelled) {
          setDashData(dash);
          setAnnouncements(ann);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayName = firstName
    || currentUser?.display_name
    || currentUser?.email?.split("@")[0]
    || "Student";

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const todayDow = now.getDay();
  const tomorrowDow = (todayDow + 1) % 7;

  const schedule = dashData?.schedule || [];
  const todayClasses = schedule.filter(s => s.day_of_week === todayDow);
  const tomorrowClasses = schedule.filter(s => s.day_of_week === tomorrowDow);

  const subjectsEnrolled = dashData?.subjects_enrolled ?? 0;
  const classesThisWeek = dashData?.classes_this_week ?? 0;
  const groups = dashData?.groups || [];
  const groupName = groups.length > 0 ? groups[0].name : "—";

  if (loading) {
    return (
      <StudentLayout activePage="s-dashboard">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activePage="s-dashboard">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">

        {/* Welcome header */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-800 text-[clamp(24px,3vw,40px)] font-bold m-0">
              {greeting}, {displayName}
            </h1>
            <p className="text-gray-500 text-sm m-0 mt-1">{dateStr}</p>
          </div>
          <button
            onClick={() => navigate("/student/schedule")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#006236] text-white text-sm font-semibold border-none cursor-pointer hover:bg-[#004d2a] transition-colors"
          >
            <CalendarIcon /> My Schedule
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Subjects Enrolled", value: subjectsEnrolled, icon: <BookIcon />, color: "bg-[#006236]" },
            { label: "Classes This Week", value: classesThisWeek, icon: <CalendarIcon />, color: "bg-blue-500" },
            { label: "Current Level", value: groups[0]?.level || "—", icon: <LevelIcon />, color: "bg-amber-500" },
            { label: "My Group", value: groupName, icon: <UsersIcon />, color: "bg-[#006236]" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-[clamp(14px,1.5vw,24px)] flex items-center gap-3 border border-[#006236]/10">
              <div className={`${card.color} w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-gray-500 text-xs m-0">{card.label}</p>
                <p className="text-[#006236] text-[clamp(18px,1.8vw,26px)] font-bold m-0">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Classes */}
        <div className="bg-white rounded-2xl p-[clamp(16px,2vw,28px)] border border-[#006236]/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">Today's Classes</h3>
            <span className="text-gray-500 text-xs">{todayClasses.length} sessions</span>
          </div>
          <div className="flex flex-col gap-3">
            {todayClasses.length === 0 ? (
              <p className="text-gray-400 text-sm m-0 py-4 text-center">No classes scheduled for today.</p>
            ) : todayClasses.map((cls) => (
              <div key={cls.id} className="bg-[#f4f6f5] rounded-xl px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 hover:bg-[#006236]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006236] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {(cls.counterpart_name || "?").split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[#006236] font-semibold text-sm m-0">{cls.subject_name || "Class"} — {cls.level || ""}</p>
                    <p className="text-gray-400 text-xs m-0">{cls.counterpart_name || "Teacher"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#006236] text-sm font-semibold flex items-center gap-1">
                    <ClockIcon /> {formatHour(cls.hour)}
                  </span>
                  <button
                    onClick={() => navigate("/student/live-session")}
                    className="px-4 py-1.5 rounded-full bg-[#006236] text-white text-xs font-semibold border-none cursor-pointer hover:bg-[#004d2a] transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row: Tomorrow + Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tomorrow */}
          <div className="bg-white rounded-2xl p-[clamp(16px,2vw,28px)] border border-[#006236]/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">Tomorrow</h3>
              <span className="text-gray-500 text-xs">{tomorrowClasses.length} sessions</span>
            </div>
            <div className="flex flex-col gap-3">
              {tomorrowClasses.length === 0 ? (
                <p className="text-gray-400 text-sm m-0 py-4 text-center">No classes tomorrow.</p>
              ) : tomorrowClasses.map((cls) => (
                <div key={cls.id} className="bg-[#f4f6f5] rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#006236]/15 flex items-center justify-center text-[#006236] font-bold text-xs shrink-0">
                      {(cls.counterpart_name || "?").split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[#006236] font-semibold text-sm m-0">{cls.subject_name || "Class"} — {cls.level || ""}</p>
                      <p className="text-gray-400 text-xs m-0">{cls.counterpart_name || "Teacher"}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs flex items-center gap-1"><ClockIcon /> {formatHour(cls.hour)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/student/schedule")}
              className="mt-4 flex items-center gap-1 text-[#006236] text-sm font-semibold bg-transparent border-none cursor-pointer hover:underline p-0"
            >
              See full schedule <ChevronRight />
            </button>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl p-[clamp(16px,2vw,28px)] border border-[#006236]/10">
            <div className="flex items-center gap-2 mb-4">
              <BellIcon />
              <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">Announcements</h3>
            </div>
            <div className="flex flex-col gap-3">
              {announcements.length === 0 ? (
                <p className="text-gray-400 text-sm m-0 py-4 text-center">No announcements yet.</p>
              ) : announcements.map((a) => (
                <div key={a.id} className="bg-[#f4f6f5] rounded-xl px-5 py-3.5">
                  <p className="text-gray-700 text-sm m-0 leading-relaxed">{a.text}</p>
                  <p className="text-gray-400 text-xs m-0 mt-1.5">{new Date(a.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
