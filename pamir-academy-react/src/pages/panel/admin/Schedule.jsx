import { useState } from "react";
import DashboardLayout from "./DashboardLayout";

const TIME_SLOTS = ["00:00","00:30","01:00","01:30","02:00","02:30"];
const DATES = ["1 sep","2 sep","3 sep","4 sep","5 sep","6 sep","7 sep","8 sep","9 sep","10 sep","11 sep","12 sep","13 sep","14 sep","15 sep"];

function generateSchedule() {
  const grid = {};
  DATES.forEach(d => { grid[d] = TIME_SLOTS.map(() => "active"); });
  grid["3 sep"] = ["active","free","active","free","free","free"];
  grid["8 sep"] = ["busy","busy","active","busy","active","active"];
  grid["9 sep"] = ["busy","busy","active","active","busy","active"];
  grid["14 sep"] = ["check","check","check","check","check","check"];
  return grid;
}

const STATUS_COLORS = { active:"bg-[#006236]", busy:"bg-orange-500", check:"bg-[#FB001D]", free:"bg-blue-500" };
const LEGEND = [
  { key:"active", label:"Active", color:"bg-[#006236]" },
  { key:"busy", label:"Busy", color:"bg-orange-500" },
  { key:"check", label:"System check", color:"bg-[#FB001D]" },
  { key:"free", label:"Free", color:"bg-blue-500" },
];

export default function Schedule() {
  const [schedule] = useState(generateSchedule);

  return (
    <DashboardLayout activePage="schedule">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-white text-[clamp(20px,2.5vw,36px)] font-semibold">English</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 15 12 9 18 15"/></svg>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {LEGEND.map(l => (
              <div key={l.key} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full ${l.color}`}/>
                <span className="text-white text-[clamp(11px,1vw,14px)] whitespace-nowrap">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(8px,2vw,24px)] overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: "4px", minWidth: "500px" }}>
            <thead>
              <tr>
                <th className="p-2 text-[#006236] text-[clamp(11px,1.1vw,16px)] text-left"/>
                {TIME_SLOTS.map(t => <th key={t} className="p-2 text-[#006236] text-[clamp(11px,1.1vw,16px)] text-center">{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {DATES.map(date => (
                <tr key={date}>
                  <td className="px-2 py-1.5 text-[#006236] text-[clamp(11px,1.1vw,16px)] font-semibold whitespace-nowrap">{date}</td>
                  {schedule[date].map((status, i) => (
                    <td key={i} className="p-1">
                      <div className={`${STATUS_COLORS[status]} rounded-md h-[clamp(24px,3vw,36px)] w-full min-w-[40px]`}/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
