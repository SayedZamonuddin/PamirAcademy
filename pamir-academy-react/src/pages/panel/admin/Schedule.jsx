import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { getAdminSchedule } from "../../../utils/panelApi";

const STATUS_COLORS = { available: "bg-[#006236]", booked: "bg-blue-500", unavailable: "bg-[#e5e5e5]" };
const LEGEND = [
  { key: "available", label: "Available", color: "bg-[#006236]" },
  { key: "booked", label: "Booked", color: "bg-blue-500" },
  { key: "unavailable", label: "Unavailable", color: "bg-[#e5e5e5]" },
];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);

function formatHour(h) {
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export default function Schedule() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminSchedule();
        setSlots(data);
      } catch (err) { console.error("Admin schedule error:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  const teachers = [...new Set(slots.map(s => s.user_name))].sort();

  const filteredSlots = selectedTeacher === "all"
    ? slots
    : slots.filter(s => s.user_name === selectedTeacher);

  // Build grid
  const grid = {};
  filteredSlots.forEach(s => {
    const hi = s.hour - 8;
    if (hi < 0 || hi >= HOURS.length) return;
    const key = `${s.day_of_week}-${hi}`;
    grid[key] = s.status;
  });

  if (loading) {
    return (
      <DashboardLayout activePage="schedule">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="schedule">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-gray-800 text-[clamp(20px,2.5vw,36px)] font-semibold m-0">Schedule Overview</h1>
            <select
              value={selectedTeacher}
              onChange={e => setSelectedTeacher(e.target.value)}
              className="px-4 py-2 rounded-full border border-[#006236]/20 text-sm text-[#006236] bg-white cursor-pointer"
            >
              <option value="all">All Teachers</option>
              {teachers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {LEGEND.map(l => (
              <div key={l.key} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full ${l.color}`}/>
                <span className="text-gray-700 text-[clamp(11px,1vw,14px)] whitespace-nowrap">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-[clamp(8px,2vw,24px)] overflow-x-auto border border-[#006236]/10">
          <table className="w-full border-separate" style={{ borderSpacing: "4px", minWidth: "500px" }}>
            <thead>
              <tr>
                <th className="p-2 text-[#006236] text-[clamp(11px,1.1vw,16px)] text-left"/>
                {DAY_NAMES.map(d => <th key={d} className="p-2 text-[#006236] text-[clamp(11px,1.1vw,16px)] text-center">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour, hi) => (
                <tr key={hi}>
                  <td className="px-2 py-1.5 text-[#006236] text-[clamp(11px,1.1vw,16px)] font-semibold whitespace-nowrap">{formatHour(hour)}</td>
                  {DAY_NAMES.map((_, di) => {
                    const key = `${di}-${hi}`;
                    const status = grid[key] || "unavailable";
                    return (
                      <td key={key} className="p-1">
                        <div className={`${STATUS_COLORS[status] || "bg-[#e5e5e5]"} rounded-md h-[clamp(24px,3vw,36px)] w-full min-w-[40px]`}/>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {slots.length === 0 && (
          <p className="text-gray-400 text-center mt-8">No schedule data available.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
