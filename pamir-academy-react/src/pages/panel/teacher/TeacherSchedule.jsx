import { useState } from "react";
import TeacherLayout from "./TeacherLayout";

/* ---- Data ---- */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 13 }, (_, i) => {
  const h = i + 8; // 8 AM to 8 PM
  return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
});

const WEEK_DATES = [
  { day: "Mon", date: "Mar 16" },
  { day: "Tue", date: "Mar 17" },
  { day: "Wed", date: "Mar 18" },
  { day: "Thu", date: "Mar 19" },
  { day: "Fri", date: "Mar 20" },
  { day: "Sat", date: "Mar 21" },
  { day: "Sun", date: "Mar 22" },
];

// Pre-set some availability and booked sessions
const INITIAL_SLOTS = {};
WEEK_DATES.forEach((wd, di) => {
  HOURS.forEach((h, hi) => {
    const key = `${di}-${hi}`;
    INITIAL_SLOTS[key] = "unavailable"; // default
  });
});
// Mark available slots
["0-0","0-1","0-2","0-4","0-5","0-6","0-7",
 "1-1","1-2","1-3","1-5","1-6",
 "2-0","2-1","2-2","2-4","2-5","2-6","2-7","2-8",
 "3-1","3-2","3-3","3-5","3-6","3-7",
 "4-0","4-1","4-2","4-3","4-4",
 "5-2","5-3","5-4",
].forEach(k => { INITIAL_SLOTS[k] = "available"; });
// Mark booked sessions
["0-1","0-5","1-2","1-6","2-1","2-5","3-2","3-6","4-1","4-3"].forEach(k => { INITIAL_SLOTS[k] = "booked"; });

const BOOKED_INFO = {
  "0-1": { student: "Ahmad Nazari", subject: "English", level: "Elementary" },
  "0-5": { student: "Fatima Karimova", subject: "English", level: "Intermediate" },
  "1-2": { student: "Omar Hassan", subject: "English", level: "Beginner" },
  "1-6": { student: "Layla Ahmadi", subject: "English", level: "Advanced" },
  "2-1": { student: "Daniyal Mirzo", subject: "English", level: "Elementary" },
  "2-5": { student: "Ahmad Nazari", subject: "English", level: "Elementary" },
  "3-2": { student: "Fatima Karimova", subject: "English", level: "Intermediate" },
  "3-6": { student: "Omar Hassan", subject: "English", level: "Beginner" },
  "4-1": { student: "Layla Ahmadi", subject: "English", level: "Advanced" },
  "4-3": { student: "Daniyal Mirzo", subject: "English", level: "Elementary" },
};

const STATUS_LEGEND = [
  { key: "available", label: "Available", color: "bg-[#006236]" },
  { key: "booked", label: "Booked", color: "bg-blue-500" },
  { key: "unavailable", label: "Unavailable", color: "bg-[#d9d9d9]" },
];

/* ---- SVG Icons ---- */
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default function TeacherSchedule() {
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const toggleSlot = (key) => {
    if (!editMode) return;
    if (slots[key] === "booked") return; // Can't change booked slots
    setSlots(prev => ({
      ...prev,
      [key]: prev[key] === "available" ? "unavailable" : "available",
    }));
  };

  const totalAvailable = Object.values(slots).filter(v => v === "available").length;
  const totalBooked = Object.values(slots).filter(v => v === "booked").length;

  const slotColor = (status) => {
    if (status === "available") return "bg-[#006236] hover:bg-[#004d2a]";
    if (status === "booked") return "bg-blue-500";
    return "bg-[#e5e5e5] hover:bg-gray-300";
  };

  return (
    <TeacherLayout activePage="t-schedule">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-white text-[clamp(24px,3vw,40px)] font-bold m-0">My Schedule</h1>
            <p className="text-white/60 text-sm m-0 mt-1">Set your availability and view booked sessions</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditMode(!editMode)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer border-none transition-colors ${
                editMode ? "bg-amber-500 text-white" : "bg-[#006236] text-white"
              }`}>
              {editMode ? "Done Editing" : "Edit Availability"}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="bg-[#006236] rounded-xl px-5 py-3 flex items-center gap-2">
            <span className="text-white/70 text-sm">Available slots:</span>
            <span className="text-white font-bold text-lg">{totalAvailable}</span>
          </div>
          <div className="bg-blue-500 rounded-xl px-5 py-3 flex items-center gap-2">
            <span className="text-white/70 text-sm">Booked sessions:</span>
            <span className="text-white font-bold text-lg">{totalBooked}</span>
          </div>
          <div className="flex items-center gap-4 ml-auto flex-wrap">
            {STATUS_LEGEND.map(l => (
              <div key={l.key} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded ${l.color}`}/>
                <span className="text-white text-[clamp(11px,1vw,14px)] whitespace-nowrap">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setWeekOffset(w => w - 1)} className="w-8 h-8 rounded-full bg-[#006236] text-white flex items-center justify-center border-none cursor-pointer hover:bg-[#004d2a] transition-colors"><ChevronLeft/></button>
          <span className="text-white text-[clamp(16px,1.8vw,22px)] font-semibold">
            March 16 — 22, 2026
          </span>
          <button onClick={() => setWeekOffset(w => w + 1)} className="w-8 h-8 rounded-full bg-[#006236] text-white flex items-center justify-center border-none cursor-pointer hover:bg-[#004d2a] transition-colors"><ChevronRight/></button>
        </div>

        {/* Schedule Grid */}
        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(8px,2vw,20px)] overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: "3px", minWidth: "650px" }}>
            <thead>
              <tr>
                <th className="p-2 text-[#006236] text-[clamp(11px,1vw,14px)] text-left w-[80px]">
                  <ClockIcon/>
                </th>
                {WEEK_DATES.map(wd => (
                  <th key={wd.day} className="p-2 text-center">
                    <div className="text-[#006236] text-[clamp(12px,1.1vw,15px)] font-bold">{wd.day}</div>
                    <div className="text-gray-500 text-[clamp(10px,0.9vw,12px)]">{wd.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour, hi) => (
                <tr key={hi}>
                  <td className="px-2 py-1 text-[#006236] text-[clamp(10px,0.9vw,13px)] font-semibold whitespace-nowrap">{hour}</td>
                  {WEEK_DATES.map((_, di) => {
                    const key = `${di}-${hi}`;
                    const status = slots[key] || "unavailable";
                    const bookedInfo = BOOKED_INFO[key];
                    return (
                      <td key={key} className="p-0.5 relative"
                        onMouseEnter={() => setHoveredSlot(key)}
                        onMouseLeave={() => setHoveredSlot(null)}>
                        <div onClick={() => toggleSlot(key)}
                          className={`${slotColor(status)} rounded-md h-[clamp(28px,3.5vw,40px)] w-full transition-colors ${
                            editMode && status !== "booked" ? "cursor-pointer" : status === "booked" ? "cursor-default" : "cursor-default"
                          } flex items-center justify-center`}>
                          {status === "booked" && (
                            <span className="text-white text-[clamp(8px,0.7vw,10px)] font-semibold truncate px-1">
                              {bookedInfo?.student?.split(" ")[0] || "Booked"}
                            </span>
                          )}
                        </div>
                        {/* Tooltip for booked */}
                        {hoveredSlot === key && bookedInfo && (
                          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#006236] text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                            <div className="font-bold">{bookedInfo.student}</div>
                            <div className="text-white/70">{bookedInfo.subject} — {bookedInfo.level}</div>
                            <div className="text-white/70">{hour}</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#006236]"/>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
          <h3 className="text-[#006236] text-[clamp(16px,1.6vw,22px)] font-bold m-0 mb-4">Upcoming Sessions Today</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(BOOKED_INFO).slice(0, 4).map(([key, info]) => {
              const [di, hi] = key.split("-").map(Number);
              return (
                <div key={key} className="bg-white rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#006236] flex items-center justify-center text-white font-bold text-sm">
                      {info.student.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[#006236] font-semibold text-sm m-0">{info.student}</p>
                      <p className="text-gray-400 text-xs m-0">{info.subject} — {info.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#006236] text-sm font-semibold flex items-center gap-1"><ClockIcon/> {HOURS[hi]}</span>
                    <span className="text-gray-400 text-xs">{WEEK_DATES[di]?.day}, {WEEK_DATES[di]?.date}</span>
                    <button className="px-4 py-1.5 rounded-full bg-[#006236] text-white text-xs font-semibold border-none cursor-pointer hover:bg-[#004d2a] transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
