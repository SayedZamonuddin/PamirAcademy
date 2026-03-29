import { useState } from "react";
import DashboardLayout from "./DashboardLayout";

const AVATAR = "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mzg3MzAwNXww&ixlib=rb-4.1.0&q=80&w=1080";

const STUDENTS = [
  { name: "Steve Job", date: "08/30/2024", status: "pending", statusColor: "text-orange-500" },
  { name: "Bill Gates", date: "08/31/2024", status: "failed", statusColor: "text-[#c51310]" },
  { name: "Elon Musk", date: "09/03/2024", status: "Complete", statusColor: "text-[#006236]" },
];

function Speedometer({ percentage }) {
  const r = 80, cx = 100, cy = 100;
  const toRad = (d) => (d * Math.PI) / 180;
  const startAngle = -180;
  const sweepAngle = (180 * percentage) / 100;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(startAngle + sweepAngle));
  const y2 = cy + r * Math.sin(toRad(startAngle + sweepAngle));
  const largeArc = sweepAngle > 180 ? 1 : 0;
  const nx = cx + (r - 15) * Math.cos(toRad(startAngle + sweepAngle));
  const ny = cy + (r - 15) * Math.sin(toRad(startAngle + sweepAngle));

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <svg viewBox="0 0 200 120" className="w-full">
        <path d={`M ${cx + r * Math.cos(toRad(-180))} ${cy + r * Math.sin(toRad(-180))} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(toRad(0))} ${cy + r * Math.sin(toRad(0))}`} fill="none" stroke="#d9d9d9" strokeWidth="14" strokeLinecap="round"/>
        {percentage > 0 && <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke="#006236" strokeWidth="14" strokeLinecap="round"/>}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#006236" strokeWidth="4" strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r="6" fill="#006236"/>
        <text x="15" y="115" fill="#fff" fontSize="12" textAnchor="middle">0%</text>
        <text x="185" y="115" fill="#fff" fontSize="12" textAnchor="middle">100%</text>
      </svg>
    </div>
  );
}

const ChevronLeft = () => (
  <svg width="32" height="60" viewBox="0 0 24 60" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 45 8 30 18 15"/></svg>
);
const ChevronRight = () => (
  <svg width="32" height="60" viewBox="0 0 24 60" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 15 16 30 6 45"/></svg>
);

export default function Dashboard() {
  const [currentSubject] = useState("English");

  return (
    <DashboardLayout activePage="dashboard">
      <div className="flex-1 p-[clamp(20px,4vw,60px)] overflow-y-auto">
        <h1 className="text-white text-[clamp(32px,5vw,60px)] mb-6">Dashboard</h1>

        {/* Subject card */}
        <div className="bg-[#006236] rounded-[30px] p-[clamp(20px,3vw,40px)] relative">
          <h2 className="text-white text-center text-[clamp(24px,3vw,40px)] mb-5">{currentSubject}</h2>

          <div className="flex items-center gap-3">
            <button className="bg-transparent border-none cursor-pointer shrink-0"><ChevronLeft/></button>

            <div className="flex-1">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-[#d9d9d9] rounded-[10px] px-4 py-2.5 mb-2">
                <span className="text-[#006236] font-semibold text-[clamp(14px,1.4vw,20px)]">Profile</span>
                <span className="text-[#006236] font-semibold text-[clamp(14px,1.4vw,20px)] text-center">Date</span>
                <span className="text-[#006236] font-semibold text-[clamp(14px,1.4vw,20px)] text-right">Payment</span>
              </div>

              {/* Table body */}
              <div className="bg-[#d9d9d9] rounded-[10px] px-4 py-3">
                {STUDENTS.map((s, idx) => (
                  <div key={idx} className={`grid grid-cols-3 items-center py-2.5 ${idx < STUDENTS.length - 1 ? "border-b border-[#006236]/15" : ""}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[#006236] shrink-0">
                        <img src={AVATAR} alt={s.name} className="w-full h-full object-cover"/>
                      </div>
                      <span className="text-[#006236] text-[clamp(12px,1.2vw,16px)]">{s.name}</span>
                    </div>
                    <span className="text-[#006236] text-[clamp(12px,1.2vw,16px)] text-center">{s.date}</span>
                    <span className={`${s.statusColor} text-[clamp(12px,1.2vw,16px)] text-right`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="bg-transparent border-none cursor-pointer shrink-0"><ChevronRight/></button>
          </div>
        </div>

        {/* Speedometer */}
        <div className="mt-10 text-center">
          <h2 className="text-white text-[clamp(20px,2.5vw,36px)] mb-6">Accountant Progress (hour work)</h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-white text-[clamp(48px,7vw,100px)] font-bold">80%</span>
            <Speedometer percentage={80}/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
