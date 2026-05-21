import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { getAdminDashboard } from "../../../utils/panelApi";

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
        <text x="15" y="115" fill="#374151" fontSize="12" textAnchor="middle">0%</text>
        <text x="185" y="115" fill="#374151" fontSize="12" textAnchor="middle">100%</text>
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await getAdminDashboard();
        setData(resp);
      } catch (err) { console.error("Admin dashboard error:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activePage="dashboard">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Total Students", value: data?.total_students ?? 0, color: "bg-[#006236]" },
    { label: "Total Teachers", value: data?.total_teachers ?? 0, color: "bg-blue-500" },
    { label: "Total Groups", value: data?.total_groups ?? 0, color: "bg-amber-500" },
    { label: "Total Courses", value: data?.total_courses ?? 0, color: "bg-purple-500" },
  ];

  const pendingApprovals = data?.pending_teacher_approvals ?? 0;

  return (
    <DashboardLayout activePage="dashboard">
      <div className="flex-1 p-[clamp(20px,4vw,60px)] overflow-y-auto">
        <h1 className="text-gray-800 text-[clamp(32px,5vw,60px)] mb-6">Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-[#006236]/10 rounded-2xl p-[clamp(16px,2vw,28px)] flex flex-col gap-2">
              <div className={`${s.color} w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                {s.value}
              </div>
              <p className="text-gray-500 text-sm m-0">{s.label}</p>
              <p className="text-[#006236] text-[clamp(28px,3vw,44px)] font-bold m-0">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        {pendingApprovals > 0 && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {pendingApprovals}
            </div>
            <div>
              <p className="text-gray-800 font-bold text-lg m-0">Pending Teacher Approvals</p>
              <p className="text-gray-500 text-sm m-0">There are {pendingApprovals} teacher(s) waiting for approval via demo session.</p>
            </div>
          </div>
        )}

        {/* Speedometer */}
        <div className="mt-6 text-center">
          <h2 className="text-gray-800 text-[clamp(20px,2.5vw,36px)] mb-6">Platform Overview</h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-[#006236] text-[clamp(48px,7vw,100px)] font-bold">
              {data ? Math.round(((data.total_students + data.total_teachers) / Math.max(1, data.total_students + data.total_teachers + pendingApprovals)) * 100) : 0}%
            </span>
            <Speedometer percentage={data ? Math.round(((data.total_students + data.total_teachers) / Math.max(1, data.total_students + data.total_teachers + pendingApprovals)) * 100) : 0}/>
          </div>
          <p className="text-gray-500 text-sm mt-2">Active users ratio</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
