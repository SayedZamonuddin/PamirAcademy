import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { getAdminStatistics } from "../../../utils/panelApi";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminStatistics();
        setStats(data);
      } catch (err) { console.error("Admin stats error:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activePage="statistics">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const summaryItems = [
    { label: `Total Students: ${stats?.total_students ?? 0}` },
    { label: `Total Teachers: ${stats?.total_teachers ?? 0}` },
    { label: `Total Courses: ${stats?.total_courses ?? 0}` },
    { label: `Total Groups: ${stats?.total_groups ?? 0}` },
  ];

  const barData = stats?.students_by_country || [];

  return (
    <DashboardLayout activePage="statistics">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-gray-800 text-[clamp(24px,3vw,48px)] font-semibold">Statistics</span>
        </div>

        <div className="bg-white rounded-2xl p-[clamp(16px,3vw,40px)] border border-[#006236]/10">
          <div className="border border-[#006236] rounded-2xl px-6 py-2.5 text-center mb-4">
            <span className="text-[#006236] text-[clamp(16px,1.6vw,24px)] font-semibold">Platform Overview</span>
          </div>

          <div className="flex items-center justify-center gap-[clamp(12px,2vw,32px)] mb-5 flex-wrap">
            {summaryItems.map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#006236]"/>
                <span className="text-[#006236] text-[clamp(11px,1vw,16px)] whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>

          {barData.length > 0 ? (
            <>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-[#006236] text-[clamp(16px,1.6vw,24px)] font-semibold">Students by Country</span>
              </div>
              <div className="border border-[#006236] rounded p-[clamp(12px,2vw,24px)] flex items-end justify-center gap-[clamp(16px,3vw,40px)] min-h-[250px]">
                {barData.map(item => {
                  const maxVal = Math.max(...barData.map(b => b.value), 1);
                  const heightPct = (item.value / maxVal) * 100;
                  return (
                    <div key={item.country} className="flex flex-col items-center gap-1">
                      <span className="text-[#006236] text-[clamp(11px,1vw,16px)] font-semibold">{item.value}</span>
                      <div className="bg-[#006236] rounded-sm min-h-[20px]" style={{ width: "clamp(20px,2.5vw,30px)", height: `${heightPct * 1.8}px` }}/>
                      <div className="text-[#006236] text-[clamp(10px,0.9vw,14px)] whitespace-nowrap mt-1" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{item.country}</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              Student country data will appear here once country fields are added to user profiles.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
