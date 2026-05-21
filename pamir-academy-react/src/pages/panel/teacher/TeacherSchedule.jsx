import { useState, useEffect } from "react";
import TeacherLayout from "./TeacherLayout";
import { getMySchedule, updateScheduleSlot } from "../../../utils/panelApi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8–20

function formatHour(h) {
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

const STATUS_LEGEND = [
  { key: "available", label: "Available", color: "bg-[#006236]" },
  { key: "booked", label: "Booked", color: "bg-blue-500" },
  { key: "unavailable", label: "Unavailable", color: "bg-[#e5e5e5]" },
];

const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default function TeacherSchedule() {
  const [slots, setSlots] = useState({});
  const [slotIds, setSlotIds] = useState({});
  const [bookedInfo, setBookedInfo] = useState({});
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMySchedule();
        const slotsMap = {};
        const idsMap = {};
        const infoMap = {};
        // Initialize all to unavailable
        for (let di = 0; di < 7; di++) {
          for (let hi = 0; hi < HOURS.length; hi++) {
            slotsMap[`${di}-${hi}`] = "unavailable";
          }
        }
        data.forEach(s => {
          const hi = s.hour - 8;
          if (hi < 0 || hi >= HOURS.length) return;
          const key = `${s.day_of_week}-${hi}`;
          slotsMap[key] = s.status;
          idsMap[key] = s.id;
          if (s.status === "booked") {
            infoMap[key] = { student: s.counterpart_name, subject: s.subject_name, level: s.level };
          }
        });
        setSlots(slotsMap);
        setSlotIds(idsMap);
        setBookedInfo(infoMap);
      } catch (err) { console.error("Schedule fetch error:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  const toggleSlot = async (key) => {
    if (!editMode) return;
    if (slots[key] === "booked") return;
    const newStatus = slots[key] === "available" ? "unavailable" : "available";
    setSlots(prev => ({ ...prev, [key]: newStatus }));
    const slotId = slotIds[key];
    if (slotId) {
      try { await updateScheduleSlot(slotId, newStatus); } catch { /* revert on error if needed */ }
    }
  };

  const totalAvailable = Object.values(slots).filter(v => v === "available").length;
  const totalBooked = Object.values(slots).filter(v => v === "booked").length;

  const slotColor = (status) => {
    if (status === "available") return "bg-[#006236] hover:bg-[#004d2a]";
    if (status === "booked") return "bg-blue-500";
    return "bg-[#e5e5e5] hover:bg-gray-300";
  };

  // Compute current week dates
  const now = new Date();
  const mondayOffset = now.getDay() === 0 ? -6 : 1 - now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const weekDates = DAY_SHORT.map((d, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { day: d, date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });
  const weekLabel = `${weekDates[0].date} — ${weekDates[6].date}`;

  if (loading) {
    return (
      <TeacherLayout activePage="t-schedule">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout activePage="t-schedule">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-800 text-[clamp(24px,3vw,40px)] font-bold m-0">My Schedule</h1>
            <p className="text-gray-500 text-sm m-0 mt-1">Set your availability and view booked sessions</p>
          </div>
          <button onClick={() => setEditMode(!editMode)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer border-none transition-colors ${
              editMode ? "bg-amber-500 text-white" : "bg-[#006236] text-white"
            }`}>
            {editMode ? "Done Editing" : "Edit Availability"}
          </button>
        </div>

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
                <span className="text-gray-800 text-[clamp(11px,1vw,14px)] whitespace-nowrap">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className="text-gray-800 text-[clamp(16px,1.8vw,22px)] font-semibold">{weekLabel}</span>
        </div>

        <div className="bg-white border border-[#006236]/10 rounded-2xl p-[clamp(8px,2vw,20px)] overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: "3px", minWidth: "650px" }}>
            <thead>
              <tr>
                <th className="p-2 text-[#006236] text-[clamp(11px,1vw,14px)] text-left w-[80px]"><ClockIcon/></th>
                {weekDates.map(wd => (
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
                  <td className="px-2 py-1 text-[#006236] text-[clamp(10px,0.9vw,13px)] font-semibold whitespace-nowrap">{formatHour(hour)}</td>
                  {DAY_SHORT.map((_, di) => {
                    const key = `${di}-${hi}`;
                    const status = slots[key] || "unavailable";
                    const info = bookedInfo[key];
                    return (
                      <td key={key} className="p-0.5 relative"
                        onMouseEnter={() => setHoveredSlot(key)}
                        onMouseLeave={() => setHoveredSlot(null)}>
                        <div onClick={() => toggleSlot(key)}
                          className={`${slotColor(status)} rounded-md h-[clamp(28px,3.5vw,40px)] w-full transition-colors ${
                            editMode && status !== "booked" ? "cursor-pointer" : "cursor-default"
                          } flex items-center justify-center`}>
                          {status === "booked" && (
                            <span className="text-white text-[clamp(8px,0.7vw,10px)] font-semibold truncate px-1">
                              {info?.student?.split(" ")[0] || "Booked"}
                            </span>
                          )}
                        </div>
                        {hoveredSlot === key && info && (
                          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#006236] text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                            <div className="font-bold">{info.student}</div>
                            <div className="text-white/70">{info.subject} — {info.level}</div>
                            <div className="text-white/70">{formatHour(hour)}</div>
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

        {/* Upcoming Sessions Today */}
        <div className="bg-white border border-[#006236]/10 rounded-2xl p-[clamp(16px,2vw,28px)]">
          <h3 className="text-[#006236] text-[clamp(16px,1.6vw,22px)] font-bold m-0 mb-4">Upcoming Sessions Today</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(bookedInfo).length === 0 ? (
              <p className="text-gray-400 text-sm m-0 py-4 text-center">No booked sessions.</p>
            ) : Object.entries(bookedInfo).slice(0, 4).map(([key, info]) => {
              const [di, hi] = key.split("-").map(Number);
              return (
                <div key={key} className="bg-white rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#006236] flex items-center justify-center text-white font-bold text-sm">
                      {(info.student || "?").split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[#006236] font-semibold text-sm m-0">{info.student}</p>
                      <p className="text-gray-400 text-xs m-0">{info.subject} — {info.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#006236] text-sm font-semibold flex items-center gap-1"><ClockIcon/> {formatHour(HOURS[hi])}</span>
                    <span className="text-gray-400 text-xs">{weekDates[di]?.day}, {weekDates[di]?.date}</span>
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
