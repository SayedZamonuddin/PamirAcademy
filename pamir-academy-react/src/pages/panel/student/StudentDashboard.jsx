import { useNavigate } from "react-router-dom";
import StudentLayout from "./StudentLayout";

/* ---- Sample Data ---- */
const STUDENT_NAME = "Ahmad";

const TODAY_CLASSES = [
  { id: 1, teacher: "Amina Rahimi", subject: "English", level: "Elementary", topic: "Past Simple Tense", time: "9:00 AM" },
  { id: 2, teacher: "Dariush Karimi", subject: "Math", level: "Intermediate", topic: "Quadratic Equations", time: "11:00 AM" },
  { id: 3, teacher: "Sarah Nazari", subject: "Physics", level: "Elementary", topic: "Newton's Laws", time: "3:00 PM" },
];

const TOMORROW_CLASSES = [
  { id: 4, teacher: "Amina Rahimi", subject: "English", level: "Elementary", topic: "Irregular Verbs", time: "10:00 AM" },
  { id: 5, teacher: "Dariush Karimi", subject: "Math", level: "Intermediate", topic: "Polynomials", time: "2:00 PM" },
];

const QUICK_STATS = {
  subjectsEnrolled: 3,
  classesThisWeek: 8,
  currentLevel: "Elementary",
  groupName: "Group A",
};

const ANNOUNCEMENTS = [
  { id: 1, text: "Schedule change: your Thursday English class has moved from 9 AM to 10 AM.", time: "3 hours ago" },
  { id: 2, text: "New study resources for Physics — Newton's Laws available in your materials section.", time: "1 day ago" },
];

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

export default function StudentDashboard() {
  const navigate = useNavigate();

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <StudentLayout activePage="s-dashboard">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">

        {/* Welcome header */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-white text-[clamp(24px,3vw,40px)] font-bold m-0">
              {greeting}, {STUDENT_NAME}
            </h1>
            <p className="text-white/60 text-sm m-0 mt-1">{dateStr}</p>
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
            { label: "Subjects Enrolled", value: QUICK_STATS.subjectsEnrolled, icon: <BookIcon />, color: "bg-[#006236]" },
            { label: "Classes This Week", value: QUICK_STATS.classesThisWeek, icon: <CalendarIcon />, color: "bg-blue-500" },
            { label: "Current Level", value: QUICK_STATS.currentLevel, icon: <LevelIcon />, color: "bg-amber-500" },
            { label: "My Group", value: QUICK_STATS.groupName, icon: <UsersIcon />, color: "bg-[#006236]" },
          ].map((card, i) => (
            <div key={i} className="bg-[#d9d9d9] rounded-2xl p-[clamp(14px,1.5vw,24px)] flex items-center gap-3">
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
        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">Today's Classes</h3>
            <span className="text-gray-500 text-xs">{TODAY_CLASSES.length} sessions</span>
          </div>
          <div className="flex flex-col gap-3">
            {TODAY_CLASSES.map((cls) => (
              <div key={cls.id} className="bg-white rounded-xl px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 hover:bg-[#006236]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006236] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {cls.teacher.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[#006236] font-semibold text-sm m-0">{cls.subject} — {cls.topic}</p>
                    <p className="text-gray-400 text-xs m-0">{cls.teacher} · {cls.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#006236] text-sm font-semibold flex items-center gap-1">
                    <ClockIcon /> {cls.time}
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
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">Tomorrow</h3>
              <span className="text-gray-500 text-xs">{TOMORROW_CLASSES.length} sessions</span>
            </div>
            <div className="flex flex-col gap-3">
              {TOMORROW_CLASSES.map((cls) => (
                <div key={cls.id} className="bg-white rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#006236]/15 flex items-center justify-center text-[#006236] font-bold text-xs shrink-0">
                      {cls.teacher.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[#006236] font-semibold text-sm m-0">{cls.subject} — {cls.topic}</p>
                      <p className="text-gray-400 text-xs m-0">{cls.teacher}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs flex items-center gap-1"><ClockIcon /> {cls.time}</span>
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
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <div className="flex items-center gap-2 mb-4">
              <BellIcon />
              <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">Announcements</h3>
            </div>
            <div className="flex flex-col gap-3">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className="bg-white rounded-xl px-5 py-3.5">
                  <p className="text-[#006236] text-sm m-0 leading-relaxed">{a.text}</p>
                  <p className="text-gray-400 text-xs m-0 mt-1.5">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
