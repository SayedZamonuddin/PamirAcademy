import { useState } from "react";
import TeacherLayout from "./TeacherLayout";
/* ---- Images ---- */
const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1773243906471-bd9153d1a5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGJveSUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3NDAwODY0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1660128355607-2a311a8acfa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmwlMjBzdHVkeWluZyUyMG5vdGVib29rfGVufDF8fHx8MTc3NDAwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM5MzI5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1767619946289-96cea6c14081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDAwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1631905131477-eefc1360588a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwdGVlbmFnZXIlMjBib3klMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDAwODY0OXww&ixlib=rb-4.1.0&q=80&w=1080",
];

/* ---- SVG Icons ---- */
const UsersIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const UserCheckIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
const GroupIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="7" r="3"/><path d="M21 21v-2a3 3 0 0 0-2-2.83"/></svg>;
const UserIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const TrendUpIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const TrendDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const BookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const AwardIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

/* ---- Data ---- */
const OVERVIEW = {
  totalStudents: 147,
  activeStudents: 38,
  groupStudents: 22,
  individualStudents: 16,
  totalChange: 12,
  activeChange: 5,
};

const STUDENT_GROWTH = [
  { month: "Jul", total: 85, active: 18 },
  { month: "Aug", total: 92, active: 22 },
  { month: "Sep", total: 104, active: 28 },
  { month: "Oct", total: 112, active: 25 },
  { month: "Nov", total: 120, active: 30 },
  { month: "Dec", total: 118, active: 24 },
  { month: "Jan", total: 128, active: 32 },
  { month: "Feb", total: 138, active: 35 },
  { month: "Mar", total: 147, active: 38 },
];

const LEVEL_DISTRIBUTION = [
  { level: "Beginner", count: 42, color: "bg-blue-500", pct: 28 },
  { level: "Elementary", count: 38, color: "bg-[#006236]", pct: 26 },
  { level: "Intermediate", count: 35, color: "bg-amber-500", pct: 24 },
  { level: "Advanced", count: 22, color: "bg-[#c51310]", pct: 15 },
  { level: "Proficient", count: 10, color: "bg-purple-500", pct: 7 },
];

const GROUP_VS_INDIVIDUAL = [
  { label: "Group (2-4)", count: 14, sessions: 42, color: "bg-[#006236]" },
  { label: "Group (5-8)", count: 8, sessions: 24, color: "bg-blue-500" },
  { label: "Individual", count: 16, sessions: 64, color: "bg-amber-500" },
];

const RETENTION = [
  { period: "1 month", pct: 95 },
  { period: "3 months", pct: 82 },
  { period: "6 months", pct: 68 },
  { period: "1 year", pct: 54 },
  { period: "2+ years", pct: 31 },
];

const TOP_STUDENTS = [
  { name: "Layla Ahmadi", avatar: STUDENT_AVATARS[3], level: "Advanced", sessions: 86, rating: 4.9, streak: 24, status: "active" },
  { name: "Ahmad Nazari", avatar: STUDENT_AVATARS[0], level: "Elementary", sessions: 72, rating: 4.7, streak: 18, status: "active" },
  { name: "Fatima Karimova", avatar: STUDENT_AVATARS[1], level: "Intermediate", sessions: 64, rating: 4.8, streak: 15, status: "active" },
  { name: "Daniyal Mirzo", avatar: STUDENT_AVATARS[4], level: "Elementary", sessions: 58, rating: 4.5, streak: 12, status: "active" },
  { name: "Omar Hassan", avatar: STUDENT_AVATARS[2], level: "Beginner", sessions: 45, rating: 4.6, streak: 8, status: "inactive" },
];

const STUDENT_COUNTRIES = [
  { country: "Tajikistan", count: 52, flag: "TJ" },
  { country: "Afghanistan", count: 38, flag: "AF" },
  { country: "United Kingdom", count: 22, flag: "UK" },
  { country: "United States", count: 18, flag: "US" },
  { country: "Russia", count: 12, flag: "RU" },
  { country: "Other", count: 5, flag: "--" },
];

const SESSION_STATS = {
  totalHours: 1248,
  avgSessionLength: 52,
  completionRate: 94,
  avgRating: 4.7,
};

const WEEKDAY_ACTIVITY = [
  { day: "Mon", sessions: 18 },
  { day: "Tue", sessions: 22 },
  { day: "Wed", sessions: 25 },
  { day: "Thu", sessions: 20 },
  { day: "Fri", sessions: 16 },
  { day: "Sat", sessions: 8 },
  { day: "Sun", sessions: 3 },
];

/* ============================================================
   Donut Chart Component (SVG)
   ============================================================ */
function DonutChart({ segments, size = 160, thickness = 28 }) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let cumulativeOffset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e5e5" strokeWidth={thickness} />
      {segments.map((seg, i) => {
        const dashLength = (seg.pct / 100) * circumference;
        const offset = cumulativeOffset;
        cumulativeOffset += dashLength;
        const colorMap = {
          "bg-blue-500": "#3b82f6",
          "bg-[#006236]": "#006236",
          "bg-amber-500": "#f59e0b",
          "bg-[#c51310]": "#c51310",
          "bg-purple-500": "#a855f7",
        };
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={colorMap[seg.color] || "#006236"}
            strokeWidth={thickness}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-all duration-700"
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#006236" fontSize="28" fontWeight="bold">{segments.reduce((s, seg) => s + seg.count, 0)}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#7d807f" fontSize="11">Total</text>
    </svg>
  );
}

/* ============================================================
   Speedometer / Gauge (reused pattern)
   ============================================================ */
function Gauge({ percentage, label, color = "#006236" }) {
  const r = 50;
  const cx = 60;
  const cy = 60;
  const toRad = (d) => (d * Math.PI) / 180;
  const startAngle = -180;
  const sweepAngle = (180 * percentage) / 100;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(startAngle + sweepAngle));
  const y2 = cy + r * Math.sin(toRad(startAngle + sweepAngle));
  const largeArc = sweepAngle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 120 70" className="w-full max-w-[120px]">
        <path d={`M ${cx + r * Math.cos(toRad(-180))} ${cy + r * Math.sin(toRad(-180))} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(toRad(0))} ${cy + r * Math.sin(toRad(0))}`}
          fill="none" stroke="#e5e5e5" strokeWidth="10" strokeLinecap="round"/>
        {percentage > 0 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"/>
        )}
        <text x={cx} y={cy - 2} textAnchor="middle" fill={color} fontSize="18" fontWeight="bold">{percentage}%</text>
      </svg>
      <span className="text-gray-500 text-[clamp(10px,0.9vw,12px)] text-center">{label}</span>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function TeacherStats() {
  const [timeRange, setTimeRange] = useState("all");
  const maxGrowth = Math.max(...STUDENT_GROWTH.map(s => s.total));
  const maxWeekday = Math.max(...WEEKDAY_ACTIVITY.map(w => w.sessions));
  const maxCountry = Math.max(...STUDENT_COUNTRIES.map(c => c.count));

  return (
    <TeacherLayout activePage="t-stats">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">

        {/* ---- Header ---- */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-white text-[clamp(24px,3vw,40px)] font-bold m-0">Student Statistics</h1>
            <p className="text-white/60 text-sm m-0 mt-1">Insights into your teaching journey and student progress</p>
          </div>
          <div className="flex items-center bg-[#d9d9d9] rounded-full overflow-hidden">
            {[
              { key: "all", label: "All Time" },
              { key: "year", label: "This Year" },
              { key: "month", label: "This Month" },
            ].map(t => (
              <button key={t.key} onClick={() => setTimeRange(t.key)}
                className={`px-4 py-2 text-xs font-semibold cursor-pointer border-none transition-colors ${
                  timeRange === t.key ? "bg-[#006236] text-white" : "bg-transparent text-[#006236] hover:bg-[#006236]/10"
                }`}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* ---- Top Summary Cards ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Students", value: OVERVIEW.totalStudents, icon: <UsersIcon/>, color: "bg-[#006236]", change: `+${OVERVIEW.totalChange}`, up: true, sub: "all time" },
            { label: "Active Now", value: OVERVIEW.activeStudents, icon: <UserCheckIcon/>, color: "bg-blue-500", change: `+${OVERVIEW.activeChange}`, up: true, sub: "currently enrolled" },
            { label: "Group Learners", value: OVERVIEW.groupStudents, icon: <GroupIcon/>, color: "bg-amber-500", change: "58%", up: true, sub: "of active students" },
            { label: "Individual", value: OVERVIEW.individualStudents, icon: <UserIcon/>, color: "bg-purple-500", change: "42%", up: false, sub: "of active students" },
          ].map((card, i) => (
            <div key={i} className="bg-[#d9d9d9] rounded-2xl p-[clamp(14px,1.5vw,24px)] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0`}>{card.icon}</div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${card.up ? "text-[#006236]" : "text-amber-500"}`}>
                  {card.up ? <TrendUpIcon/> : <TrendDownIcon/>} {card.change}
                </span>
              </div>
              <p className="text-[#006236] text-[clamp(26px,2.8vw,38px)] font-bold m-0 leading-none">{card.value}</p>
              <p className="text-gray-500 text-xs m-0">{card.label} <span className="text-gray-400">· {card.sub}</span></p>
            </div>
          ))}
        </div>

        {/* ---- Row: Growth Chart + Level Distribution ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">

          {/* Student Growth Over Time */}
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-1">Student Growth</h3>
            <p className="text-gray-400 text-xs m-0 mb-4">Total vs active students over time</p>
            <div className="flex items-end gap-[clamp(4px,0.8vw,12px)] h-[200px] px-1">
              {STUDENT_GROWTH.map((m, i) => {
                const totalH = (m.total / maxGrowth) * 170;
                const activeH = (m.active / maxGrowth) * 170;
                const isCurrent = i === STUDENT_GROWTH.length - 1;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1 relative group">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 bg-[#006236] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Total: {m.total} · Active: {m.active}
                    </div>
                    <div className="w-full flex gap-0.5 items-end">
                      <div className={`flex-1 rounded-t-md transition-all ${isCurrent ? "bg-[#006236]" : "bg-[#006236]/60"}`} style={{ height: `${totalH}px` }}/>
                      <div className={`flex-1 rounded-t-md transition-all ${isCurrent ? "bg-blue-500" : "bg-blue-400/60"}`} style={{ height: `${activeH}px` }}/>
                    </div>
                    <span className={`text-[clamp(9px,0.8vw,12px)] ${isCurrent ? "text-[#006236] font-bold" : "text-gray-500"}`}>{m.month}</span>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-4">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#006236]"/><span className="text-xs text-gray-500">Total</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500"/><span className="text-xs text-gray-500">Active</span></div>
            </div>
          </div>

          {/* Level Distribution Donut */}
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)] flex flex-col items-center">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-1 self-start">By Level</h3>
            <p className="text-gray-400 text-xs m-0 mb-4 self-start">Student distribution across levels</p>
            <DonutChart segments={LEVEL_DISTRIBUTION} size={160} thickness={26}/>
            <div className="flex flex-col gap-2 mt-4 w-full">
              {LEVEL_DISTRIBUTION.map(l => (
                <div key={l.level} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${l.color} shrink-0`}/>
                  <span className="text-gray-600 text-xs flex-1">{l.level}</span>
                  <span className="text-[#006236] text-xs font-bold">{l.count}</span>
                  <span className="text-gray-400 text-[10px] w-8 text-right">{l.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Row: Group vs Individual + Session Stats ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Group vs Individual */}
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-1">Group vs Individual</h3>
            <p className="text-gray-400 text-xs m-0 mb-5">How your active students are distributed</p>

            {/* Visual bars */}
            <div className="flex flex-col gap-4">
              {GROUP_VS_INDIVIDUAL.map(g => {
                const maxCount = Math.max(...GROUP_VS_INDIVIDUAL.map(x => x.count));
                const pct = (g.count / OVERVIEW.activeStudents) * 100;
                return (
                  <div key={g.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${g.color}`}/>
                        <span className="text-gray-700 text-sm font-semibold">{g.label}</span>
                      </div>
                      <span className="text-[#006236] text-sm font-bold">{g.count} students · {g.sessions} sessions</span>
                    </div>
                    <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${g.color}`} style={{ width: `${pct}%` }}/>
                    </div>
                    <span className="text-gray-400 text-[10px] text-right">{Math.round(pct)}% of active</span>
                  </div>
                );
              })}
            </div>

            {/* Group size summary */}
            <div className="mt-5 bg-[#006236]/10 rounded-xl p-4 flex items-center gap-3">
              <GroupIcon/>
              <div>
                <p className="text-[#006236] font-semibold text-sm m-0">Groups are growing!</p>
                <p className="text-gray-500 text-xs m-0 mt-0.5">58% of your active students prefer group learning. Consider opening more group slots.</p>
              </div>
            </div>
          </div>

          {/* Session Performance */}
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-1">Session Performance</h3>
            <p className="text-gray-400 text-xs m-0 mb-5">Your teaching metrics at a glance</p>

            <div className="grid grid-cols-2 gap-4">
              <Gauge percentage={SESSION_STATS.completionRate} label="Completion Rate" color="#006236"/>
              <Gauge percentage={Math.round((SESSION_STATS.avgRating / 5) * 100)} label="Avg Rating" color="#3b82f6"/>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-white rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#006236]/10 flex items-center justify-center text-[#006236]"><ClockIcon/></div>
                <div>
                  <p className="text-[#006236] text-lg font-bold m-0">{SESSION_STATS.totalHours}</p>
                  <p className="text-gray-400 text-[10px] m-0">Total Hours Taught</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500"><BookIcon/></div>
                <div>
                  <p className="text-[#006236] text-lg font-bold m-0">{SESSION_STATS.avgSessionLength}m</p>
                  <p className="text-gray-400 text-[10px] m-0">Avg Session Length</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Row: Retention + Weekday Activity + Countries ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Student Retention */}
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-1">Retention Rate</h3>
            <p className="text-gray-400 text-xs m-0 mb-4">How long students keep studying with you</p>
            <div className="flex flex-col gap-3">
              {RETENTION.map(r => (
                <div key={r.period} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">{r.period}</span>
                    <span className="text-[#006236] text-xs font-bold">{r.pct}%</span>
                  </div>
                  <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#006236] transition-all duration-700" style={{ width: `${r.pct}%`, opacity: 0.4 + (r.pct / 100) * 0.6 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Busiest Days */}
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-1">Busiest Days</h3>
            <p className="text-gray-400 text-xs m-0 mb-4">Sessions per day of the week</p>
            <div className="flex items-end gap-[clamp(4px,0.6vw,8px)] h-[160px]">
              {WEEKDAY_ACTIVITY.map(w => {
                const h = (w.sessions / maxWeekday) * 130;
                const isBusiest = w.sessions === maxWeekday;
                return (
                  <div key={w.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[#006236] text-[10px] font-bold">{w.sessions}</span>
                    <div className={`w-full rounded-t-lg transition-all ${isBusiest ? "bg-[#006236]" : "bg-[#006236]/40"}`} style={{ height: `${h}px` }}/>
                    <span className={`text-[10px] ${isBusiest ? "text-[#006236] font-bold" : "text-gray-500"}`}>{w.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <div className="flex items-center gap-2 mb-1">
              <GlobeIcon/>
              <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">By Country</h3>
            </div>
            <p className="text-gray-400 text-xs m-0 mb-4">Where your students are from</p>
            <div className="flex flex-col gap-2.5">
              {STUDENT_COUNTRIES.map(c => {
                const pct = (c.count / OVERVIEW.totalStudents) * 100;
                return (
                  <div key={c.country} className="flex items-center gap-2.5">
                    <span className="w-7 h-5 bg-[#006236]/15 rounded text-[#006236] text-[9px] font-bold flex items-center justify-center shrink-0">{c.flag}</span>
                    <span className="text-gray-600 text-xs flex-1 truncate">{c.country}</span>
                    <div className="w-20 h-2.5 bg-gray-300 rounded-full overflow-hidden shrink-0">
                      <div className="h-full rounded-full bg-[#006236]" style={{ width: `${pct}%` }}/>
                    </div>
                    <span className="text-[#006236] text-xs font-bold w-6 text-right">{c.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---- Top Students Table ---- */}
        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">Top Students</h3>
              <p className="text-gray-400 text-xs m-0 mt-0.5">Your most engaged and high-performing students</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <AwardIcon/><span className="text-xs font-semibold">Based on total sessions & rating</span>
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_0.7fr] gap-2 px-4 py-2 text-[clamp(10px,0.9vw,13px)] text-[#006236] font-semibold border-b-2 border-[#006236]/15">
            <span>Student</span>
            <span>Level</span>
            <span className="text-center">Sessions</span>
            <span className="text-center">Rating</span>
            <span className="text-center">Streak</span>
            <span className="text-center">Status</span>
          </div>

          <div className="divide-y divide-[#006236]/10">
            {TOP_STUDENTS.map((s, rank) => (
              <div key={s.name} className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_0.7fr] gap-2 px-4 py-3 items-center hover:bg-[#006236]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
                    rank === 0 ? "bg-amber-500" : rank === 1 ? "bg-gray-400" : rank === 2 ? "bg-amber-700" : "bg-gray-300"
                  }`}>{rank + 1}</span>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#006236] shrink-0">
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover"/>
                  </div>`
                  <span className="text-[#006236] font-semibold text-sm truncate">{s.name}</span>
                </div>
                <span className="text-gray-600 text-sm">{s.level}</span>
                <span className="text-[#006236] font-bold text-sm text-center">{s.sessions}</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-amber-500"><StarIcon/></span>
                  <span className="text-gray-700 text-sm font-semibold">{s.rating}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[#006236] text-sm font-bold">{s.streak}</span>
                  <span className="text-gray-400 text-[10px]">days</span>
                </div>
                <span className="text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    s.status === "active" ? "bg-[#006236]/15 text-[#006236]" : "bg-gray-300 text-gray-500"
                  }`}>{s.status === "active" ? "Active" : "Inactive"}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </TeacherLayout>
  );
}
